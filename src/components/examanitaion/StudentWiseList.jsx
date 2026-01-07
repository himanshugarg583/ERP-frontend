import React, { useState, useEffect } from 'react';
import { 
  getAllClassesDropdown,
  getAllStudentsByClass,
  getStudentExamHistory
} from '../../helper/requests-method/apiMethods';

const StudentWiseList = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examHistory, setExamHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getAllClassesDropdown();
        if (response?.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
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
        if (response?.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
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
      const response = await getStudentExamHistory(student.id);
      if (response?.data) {
        setExamHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching exam history:', error);
      setExamHistory(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setExamHistory(null);
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
            <option key={classItem.id} value={classItem.id}>
              {classItem.class_name} - {classItem.section_name}
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
                  <div className="bg-gradient-to-r from-violet-100 to-blue-100 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Student Name</p>
                        <p className="font-semibold text-base">{examHistory.student_info?.student_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-semibold text-sm">{examHistory.student_info?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Class</p>
                        <p className="font-semibold text-sm">{examHistory.student_info?.class}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Total Terms</p>
                        <p className="font-bold text-xl text-violet-700">{examHistory.total_terms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Exams</p>
                        <p className="font-bold text-xl text-blue-700">{examHistory.total_exams}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam History */}
                  {examHistory.exam_history?.length > 0 ? (
                    examHistory.exam_history.map((term) => (
                      <div key={term.term_id} className="mb-6">
                        {/* Term Header */}
                        <div className="bg-violet-600 text-white p-3 rounded-t-lg">
                          <h3 className="text-lg font-bold">{term.term_name}</h3>
                          <p className="text-violet-200 text-sm">
                            {term.academic_year} • {term.start_date} to {term.end_date}
                          </p>
                          <p className="text-xs text-violet-200 mt-1">Total Exams: {term.total_exams}</p>
                        </div>

                        {/* Exams */}
                        {term.exams?.map((exam) => (
                          <div key={exam.exam_id} className="border border-gray-300 mb-3">
                            {/* Exam Header */}
                            <div className="bg-gray-100 p-3">
                              <div className="flex flex-wrap justify-between items-start gap-3">
                                <div>
                                  <h4 className="text-base font-bold text-gray-800">{exam.exam_name}</h4>
                                  <p className="text-xs text-gray-600">{exam.description}</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {exam.start_date} to {exam.end_date}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    exam.status === 'completed' ? 'bg-green-200 text-green-800' :
                                    exam.status === 'scheduled' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>
                                    {exam.status.toUpperCase()}
                                  </span>
                                  {exam.is_passed !== null && (
                                    <div className="mt-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        exam.is_passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                      }`}>
                                        {exam.is_passed ? 'PASSED' : 'FAILED'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Exam Summary */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                                <div>
                                  <p className="text-xs text-gray-600">Total Marks</p>
                                  <p className="font-bold text-base text-blue-700">{exam.total_marks}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Passing Marks</p>
                                  <p className="font-bold text-base text-orange-700">{exam.passing_marks}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Marks Obtained</p>
                                  <p className="font-bold text-base text-green-700">{exam.total_marks_obtained || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Total Subjects</p>
                                  <p className="font-bold text-base text-purple-700">{exam.total_subjects}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">Marked Subjects</p>
                                  <p className="font-bold text-base text-indigo-700">{exam.marked_subjects}</p>
                                </div>
                              </div>
                            </div>

                            {/* Subjects Table */}
                            {exam.subjects?.length > 0 && (
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead className="bg-gray-200">
                                    <tr>
                                      <th className="py-2 px-2 text-left">Subject</th>
                                      <th className="py-2 px-2 text-left">Code</th>
                                      <th className="py-2 px-2 text-left">Date</th>
                                      <th className="py-2 px-2 text-center">Time</th>
                                      <th className="py-2 px-2 text-center">Max</th>
                                      <th className="py-2 px-2 text-center">Obtained</th>
                                      <th className="py-2 px-2 text-center">Grade</th>
                                      <th className="py-2 px-2 text-left">Remarks</th>
                                      <th className="py-2 px-2 text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exam.subjects.map((subject) => (
                                      <tr key={subject.subject_id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-2 font-medium">{subject.subject_name}</td>
                                        <td className="py-2 px-2 text-gray-600">{subject.subject_code}</td>
                                        <td className="py-2 px-2">{subject.exam_date}</td>
                                        <td className="py-2 px-2 text-center text-xs">
                                          {subject.start_time} - {subject.end_time}
                                        </td>
                                        <td className="py-2 px-2 text-center font-semibold">{subject.max_marks}</td>
                                        <td className="py-2 px-2 text-center font-bold text-blue-700">
                                          {subject.marks_obtained !== null ? subject.marks_obtained : '-'}
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                          {subject.grade ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                                              {subject.grade}
                                            </span>
                                          ) : '-'}
                                        </td>
                                        <td className="py-2 px-2 text-xs text-gray-600">
                                          {subject.remarks || '-'}
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            subject.is_marked ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                                          }`}>
                                            {subject.is_marked ? 'Marked' : 'Pending'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))
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
