import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getSubjectsByClass, 
  registerStudentMarks 
} from '../../helper/requests-method/apiMethods';

const EnterMarks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, classId } = location.state || {};

  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [marksData, setMarksData] = useState([]);

  // Fetch exam terms on component mount
  useEffect(() => {
    const fetchExamTerms = async () => {
      try {
        setLoading(true);
        const response = await getExamTermDropdown();
        if (response?.data) {
          setExamTerms(response.data);
        }
      } catch (error) {
        console.error('Error fetching exam terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamTerms();
  }, []);

  // Fetch exams when term is selected
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedTerm) {
        setExams([]);
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

  // Fetch subjects when class is available
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!classId) return;

      try {
        setLoading(true);
        const response = await getSubjectsByClass(classId);
        if (response?.data) {
          const subjectsArray = Array.isArray(response.data) ? response.data : response.data.subjects || [];
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
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [classId]);

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
        class_section_id: parseInt(classId),
        student_id: student.id,
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
        navigate(-1); // Go back to previous page
      }
    } catch (error) {
      console.error('Error submitting marks:', error);
      alert('Failed to register marks. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!student) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No student selected</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-violet-700">
              Enter Marks
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>

          {/* Student Info */}
          <div className="bg-violet-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-violet-700 mb-2">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Name:</span>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Roll Number:</span>
                <p className="font-medium">{student.roll_number || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Gender:</span>
                <p className="font-medium">{student.gender || 'N/A'}</p>
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
                onChange={(e) => {
                  setSelectedTerm(e.target.value);
                  setSelectedExam('');
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
                onChange={(e) => setSelectedExam(e.target.value)}
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
                <div className="space-y-4">
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
                  onClick={() => navigate(-1)}
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
    </main>
  );
};

export default EnterMarks;
