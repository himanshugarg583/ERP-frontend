import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getAllClassesDropdown,
  getExamScheduleByExam,
  getPublishedResultsClassWise,
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

const ClassWiseReport = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [eventIds, setEventIds] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [classWiseData, setClassWiseData] = useState(null);

  // Fetch exam terms and classes on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch exam terms
        const termsResponse = await getExamTermDropdown();
        setExamTerms(normalizeArray(termsResponse?.data));

        // Fetch classes
        const classesResponse = await getAllClassesDropdown();
        setClasses(normalizeArray(classesResponse?.data?.classes || classesResponse?.data));
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load class wise filters');
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
        setExams(normalizeArray(response?.data));
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast.error('Failed to load exams for selected term');
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedTerm]);

  useEffect(() => {
    const fetchExamEvents = async () => {
      if (!selectedExam) {
        setEventIds([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getExamScheduleByExam(selectedExam);
        const uniqueEventIds = Array.from(
          new Set(
            normalizeArray(response?.data)
              .map((eventItem) => Number(eventItem?.exam_event_id ?? eventItem?.id ?? eventItem?.exam_schedule_id ?? eventItem?.uuid))
              .filter((eventId) => Number.isFinite(eventId) && eventId > 0)
          )
        );
        setEventIds(uniqueEventIds);
      } catch (error) {
        console.error('Error fetching exam events:', error);
        toast.error('Failed to resolve exam event');
        setEventIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamEvents();
  }, [selectedExam]);

  const handleFetchMarksheet = async () => {
    const selectedEventId = Number(eventIds?.[0]);
    if (!selectedExam || !selectedClass) {
      toast.warning('Please select exam and class section');
      return;
    }

    if (!Number.isFinite(selectedEventId) || selectedEventId <= 0) {
      toast.warning('No valid exam event found for selected exam');
      return;
    }

    try {
      setLoading(true);
      const response = await getPublishedResultsClassWise({
        examEventId: selectedEventId,
        classId: selectedClass,
      });

      const payload = response?.data?.data || response?.data || {};
      const students = normalizeArray(payload?.students).map((studentItem) => ({
        student_id: studentItem?.student_id,
        student_name: studentItem?.student_name || 'N/A',
        roll_number: studentItem?.roll_number || 'N/A',
        result_id: studentItem?.result?.result_id,
        total_marks: studentItem?.result?.total_marks,
        max_marks: studentItem?.result?.max_marks,
        percentage: studentItem?.result?.percentage,
        grade: studentItem?.result?.grade || 'N/A',
        rank: studentItem?.result?.rank ?? 'N/A',
        is_pass: studentItem?.result?.is_pass,
        published_at: studentItem?.result?.published_at,
      }));

      setClassWiseData({
        exam_event: payload?.exam_event || null,
        class_section: payload?.class_section || null,
        students,
      });

      if (!students.length) {
        toast.info('No published class wise results found');
      }
    } catch (error) {
      console.error('Error fetching marksheet:', error);
      toast.error('Failed to fetch class wise report data');
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
              setSelectedExam('');
              setEventIds([]);
              setClassWiseData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={loading}
          >
            <option value="">-- Select Exam Term --</option>
            {examTerms.map((term) => (
              <option key={term.id || term.term_id || term.uuid} value={term.id || term.term_id || term.uuid}>
                {term.term_name || term.name || 'Term'} {term.academic_year ? `(${term.academic_year})` : ''}
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
              setClassWiseData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={!selectedTerm || loading}
          >
            <option value="">-- Select Exam --</option>
            {exams.map((exam) => (
              <option key={exam.id || exam.exam_id || exam.uuid} value={exam.id || exam.exam_id || exam.uuid}>
                {exam.exam_name || exam.name || 'Exam'}
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
              setClassWiseData(null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
            disabled={loading}
          >
            <option value="">-- Select Class --</option>
            {classes.map((classItem) => (
              <option key={classItem.id || classItem.class_section_id} value={classItem.id || classItem.class_section_id}>
                {classItem.class_name || classItem.class || 'Class'} - {classItem.section_name || classItem.section || 'Section'}
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
      {!loading && classWiseData && (
        <div className="mt-6">
          {/* Exam Info */}
          <div className="bg-violet-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-violet-700 mb-3">Exam Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Exam Name:</span>
                <p className="font-medium">{classWiseData.exam_event?.exam_event_name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Class:</span>
                <p className="font-medium">{classWiseData.class_section?.label || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Academic Year:</span>
                <p className="font-medium">{classWiseData.exam_event?.academic_year || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Published At:</span>
                <p className="font-medium">{formatDateTime(classWiseData.exam_event?.result_publish_at)}</p>
              </div>
            </div>
          </div>

          {/* Students Marksheet */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Results</h3>
            {classWiseData.students && classWiseData.students.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead className="bg-violet-600 text-white">
                  <tr>
                    <th className="py-2 px-3 text-left">Roll No</th>
                    <th className="py-2 px-3 text-left">Student Name</th>
                    <th className="py-2 px-3 text-left">Total / Max</th>
                    <th className="py-2 px-3 text-left">Percentage</th>
                    <th className="py-2 px-3 text-left">Grade</th>
                    <th className="py-2 px-3 text-left">Rank</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Published At</th>
                  </tr>
                </thead>
                <tbody>
                  {classWiseData.students.map((student) => (
                    <tr key={student.student_id} className="border-b hover:bg-violet-50 transition-colors">
                      <td className="py-2 px-3">{student.roll_number}</td>
                      <td className="py-2 px-3 font-medium">{student.student_name}</td>
                      <td className="py-2 px-3">{formatNumber(student.total_marks)} / {formatNumber(student.max_marks)}</td>
                      <td className="py-2 px-3">{formatNumber(student.percentage)}%</td>
                      <td className="py-2 px-3">{student.grade}</td>
                      <td className="py-2 px-3">{student.rank}</td>
                      <td className={`py-2 px-3 font-semibold ${student.is_pass ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {student.is_pass ? 'PASS' : 'FAIL'}
                      </td>
                      <td className="py-2 px-3">{formatDateTime(student.published_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {!loading && !classWiseData && selectedExam && selectedClass && (
        <div className="text-center py-8">
          <p className="text-gray-600">Click "Generate Report" to fetch class wise result data.</p>
        </div>
      )}
    </div>
  );
};

export default ClassWiseReport;
