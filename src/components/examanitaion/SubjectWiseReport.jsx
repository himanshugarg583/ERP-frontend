import React, { useState, useEffect } from 'react';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getAllClassesDropdown,
  getSubjectsByClass,
  getStudentsBySubject 
} from '../../helper/requests-method/apiMethods';

const SubjectWiseReport = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Fetch exam terms and classes on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const termsResponse = await getExamTermDropdown();
        if (termsResponse?.data) {
          setExamTerms(termsResponse.data);
        }

        const classesResponse = await getAllClassesDropdown();
        if (classesResponse?.data) {
          setClasses(classesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch exams when term is selected
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedTerm) {
        setExams([]);
        setSelectedExam('');
        return;
      }

      try {
        setLoading(true);
        const response = await getExamDropdown(selectedTerm);
        if (response?.data) {
          setExams(response.data);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedTerm]);

  // Fetch subjects when class is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass) {
        setSubjects([]);
        setSelectedSubject('');
        return;
      }

      try {
        setLoading(true);
        const response = await getSubjectsByClass(selectedClass);
        if (response?.data) {
          const subjectsArray = Array.isArray(response.data) 
            ? response.data 
            : response.data.subjects || [];
          setSubjects(subjectsArray);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedClass]);

  const handleFetchReport = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      alert('Please select exam, class section, and subject');
      return;
    }

    try {
      setLoading(true);
      const response = await getStudentsBySubject(selectedExam, selectedClass, selectedSubject);
      if (response?.data) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
        Subject Wise Exam Report
      </h2>

      {/* Selection Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Exam Term
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setReportData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={loading}
          >
            <option value="">-- Select Exam Term --</option>
            {examTerms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.term_name} ({term.academic_year})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Exam
          </label>
          <select
            value={selectedExam}
            onChange={(e) => {
              setSelectedExam(e.target.value);
              setReportData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={!selectedTerm || loading}
          >
            <option value="">-- Select Exam --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.exam_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class Section
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setReportData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={loading}
          >
            <option value="">-- Select Class --</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.class_name} - {classItem.section_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setReportData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={!selectedClass || loading}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject.subject_id || subject.id} value={subject.subject_id || subject.id}>
                {subject.subject_name || subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fetch Button */}
      <div className="mb-6">
        <button
          onClick={handleFetchReport}
          className="w-full md:w-auto bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
          disabled={loading || !selectedExam || !selectedClass || !selectedSubject}
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      )}

      {/* Report Data Display */}
      {!loading && reportData && (
        <div className="mt-6">
          {/* Exam and Subject Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-violet-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-violet-700 mb-3">Exam Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Exam Name:</span>
                  <p className="font-medium">{reportData.exam_info?.exam_name}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Class:</span>
                  <p className="font-medium">{reportData.exam_info?.class}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Subject Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Subject:</span>
                  <p className="font-medium">{reportData.subject_info?.subject_name}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Subject Code:</span>
                  <p className="font-medium">{reportData.subject_info?.subject_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-green-700">{reportData.total_students || 0}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Marked Students</p>
              <p className="text-2xl font-bold text-blue-700">{reportData.marked_students || 0}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-orange-700">
                {(reportData.total_students || 0) - (reportData.marked_students || 0)}
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Marks List</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Admission No</th>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students && reportData.students.length > 0 ? (
                  reportData.students.map((student) => (
                    <tr 
                      key={student.student_id} 
                      className={`border-b hover:bg-violet-50 transition-colors ${!student.is_marked ? 'bg-red-50' : ''}`}
                    >
                      <td className="py-3 px-4">{student.roll_number}</td>
                      <td className="py-3 px-4">{student.admission_number}</td>
                      <td className="py-3 px-4 font-medium">{student.student_name}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{student.email}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        {student.marks_obtained !== null ? student.marks_obtained : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {student.is_marked ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Marked
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-600">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Print Button */}
          <div className="mt-6 text-right">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Print Report
            </button>
          </div>
        </div>
      )}

      {!loading && !reportData && selectedExam && selectedClass && selectedSubject && (
        <div className="text-center py-8">
          <p className="text-gray-600">Click "Generate Report" to fetch subject-wise marks.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectWiseReport;
