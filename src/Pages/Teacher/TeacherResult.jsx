import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import {
  bulkTeacherAttendanceV2Thunk,
  listTeacherAssignedPapersV2Thunk,
  listTeacherPaperStudentsV2Thunk,
  listTeacherTimetableV2Thunk,
  listTeacherExamTermsDropdownV2Thunk,
  listTeacherExamEventsDropdownV2Thunk,
  listTeacherExamClassSectionsDropdownV2Thunk,
  listTeacherExamPapersDropdownV2Thunk,
  listTeacherExamStudentsDropdownV2Thunk,
  listTeacherExamMarksRegistersV2Thunk,
  upsertTeacherExamMarksRegistersV2Thunk,
} from '../../store/slices/examSlice';

const EXAM_SECTIONS = {
  'assigned-papers': {
    label: 'Assigned Papers',
    description: 'View all exam papers assigned to you.',
  },
  timetable: {
    label: 'Exam Timetable',
    description: 'See your invigilation schedule for upcoming exams.',
  },
  'mark-register': {
    label: 'Mark Register',
    description: 'Fill or view marks using the exam register.',
  },
  'paper-students': {
    label: 'Paper Students',
    description: 'Check the student list for a selected paper.',
  },
  attendance: {
    label: 'Mark Attendance',
    description: 'Record attendance for students in a selected paper.',
  },
};

const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
];

const TeacherResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { section } = useParams();

  const sectionAliases = {
    'upsert-marks': 'mark-register',
    'submit-marks': 'mark-register',
    'paper-marks': 'mark-register',
  };
  const normalizedSection = sectionAliases[section] || section;
  const resolvedSection = EXAM_SECTIONS[normalizedSection] ? normalizedSection : 'assigned-papers';
  const sectionMeta = EXAM_SECTIONS[resolvedSection];

  const [filters, setFilters] = useState({
    exam_event_id: '',
    status: '',
    class_id: '',
    subject_id: '',
  });
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [paperStudents, setPaperStudents] = useState([]);
  const [myTimetable, setMyTimetable] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [registerMode, setRegisterMode] = useState('fill');
  const [examTerms, setExamTerms] = useState([]);
  const [examEvents, setExamEvents] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [registerPapers, setRegisterPapers] = useState([]);
  const [registerStudents, setRegisterStudents] = useState([]);
  const [selectedExamTypeId, setSelectedExamTypeId] = useState('');
  const [selectedExamEventId, setSelectedExamEventId] = useState('');
  const [selectedClassSectionId, setSelectedClassSectionId] = useState('');
  const [selectedPaperFilterIds, setSelectedPaperFilterIds] = useState(['all']);
  const [registerMarksByKey, setRegisterMarksByKey] = useState({});
  const [registerAbsentByKey, setRegisterAbsentByKey] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerLoaded, setRegisterLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!section || !EXAM_SECTIONS[normalizedSection]) {
      navigate('/teacher/exam/assigned-papers', { replace: true });
    }
  }, [section, normalizedSection, navigate]);

  useEffect(() => {
    setPaperStudents([]);
    setAttendanceRecords({});
  }, [selectedPaperId]);

  const selectedPaper = useMemo(
    () => assignedPapers.find((paper) => String(paper.id || paper.uuid) === String(selectedPaperId)),
    [assignedPapers, selectedPaperId]
  );

  const showPaperSelector = ['paper-students', 'attendance'].includes(resolvedSection);
  const showFilters = ['assigned-papers', 'timetable', 'paper-students', 'attendance'].includes(resolvedSection);

  const unwrapList = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.papers)) return response.papers;
    if (Array.isArray(response?.students)) return response.students;
    if (Array.isArray(response?.marks)) return response.marks;
    if (Array.isArray(response?.timetable)) return response.timetable;
    if (Array.isArray(response)) return response;
    return [];
  };

  const normalizeRegisterStudents = (students) => {
    if (!Array.isArray(students)) return [];
    return students
      .map((student) => {
        const studentId = student?.id ?? student?.student_id;
        if (!studentId) return null;
        return {
          ...student,
          id: studentId,
          student_id: studentId,
        };
      })
      .filter(Boolean);
  };

  const buildFilterParams = () => {
    const params = {};
    if (filters.exam_event_id) params.exam_event_id = Number(filters.exam_event_id);
    if (filters.status) params.status = filters.status;
    if (filters.class_id) params.class_id = Number(filters.class_id);
    if (filters.subject_id) params.subject_id = Number(filters.subject_id);
    return params;
  };

  const resolveError = (error) => {
    return (
      error?.error?.message ||
      error?.message ||
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      'Request failed'
    );
  };

  const runAsync = async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } catch (error) {
      toast.error(resolveError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedPapers = async () => {
    await runAsync(async () => {
      const params = buildFilterParams();
      const response = await dispatch(listTeacherAssignedPapersV2Thunk(params)).unwrap();
      const list = unwrapList(response);
      setAssignedPapers(list);
      if (!selectedPaperId && list.length > 0) {
        setSelectedPaperId(String(list[0].id || list[0].uuid));
      }
      toast.success('Assigned papers loaded');
      return response;
    });
  };

  const loadMyTimetable = async () => {
    await runAsync(async () => {
      const params = buildFilterParams();
      const response = await dispatch(listTeacherTimetableV2Thunk(params)).unwrap();
      setMyTimetable(unwrapList(response));
      toast.success('Timetable loaded');
      return response;
    });
  };

  const loadPaperStudents = async (paperId) => {
    if (!paperId) {
      toast.error('Select a paper first');
      return;
    }

    await runAsync(async () => {
      const studentsResponse = await dispatch(
        listTeacherPaperStudentsV2Thunk({ examPaperUuid: paperId })
      ).unwrap();
      const students = unwrapList(studentsResponse);
      setPaperStudents(students);
      const recordMap = students.reduce((acc, student) => {
        const id = String(student.id || student.student_id);
        acc[id] = {
          status: 'present',
          remarks: '',
          malpractice_flag: false,
        };
        return acc;
      }, {});
      setAttendanceRecords(recordMap);
      toast.success('Paper students loaded');
      return studentsResponse;
    });
  };

  const loadRegisterDropdowns = async () => {
    setRegisterLoading(true);
    try {
      const [termsResponse, classSectionsResponse] = await Promise.all([
        dispatch(listTeacherExamTermsDropdownV2Thunk()).unwrap(),
        dispatch(listTeacherExamClassSectionsDropdownV2Thunk()).unwrap(),
      ]);

      setExamTerms(unwrapList(termsResponse));
      setClassSections(unwrapList(classSectionsResponse));
    } catch (error) {
      toast.error(resolveError(error));
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    if (resolvedSection === 'mark-register') {
      loadRegisterDropdowns();
    }
  }, [resolvedSection]);

  const handleExamTypeChange = async (value) => {
    setSelectedExamTypeId(value);
    setSelectedExamEventId('');
    setRegisterPapers([]);
    setRegisterStudents([]);
    setRegisterMarksByKey({});
    setRegisterAbsentByKey({});
    setRegisterLoaded(false);
    setSelectedPaperFilterIds(['all']);

    if (!value) {
      setExamEvents([]);
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await dispatch(
        listTeacherExamEventsDropdownV2Thunk({ exam_type_id: Number(value) })
      ).unwrap();
      setExamEvents(unwrapList(response));
    } catch (error) {
      toast.error(resolveError(error));
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleExamEventChange = (value) => {
    setSelectedExamEventId(value);
    setRegisterMarksByKey({});
    setRegisterAbsentByKey({});
    setRegisterLoaded(false);
    setSelectedPaperFilterIds(['all']);
  };

  const handleClassSectionChange = async (value) => {
    setSelectedClassSectionId(value);
    setRegisterMarksByKey({});
    setRegisterAbsentByKey({});
    setRegisterLoaded(false);
    setSelectedPaperFilterIds(['all']);

    if (!value) {
      setRegisterStudents([]);
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await dispatch(
        listTeacherExamStudentsDropdownV2Thunk({ class_section_id: Number(value) })
      ).unwrap();
      const students = response?.data?.students || response?.students || unwrapList(response);
      setRegisterStudents(normalizeRegisterStudents(students));
    } catch (error) {
      toast.error(resolveError(error));
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    const loadPapers = async () => {
      if (!selectedExamEventId || !selectedClassSectionId) {
        setRegisterPapers([]);
        return;
      }

      setRegisterLoading(true);
      try {
        const response = await dispatch(
          listTeacherExamPapersDropdownV2Thunk({
            exam_event_id: Number(selectedExamEventId),
            class_section_id: Number(selectedClassSectionId),
          })
        ).unwrap();
        setRegisterPapers(unwrapList(response));
      } catch (error) {
        toast.error(resolveError(error));
      } finally {
        setRegisterLoading(false);
      }
    };

    loadPapers();
  }, [selectedExamEventId, selectedClassSectionId]);

  const loadMarkRegister = async () => {
    if (!selectedClassSectionId || !selectedExamEventId) {
      toast.error('Select exam and class section first');
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await dispatch(
        listTeacherExamMarksRegistersV2Thunk({
          class_id: Number(selectedClassSectionId),
          exam_event_id: Number(selectedExamEventId),
        })
      ).unwrap();
      const registers = response?.data?.registers || response?.registers || [];
      const marksMap = {};
      const absentMap = {};
      registers.forEach((register) => {
        const paperId = register?.exam_paper?.id || register?.exam_paper_id;
        const entries = register?.marks_entries || [];
        entries.forEach((entry) => {
          const key = `${entry.student_id}-${paperId}`;
          marksMap[key] = entry.total_marks ?? entry.marks_obtained ?? '';
          absentMap[key] = Boolean(entry.is_absent);
        });
      });
      setRegisterMarksByKey(marksMap);
      setRegisterAbsentByKey(absentMap);
      setRegisterLoaded(true);
      toast.success('Mark register loaded');
    } catch (error) {
      toast.error(resolveError(error));
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterMarkChange = (studentId, paperId, value) => {
    setRegisterMarksByKey((prev) => ({
      ...prev,
      [`${studentId}-${paperId}`]: value,
    }));
  };

  const handleRegisterAbsentChange = (studentId, paperId, checked) => {
    const key = `${studentId}-${paperId}`;
    setRegisterAbsentByKey((prev) => ({
      ...prev,
      [key]: checked,
    }));
    if (checked) {
      setRegisterMarksByKey((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const handlePaperFilterChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions).map((option) => option.value);
    if (selectedValues.includes('all')) {
      setSelectedPaperFilterIds(['all']);
      return;
    }
    setSelectedPaperFilterIds(selectedValues.length > 0 ? selectedValues : ['all']);
  };

  const handleSaveRegister = async () => {
    if (!selectedClassSectionId || !selectedExamEventId) {
      toast.error('Select exam and class section first');
      return;
    }

    const paperList = selectedPaperFilterIds.includes('all')
      ? registerPapers
      : registerPapers.filter((paper) => {
        const paperId = paper.exam_paper_id || paper.id || paper.exam_paper?.id;
        return selectedPaperFilterIds.includes(String(paperId));
      });

    const entries = paperList
      .map((paper) => {
        const paperId = paper.exam_paper_id || paper.id;
        const studentsPayload = registerStudents
          .map((student) => {
            const studentId = student.id ?? student.student_id;
            if (!studentId) {
              return null;
            }
            const key = `${studentId}-${paperId}`;
            const rawValue = registerMarksByKey[key];
            const isAbsent = Boolean(registerAbsentByKey[key]);
            if (!isAbsent && (rawValue === '' || rawValue === undefined || rawValue === null)) {
              return null;
            }
            const total = isAbsent ? 0 : Number(rawValue);
            if (!isAbsent && Number.isNaN(total)) {
              return null;
            }
            return {
              student_id: Number(studentId),
              marks: { theory: total, practical: 0 },
              total_marks: total,
              is_absent: isAbsent,
              is_exempt: false,
              meta_data: { updated_from_ui: true },
            };
          })
          .filter(Boolean);

        if (studentsPayload.length === 0) {
          return null;
        }

        return {
          exam_paper_id: Number(paperId),
          students: studentsPayload,
        };
      })
      .filter(Boolean);

    if (entries.length === 0) {
      toast.error('Enter marks before saving');
      return;
    }

    setRegisterLoading(true);
    try {
      await dispatch(
        upsertTeacherExamMarksRegistersV2Thunk({
          class_id: Number(selectedClassSectionId),
          entries,
        })
      ).unwrap();
      toast.success('Marks saved');
      await loadMarkRegister();
    } catch (error) {
      toast.error(resolveError(error));
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [field]: value,
      },
    }));
  };

  const markAllPresent = () => {
    setAttendanceRecords((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = { ...(next[key] || {}), status: 'present' };
      });
      return next;
    });
  };

  const handleBulkAttendance = async () => {
    if (!selectedPaperId) {
      toast.error('Select a paper first');
      return;
    }

    const records = paperStudents
      .map((student) => {
        const id = String(student.id || student.student_id);
        const record = attendanceRecords[id];
        if (!record?.status) {
          return null;
        }
        return {
          student_id: Number(student.id || student.student_id),
          status: record.status,
          remarks: record.remarks || '',
          malpractice_flag: Boolean(record.malpractice_flag),
        };
      })
      .filter(Boolean);

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    await runAsync(async () => {
      const response = await dispatch(
        bulkTeacherAttendanceV2Thunk({
          examPaperUuid: selectedPaperId,
          payload: { records },
        })
      ).unwrap();
      toast.success('Attendance saved');
      return response;
    });
  };

  const paperLabel = (paper) => {
    const subject = paper?.subject?.subject_name || paper?.subject_name || 'Subject';
    const className = paper?.classSection?.class_name || paper?.class_name || '';
    const sectionName = paper?.classSection?.section_name || paper?.section_name || '';
    return `${subject} ${className}${sectionName ? `-${sectionName}` : ''}`.trim();
  };

  const registerPaperLabel = (paper) => {
    const name =
      paper?.paper_name ||
      paper?.subject?.subject_name ||
      paper?.subject_name ||
      paper?.subject?.name ||
      paper?.name ||
      'Paper';
    const code = paper?.subject_code || paper?.subject?.subject_code || '';
    const className = paper?.class_name || paper?.classSection?.class_name || '';
    const sectionName = paper?.section_name || paper?.classSection?.section_name || '';
    const classLabel = `${className}${sectionName ? `-${sectionName}` : ''}`.trim();
    const baseLabel = `${name}${code ? ` (${code})` : ''}`.trim();
    return classLabel ? `${baseLabel} (${classLabel})` : baseLabel;
  };

  const visibleRegisterPapers = useMemo(() => {
    if (selectedPaperFilterIds.includes('all') || selectedPaperFilterIds.length === 0) {
      return registerPapers;
    }
    return registerPapers.filter((paper) => {
      const paperId = paper.exam_paper_id || paper.id || paper.exam_paper?.id;
      return selectedPaperFilterIds.includes(String(paperId));
    });
  }, [registerPapers, selectedPaperFilterIds]);

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: '95vh',
          width: '100vw',
          gap: '10px',
          display: 'flex',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          <div className="container mx-auto max-w-full space-y-5 pb-6">
            <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-600">
                  Exam Management - {sectionMeta?.label}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{sectionMeta?.description}</p>
              </div>

              {showFilters && (
                <div className="border border-slate-200 rounded-lg p-3 md:p-4 mb-5">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    {resolvedSection === 'timetable' ? 'Filters' : 'Filter Papers'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <input
                      value={filters.exam_event_id}
                      onChange={(e) => setFilters((prev) => ({ ...prev, exam_event_id: e.target.value }))}
                      placeholder="Exam Event ID"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <input
                      value={filters.status}
                      onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                      placeholder="Status"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <input
                      value={filters.class_id}
                      onChange={(e) => setFilters((prev) => ({ ...prev, class_id: e.target.value }))}
                      placeholder="Class ID"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <input
                      value={filters.subject_id}
                      onChange={(e) => setFilters((prev) => ({ ...prev, subject_id: e.target.value }))}
                      placeholder="Subject ID"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {resolvedSection !== 'timetable' && (
                      <button
                        onClick={loadAssignedPapers}
                        disabled={loading}
                        className="bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 disabled:opacity-60"
                      >
                        Load Papers
                      </button>
                    )}
                    {resolvedSection === 'timetable' && (
                      <button
                        onClick={loadMyTimetable}
                        disabled={loading}
                        className="bg-slate-800 text-white rounded-lg px-3 py-2 hover:bg-slate-900 disabled:opacity-60"
                      >
                        Load Timetable
                      </button>
                    )}
                  </div>
                </div>
              )}

              {showPaperSelector && (
                <div className="border border-slate-200 rounded-lg p-3 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">Select Paper</h3>
                    <button
                      onClick={loadAssignedPapers}
                      disabled={loading}
                      className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                    >
                      Refresh Papers
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-44 overflow-auto">
                    {assignedPapers.map((paper) => {
                      const paperId = String(paper.id || paper.uuid);
                      const active = String(selectedPaperId) === paperId;
                      return (
                        <button
                          key={paperId}
                          onClick={() => setSelectedPaperId(paperId)}
                          className={`text-left border rounded-lg px-3 py-2 transition-colors ${
                            active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-medium text-slate-800">{paperLabel(paper)}</div>
                          <div className="text-xs text-slate-500">Paper ID: {paperId}</div>
                        </button>
                      );
                    })}
                    {assignedPapers.length === 0 && (
                      <p className="text-sm text-slate-500">No papers loaded yet.</p>
                    )}
                  </div>
                </div>
              )}

              {resolvedSection === 'assigned-papers' && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">Assigned Papers</h3>
                    <button
                      onClick={loadAssignedPapers}
                      disabled={loading}
                      className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="text-left p-2">Paper ID</th>
                          <th className="text-left p-2">Event</th>
                          <th className="text-left p-2">Subject</th>
                          <th className="text-left p-2">Class</th>
                          <th className="text-left p-2">Max / Pass</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedPapers.map((row, index) => (
                          <tr key={row.id || index} className="border-t border-slate-200">
                            <td className="p-2">{row.id}</td>
                            <td className="p-2">{row.event?.name || row.exam_event_id}</td>
                            <td className="p-2">{row.subject?.subject_name || row.subject_id}</td>
                            <td className="p-2">
                              {row.classSection?.class_name || row.class_id}{' '}
                              {row.classSection?.section_name || ''}
                            </td>
                            <td className="p-2">{row.max_marks} / {row.passing_marks}</td>
                          </tr>
                        ))}
                        {assignedPapers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-3 text-slate-500">No papers found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {resolvedSection === 'timetable' && (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <div className="flex items-center justify-between p-3 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">My Exam Timetable</h3>
                    <button
                      onClick={loadMyTimetable}
                      disabled={loading}
                      className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                    >
                      Refresh
                    </button>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-left p-2">Room</th>
                        <th className="text-left p-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTimetable.map((row, index) => (
                        <tr key={row.id || index} className="border-t border-slate-200">
                          <td className="p-2">{row.exam_date || row.date || 'N/A'}</td>
                          <td className="p-2">{row.subject?.subject_name || row.subject_name || 'N/A'}</td>
                          <td className="p-2">{row.room_label || row.room_no || 'N/A'}</td>
                          <td className="p-2">{row.start_time || 'N/A'} - {row.end_time || 'N/A'}</td>
                        </tr>
                      ))}
                      {myTimetable.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-3 text-slate-500">No timetable found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {resolvedSection === 'paper-students' && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">Students for Selected Paper</h3>
                    <button
                      onClick={() => loadPaperStudents(selectedPaperId)}
                      disabled={!selectedPaperId || loading}
                      className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                    >
                      Load Students
                    </button>
                  </div>
                  <div className="max-h-72 overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="text-left p-2">Student ID</th>
                          <th className="text-left p-2">User ID</th>
                          <th className="text-left p-2">Roll Number</th>
                          <th className="text-left p-2">Class Section</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paperStudents.map((student, index) => (
                          <tr key={student.id || index} className="border-t border-slate-200">
                            <td className="p-2">{student.id || student.student_id}</td>
                            <td className="p-2">{student.user_id || 'N/A'}</td>
                            <td className="p-2">{student.roll_number || 'N/A'}</td>
                            <td className="p-2">{student.class_section_id || 'N/A'}</td>
                          </tr>
                        ))}
                        {paperStudents.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-3 text-slate-500">No students found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {resolvedSection === 'mark-register' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">Register Filters</h3>
                        <p className="text-xs text-slate-500">Choose exam, class section, and papers to update.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={loadMarkRegister}
                          disabled={registerLoading || !selectedExamEventId || !selectedClassSectionId}
                          className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                        >
                          {registerLoaded ? 'Refresh Register' : 'Load Register'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                      <select
                        value={selectedExamTypeId}
                        onChange={(e) => handleExamTypeChange(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select exam term</option>
                        {examTerms.map((term, index) => {
                          const termId = term.id ?? term.exam_type_id ?? term.value ?? term.code ?? index;
                          const termLabel = term.name || term.exam_type_name || term.title || `Term ${termId}`;
                          return (
                            <option key={termId} value={termId}>
                              {termLabel}
                            </option>
                          );
                        })}
                      </select>

                      <select
                        value={selectedExamEventId}
                        onChange={(e) => handleExamEventChange(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                        disabled={!selectedExamTypeId}
                      >
                        <option value="">Select exam event</option>
                        {examEvents.map((event, index) => {
                          const eventId = event.id ?? event.exam_event_id ?? event.value ?? event.code ?? index;
                          const eventLabel = event.name || event.exam_event_name || event.title || `Event ${eventId}`;
                          return (
                            <option key={eventId} value={eventId}>
                              {eventLabel}
                            </option>
                          );
                        })}
                      </select>

                      <select
                        value={selectedClassSectionId}
                        onChange={(e) => handleClassSectionChange(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select class section</option>
                        {classSections.map((classSection, index) => {
                          const classSectionId =
                            classSection.id ?? classSection.class_section_id ?? classSection.value ?? index;
                          const classLabel = [
                            classSection.class_name || classSection.class || classSection.name,
                            classSection.section_name,
                          ]
                            .filter(Boolean)
                            .join(' ');
                          return (
                            <option key={classSectionId} value={classSectionId}>
                              {classLabel || `Class ${classSectionId}`}
                            </option>
                          );
                        })}
                      </select>

                      <div className="flex flex-col gap-1">
                        <select
                          multiple
                          value={selectedPaperFilterIds}
                          onChange={handlePaperFilterChange}
                          size={Math.min(4, registerPapers.length + 1)}
                          className="border border-slate-300 rounded-lg px-3 py-2"
                          disabled={registerPapers.length === 0}
                        >
                          <option value="all">All papers</option>
                          {registerPapers.map((paper, index) => {
                            const paperId = paper.exam_paper_id || paper.id || paper.exam_paper?.id || index;
                            return (
                              <option key={paperId} value={paperId}>
                                {registerPaperLabel(paper)}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-xs text-slate-500">Hold Ctrl/Command to select multiple.</span>
                      </div>

                      <select
                        value={registerMode}
                        onChange={(e) => setRegisterMode(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="fill">Fill marks</option>
                        <option value="view">View only</option>
                      </select>
                    </div>

                    {registerLoading && (
                      <p className="mt-2 text-sm text-indigo-600">Loading register data...</p>
                    )}
                  </div>

                  {!registerLoaded ? (
                    <p className="text-sm text-slate-500">
                      Click Load Register to view the student list and marks grid.
                    </p>
                  ) : registerStudents.length === 0 || visibleRegisterPapers.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Select exam event and class section to view the register grid.
                    </p>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="text-left p-2">Student</th>
                            {visibleRegisterPapers.map((paper) => {
                              const paperId = paper.exam_paper_id || paper.id || paper.exam_paper?.id;
                              return (
                                <th key={paperId} className="text-left p-2 whitespace-nowrap">
                                  {registerPaperLabel(paper)}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {registerStudents.map((student, index) => {
                            const studentId = student.id || student.student_id;
                            const studentLabel =
                              student.student_name ||
                              student.name ||
                              student.full_name ||
                              student.user?.name ||
                              `Student ${studentId || index + 1}`;
                            return (
                              <tr key={studentId || index} className="border-t border-slate-200">
                                <td className="p-2">
                                  <div className="font-medium text-slate-800">{studentLabel}</div>
                                  <div className="text-xs text-slate-500">
                                    ID: {studentId || 'N/A'}
                                    {student.roll_number ? ` | Roll: ${student.roll_number}` : ''}
                                  </div>
                                </td>
                                {visibleRegisterPapers.map((paper) => {
                                  const paperId = paper.exam_paper_id || paper.id || paper.exam_paper?.id;
                                  const key = `${studentId}-${paperId}`;
                                  const value = registerMarksByKey[key] ?? '';
                                  const isAbsent = Boolean(registerAbsentByKey[key]);
                                  return (
                                    <td key={key} className="p-2">
                                      <input
                                        type="number"
                                        min="0"
                                        value={value}
                                        onChange={(e) => handleRegisterMarkChange(studentId, paperId, e.target.value)}
                                        disabled={registerMode === 'view' || isAbsent}
                                        className="w-24 border border-slate-300 rounded-lg px-2 py-1 disabled:bg-slate-100"
                                        placeholder="--"
                                      />
                                      <label className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                                        <input
                                          type="checkbox"
                                          checked={isAbsent}
                                          onChange={(e) => handleRegisterAbsentChange(studentId, paperId, e.target.checked)}
                                          disabled={registerMode === 'view'}
                                        />
                                        Absent
                                      </label>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {registerLoaded && registerMode === 'fill' && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveRegister}
                        disabled={
                          registerLoading ||
                          registerStudents.length === 0 ||
                          visibleRegisterPapers.length === 0
                        }
                        className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
                      >
                        Save Marks
                      </button>
                    </div>
                  )}
                </div>
              )}

              {resolvedSection === 'attendance' && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-slate-800">Bulk Attendance</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadPaperStudents(selectedPaperId)}
                        disabled={!selectedPaperId || loading}
                        className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                      >
                        Load Students
                      </button>
                      <button
                        onClick={markAllPresent}
                        disabled={paperStudents.length === 0}
                        className="bg-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                      >
                        Mark All Present
                      </button>
                    </div>
                  </div>

                  {paperStudents.length === 0 ? (
                    <p className="text-sm text-slate-500">No students loaded for the selected paper.</p>
                  ) : (
                    <div className="max-h-96 overflow-auto border border-slate-200 rounded-lg">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="text-left p-2">Student ID</th>
                            <th className="text-left p-2">Roll Number</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Remarks</th>
                            <th className="text-left p-2">Malpractice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paperStudents.map((student, index) => {
                            const id = String(student.id || student.student_id);
                            const record = attendanceRecords[id] || {};
                            return (
                              <tr key={student.id || index} className="border-t border-slate-200">
                                <td className="p-2">{student.id || student.student_id}</td>
                                <td className="p-2">{student.roll_number || 'N/A'}</td>
                                <td className="p-2">
                                  <select
                                    value={record.status || ''}
                                    onChange={(e) => handleAttendanceChange(id, 'status', e.target.value)}
                                    className="border border-slate-300 rounded-lg px-2 py-1"
                                  >
                                    <option value="">Select</option>
                                    {ATTENDANCE_STATUSES.map((status) => (
                                      <option key={status.value} value={status.value}>
                                        {status.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="p-2">
                                  <input
                                    value={record.remarks || ''}
                                    onChange={(e) => handleAttendanceChange(id, 'remarks', e.target.value)}
                                    className="border border-slate-300 rounded-lg px-2 py-1"
                                    placeholder="Remarks"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(record.malpractice_flag)}
                                    onChange={(e) => handleAttendanceChange(id, 'malpractice_flag', e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <button
                    onClick={handleBulkAttendance}
                    disabled={!selectedPaperId || loading || paperStudents.length === 0}
                    className="mt-3 bg-slate-800 text-white rounded-lg px-4 py-2 disabled:opacity-60"
                  >
                    Save Attendance
                  </button>
                </div>
              )}

              {selectedPaper && (
                <p className="mt-3 text-xs text-slate-500">
                  Active paper: {paperLabel(selectedPaper)} ({selectedPaper.id || selectedPaper.uuid})
                </p>
              )}

              {loading && <p className="mt-2 text-sm text-indigo-600">Processing request...</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherResult;