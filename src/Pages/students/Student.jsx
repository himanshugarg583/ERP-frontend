import React, { useState } from 'react';
import StudentNavbar from './StudentNavbar';
import StudentSidebar from './StudentSidebar';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Student = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <StudentSidebar className="fixed top-0 left-0 w-64 h-full" />
      <div className="fixed top-0 left-64 right-0 z-10 bg-white shadow-md">
        <StudentNavbar />
      </div>
      <main className="flex-1 md:ml-64 mt-10">
        <div className='p-4 md:p-6 lg:p-8'>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-4">
            <Card title="Attendance" percentage="92.5%" details="Present: 37 days | Absent: 3 days" color="green" />
            <Card title="Assignments" percentage="75%" details="Completed: 6 | Pending: 2" color="blue" pending="2 Pending" />
            <Card title="Overall Grade" percentage="88%" details="Current: 88% | Last Term: 84%" color="indigo" grade="A" />
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <UpcomingClasses />
            <PendingAssignments />
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AcademicPerformance />
            <UpcomingEvents />
          </section>
        </div>
      </main>
    </div>
  );
};

// Reusable Card Component
const Card = ({ title, percentage, details, color, pending, grade }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}>
    <div className="flex justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {pending && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{pending}</span>}
      {grade && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{grade}</span>}
    </div>
    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}-500`} style={{ width: percentage }} />
    </div>
    <p className="mt-4 text-sm text-gray-500">{details}</p>
  </div>
);

// Reusable ListItem Component
const ListItem = ({ data, type, color }) => {
  const renderContent = () => {
    switch (type) {
      case 'class':
        return (
          <div className={`p-4 border-l-4 border-${color}-500 bg-${color}-50 rounded-r-lg hover:bg-${color}-100 transition-all`}>
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{data.subject}</h4>
                <p className="text-sm text-gray-500">{data.teacher} • {data.room}</p>
              </div>
              <span className={`bg-${color}-200 text-${color}-800 text-xs px-2 py-1 rounded-md`}>{data.time}</span>
            </div>
          </div>
        );
      case 'assignment':
        return (
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            <h4 className="font-medium">{data.title}</h4>
            <p className="text-sm text-gray-500">Due: {data.due}</p>
          </div>
        );
      case 'event':
        return (
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <div className={`flex flex-col items-center bg-${color}-100 h-12 w-12 rounded-lg`}>
                <span className={`text-lg font-bold text-${color}-700`}>{data.date}</span>
                <span className={`text-xs text-${color}-700`}>{data.month}</span>
              </div>
              <div>
                <h4 className="font-medium">{data.title}</h4>
                <p className="text-sm text-gray-500">{data.time}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
};

// Upcoming Classes
const UpcomingClasses = () => {
  const [showAll, setShowAll] = useState(false);
  const classData = [
    { subject: "Mathematics", teacher: "Prof. Anil Kumar", room: "Room 202", time: "10:30 AM", color: "indigo" },
    { subject: "Physics", teacher: "Dr. Rakesh Sharma", room: "Lab 101", time: "11:45 AM", color: "green" },
    { subject: "Computer Science", teacher: "Mr. Vikram Patel", room: "Lab 301", time: "2:15 PM", color: "purple" },
    { subject: "English", teacher: "Ms. Shalini Verma", room: "Room 205", time: "9:00 AM", color: "blue" },
    { subject: "Chemistry", teacher: "Dr. Priya Gupta", room: "Lab 102", time: "1:00 PM", color: "yellow" },
  ];
  const displayedClasses = showAll ? classData : classData.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Upcoming Classes</h3>
        <button onClick={() => setShowAll(!showAll)} className="text-indigo-600 text-sm hover:underline">
          {showAll ? "View Less" : "View All"}
        </button>
      </div>
      <div className="space-y-4">
        {displayedClasses.map((item, index) => (
          <ListItem key={index} data={item} type="class" color={item.color} />
        ))}
      </div>
    </div>
  );
};

// Pending Assignments
const PendingAssignments = () => {
  const assignmentData = [
    { title: "Physics Lab Report", due: "Tomorrow, 11:59 PM" },
    { title: "Mathematics Problem Set", due: "Friday, 09:00 AM" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Pending Assignments</h3>
        <a href="#assignments" className="text-indigo-600 text-sm hover:underline">View All</a>
      </div>
      <div className="space-y-4">
        {assignmentData.map((item, index) => (
          <ListItem key={index} data={item} type="assignment" />
        ))}
      </div>
    </div>
  );
};

// Academic Performance
const AcademicPerformance = () => {
  const [selectedExam, setSelectedExam] = useState('Unit');
  const performanceData = {
    'Unit': [
      { subject: "Mathematics", score: 90 },
      { subject: "Physics", score: 75 },
      { subject: "Chemistry", score: 85 },
      { subject: "English", score: 100 },
      { subject: "Computer Science", score: 80 },
    ],
    'Half Yearly Exam': [
      { subject: "Mathematics", score: 85 },
      { subject: "Physics", score: 80 },
      { subject: "Chemistry", score: 90 },
      { subject: "English", score: 95 },
      { subject: "Computer Science", score: 75 },
    ],
  };

  const subjects = performanceData[selectedExam].map(item => item.subject);
  const scores = performanceData[selectedExam].map(item => item.score);

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1, flexGrow: 2 }} className="col-span-2">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Academic Performance</Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="exam-select-label">Exam</InputLabel>
          <Select
            labelId="exam-select-label"
            value={selectedExam}
            label="Exam"
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <MenuItem value="Unit">Unit</MenuItem>
            <MenuItem value="Half Yearly Exam">Half Yearly Exam</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <BarChart
        xAxis={[{ scaleType: 'band', data: subjects, label: 'Subjects' }]}
        yAxis={[{ label: 'Score (out of 100)', min: 0, max: 100 }]}
        series={[{ data: scores, color: '#3f51b5', label: 'Score' }]}
        height={300}
        tooltip={{ trigger: 'item' }}
      />
    </Box>
  );
};

// Upcoming Events
const UpcomingEvents = () => {
  const eventData = [
    { date: "15", month: "May", title: "Science Exhibition", time: "10:00 AM", color: "indigo" },
    { date: "22", month: "May", title: "Math Quiz Competition", time: "9:00 AM", color: "green" },
    { date: "30", month: "May", title: "Career Counseling", time: "2:30 PM", color: "purple" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <a href="#events" className="text-indigo-600 text-sm hover:underline">View All</a>
      </div>
      <div className="space-y-4">
        {eventData.map((item, index) => (
          <ListItem key={index} data={item} type="event" color={item.color} />
        ))}
      </div>
    </div>
  );
};

export default Student;