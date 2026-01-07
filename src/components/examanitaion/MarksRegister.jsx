import React, { useState, useEffect } from 'react';
import { 
  getAllClassesDropdown, 
  getAllStudentsByClass,
  getExamTermDropdown,
  getExamDropdown,
  getSubjectsByClass,
  registerStudentMarks
} from '../../helper/requests-method/apiMethods';


const MarkRegister = () => {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [marksData, setMarksData] = useState([]);

  // Fetch all classes on component mount
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

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleOpenModal = async (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    
    // Fetch exam terms
    try {
      setLoading(true);
      const termsResponse = await getExamTermDropdown();
      if (termsResponse?.data) {
        setExamTerms(termsResponse.data);
      }

      // Fetch subjects
      const subjectsResponse = await getSubjectsByClass(selectedClass);
      if (subjectsResponse?.data) {
        const subjectsArray = Array.isArray(subjectsResponse.data) 
          ? subjectsResponse.data 
          : subjectsResponse.data.subjects || [];
        setSubjects(subjectsArray);
        
        // Initialize marks data
        const initialMarks = subjectsArray.map(subject => ({
          subject_id: subject.subject_id || subject.id,
          subject_name: subject.subject_name || subject.name,
          marks_obtained: 0,
          grade: '',
          remarks: ''
        }));
        setMarksData(initialMarks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setSelectedTerm('');
    setSelectedExam('');
    setExams([]);
    setMarksData([]);
  };

  const handleTermChange = async (termId) => {
    setSelectedTerm(termId);
    setSelectedExam('');
    
    if (!termId) {
      setExams([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getExamDropdown(termId);
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

  const handleMarkChange = (index, field, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index][field] = value;
    setMarksData(updatedMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedExam) {
      alert('Please select an exam');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        exam_id: parseInt(selectedExam),
        class_section_id: parseInt(selectedClass),
        student_id: selectedStudent.id,
        subjects: marksData.map(mark => ({
          subject_id: mark.subject_id,
          marks_obtained: parseInt(mark.marks_obtained) || 0,
          grade: mark.grade,
          remarks: mark.remarks
        }))
      };

      const response = await registerStudentMarks(payload);
      
      if (response?.success) {
        alert('Marks registered successfully!');
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error submitting marks:', error);
      alert('Failed to register marks. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="container mx-auto max-w-full">
            <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
                Student Results Management
              </h2>

              {/* Class Selection Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600 text-sm md:text-base"
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

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              )}

              {!loading && selectedClass && students.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No students found in this class.</p>
                </div>
              )}

              {!loading && students.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm md:text-base">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left">Roll No</th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left">Name</th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left hidden md:table-cell">
                        Parent's Phone
                      </th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left hidden md:table-cell">
                        Gender
                      </th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-violet-50 transition-colors">
                        <td className="py-2 px-2 md:py-3 md:px-4">{student.roll_number || 'N/A'}</td>
                        <td className="py-2 px-2 md:py-3 md:px-4">{student.name}</td>
                        <td className="py-2 px-2 md:py-3 md:px-4 hidden md:table-cell">
                          {student.phone_no || 'N/A'}
                        </td>
                        <td className="py-2 px-2 md:py-3 md:px-4 hidden md:table-cell">
                          {student.gender || 'N/A'}
                        </td>
                        <td className="py-2 px-2 md:py-3 md:px-4 text-center">
                          <button
                            onClick={() => handleOpenModal(student)}
                            className="bg-violet-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-violet-700 transition-colors text-sm md:text-base">
                            Enter Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>

          {/* Modal for entering marks */}
          {showModal && selectedStudent && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-violet-700">
                      Enter Marks
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                      disabled={submitting}
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {/* Student Info */}
                  <div className="bg-violet-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-violet-700 mb-2">Student Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">Name:</span>
                        <p className="font-medium">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Roll Number:</span>
                        <p className="font-medium">{selectedStudent.roll_number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Gender:</span>
                        <p className="font-medium">{selectedStudent.gender || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Exam Term
                      </label>
                      <select
                        value={selectedTerm}
                        onChange={(e) => handleTermChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
                        disabled={loading || submitting}
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
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
                        disabled={!selectedTerm || loading || submitting}
                      >
                        <option value="">-- Select Exam --</option>
                        {exams.map((exam) => (
                          <option key={exam.id} value={exam.id}>
                            {exam.exam_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
                      <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                  )}

                  {/* Marks Entry Form */}
                  {!loading && subjects.length > 0 && (
                    <form onSubmit={handleSubmit}>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Subject-wise Marks</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {marksData.map((mark, index) => (
                            <div key={mark.subject_id} className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-medium text-gray-800 mb-3">
                                {mark.subject_name}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marks Obtained
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={mark.marks_obtained}
                                    onChange={(e) => handleMarkChange(index, 'marks_obtained', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade
                                  </label>
                                  <input
                                    type="text"
                                    value={mark.grade}
                                    onChange={(e) => handleMarkChange(index, 'grade', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"
                                    placeholder="e.g., A, B+"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                  </label>
                                  <input
                                    type="text"
                                    value={mark.remarks}
                                    onChange={(e) => handleMarkChange(index, 'remarks', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"
                                    placeholder="Optional remarks"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
                          disabled={submitting || !selectedExam}
                        >
                          {submitting ? 'Submitting...' : 'Submit Marks'}
                        </button>
                      </div>
                    </form>
                  )}

                  {!loading && subjects.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No subjects found for this class.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
    
  );
};

export default MarkRegister;