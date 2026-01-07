import React, { useState, useEffect } from 'react';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getAllClassesDropdown,
  getCompleteMarksheet 
} from '../../helper/requests-method/apiMethods';

const ClassWiseReport = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [marksheetData, setMarksheetData] = useState(null);

  // Fetch exam terms and classes on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch exam terms
        const termsResponse = await getExamTermDropdown();
        if (termsResponse?.data) {
          setExamTerms(termsResponse.data);
        }

        // Fetch classes
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

  const handleFetchMarksheet = async () => {
    if (!selectedExam || !selectedClass) {
      alert('Please select exam and class section');
      return;
    }

    try {
      setLoading(true);
      const response = await getCompleteMarksheet(selectedExam, selectedClass);
      if (response?.data) {
        setMarksheetData(response.data);
      }
    } catch (error) {
      console.error('Error fetching marksheet:', error);
      alert('Failed to fetch marksheet data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
        Class Wise Exam Report
      </h2>

      {/* Selection Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Exam Term
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setMarksheetData(null);
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
              setMarksheetData(null);
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
              setMarksheetData(null);
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
      </div>

      {/* Fetch Button */}
      <div className="mb-6">
        <button
          onClick={handleFetchMarksheet}
          className="w-full md:w-auto bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
          disabled={loading || !selectedExam || !selectedClass}
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

      {/* Marksheet Data Display */}
      {!loading && marksheetData && (
        <div className="mt-6">
          {/* Exam Info */}
          <div className="bg-violet-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-violet-700 mb-3">Exam Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Exam Name:</span>
                <p className="font-medium">{marksheetData.exam_info?.exam_name}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Class:</span>
                <p className="font-medium">{marksheetData.exam_info?.class}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Total Marks:</span>
                <p className="font-medium">{marksheetData.exam_info?.total_marks}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Passing Marks:</span>
                <p className="font-medium">{marksheetData.exam_info?.passing_marks}</p>
              </div>
            </div>
          </div>

          {/* Students Marksheet */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Marks</h3>
            {marksheetData.students && marksheetData.students.length > 0 ? (
              marksheetData.students.map((student) => (
                <div key={student.student_id} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  {/* Student Header */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        {student.student_name} (Roll No: {student.roll_number})
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Total Marks: </span>
                      <span className="text-lg font-bold text-violet-700">{student.total_marks}</span>
                    </div>
                  </div>

                  {/* Subject Marks Table */}
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-violet-600 text-white">
                      <tr>
                        <th className="py-2 px-3 text-left">Subject</th>
                        <th className="py-2 px-3 text-left hidden md:table-cell">Code</th>
                        <th className="py-2 px-3 text-center">Marks</th>
                        <th className="py-2 px-3 text-center">Grade</th>
                        <th className="py-2 px-3 text-left hidden lg:table-cell">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.subjects && student.subjects.map((subject) => (
                        <tr key={subject.subject_id} className="border-b hover:bg-white transition-colors">
                          <td className="py-2 px-3">{subject.subject_name}</td>
                          <td className="py-2 px-3 hidden md:table-cell">{subject.subject_code}</td>
                          <td className="py-2 px-3 text-center font-medium">{subject.marks_obtained}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded">
                              {subject.grade}
                            </span>
                          </td>
                          <td className="py-2 px-3 hidden lg:table-cell text-gray-600">{subject.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No student data found.</p>
              </div>
            )}
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

      {!loading && !marksheetData && selectedExam && selectedClass && (
        <div className="text-center py-8">
          <p className="text-gray-600">Click "Generate Report" to fetch marksheet data.</p>
        </div>
      )}
    </div>
  );
};

export default ClassWiseReport;
