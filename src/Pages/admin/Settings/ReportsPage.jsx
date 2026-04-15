import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import { listDocumentsV2Thunk } from '../../../store/slices/examSlice';
import { fetchAllClassesForAttendance, getAllStudentsByClass } from '../../../helper/requests-method/apiMethods';

const toArray = (value) => (Array.isArray(value) ? value : []);

const parseMeta = (value) => {
  if (typeof value === 'object' && value !== null) return value;
  if (typeof value !== 'string') return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const toDocumentRows = (response) => {
  const source = toArray(response?.data).length ? toArray(response.data) : toArray(response);

  return source.map((item) => {
    const meta = parseMeta(item.meta_data);
    return {
      id: item.id,
      student_id: item.student_id,
      roll_number: item.student?.roll_number || 'N/A',
      document_type: item.document_type || 'N/A',
      reference_id: item.reference_id || 'N/A',
      status: item.status || 'N/A',
      version: item.version || 'N/A',
      is_valid: Boolean(item.is_valid),
      generated_by: item.generatedBy?.name || item.generated_by || 'N/A',
      generated_at: item.generated_at,
      file_url: item.file_url || '',
      signed_url: item.signed_url || '',
      requested_action: meta.requested_action || 'N/A',
    };
  });
};

const normalizeClasses = (response) => {
  const source = toArray(response?.data?.classes).length
    ? toArray(response.data.classes)
    : toArray(response?.data);

  return source.map((item) => ({
    id: item.id,
    class_name: item.class_name || 'N/A',
    section_name: item.section_name || 'N/A',
  }));
};

const normalizeStudents = (response) => {
  const source = toArray(response?.data);
  return source.map((student, index) => ({
    id: student.id || student.student_id || student.user_id || `${index + 1}`,
    name: student.name || student.student_name || student.User?.name || 'N/A',
    roll_number: student.roll_number || student.roll_no || 'N/A',
    gender: student.gender || 'N/A',
  }));
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ReportsPage = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('documents');

  const [loadingLogs, setLoadingLogs] = useState(false);
  const [allDocumentLogs, setAllDocumentLogs] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingStudentLogs, setLoadingStudentLogs] = useState(false);

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentDocumentLogs, setStudentDocumentLogs] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const allLogsCount = useMemo(() => allDocumentLogs.length, [allDocumentLogs]);
  const studentLogsCount = useMemo(() => studentDocumentLogs.length, [studentDocumentLogs]);

  const loadAllDocumentLogs = async () => {
    try {
      setLoadingLogs(true);
      const response = await dispatch(listDocumentsV2Thunk({})).unwrap();
      setAllDocumentLogs(toDocumentRows(response));
    } catch (error) {
      setAllDocumentLogs([]);
      toast.error(error?.message || 'Failed to load document logs');
    } finally {
      setLoadingLogs(false);
    }
  };

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await fetchAllClassesForAttendance();
      setClasses(normalizeClasses(response));
    } catch (error) {
      setClasses([]);
      toast.error(error?.message || 'Failed to load classes');
    } finally {
      setLoadingClasses(false);
    }
  };

  const loadStudentsByClass = async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);
      const response = await getAllStudentsByClass(classId);
      setStudents(normalizeStudents(response));
    } catch (error) {
      setStudents([]);
      toast.error(error?.message || 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadStudentDocumentLogs = async (studentId) => {
    if (!studentId) {
      setStudentDocumentLogs([]);
      return;
    }

    try {
      setLoadingStudentLogs(true);
      const response = await dispatch(listDocumentsV2Thunk({ student_id: Number(studentId) })).unwrap();
      setStudentDocumentLogs(toDocumentRows(response));
    } catch (error) {
      setStudentDocumentLogs([]);
      toast.error(error?.message || 'Failed to load student document logs');
    } finally {
      setLoadingStudentLogs(false);
    }
  };

  useEffect(() => {
    loadAllDocumentLogs();
    loadClasses();
  }, []);

  const handleClassChange = async (classId) => {
    setSelectedClassId(classId);
    setSelectedStudentId('');
    setStudentDocumentLogs([]);
    await loadStudentsByClass(classId);
  };

  const handleStudentLogs = async (studentId) => {
    setSelectedStudentId(String(studentId));
    await loadStudentDocumentLogs(studentId);
  };

  const renderDocumentLogTable = (rows, loading) => {
    if (loading) {
      return <p className="text-sm text-slate-500">Loading document logs...</p>;
    }

    if (rows.length === 0) {
      return <p className="text-sm text-slate-500">No document logs found.</p>;
    }

    return (
      <div className="overflow-auto border border-slate-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Student ID</th>
              <th className="px-3 py-2 text-left">Roll No</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Version</th>
              <th className="px-3 py-2 text-left">Requested Action</th>
              <th className="px-3 py-2 text-left">Valid</th>
              <th className="px-3 py-2 text-left">Generated By</th>
              <th className="px-3 py-2 text-left">Generated At</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2">{row.student_id}</td>
                <td className="px-3 py-2">{row.roll_number}</td>
                <td className="px-3 py-2">{row.document_type}</td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2">{row.version}</td>
                <td className="px-3 py-2">{row.requested_action}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${row.is_valid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {row.is_valid ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-3 py-2">{row.generated_by}</td>
                <td className="px-3 py-2">{formatDateTime(row.generated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

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

        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">Reports</h1>
              <p className="text-sm text-slate-600">Exam document logs and class wise student document logs</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'documents' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Documents Logs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('classwise')}
                  className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'classwise' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Class Wise Document Logs
                </button>
              </div>
            </div>

            {activeTab === 'documents' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="text-lg font-semibold text-slate-800">Documents Logs</h2>
                  <button
                    type="button"
                    onClick={loadAllDocumentLogs}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                    disabled={loadingLogs}
                  >
                    {loadingLogs ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                <p className="text-sm text-slate-600">Total Logs: {allLogsCount}</p>
                {renderDocumentLogTable(allDocumentLogs, loadingLogs)}
              </div>
            )}

            {activeTab === 'classwise' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">Class Wise Document Logs</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
                    <select
                      value={selectedClassId}
                      onChange={(event) => handleClassChange(event.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      disabled={loadingClasses}
                    >
                      <option value="">Select class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.class_name} - {classItem.section_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <p className="text-sm text-slate-600">Students: {students.length}</p>
                  </div>
                </div>

                {selectedClassId && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-800">Student List</h3>

                    {loadingStudents ? (
                      <p className="text-sm text-slate-500">Loading students...</p>
                    ) : students.length === 0 ? (
                      <p className="text-sm text-slate-500">No students found for selected class.</p>
                    ) : (
                      <div className="overflow-auto border border-slate-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-slate-100 text-slate-700">
                            <tr>
                              <th className="px-3 py-2 text-left">Student ID</th>
                              <th className="px-3 py-2 text-left">Name</th>
                              <th className="px-3 py-2 text-left">Roll No</th>
                              <th className="px-3 py-2 text-left">Gender</th>
                              <th className="px-3 py-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={String(student.id)} className="border-t border-slate-200 even:bg-slate-50">
                                <td className="px-3 py-2">{student.id}</td>
                                <td className="px-3 py-2">{student.name}</td>
                                <td className="px-3 py-2">{student.roll_number}</td>
                                <td className="px-3 py-2">{student.gender}</td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleStudentLogs(student.id)}
                                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                  >
                                    View Logs
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {selectedStudentId && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-slate-800">Student Document Logs (Student ID: {selectedStudentId})</h3>
                      <button
                        type="button"
                        onClick={() => loadStudentDocumentLogs(selectedStudentId)}
                        className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
                        disabled={loadingStudentLogs}
                      >
                        {loadingStudentLogs ? 'Refreshing...' : 'Refresh'}
                      </button>
                    </div>

                    <p className="text-sm text-slate-600">Total Logs: {studentLogsCount}</p>
                    {renderDocumentLogTable(studentDocumentLogs, loadingStudentLogs)}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
