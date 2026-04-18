import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getExamTermDropdown, 
  getExamDropdown, 
  getAllClassesDropdown,
  getSubjectsByClass,
  getExamScheduleByExam,
  getPublishedResultsSubjectWise,
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

const SubjectWiseReport = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [eventIds, setEventIds] = useState([]);
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
        setExamTerms(normalizeArray(termsResponse?.data));

        const classesResponse = await getAllClassesDropdown();
        setClasses(normalizeArray(classesResponse?.data?.classes || classesResponse?.data));
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load subject wise filters');
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

  // Fetch subjects when class is selected
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
        const subjectsArray = normalizeArray(response?.data?.subjects || response?.data);
        setSubjects(subjectsArray);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to load subjects for selected class');
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedClass]);

  const handleFetchReport = async () => {
    const selectedEventId = Number(eventIds?.[0]);

    if (!selectedExam || !selectedClass || !selectedSubject) {
      toast.warning('Please select exam, class section, and subject');
      return;
    }

    if (!Number.isFinite(selectedEventId) || selectedEventId <= 0) {
      toast.warning('No valid exam event found for selected exam');
      return;
    }

    try {
      setLoading(true);
      const response = await getPublishedResultsSubjectWise({
        examEventId: selectedEventId,
        classId: selectedClass,
        subjectId: selectedSubject,
      });

      const payload = response?.data?.data || response?.data || {};
      const normalizedStudents = normalizeArray(payload?.students).map((studentItem) => {
        const resultInfo = studentItem?.result || {};
        const subjectDetail =
          normalizeArray(studentItem?.details_breakdown).find(
            (detail) => String(detail?.subject_id) === String(payload?.subject?.subject_id || selectedSubject)
          ) || normalizeArray(studentItem?.details_breakdown)[0] || {};

        return {
          student_id: studentItem?.student_id,
          student_name: studentItem?.student_name || 'N/A',
          roll_number: studentItem?.roll_number || 'N/A',
          total_marks: resultInfo?.total_marks,
          max_marks: resultInfo?.max_marks,
          percentage: resultInfo?.percentage,
          result_grade: resultInfo?.grade || 'N/A',
          rank: resultInfo?.rank ?? 'N/A',
          is_pass: resultInfo?.is_pass,
          published_at: resultInfo?.published_at,
          subject_marks_obtained: subjectDetail?.marks_obtained,
          subject_max_marks: subjectDetail?.max_marks,
          subject_grade: subjectDetail?.grade || 'N/A',
          is_absent: subjectDetail?.is_absent,
        };
      });

      setReportData({
        exam_event: payload?.exam_event || null,
        class_section: payload?.class_section || null,
        subject: payload?.subject || null,
        students: normalizedStudents,
      });

      if (!normalizedStudents.length) {
        toast.info('No subject wise published results found');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch subject wise report data');
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
              setSelectedExam('');
              setEventIds([]);
              setReportData(null);
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
              setReportData(null);
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
              setReportData(null);
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
          {/* Students Table */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Marks List</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-center">Subject Marks</th>
                  <th className="py-3 px-4 text-center">Subject Grade</th>
                  <th className="py-3 px-4 text-center">Total / Max</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4 text-center">Published At</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students && reportData.students.length > 0 ? (
                  reportData.students.map((student) => (
                    <tr 
                      key={student.student_id} 
                      className={`border-b hover:bg-violet-50 transition-colors ${student.is_absent ? 'bg-amber-50' : ''}`}
                    >
                      <td className="py-3 px-4">{student.roll_number}</td>
                      <td className="py-3 px-4 font-medium">{student.student_name}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        {formatNumber(student.subject_marks_obtained)} / {formatNumber(student.subject_max_marks)}
                      </td>
                      <td className="py-3 px-4 text-center">{student.subject_grade}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(student.total_marks)} / {formatNumber(student.max_marks)}</td>
                      <td className="py-3 px-4 text-center">{formatNumber(student.percentage)}%</td>
                      <td className="py-3 px-4 text-center">{student.rank}</td>
                      <td className="py-3 px-4 text-center">{formatDateTime(student.published_at)}</td>
                      <td className="py-3 px-4 text-center">
                        {student.is_absent ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                            Absent
                          </span>
                        ) : student.is_pass ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Pass
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                            Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-600">
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
          <p className="text-gray-600">Click "Generate Report" to fetch subject-wise published results.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectWiseReport;
