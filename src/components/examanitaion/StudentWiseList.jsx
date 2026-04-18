import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllClassesDropdown,
  getAllStudentsByClass,
  getStudentReportHistory
} from '../../helper/requests-method/apiMethods';

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : String(value);
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StudentWiseList = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examHistory, setExamHistory] = useState(null);
  const [historyMeta, setHistoryMeta] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getAllClassesDropdown();
        setClasses(normalizeArray(response?.data?.classes || response?.data));
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load class sections');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getAllStudentsByClass(selectedClass);
        const normalizedStudents = normalizeArray(response?.data).map((student, index) => ({
          ...student,
          id: student?.id ?? student?.student_id ?? student?.user_id ?? `${index + 1}`,
          name: student?.name || student?.student_name || student?.User?.name || 'N/A',
          roll_number: student?.roll_number || student?.roll_no || 'N/A',
          email: student?.email || 'N/A',
          phone_no: student?.phone_no || student?.phone || 'N/A',
          gender: student?.gender || 'N/A',
          father_name: student?.father_name || student?.fatherName || 'N/A',
        }));
        setStudents(normalizedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students list');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Fetch student exam history
  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setLoadingHistory(true);
    
    try {
      const response = await getStudentReportHistory({ studentId: student?.id });
      const payload = response?.data?.data || response?.data || null;
      setExamHistory(payload);
      setHistoryMeta(response?.data?.meta || null);
    } catch (error) {
      console.error('Error fetching exam history:', error);
      setExamHistory(null);
      setHistoryMeta(null);
      toast.error('Failed to load student exam history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setExamHistory(null);
    setHistoryMeta(null);
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
        Student Wise List
      </h2>

      {/* Class Selection Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Class Section
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
          disabled={loading}
        >
          <option value="">-- Select Class Section --</option>
          {classes.map((classItem) => (
            <option key={classItem.id || classItem.class_section_id} value={classItem.id || classItem.class_section_id}>
              {classItem.class_name || classItem.class || 'Class'} - {classItem.section_name || classItem.section || 'Section'}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      )}

      {/* No Students Message */}
      {!loading && selectedClass && students.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No students found in this class.</p>
        </div>
      )}

      {/* Students Table */}
      {!loading && students.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Total Students: {students.length}
          </h3>
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-violet-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Phone</th>
                <th className="py-3 px-4 text-left hidden lg:table-cell">Gender</th>
                <th className="py-3 px-4 text-left hidden lg:table-cell">Father Name</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr 
                  key={student.id} 
                  className="border-b hover:bg-violet-50 transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{student.roll_number || 'N/A'}</td>
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4 hidden md:table-cell">{student.email || 'N/A'}</td>
                  <td className="py-3 px-4 hidden md:table-cell">{student.phone_no || 'N/A'}</td>
                  <td className="py-3 px-4 hidden lg:table-cell capitalize">{student.gender || 'N/A'}</td>
                  <td className="py-3 px-4 hidden lg:table-cell">{student.father_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Print Button */}
          <div className="mt-6 text-right">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Print List
            </button>
          </div>
        </div>
      )}

      {!loading && !selectedClass && (
        <div className="text-center py-8">
          <p className="text-gray-600">Please select a class section to view students.</p>
        </div>
      )}

      {/* Exam History Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-violet-700 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Exam History</h2>
                <p className="text-violet-200 text-sm mt-1">
                  {selectedStudent.name} ({selectedStudent.roll_number})
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-violet-800 rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-violet-700"></div>
                  <p className="mt-3 text-gray-600">Loading exam history...</p>
                </div>
              ) : examHistory ? (
                <div>
                  {/* Student Info Card */}
                  <div className="bg-linear-to-r from-violet-100 to-blue-100 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Student Name</p>
                        <p className="font-semibold text-base">{examHistory.student?.student_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-semibold text-sm">{examHistory.student?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Class</p>
                        <p className="font-semibold text-sm">{examHistory.student?.class_label || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Roll Number</p>
                        <p className="font-bold text-xl text-violet-700">{examHistory.student?.roll_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Exam Records</p>
                        <p className="font-bold text-xl text-blue-700">
                          {historyMeta?.total_exam_records ?? normalizeArray(examHistory.exam_history).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Exam History */}
                  {normalizeArray(examHistory.exam_history).length > 0 ? (
                    normalizeArray(examHistory.exam_history).map((record, index) => {
                      const recordKey = `${record?.exam_event?.exam_event_id || 'event'}-${record?.result?.result_id || index}`;
                      return (
                        <div key={recordKey} className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
                          <div className="bg-violet-50 px-4 py-3 border-b border-slate-200">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-base font-semibold text-violet-800">
                                  {record?.exam_event?.exam_event_name || 'Exam Event'}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                  Term: {record?.exam_term?.exam_type_name || 'N/A'} | Academic Year: {record?.exam_event?.academic_year || 'N/A'}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record?.result?.is_pass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {record?.result?.is_pass ? 'PASS' : 'FAIL'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 text-sm">
                              <div>
                                <p className="text-slate-500">Total / Max</p>
                                <p className="font-semibold text-slate-800">
                                  {formatNumber(record?.result?.total_marks)} / {formatNumber(record?.result?.max_marks)}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500">Percentage</p>
                                <p className="font-semibold text-slate-800">{formatNumber(record?.result?.percentage)}%</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Grade</p>
                                <p className="font-semibold text-slate-800">{record?.result?.grade || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Rank</p>
                                <p className="font-semibold text-slate-800">{record?.result?.rank ?? 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Published At</p>
                                <p className="font-semibold text-slate-800">{formatDateTime(record?.result?.published_at)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs md:text-sm">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="py-2 px-3 text-left">Subject</th>
                                  <th className="py-2 px-3 text-left">Code</th>
                                  <th className="py-2 px-3 text-center">Marks</th>
                                  <th className="py-2 px-3 text-center">Max</th>
                                  <th className="py-2 px-3 text-center">Passing</th>
                                  <th className="py-2 px-3 text-center">Grade</th>
                                  <th className="py-2 px-3 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {normalizeArray(record?.details_breakdown).map((detail, detailIndex) => (
                                  <tr
                                    key={`${detail?.marks_entry_id || detail?.subject_id || detailIndex}`}
                                    className="border-t border-slate-200"
                                  >
                                    <td className="py-2 px-3 font-medium">{detail?.subject_name || 'N/A'}</td>
                                    <td className="py-2 px-3">{detail?.subject_code || 'N/A'}</td>
                                    <td className="py-2 px-3 text-center">{formatNumber(detail?.marks_obtained)}</td>
                                    <td className="py-2 px-3 text-center">{formatNumber(detail?.max_marks)}</td>
                                    <td className="py-2 px-3 text-center">{formatNumber(detail?.passing_marks)}</td>
                                    <td className="py-2 px-3 text-center">{detail?.grade || 'N/A'}</td>
                                    <td className="py-2 px-3 text-center">
                                      {detail?.is_absent ? (
                                        <span className="px-2 py-1 rounded text-[11px] font-semibold bg-amber-100 text-amber-700">Absent</span>
                                      ) : detail?.is_pass ? (
                                        <span className="px-2 py-1 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700">Pass</span>
                                      ) : (
                                        <span className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">Fail</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No exam history found for this student.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600">Failed to load exam history. Please try again.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-100 p-3 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Print History
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWiseList;
