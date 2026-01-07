import React, { useState, useEffect } from 'react';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getAllClassesDropdown,
  getSubjectsByClass,
  getStudentsBySubject,
  updateSubjectMarks 
} from '../../helper/requests-method/apiMethods';

const SubjectWiseMarkRegister = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [marksData, setMarksData] = useState([]);

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

  const handleFetchStudents = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      alert('Please select exam, class section, and subject');
      return;
    }

    try {
      setLoading(true);
      const response = await getStudentsBySubject(selectedExam, selectedClass, selectedSubject);
      if (response?.data && response.data.students) {
        setStudentsData(response.data);
        
        // Initialize marks data from existing marks or empty
        const initialMarks = response.data.students.map(student => ({
          student_id: student.student_id,
          student_name: student.student_name,
          roll_number: student.roll_number,
          marks_obtained: student.marks_obtained || 0,
          grade: student.grade || '',
          remarks: student.remarks || ''
        }));
        setMarksData(initialMarks);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (index, field, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index][field] = value;
    setMarksData(updatedMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExam || !selectedClass || !selectedSubject) {
      alert('Please ensure exam, class, and subject are selected');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        exam_id: parseInt(selectedExam),
        class_section_id: parseInt(selectedClass),
        subject_id: parseInt(selectedSubject),
        students: marksData.map(mark => ({
          student_id: mark.student_id,
          marks_obtained: parseInt(mark.marks_obtained) || 0,
          grade: mark.grade,
          remarks: mark.remarks
        }))
      };

      const response = await updateSubjectMarks(payload);
      
      if (response?.success) {
        alert('Marks updated successfully!');
        // Refresh data
        handleFetchStudents();
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      alert('Failed to update marks. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
        Subject Wise Mark Register
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
              setMarksData([]);
              setStudentsData([]);
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
              setMarksData([]);
              setStudentsData([]);
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
              setMarksData([]);
              setStudentsData([]);
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
              setMarksData([]);
              setStudentsData([]);
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
          onClick={handleFetchStudents}
          className="w-full md:w-auto bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
          disabled={loading || !selectedExam || !selectedClass || !selectedSubject}
        >
          {loading ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      )}

      {/* Marks Entry Form */}
      {!loading && marksData.length > 0 && (
        <form onSubmit={handleSubmit}>
          {/* Subject Info */}
          {studentsData.subject_info && (
            <div className="bg-violet-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-violet-700 mb-2">Subject Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Subject:</span>
                  <p className="font-medium">{studentsData.subject_info.subject_name}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Subject Code:</span>
                  <p className="font-medium">{studentsData.subject_info.subject_code}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Total Students:</span>
                  <p className="font-medium">{studentsData.total_students || marksData.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Students Marks Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((mark, index) => (
                  <tr key={mark.student_id} className="border-b hover:bg-violet-50 transition-colors">
                    <td className="py-3 px-4">{mark.roll_number}</td>
                    <td className="py-3 px-4 font-medium">{mark.student_name}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={mark.marks_obtained}
                        onChange={(e) => handleMarkChange(index, 'marks_obtained', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600 text-center"
                        required
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={mark.grade}
                        onChange={(e) => handleMarkChange(index, 'grade', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600 text-center"
                        placeholder="A, B+"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={mark.remarks}
                        onChange={(e) => handleMarkChange(index, 'remarks', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"
                        placeholder="Remarks"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setMarksData([]);
                setStudentsData([]);
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={submitting}
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Marks'}
            </button>
          </div>
        </form>
      )}

      {!loading && marksData.length === 0 && selectedExam && selectedClass && selectedSubject && (
        <div className="text-center py-8">
          <p className="text-gray-600">Click "Load Students" to fetch student list.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectWiseMarkRegister;
