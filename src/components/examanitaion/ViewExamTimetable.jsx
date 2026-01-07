import React, { useState, useEffect } from 'react';
import { 
  getExamTimetableByClassAndExam,
  getExamTermDropdown, 
  getExamDropdown, 
  fetchClassDropdown 
} from '../../helper/requests-method/apiMethods';
import { FaCalendarAlt, FaClock, FaBook, FaClipboardList } from 'react-icons/fa';

const ViewExamTimetable = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exam terms on mount
  useEffect(() => {
    const fetchExamTerms = async () => {
      try {
        const response = await getExamTermDropdown();
        if (response?.data) {
          setExamTerms(response.data);
        }
      } catch (error) {
        console.error('Error fetching exam terms:', error);
      }
    };
    fetchExamTerms();
  }, []);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetchClassDropdown();
        if (response?.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch exams when term is selected
  useEffect(() => {
    if (selectedTerm) {
      const fetchExams = async () => {
        try {
          const response = await getExamDropdown(selectedTerm);
          if (response?.data) {
            setExams(response.data);
          }
        } catch (error) {
          console.error('Error fetching exams:', error);
        }
      };
      fetchExams();
    } else {
      setExams([]);
      setSelectedExam('');
    }
  }, [selectedTerm]);

  // Fetch timetable when both exam and class are selected
  const handleFetchTimetable = async () => {
    if (!selectedExam || !selectedClass) {
      setError('Please select both exam and class');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getExamTimetableByClassAndExam(selectedExam, selectedClass);
      if (response?.data) {
        setTimetableData(response.data);
      } else {
        setError('No timetable found');
        setTimetableData(null);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to fetch timetable. Please try again.');
      setTimetableData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-violet-700 mb-6">View Exam Timetable</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Exam Term Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam Term <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => {
                setSelectedTerm(e.target.value);
                setTimetableData(null);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
            >
              <option value="">Select Exam Term</option>
              {examTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.term_name} ({term.academic_year})
                </option>
              ))}
            </select>
          </div>

          {/* Exam Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                setTimetableData(null);
              }}
              disabled={!selectedTerm}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 ${
                !selectedTerm ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.exam_name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Section Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Class - Section <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setTimetableData(null);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
            >
              <option value="">Select Class - Section</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} - {cls.section_name}
                </option>
              ))}
            </select>
          </div>

          {/* Fetch Button */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
            <button
              onClick={handleFetchTimetable}
              disabled={!selectedExam || !selectedClass || loading}
              className={`w-full px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                !selectedExam || !selectedClass || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700 transform hover:scale-105'
              }`}
            >
              {loading ? 'Loading...' : 'View Timetable'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Timetable Display */}
        {timetableData && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Exam</h3>
                  <p className="text-lg font-bold text-violet-700">{timetableData.exam?.exam_name}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(timetableData.exam?.start_date)} - {formatDate(timetableData.exam?.end_date)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Class - Section</h3>
                  <p className="text-lg font-bold text-violet-700">
                    {timetableData.classSection?.class_name} - {timetableData.classSection?.section_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Marks Information</h3>
                  <p className="text-sm text-gray-700">
                    Total Marks: <span className="font-semibold">{timetableData.total_marks}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Passing Marks: <span className="font-semibold">{timetableData.passing_marks}</span>
                  </p>
                </div>
              </div>
              {timetableData.remarks && (
                <div className="mt-4 pt-4 border-t border-violet-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Remarks</h3>
                  <p className="text-sm text-gray-700">{timetableData.remarks}</p>
                </div>
              )}
            </div>

            {/* Timetable Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-violet-600" />
                Exam Schedule
              </h3>
              
              {timetableData.examTimetables && timetableData.examTimetables.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timetableData.examTimetables.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                            <FaBook className="text-violet-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">
                              {item.subject?.subject_name}
                            </h4>
                            <p className="text-xs text-gray-500">{item.subject?.subject_code}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarAlt className="mr-2 text-violet-500" />
                          <span className="font-medium">Date:</span>
                          <span className="ml-2">{formatDate(item.exam_date)}</span>
                        </div>

                        {(item.start_time || item.end_time) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaClock className="mr-2 text-violet-500" />
                            <span className="font-medium">Time:</span>
                            <span className="ml-2">
                              {item.start_time || 'N/A'} - {item.end_time || 'N/A'}
                            </span>
                          </div>
                        )}

                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-gray-500">Max Marks</p>
                              <p className="text-lg font-bold text-violet-600">{item.max_marks}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Passing Marks</p>
                              <p className="text-lg font-bold text-green-600">{item.passing_marks}</p>
                            </div>
                          </div>
                        </div>

                        {item.room_no && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Room:</span> {item.room_no}
                          </div>
                        )}

                        {item.invigilator && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Invigilator:</span> {item.invigilator}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No subjects scheduled for this exam
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!timetableData && !error && !loading && (
          <div className="text-center py-12">
            <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Select exam and class to view timetable</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExamTimetable;
