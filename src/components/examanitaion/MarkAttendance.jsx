import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ChevronDown, Loader2 } from 'lucide-react';
import { fetchAllClassesForAttendance, getAllStudentsByClass } from '../../helper/requests-method/apiMethods';
import {
  listExamTypesV2Thunk,
  listExamEventsV2Thunk,
  listExamPapersV2Thunk,
  createExamAttendanceBulkV2Thunk,
  listExamAttendanceV2Thunk,
  updateExamAttendanceV2Thunk,
} from '../../store/slices/examSlice';

const toArray = (value) => (Array.isArray(value) ? value : []);
const getPaperId = (paper) => String(paper.id || paper.uuid || '');
const toApiId = (id) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? id : parsed;
};
const getPaperLabel = (paper) =>
  paper.subject_name ||
  paper.subject?.name ||
  paper.subject?.subject_name ||
  `Subject ${paper.subject_id || getPaperId(paper)}`;

const ATTENDANCE_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'excused', label: 'Excused' },
];

const getCellKey = (studentId, paperId) => `${studentId}::${paperId}`;

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const subjectDropdownRef = useRef(null);

  const [loadingBase, setLoadingBase] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  const [examTypes, setExamTypes] = useState([]);
  const [examEvents, setExamEvents] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [allPapers, setAllPapers] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExamTypeId, setSelectedExamTypeId] = useState('');
  const [selectedExamEventId, setSelectedExamEventId] = useState('');
  const [selectedClassSectionId, setSelectedClassSectionId] = useState('');
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const [statusByKey, setStatusByKey] = useState({});
  const [remarksByKey, setRemarksByKey] = useState({});
  const [attendanceIdByKey, setAttendanceIdByKey] = useState({});

  const [isAttendanceLoaded, setIsAttendanceLoaded] = useState(false);

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
        setSelectedPaperIds([]);
        setIsAttendanceLoaded(false);
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
        setSelectedPaperIds([]);
        setIsAttendanceLoaded(false);
      } catch (error) {
        toast.error(error?.message || 'Failed to load subjects for exam');
        setAllPapers([]);
        setSelectedPaperIds([]);
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!subjectDropdownRef.current) return;
      if (!subjectDropdownRef.current.contains(event.target)) {
        setSubjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredExamEvents = useMemo(() => {
    if (!selectedExamTypeId) return [];
    return examEvents.filter(
      (eventItem) => String(eventItem.exam_type_id || eventItem.exam_type?.id || '') === String(selectedExamTypeId)
    );
  }, [examEvents, selectedExamTypeId]);

  const availablePapers = useMemo(() => {
    if (!selectedClassSectionId) return [];
    return allPapers.filter((paper) => String(paper.class_id || '') === String(selectedClassSectionId));
  }, [allPapers, selectedClassSectionId]);

  const selectedPapers = useMemo(() => {
    const selectedSet = new Set(selectedPaperIds.map((id) => String(id)));
    return availablePapers.filter((paper) => selectedSet.has(getPaperId(paper)));
  }, [availablePapers, selectedPaperIds]);

  const allSubjectsSelected =
    availablePapers.length > 0 && selectedPaperIds.length === availablePapers.length;

  const selectedSubjectsLabel = useMemo(() => {
    if (allSubjectsSelected) return 'All Subjects';
    if (selectedPapers.length === 0) return 'Select';
    if (selectedPapers.length === 1) return getPaperLabel(selectedPapers[0]);
    if (selectedPapers.length === 2) return `${getPaperLabel(selectedPapers[0])}, ${getPaperLabel(selectedPapers[1])}`;
    return `${selectedPapers.length} subjects selected`;
  }, [allSubjectsSelected, selectedPapers]);

  const studentRows = useMemo(
    () =>
      students.map((student, index) => ({
        id: student.id || student.student_id || student.user_id || `${index + 1}`,
        name: student.name || student.student_name || student.User?.name || 'N/A',
        rollNumber: student.roll_number || student.roll_no || 'N/A',
      })),
    [students]
  );

  const resetAttendanceData = () => {
    setStatusByKey({});
    setRemarksByKey({});
    setAttendanceIdByKey({});
    setIsAttendanceLoaded(false);
  };

  const handleTogglePaper = (paperId) => {
    const idAsString = String(paperId);
    setSelectedPaperIds((prev) => {
      const set = new Set(prev.map((id) => String(id)));
      if (set.has(idAsString)) {
        set.delete(idAsString);
      } else {
        set.add(idAsString);
      }
      return Array.from(set);
    });
    resetAttendanceData();
  };

  const handleToggleAllSubjects = () => {
    if (allSubjectsSelected) {
      setSelectedPaperIds([]);
      resetAttendanceData();
      return;
    }
    setSelectedPaperIds(availablePapers.map((paper) => getPaperId(paper)));
    resetAttendanceData();
  };

  const handleStatusChange = (studentId, paperId, status) => {
    const key = getCellKey(studentId, paperId);
    setStatusByKey((prev) => ({ ...prev, [key]: status }));
  };

  const handleRemarksChange = (studentId, paperId, remarks) => {
    const key = getCellKey(studentId, paperId);
    setRemarksByKey((prev) => ({ ...prev, [key]: remarks }));
  };

  const handleLoadAttendance = async () => {
    if (!selectedExamTypeId || !selectedExamEventId || !selectedClassSectionId) {
      toast.error('Please select exam term, exam, and class section');
      return;
    }

    if (selectedPaperIds.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    if (studentRows.length === 0) {
      toast.error('No students found for selected class section');
      return;
    }

    try {
      setLoadingAttendance(true);

      const selectedIds = selectedPaperIds.map((id) => String(id));
      const responses = await Promise.all(
        selectedIds.map((paperId) =>
          dispatch(
            listExamAttendanceV2Thunk({
              exam_paper_id: paperId,
              class_id: selectedClassSectionId,
            })
          ).unwrap()
        )
      );

      const nextStatus = {};
      const nextRemarks = {};
      const nextIds = {};

      responses.forEach((response, responseIndex) => {
        const paperId = selectedIds[responseIndex];
        const rows = toArray(response?.data).length
          ? toArray(response.data)
          : toArray(response?.attendance).length
            ? toArray(response.attendance)
            : toArray(response);

        rows.forEach((entry) => {
          const sid = entry.student_id || entry.student?.id;
          if (!sid) return;

          const key = getCellKey(sid, paperId);
          nextStatus[key] = entry.status || 'present';
          nextRemarks[key] = entry.remarks || '';
          nextIds[key] = entry.id;
        });
      });

      setStatusByKey(nextStatus);
      setRemarksByKey(nextRemarks);
      setAttendanceIdByKey(nextIds);
      setIsAttendanceLoaded(true);
      toast.success('Attendance loaded');
    } catch (error) {
      toast.error(error?.message || 'Failed to load attendance');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const buildRecord = (student, paperId) => {
    const key = getCellKey(student.id, paperId);
    const status = statusByKey[key];
    if (!status) return null;

    return {
      student_id: Number(student.id),
      status,
      remarks: remarksByKey[key] || '',
      malpractice_flag: false,
    };
  };

  const handleSaveAll = async () => {
    if (selectedPapers.length === 0 || studentRows.length === 0) {
      toast.error('No attendance rows to save');
      return;
    }

    try {
      setSavingAll(true);

      let createdCount = 0;
      let updatedCount = 0;

      for (const paper of selectedPapers) {
        const paperId = getPaperId(paper);
        const newRecords = [];
        const updateTasks = [];

        for (const student of studentRows) {
          const key = getCellKey(student.id, paperId);
          const record = buildRecord(student, paperId);
          if (!record) continue;

          const attendanceId = attendanceIdByKey[key];
          if (attendanceId) {
            updateTasks.push(
              dispatch(
                updateExamAttendanceV2Thunk({
                  attendanceId,
                  payload: {
                    status: record.status,
                    remarks: record.remarks,
                    malpractice_flag: record.malpractice_flag,
                  },
                })
              ).unwrap()
            );
          } else {
            newRecords.push(record);
          }
        }

        if (newRecords.length > 0) {
          const bulkResponse = await dispatch(
            createExamAttendanceBulkV2Thunk({
              exam_paper_id: toApiId(paperId),
              records: newRecords,
            })
          ).unwrap();

          createdCount += newRecords.length;

          const createdRows = toArray(bulkResponse?.data).length
            ? toArray(bulkResponse.data)
            : toArray(bulkResponse?.attendance).length
              ? toArray(bulkResponse.attendance)
              : [];

          if (createdRows.length > 0) {
            const nextIds = {};
            createdRows.forEach((entry) => {
              const sid = entry.student_id || entry.student?.id;
              if (!sid || !entry.id) return;
              nextIds[getCellKey(sid, paperId)] = entry.id;
            });
            setAttendanceIdByKey((prev) => ({ ...prev, ...nextIds }));
          }
        }

        if (updateTasks.length > 0) {
          const results = await Promise.allSettled(updateTasks);
          updatedCount += results.filter((item) => item.status === 'fulfilled').length;
        }
      }

      if (createdCount === 0 && updatedCount === 0) {
        toast.error('Please fill at least one attendance status before save');
        return;
      }

      toast.success(`Attendance saved. Created ${createdCount}, Updated ${updatedCount}`);
      setIsAttendanceLoaded(true);
      await handleLoadAttendance();
    } catch (error) {
      toast.error(error?.message || 'Failed to save bulk attendance');
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="container mx-auto max-w-full">
        <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2 text-center">Mark Attendance</h2>
          <p className="text-center text-sm text-slate-600 mb-6">
            Select exam term, exam, class section, and subjects to mark student attendance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Term</label>
              <select
                value={selectedExamTypeId}
                onChange={(event) => {
                  setSelectedExamTypeId(event.target.value);
                  setSelectedExamEventId('');
                  setSelectedPaperIds([]);
                  resetAttendanceData();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={loadingBase}
              >
                <option value="">Select exam term</option>
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
                  setSelectedPaperIds([]);
                  resetAttendanceData();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={!selectedExamTypeId || loadingBase}
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
                  setSelectedPaperIds([]);
                  resetAttendanceData();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                disabled={loadingBase}
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
                onClick={handleLoadAttendance}
                className="w-full h-10 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                disabled={loadingAttendance || loadingStudents || !selectedClassSectionId || !selectedExamEventId || selectedPaperIds.length === 0}
              >
                {loadingAttendance ? 'Loading...' : 'Load Attendance'}
              </button>
            </div>
          </div>

          <div className="mb-5 rounded-lg border border-slate-200 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Subject</h3>
            </div>

            {availablePapers.length === 0 ? (
              <p className="text-sm text-slate-500">No papers found for selected exam and class section.</p>
            ) : (
              <div ref={subjectDropdownRef} className="relative w-full md:w-2/3">
                <button
                  type="button"
                  onClick={() => setSubjectDropdownOpen((prev) => !prev)}
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-violet-300"
                >
                  <span className="truncate text-slate-800">{selectedSubjectsLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${subjectDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {subjectDropdownOpen && (
                  <div className="absolute mt-2 z-20 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                    <button
                      type="button"
                      onClick={handleToggleAllSubjects}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={allSubjectsSelected}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                      <span>All Subjects</span>
                    </button>

                    {availablePapers.map((paper) => {
                      const paperId = getPaperId(paper);
                      return (
                        <button
                          key={paperId}
                          type="button"
                          onClick={() => handleTogglePaper(paperId)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPaperIds.includes(paperId)}
                            onChange={() => {}}
                            className="w-4 h-4"
                          />
                          <span className="truncate">{getPaperLabel(paper)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {loadingStudents && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
            </div>
          )}

          {!loadingStudents && studentRows.length > 0 && selectedPapers.length > 0 && isAttendanceLoaded && (
            <>
              <div className="overflow-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left sticky left-0 bg-violet-600 z-10 min-w-24">Roll No</th>
                      <th className="px-3 py-2 text-left sticky left-24 bg-violet-600 z-10 min-w-44">Student</th>
                      {selectedPapers.map((paper) => (
                        <th key={getPaperId(paper)} className="px-3 py-2 text-center min-w-72">
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
                        {selectedPapers.map((paper) => {
                          const paperId = getPaperId(paper);
                          const key = getCellKey(student.id, paperId);

                          return (
                            <td key={key} className="px-3 py-2 align-top">
                              <div className="space-y-2">
                                <select
                                  value={statusByKey[key] || ''}
                                  onChange={(event) => handleStatusChange(student.id, paperId, event.target.value)}
                                  className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                  <option value="">Select status</option>
                                  {ATTENDANCE_OPTIONS.map((statusItem) => (
                                    <option key={statusItem.value} value={statusItem.value}>
                                      {statusItem.label}
                                    </option>
                                  ))}
                                </select>

                                <input
                                  type="text"
                                  value={remarksByKey[key] || ''}
                                  onChange={(event) => handleRemarksChange(student.id, paperId, event.target.value)}
                                  className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  placeholder="Remarks"
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

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={savingAll}
                  className="px-5 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  {savingAll ? 'Saving...' : 'Save All Attendance'}
                </button>
              </div>
            </>
          )}

          {!loadingStudents && studentRows.length > 0 && selectedPapers.length > 0 && !isAttendanceLoaded && (
            <p className="text-sm text-slate-500">Click Load Attendance to fetch and mark attendance.</p>
          )}

          {!loadingStudents && selectedClassSectionId && studentRows.length === 0 && (
            <p className="text-sm text-slate-500">No students found for selected class section.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MarkAttendance;
