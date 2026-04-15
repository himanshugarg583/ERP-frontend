import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  listExamTypesV2Thunk,
  listExamEventsV2Thunk,
  listExamPapersV2Thunk,
  getMarksRegisterByPaperV2Thunk,
  createMarksRegistersV2Thunk,
  updateMarksRegistersV2Thunk,
  recomputeResultsV2Thunk,
  publishResultsV2Thunk,
} from '../../store/slices/examSlice';
import { fetchAllClassesForAttendance, getAllStudentsByClass } from '../../helper/requests-method/apiMethods';

const toArray = (value) => (Array.isArray(value) ? value : []);

const getPaperId = (paper) => String(paper.id || paper.uuid || '');

const getPaperLabel = (paper) =>
  paper.subject_name ||
  paper.subject?.name ||
  paper.subject?.subject_name ||
  `Subject ${paper.subject_id || getPaperId(paper)}`;

const toApiId = (id) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? id : parsed;
};

const PublishResult = () => {
  const dispatch = useDispatch();

  const [loadingBase, setLoadingBase] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [examTypes, setExamTypes] = useState([]);
  const [examEvents, setExamEvents] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [allPapers, setAllPapers] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExamTypeId, setSelectedExamTypeId] = useState('');
  const [selectedExamEventId, setSelectedExamEventId] = useState('');
  const [selectedClassSectionId, setSelectedClassSectionId] = useState('');

  const [marksByKey, setMarksByKey] = useState({});
  const [absentByKey, setAbsentByKey] = useState({});
  const [remarkByKey, setRemarkByKey] = useState({});
  const [hasExistingRegister, setHasExistingRegister] = useState(false);
  const [isSheetLoaded, setIsSheetLoaded] = useState(false);

  useEffect(() => {
    const loadBase = async () => {
      try {
        setLoadingBase(true);

        const [typesResponse, eventsResponse, classesResponse] = await Promise.all([
          dispatch(listExamTypesV2Thunk()).unwrap(),
          dispatch(listExamEventsV2Thunk({})).unwrap(),
          fetchAllClassesForAttendance(),
        ]);

        const typeRows = toArray(typesResponse?.data).length
          ? toArray(typesResponse.data)
          : toArray(typesResponse);
        const eventRows = toArray(eventsResponse?.data).length
          ? toArray(eventsResponse.data)
          : toArray(eventsResponse);
        const classRows = toArray(classesResponse?.data?.classes).length
          ? toArray(classesResponse.data.classes)
          : toArray(classesResponse?.data);

        setExamTypes(typeRows);
        setExamEvents(eventRows);
        setClassSections(classRows);
      } catch (error) {
        toast.error(error?.message || 'Failed to load dropdown data');
      } finally {
        setLoadingBase(false);
      }
    };

    loadBase();
  }, [dispatch]);

  useEffect(() => {
    const loadPapers = async () => {
      if (!selectedExamEventId) {
        setAllPapers([]);
        setMarksByKey({});
        setAbsentByKey({});
        setRemarkByKey({});
        setHasExistingRegister(false);
        setIsSheetLoaded(false);
        return;
      }

      try {
        const response = await dispatch(
          listExamPapersV2Thunk({ exam_event_id: selectedExamEventId })
        ).unwrap();

        const rows = toArray(response?.data).length
          ? toArray(response.data)
          : toArray(response);

        setAllPapers(rows);
        setMarksByKey({});
        setAbsentByKey({});
        setRemarkByKey({});
        setHasExistingRegister(false);
        setIsSheetLoaded(false);
      } catch (error) {
        toast.error(error?.message || 'Failed to load subjects for selected exam');
        setAllPapers([]);
        setMarksByKey({});
        setAbsentByKey({});
        setRemarkByKey({});
        setHasExistingRegister(false);
        setIsSheetLoaded(false);
      }
    };

    loadPapers();
  }, [dispatch, selectedExamEventId]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClassSectionId) {
        setStudents([]);
        return;
      }

      try {
        setLoadingStudents(true);
        const response = await getAllStudentsByClass(selectedClassSectionId);
        setStudents(toArray(response?.data));
      } catch (error) {
        toast.error(error?.message || 'Failed to load students');
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClassSectionId]);

  const filteredExamEvents = useMemo(() => {
    if (!selectedExamTypeId) return [];
    return examEvents.filter(
      (eventItem) => String(eventItem.exam_type_id || eventItem.exam_type?.id || '') === String(selectedExamTypeId)
    );
  }, [examEvents, selectedExamTypeId]);

  const classPapers = useMemo(() => {
    if (!selectedClassSectionId) return [];
    return allPapers.filter((paper) => String(paper.class_id || '') === String(selectedClassSectionId));
  }, [allPapers, selectedClassSectionId]);

  const studentRows = useMemo(
    () => students.map((student, index) => ({
      id: student.id || student.student_id || student.user_id || `${index + 1}`,
      name: student.name || student.student_name || student.User?.name || 'N/A',
      rollNumber: student.roll_number || student.roll_no || 'N/A',
    })),
    [students]
  );

  const getCellKey = (studentId, paperId) => `${studentId}::${paperId}`;

  const handleMarkChange = (studentId, paperId, value) => {
    const key = getCellKey(studentId, paperId);
    setMarksByKey((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAbsentToggle = (studentId, paperId, checked) => {
    const key = getCellKey(studentId, paperId);

    setAbsentByKey((prev) => ({
      ...prev,
      [key]: checked,
    }));

    if (checked) {
      setMarksByKey((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const handleRemarkChange = (studentId, paperId, value) => {
    const key = getCellKey(studentId, paperId);
    setRemarkByKey((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLoadSheet = async () => {
    if (!selectedExamTypeId || !selectedExamEventId || !selectedClassSectionId) {
      toast.error('Please select exam type, exam, and class section');
      return;
    }

    if (classPapers.length === 0) {
      toast.error('No subjects found for selected exam and class section');
      return;
    }

    if (studentRows.length === 0) {
      toast.error('No students found for selected class section');
      return;
    }

    try {
      setLoadingSheet(true);

      const responses = await Promise.all(
        classPapers.map((paper) =>
          dispatch(
            getMarksRegisterByPaperV2Thunk({
              examPaperId: getPaperId(paper),
              params: { class_id: selectedClassSectionId },
            })
          ).unwrap()
        )
      );

      let existingFound = false;
      const nextMarks = {};
      const nextAbsent = {};
      const nextRemark = {};

      responses.forEach((response, index) => {
        const paperId = getPaperId(classPapers[index]);
        const rows = toArray(response?.data?.marks_entries).length
          ? toArray(response.data.marks_entries)
          : toArray(response?.marks_entries).length
            ? toArray(response.marks_entries)
            : toArray(response?.data).length
              ? toArray(response.data)
              : toArray(response);

        if (rows.length > 0) {
          existingFound = true;
        }

        rows.forEach((entry) => {
          const studentId = entry.student_id || entry.student?.id;
          if (!studentId) return;

          const value =
            entry.total_marks ??
            entry.marks?.theory ??
            entry.marks_obtained ??
            '';

          nextMarks[getCellKey(studentId, paperId)] = String(value ?? '');
          nextAbsent[getCellKey(studentId, paperId)] = Boolean(entry.is_absent);
          nextRemark[getCellKey(studentId, paperId)] = String(entry.remark || entry.remarks || '');
        });
      });

      setMarksByKey(nextMarks);
      setAbsentByKey(nextAbsent);
      setRemarkByKey(nextRemark);
      setHasExistingRegister(existingFound);
      setIsSheetLoaded(true);
      toast.success('Result sheet loaded');
    } catch (error) {
      toast.error(error?.message || 'Failed to load result sheet');
    } finally {
      setLoadingSheet(false);
    }
  };

  const buildEntriesPayload = () =>
    classPapers
      .map((paper) => {
        const paperId = paper.id || paper.uuid;

        const studentsPayload = studentRows
          .map((student) => {
            const key = getCellKey(student.id, String(paperId));
            const rawValue = marksByKey[key];
            const isAbsent = Boolean(absentByKey[key]);
            const remark = String(remarkByKey[key] || '').trim();

            if (!isAbsent && (rawValue === undefined || rawValue === '')) return null;

            const marksValue = isAbsent ? 0 : Number(rawValue);
            if (!isAbsent && Number.isNaN(marksValue)) return null;

            return {
              student_id: toApiId(student.id),
              marks: {
                theory: marksValue,
                practical: 0,
              },
              total_marks: marksValue,
              is_absent: isAbsent,
              is_exempt: false,
              grace_marks: 0,
              remark,
              status: 'draft',
            };
          })
          .filter(Boolean);

        if (studentsPayload.length === 0) return null;

        return {
          exam_paper_id: toApiId(paperId),
          students: studentsPayload,
        };
      })
      .filter(Boolean);

  const saveMarks = async () => {
    const entries = buildEntriesPayload();

    if (entries.length === 0) {
      toast.error('Please enter marks or mark at least one student absent before saving');
      return false;
    }

    const payload = {
      class_id: toApiId(selectedClassSectionId),
      entries,
    };

    try {
      if (hasExistingRegister) {
        await dispatch(updateMarksRegistersV2Thunk(payload)).unwrap();
      } else {
        await dispatch(createMarksRegistersV2Thunk(payload)).unwrap();
      }
      setHasExistingRegister(true);
      return true;
    } catch (error) {
      const statusCode = error?.statusCode || error?.status || error?.response?.status;
      if (!hasExistingRegister && (statusCode === 409 || statusCode === 400)) {
        await dispatch(updateMarksRegistersV2Thunk(payload)).unwrap();
        setHasExistingRegister(true);
        return true;
      }
      throw error;
    }
  };

  const handleSave = async () => {
    if (!isSheetLoaded) {
      toast.error('Please load result sheet first');
      return;
    }

    try {
      setSaving(true);
      await saveMarks();
      toast.success('Marks saved successfully');
      await handleLoadSheet();
    } catch (error) {
      toast.error(error?.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishResult = async () => {
    if (!selectedExamEventId) {
      toast.error('Please select exam first');
      return;
    }

    try {
      setPublishing(true);
      await dispatch(
        recomputeResultsV2Thunk({
          exam_event_id: toApiId(selectedExamEventId),
        })
      ).unwrap();

      await dispatch(
        publishResultsV2Thunk({
          exam_event_id: toApiId(selectedExamEventId),
          class_id: toApiId(selectedClassSectionId),
          version_bump: true,
        })
      ).unwrap();
      toast.success('Result published successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to publish result');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="container mx-auto max-w-full">
        <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2 text-center">Publish Result</h2>
          <p className="text-center text-sm text-slate-600 mb-6">
            Select exam type, exam, and class section to edit subject-wise marks and publish results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <select
                value={selectedExamTypeId}
                onChange={(event) => {
                  setSelectedExamTypeId(event.target.value);
                  setSelectedExamEventId('');
                  setAllPapers([]);
                  setMarksByKey({});
                  setAbsentByKey({});
                  setRemarkByKey({});
                  setHasExistingRegister(false);
                  setIsSheetLoaded(false);
                }}
                disabled={loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select exam type</option>
                {examTypes.map((typeItem) => (
                  <option key={typeItem.id || typeItem.uuid} value={typeItem.id || typeItem.uuid}>
                    {typeItem.name || typeItem.term_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam</label>
              <select
                value={selectedExamEventId}
                onChange={(event) => {
                  setSelectedExamEventId(event.target.value);
                  setMarksByKey({});
                  setAbsentByKey({});
                  setRemarkByKey({});
                  setHasExistingRegister(false);
                  setIsSheetLoaded(false);
                }}
                disabled={!selectedExamTypeId || loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select exam</option>
                {filteredExamEvents.map((eventItem) => (
                  <option key={eventItem.id || eventItem.uuid} value={eventItem.id || eventItem.uuid}>
                    {eventItem.name || eventItem.exam_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Section</label>
              <select
                value={selectedClassSectionId}
                onChange={(event) => {
                  setSelectedClassSectionId(event.target.value);
                  setMarksByKey({});
                  setAbsentByKey({});
                  setRemarkByKey({});
                  setHasExistingRegister(false);
                  setIsSheetLoaded(false);
                }}
                disabled={loadingBase}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select class section</option>
                {classSections.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name} - {classItem.section_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadSheet}
                disabled={loadingSheet || loadingStudents || !selectedExamTypeId || !selectedExamEventId || !selectedClassSectionId}
                className="w-full h-10 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {loadingSheet ? 'Loading...' : 'Load Result Sheet'}
              </button>
            </div>
          </div>

          {loadingStudents && (
            <p className="text-sm text-slate-500 mb-4">Loading students...</p>
          )}

          {!loadingStudents && isSheetLoaded && classPapers.length > 0 && studentRows.length > 0 && (
            <>
              <div className="overflow-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left sticky left-0 bg-violet-600 z-10 min-w-24">Roll No</th>
                      <th className="px-3 py-2 text-left sticky left-24 bg-violet-600 z-10 min-w-44">Student</th>
                      {classPapers.map((paper) => (
                        <th key={getPaperId(paper)} className="px-3 py-2 text-center min-w-44">
                          {getPaperLabel(paper)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentRows.map((student) => (
                      <tr key={String(student.id)} className="border-t border-slate-200 even:bg-slate-50">
                        <td className="px-3 py-2 sticky left-0 bg-inherit z-10">{student.rollNumber}</td>
                        <td className="px-3 py-2 sticky left-24 bg-inherit z-10 font-medium">{student.name}</td>
                        {classPapers.map((paper) => {
                          const paperId = getPaperId(paper);
                          const key = getCellKey(student.id, paperId);
                          const isAbsent = Boolean(absentByKey[key]);
                          return (
                            <td key={key} className="px-3 py-2">
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={marksByKey[key] || ''}
                                  onChange={(event) => handleMarkChange(student.id, paperId, event.target.value)}
                                  disabled={isAbsent}
                                  className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-slate-100 disabled:text-slate-500"
                                  placeholder="Marks"
                                />
                                <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={isAbsent}
                                    onChange={(event) => handleAbsentToggle(student.id, paperId, event.target.checked)}
                                  />
                                  Absent
                                </label>
                                <input
                                  type="text"
                                  value={remarkByKey[key] || ''}
                                  onChange={(event) => handleRemarkChange(student.id, paperId, event.target.value)}
                                  className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  placeholder="Remark"
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || publishing}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handlePublishResult}
                  disabled={publishing || saving}
                  className="px-5 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {publishing ? 'Publishing...' : 'Publish Result'}
                </button>
              </div>
            </>
          )}

          {!loadingStudents && isSheetLoaded && (classPapers.length === 0 || studentRows.length === 0) && (
            <p className="text-sm text-slate-500">No result rows available for selected filters.</p>
          )}

          {!isSheetLoaded && selectedClassSectionId && (
            <p className="text-sm text-slate-500">Click Load Result Sheet to view and edit subject marks.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PublishResult;
