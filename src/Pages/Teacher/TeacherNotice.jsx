import React, { useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { MdGrade, MdTrendingUp, MdTrendingDown, MdArrowForward } from 'react-icons/md';
import { BarChart } from '@mui/x-charts';
import { LinearProgress } from '@mui/material';

const TeacherNotice = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessments] = useState(getInitialAssessments);
  const [showAll, setShowAll] = useState(false);
  const [editAssessment, setEditAssessment] = useState(null);
  const [newAssessment, setNewAssessment] = useState(null);

  const students = [
    { id: 1, name: "Aarav Sharma", grade: "87%", attendance: "92%", assignments: "78%", rank: 5, photo: "https://via.placeholder.com/150", gradeHistory: [77, 79, 82, 84, 85, 87], attendanceHistory: [84, 86, 88, 90, 91, 92], assignmentHistory: [66, 68, 72, 74, 76, 78] },
    { id: 2, name: "Priya Patel", grade: "91%", attendance: "95%", assignments: "85%", rank: 2, photo: "https://via.placeholder.com/150", gradeHistory: [85, 87, 88, 89, 90, 91], attendanceHistory: [90, 91, 92, 93, 94, 95], assignmentHistory: [78, 80, 81, 82, 84, 85] },
    { id: 3, name: "Rohan Gupta", grade: "84%", attendance: "89%", assignments: "70%", rank: 8, photo: "https://via.placeholder.com/150", gradeHistory: [80, 81, 82, 83, 83, 84], attendanceHistory: [85, 86, 87, 88, 88, 89], assignmentHistory: [65, 66, 67, 68, 69, 70] },
    { id: 4, name: "Sneha Verma", grade: "88%", attendance: "93%", assignments: "80%", rank: 4, photo: "https://via.placeholder.com/150", gradeHistory: [82, 84, 85, 86, 87, 88], attendanceHistory: [87, 89, 90, 91, 92, 93], assignmentHistory: [74, 76, 77, 78, 79, 80] },
  ];

  const handleAddAssessment = () => setNewAssessment({
    title: 'Final Exam', date: '', subjects: ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education']
      .map(subject => ({ subject, score: '', classAvg: '', remarks: '', trend: 'Stable' })), icon: 'quiz', iconColor: 'blue-500'
  });

  const handleSaveAssessment = () => {
    if (editAssessment) { setAssessments((prev = []) => prev.map(a => a === editAssessment ? { ...newAssessment } : a));
    } else if (newAssessment) { setAssessments((prev = []) => [...prev, { ...newAssessment }]);
    }
    setNewAssessment(null); setEditAssessment(null);
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          {selectedStudent ? (
            <StudentDashboard student={selectedStudent} onBack={setSelectedStudent} />
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Student List</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {(students ?? []).map(student => (
                  <StudentCard key={student?.id ?? Math.random()} student={student} onClick={setSelectedStudent} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      {showAll && <AssessmentModal assessments={assessments} setShowAll={setShowAll} />}
      {(newAssessment || editAssessment) && (
        <AssessmentForm assessment={newAssessment ?? editAssessment} setAssessment={setNewAssessment} handleSave={handleSaveAssessment} handleCancel={() => { setNewAssessment(null); setEditAssessment(null); }}/>
      )}
    </div>
  );
};

const StudentCard = ({ student, onClick }) => (
  <div
    className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
    onClick={() => onClick(student)}>
    <img
      src={student?.photo ?? 'https://via.placeholder.com/150'}
      alt={student?.name ?? 'Student'}
      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mb-2 sm:mb-3 object-cover border-2 border-blue-500"/>
    <h3 className="font-semibold text-gray-800 text-base sm:text-lg text-center truncate w-full">{student?.name ?? 'N/A'}</h3>
    <div className="flex items-center gap-2 mt-1 sm:mt-2">
      <MdGrade className="text-blue-500 text-lg sm:text-xl" />
      <p className="text-lg sm:text-xl font-bold text-gray-800">{student?.grade ?? 'N/A'}</p>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 mt-1">Attendance: {student?.attendance ?? 'N/A'}</p>
    <p className="text-xs sm:text-sm text-gray-600">Rank: #{student?.rank ?? 'N/A'}</p>
  </div>
);

const Card = ({ title, value, trend, trendDirection, color }) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-500' },
  }[color] ?? { bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-500' };
  const TrendIcon = trendDirection === 'up' ? MdTrendingUp : MdTrendingDown;

  return (
    <div className={`${colorStyles.bg} p-3 sm:p-4 rounded-xl border ${colorStyles.border} hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <h3 className="font-medium text-gray-700 text-sm sm:text-base">{title ?? 'N/A'}</h3>
        <MdGrade className={`${colorStyles.text} text-lg sm:text-xl`} />
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{value ?? 'N/A'}</p>
      <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 flex items-center">
        <TrendIcon className={`${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'} text-sm mr-1`} />
        <span className={`${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'} font-medium`}>{trend ?? 'N/A'}</span> Last Month
      </p>
    </div>
  );
};

const StudentDashboard = ({ student, onBack }) => (
  <>
    <div className="flex items-center mb-4 sm:mb-6">
      <button
        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mr-4 text-sm sm:text-base" onClick={() => onBack(null)}>
        <MdArrowForward className="text-sm rotate-180" /> Back
      </button>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">{student?.name ?? 'N/A'}'s Performance Dashboard</h1>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card title="Average Grade" value={student?.grade} trend="+3.2%" trendDirection="up" color="blue" />
      <Card title="Attendance Rate" value={student?.attendance} trend="+1.7%" trendDirection="up" color="green" />
      <Card title="Assignments Completed" value={student?.assignments} trend="-2.1%" trendDirection="down" color="amber" />
      <Card title="Class Rank" value={`#${student?.rank ?? 'N/A'}`} trend="+2" trendDirection="up" color="purple" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <PerformanceTrend selectedStudent={student} />
      <SubjectPerformance />
    </div>
  </>
);

const PerformanceTrend = ({ selectedStudent }) => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const metrics = {
    grade: selectedStudent?.gradeHistory?.slice(-1) ?? [],
    attendance: selectedStudent?.attendanceHistory?.slice(-1) ?? [],
    assignments: selectedStudent?.assignmentHistory?.slice(-1) ?? []
  };
  const series = selectedMetric === 'all' ? [
    { data: metrics.grade, color: '#3b82f6' },
    { data: metrics.attendance, color: '#10b981' },
    { data: metrics.assignments, color: '#f59e0b' }
  ] : [{
    data: metrics[selectedMetric],
    color: { grade: '#3b82f6', attendance: '#10b981', assignments: '#f59e0b' }[selectedMetric] ?? '#3b82f6'
  }];

  return (
    <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-5 hover:shadow-md transition-all duration-200">
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        {['grade', 'attendance', 'assignments'].map(metric => (
          <button key={metric} className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${selectedMetric === metric || selectedMetric === 'all' ? `bg-${metric === 'grade' ? 'blue' : metric === 'attendance' ? 'green' : 'amber'}-100 text-${metric === 'grade' ? 'blue' : metric === 'attendance' ? 'green' : 'amber'}-700` : 'bg-gray-100 text-gray-700'} hover:bg-${metric === 'grade' ? 'blue' : metric === 'attendance' ? 'green' : 'amber'}-200 transition-all`}
            onClick={() => setSelectedMetric(metric)}> {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>
      <div className="w-full overflow-x-auto">
        <BarChart
          xAxis={[{ data: ['Mar'], scaleType: 'band', label: 'Month' }]}
          yAxis={[{ min: 0, max: 100, label: 'Percentage (%)' }]}
          series={series}
          width={750} 
          height={200} 
          margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiCharts-root': { width: '100% !important', height: '100% !important' },
            minWidth: { xs: 300, sm: 400, md: 600, lg: 750 }, 
          }}/>
      </div>
    </div>
  );
};

const SubjectPerformance = () => {
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art'];
  const scores = { Mathematics: 92, Science: 85, English: 78, History: 89, Art: 95 };
  const colors = { Mathematics: '#2563eb', Science: '#16a34a', English: '#d97706', History: '#9333ea', Art: '#ec4899' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-5 hover:shadow-md transition-all duration-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Subject Performance</h2>
      <div className="space-y-3 sm:space-y-4">
        {subjects.map(subject => (
          <div key={subject}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">{subject}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">{scores[subject] ?? 0}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={scores[subject] ?? 0}
              sx={{
                height: { xs: 8, sm: 10 },
                borderRadius: 5,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': { backgroundColor: colors[subject] ?? '#e5e7eb' }
              }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const AssessmentModal = ({ assessments, setShowAll }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-4 sm:p-6 w-11/12 sm:w-10/12 md:w-3/4 max-h-[80vh] overflow-y-auto shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">All Assessments</h2>
        <button className="text-red-600 hover:text-red-800 font-medium text-sm sm:text-base" onClick={() => setShowAll(false)}>Close</button>
      </div>
      {!assessments?.length ? (
        <p className="text-gray-600 text-sm sm:text-base">No assessments available.</p>
      ) : (
        (assessments ?? []).map((assessment, index) => (
          <div key={index} className="mb-4 sm:mb-6 border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              {assessment?.title ?? 'N/A'} - {assessment?.date ?? 'N/A'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
              {(assessment?.subjects ?? []).map((sub, idx) => (
                <div key={idx} className="border p-2 sm:p-3 rounded-lg bg-gray-50">
                  <p><span className="font-medium">Subject:</span> {sub?.subject ?? 'N/A'}</p>
                  <p><span className="font-medium">Score:</span> {sub?.score ?? 'N/A'}</p>
                  <p><span className="font-medium">Class Avg:</span> {sub?.classAvg ?? 'N/A'}</p>
                  <p><span className="font-medium">Grade:</span> {calculateGrade(sub?.score ?? '0/100')}</p>
                  <p><span className="font-medium">Status:</span> <span className={calculateStatus(sub?.score ?? '0/100') === 'Passed' ? 'text-green-600' : 'text-red-600'}>{calculateStatus(sub?.score ?? '0/100')}</span></p>
                  <p><span className="font-medium">Trend:</span> <span className={sub?.trend === 'Improved' ? 'text-green-600' : sub?.trend === 'Declined' ? 'text-red-600' : 'text-gray-600'}>{sub?.trend ?? 'N/A'}</span></p>
                  <p><span className="font-medium">Remarks:</span> "{sub?.remarks ?? 'N/A'}"</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const AssessmentForm = ({ assessment, setAssessment, handleSave, handleCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-4 sm:p-6 w-11/12 sm:w-10/12 md:w-3/4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{assessment === editAssessment ? 'Edit Assessment' : 'Add Assessment'}</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Date</label>
          <input
            type="text"
            value={assessment?.date ?? ''}
            onChange={e => setAssessment({ ...assessment, date: e.target.value })}
            className="w-full p-2 border rounded text-xs sm:text-sm" placeholder="e.g., June 15, 2023"/>
        </div>
        {(assessment?.subjects ?? []).map((sub, idx) => (
          <div key={idx} className="border p-2 sm:p-3 rounded">
            <p className="font-medium text-xs sm:text-sm">{sub?.subject ?? 'N/A'}</p>
            {['score', 'classAvg', 'remarks'].map(field => (
              <input key={field} type="text" value={sub?.[field] ?? ''}
                onChange={e => setAssessment({
                  ...assessment,
                  subjects: (assessment?.subjects ?? []).map((s, i) =>
                    i === idx ? { ...s, [field]: e.target.value } : s
                  )
                })}
                className="w-full p-2 border rounded mt-1 text-xs sm:text-sm"
                placeholder={field === 'score' ? 'Score (e.g., 94/100)' : field === 'classAvg' ? 'Class Avg (e.g., 82/100)' : 'Remarks'}/>
            ))}
            <select
              value={sub?.trend ?? 'Stable'}
              onChange={e => setAssessment({
                ...assessment,
                subjects: (assessment?.subjects ?? []).map((s, i) =>
                  i === idx ? { ...s, trend: e.target.value } : s
                )
              })}
              className="w-full p-2 border rounded mt-1 text-xs sm:text-sm">
              {['Improved', 'Stable', 'Declined'].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm" onClick={handleSave}>Save</button>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

const getInitialAssessments = () => [
  {
    title: 'Final Exam',
    date: 'June 15, 2023',
    subjects: [
      { subject: 'Mathematics', score: '94/100', classAvg: '82/100', remarks: 'Excellent performance!', trend: 'Improved' },
      { subject: 'Science', score: '88/100', classAvg: '79/100', remarks: 'Strong concepts!', trend: 'Stable' },
      { subject: 'English', score: '85/100', classAvg: '78/100', remarks: 'Good writing skills.', trend: 'Improved' },
      { subject: 'History', score: '90/100', classAvg: '80/100', remarks: 'Great analysis.', trend: 'Stable' },
      { subject: 'Art', score: '95/100', classAvg: '85/100', remarks: 'Creative work!', trend: 'Improved' },
      { subject: 'Physical Education', score: '92/100', classAvg: '88/100', remarks: 'Excellent participation.', trend: 'Stable' },
    ],
    icon: 'quiz',
    iconColor: 'blue-500'
  },
  {
    title: 'Research Paper',
    date: 'May 28, 2023',
    subjects: [{ subject: 'Science', score: '89/100', classAvg: '76/100', remarks: 'Great effort, focus on conclusion.', trend: 'Stable' }],
    icon: 'assignment',
    iconColor: 'green-500'
  },
  {
    title: 'Essay Assignment',
    date: 'May 14, 2023',
    subjects: [{ subject: 'English', score: '78/100', classAvg: '72/100', remarks: 'Good work, improve grammar.', trend: 'Declined' }],
    icon: 'history_edu',
    iconColor: 'amber-500'
  },
];

const calculateGrade = (score) => {
  const value = parseInt(score?.split('/')[0] ?? '0');
  return value >= 90 ? 'A' : value >= 80 ? 'B' : value >= 70 ? 'C' : value >= 60 ? 'D' : 'F';
};

const calculateStatus = (score) => {
  return parseInt(score?.split('/')[0] ?? '0') >= 40 ? 'Passed' : 'Failed';
};

export default TeacherNotice;