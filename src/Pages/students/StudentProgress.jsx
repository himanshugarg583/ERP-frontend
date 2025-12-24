import React from 'react';
import { LineChart, BarChart } from "@mui/x-charts";
import {
  FaSchool, FaClipboardList, FaCalendarAlt, FaBrain, FaCheckCircle,
  FaExclamationTriangle, FaUser, FaChalkboardTeacher, FaBook, FaCode, FaClock,
  FaBullseye, FaGraduationCap
} from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';

// Reusable Card Component
const Card = ({ title, icon, children, color = "text-gray-800" }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 transition-all hover:shadow-lg border border-gray-100">
    <h3 className={`text-xl font-semibold mb-4 flex items-center ${color}`}>
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    {children}
  </div>
);

// Reusable Assignment Item Component
const AssignmentItem = ({ subject, title, due, status, grade, color }) => (
  <li className={`flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border border-gray-200 hover:bg-${color}-50 transition-all duration-200`}>
    <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 text-lg font-bold mr-0 sm:mr-4 mb-2 sm:mb-0`}>
      {subject.charAt(0)}
    </div>
    <div className="flex-grow">
      <h5 className="font-medium text-gray-800">{title}</h5>
      <p className="text-sm text-gray-500">{subject}</p>
    </div>
    <div className="text-left sm:text-right mt-2 sm:mt-0">
      <span className="block text-sm font-medium text-gray-600">{grade ? `Submitted: ${due}` : `Due: ${due}`}</span>
      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
        {grade || status}
      </span>
    </div>
  </li>
);

// Reusable Progress Bar Component
const ProgressBar = ({ label, progress, icon, color = "bg-blue-600" }) => (
  <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-all duration-200">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium text-gray-800 flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </span>
      <span className="text-sm text-gray-600 font-semibold">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div className={`${color} h-3 rounded-full transition-all duration-500 ease-out`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const StudentProgress = () => {
  const gpaData = { labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], values: [3.5, 3.7, 3.9, 3.8, 4.0, 3.9], current: 3.9 };
  const attendanceData = { labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], values: [98, 100, 22, 54, 98, 75], total: 183, attended: 176, rate: 96 };
  const gradesData = {
    labels: ["Physics", "Chemistry", "Mathematics"],
    current: [88, 92, 95],
    average: [78, 82, 85],
  };

  const assignments = {
    upcoming: [
      { subject: "Mathematics", title: "Integration Problem Set", due: "Feb 10", status: "Pending" },
      { subject: "Chemistry", title: "Organic Chemistry Report", due: "Feb 12", status: "Pending" },
      { subject: "Physics", title: "Mechanics Assignment", due: "Feb 15", status: "Pending" },
    ],
    completed: [
      { subject: "Physics", title: "Kinematics Project", due: "Jan 28", grade: "A" },
      { subject: "Mathematics", title: "Trigonometry Worksheet", due: "Jan 25", grade: "A+" },
    ],
    missing: [{ subject: "Chemistry", title: "Chemical Bonding Quiz", due: "Jan 15", status: "Missing" }],
  };

  const behavioralData = {
    disciplinary: [
      { status: "positive", text: "No disciplinary issues reported this term" },
      { status: "warning", text: "1 tardy report in November (excused with note)" },
    ],
    comments: [
      { teacher: "Mrs. Gupta (Mathematics)", comment: "Riya excels in solving complex calculus problems..." },
      { teacher: "Mr. Verma (Chemistry)", comment: "Riya has shown great improvement in understanding reactions..." },
      { teacher: "Mr. Singh (Physics)", comment: "Riya's grasp of mechanics is commendable..." },
    ],
  };

  const goals = {
    academic: [
      { goal: "Score 90+ in Physics", progress: 80 },
      { goal: "Master organic chemistry concepts", progress: 70 },
      { goal: "Excel in calculus", progress: 85 },
    ],
    skills: [
      { title: "Critical Thinking", description: "Working on problem-solving in physics..." },
      { title: "Lab Skills", description: "Improving experimental techniques in chemistry..." },
      { title: "Mathematical Reasoning", description: "Enhancing skills in calculus..." },
      { title: "Time Management", description: "Using planner to track PCM assignments..." },
    ],
    nextGrade: { progress: 75, term: "Term 2 of 3", recommendation: "Riya is on track for promotion to Grade 12 Science..." },
  };

  // Reusable Tailwind Classes
  const chartHeight = "h-56 sm:h-64";
  const textSmGray = "text-sm text-gray-500";

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Row 1: Overall GPA and Subject Grades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Overall GPA" icon={<FaSchool className="mr-2 text-blue-600" />}>
                <div className={chartHeight}>
                  <LineChart
                    xAxis={[{ data: gpaData.labels, scaleType: 'band' }]}
                    yAxis={[{ min: 0, max: 4 }]}
                    series={[{ data: gpaData.values, label: 'GPA', color: '#3b82f6', area: true, curve: 'catmullRom', showMark: true }]}
                    sx={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-3xl font-bold text-blue-600">{gpaData.current}</span>
                  <span className="text-sm text-gray-500 ml-2">Current GPA</span>
                </div>
              </Card>
              <Card title="Subject Grades" icon={<FaClipboardList className="mr-2 text-purple-600" />}>
                <div className={chartHeight}>
                  <BarChart
                    xAxis={[{ data: gradesData.labels, scaleType: 'band' }]}
                    yAxis={[{ min: 0, max: 100 }]}
                    series={[
                      { data: gradesData.current, label: 'Your Grade', color: '#3b82f6' },
                      { data: gradesData.average, label: 'Class Avg', color: '#d1d5db' },
                    ]}
                    sx={{ width: '100%', height: '100%' }}
                  />
                </div>
              </Card>
            </div>

            {/* Row 2: Attendance Record and Upcoming Deadlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Attendance Record" icon={<FaUser className="mr-2 text-green-600" />}>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <span className="block text-2xl font-bold text-gray-800">{attendanceData.total}</span>
                    <span className={textSmGray}>Total Days</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-gray-800">{attendanceData.attended}</span>
                    <span className={textSmGray}>Attended</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-green-600">{attendanceData.rate}%</span>
                    <span className={textSmGray}>Attendance Rate</span>
                  </div>
                </div>
                <div className="h-40 sm:h-48">
                  <BarChart
                    xAxis={[{ data: attendanceData.labels, scaleType: 'band' }]}
                    yAxis={[{ min: 0, max: 100 }]}
                    series={[{ data: attendanceData.values, label: 'Attendance %', color: '#10b981' }]}
                    sx={{ width: '100%', height: '100%' }}
                  />
                </div>
              </Card>
              <Card title="Upcoming Deadlines" icon={<FaExclamationTriangle className="mr-2 text-amber-500" />}>
                <ul className="space-y-3">
                  {assignments.upcoming.map((item, index) => (
                    <AssignmentItem key={index} {...item} color="amber" />
                  ))}
                </ul>
              </Card>
            </div>

            {/* Row 3: Recently Completed and Missing/Late Submissions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Recently Completed" icon={<FaCheckCircle className="mr-2 text-green-500" />}>
                <ul className="space-y-3">
                  {assignments.completed.map((item, index) => (
                    <AssignmentItem key={index} {...item} color="green" />
                  ))}
                </ul>
              </Card>
              <Card title="Missing/Late Submissions" icon={<FaExclamationTriangle className="mr-2 text-red-500" />}>
                <ul className="space-y-3">
                  {assignments.missing.map((item, index) => (
                    <AssignmentItem key={index} {...item} color="red" />
                  ))}
                </ul>
              </Card>
            </div>

            {/* Row 4: Disciplinary Record and Teacher Comments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Disciplinary Record" icon={<FaBrain className="mr-2 text-teal-600" />}>
                <div className="space-y-3">
                  {behavioralData.disciplinary.map((item, index) => (
                    <div key={index} className={`bg-${item.status === 'positive' ? 'green' : 'amber'}-50 p-4 rounded-lg border border-${item.status === 'positive' ? 'green' : 'amber'}-200 flex items-center hover:bg-${item.status === 'positive' ? 'green' : 'amber'}-100 transition-all duration-200`}>
                      {item.status === 'positive' ? <FaCheckCircle className="text-green-600 mr-3 text-lg" /> : <FaExclamationTriangle className="text-amber-600 mr-3 text-lg" />}
                      <span className="text-sm text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Teacher Comments" icon={<FaChalkboardTeacher className="mr-2 text-blue-600" />}>
                <div className="space-y-3">
                  {behavioralData.comments.map((item, index) => (
                    <details key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 shadow-sm">
                      <summary className="font-medium flex items-center text-gray-800 cursor-pointer">
                        <FaChalkboardTeacher className="mr-2 text-blue-600" />
                        {item.teacher}
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-8 leading-relaxed">{item.comment}</p>
                    </details>
                  ))}
                </div>
              </Card>
            </div>

            {/* Row 5: Personal Academic Goals and Skill Development Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Personal Academic Goals" icon={<FaBook className="mr-2 text-purple-600" />}>
                <ul className="space-y-4">
                  {goals.academic.map((item, index) => (
                    <ProgressBar key={index} label={item.goal} progress={item.progress} icon={<FaBook className="mr-2 text-purple-600" />} color="bg-purple-600" />
                  ))}
                </ul>
              </Card>
              <Card title="Skill Development Areas" icon={<FaBrain className="mr-2 text-indigo-600" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.skills.map((item, index) => (
                    <div key={index} className="border border-indigo-100 bg-indigo-50 rounded-lg p-4 hover:bg-indigo-100 transition-all duration-200 shadow-sm">
                      <h5 className="font-medium text-indigo-800 mb-2 flex items-center">
                        {index === 0 && <FaBrain className="mr-2 text-indigo-600" />}
                        {index === 1 && <FaUser className="mr-2 text-indigo-600" />}
                        {index === 2 && <FaCode className="mr-2 text-indigo-600" />}
                        {index === 3 && <FaClock className="mr-2 text-indigo-600" />}
                        {item.title}
                      </h5>
                      <p className="text-sm text-indigo-700 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Row 6: Progress Towards Next Grade (Single Card) */}
            <div className="grid grid-cols-1 gap-6">
              <Card title="Progress Towards Next Grade" icon={<FaGraduationCap className="mr-2 text-blue-600" />}>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 shadow-sm">
                  <ProgressBar label="Progress to Grade 12" progress={goals.nextGrade.progress} icon={<FaGraduationCap className="mr-2 text-blue-600" />} />
                  <p className="text-sm text-gray-600 mt-2">Academic year progress: {goals.nextGrade.term} completed</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                  <h5 className="font-medium text-green-800 mb-2 flex items-center"><FaCheckCircle className="mr-2 text-green-600" />Teacher Recommendation</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{goals.nextGrade.recommendation}</p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProgress;