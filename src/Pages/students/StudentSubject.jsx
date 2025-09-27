import React, { useState } from 'react';
import { FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import StudentNavbar from './StudentNavbar';
import StudentSidebar from './StudentSidebar';
import StudentAllSubject from './StudentAllSubject';

const StudentSubject = () => {
  const [activeSubject] = useState({
    name: "Mathematics",
    code: "MATH-101",
    instructor: "Dr. Alan Smith",
    progress: 75,
  });

  const data = {
    pendingAssignments: [
      { id: 1, title: "Calculus Problem Set", subject: "Mathematics", dueDate: "2025-03-12", priority: "High" },
      { id: 2, title: "Trigonometry Exercises", subject: "Mathematics", dueDate: "2025-03-16", priority: "Medium" },
      { id: 3, title: "Statistics Analysis", subject: "Mathematics", dueDate: "2025-03-18", priority: "Low" },
    ],
    upcomingTests: [
      { id: 1, title: "Midterm Exam", subject: "Mathematics", date: "2025-03-20", time: "10:00 AM" },
      { id: 2, title: "Calculus Test", subject: "Mathematics", date: "2025-03-22", time: "1:00 PM" },
      { id: 3, title: "Algebra Quiz", subject: "Mathematics", date: "2025-03-16", time: "9:30 AM" },
    ],
    timetable: [
      { day: 'Monday', slots: ['Physics', 'Mathematics', 'Chemistry', 'Break', 'Mathematics', 'Physics Lab', 'English', 'Physics'] },
      { day: 'Tuesday', slots: ['Mathematics', 'Physics', 'Chemistry', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'] },
      { day: 'Wednesday', slots: ['Chemistry', 'Mathematics', 'Physics', 'Break', 'English', 'Physics', 'Mathematics', 'Chemistry'] },
      { day: 'Thursday', slots: ['Physics', 'Chemistry', 'Mathematics', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'] },
      { day: 'Friday', slots: ['Mathematics', 'Physics', 'Chemistry', 'Break', 'Physics Lab', 'English', 'Mathematics', 'Physics'] },
      { day: 'Saturday', slots: ['Chemistry', 'Mathematics', 'Physics', 'Break', 'Physical Education', 'Mathematics', '-', '-'] },
    ],
    timeHeaders: [
      "8:00 - 8:45", "8:45 - 9:30", "9:30 - 10:15", "10:15 - 10:30", "10:30 - 11:15", "11:15 - 12:00", "12:00 - 12:45", "12:45 - 1:30"
    ]
  };

  const Card = ({ title, icon, items, filterKey, emptyMessage }) => {
    const filteredItems = items.filter(item => item[filterKey] === activeSubject.name);

    return (
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            {icon} <span className="ml-2">{title}</span>
          </h2>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="border rounded-lg p-3 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {title === "Upcoming Tests" ? `${item.date} at ${item.time}` : `Due: ${item.dueDate}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    title === "Upcoming Tests" ? 'bg-indigo-100 text-indigo-800' :
                    item.priority === 'High' ? 'bg-red-100 text-red-800' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {title === "Upcoming Tests" ? "Upcoming" : item.priority}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-500">{emptyMessage}</div>
          )}
        </div>
      </div>
    );
  };

  const subjectColors = {
    Mathematics: 'bg-blue-100 text-blue-800',
    Physics: 'bg-green-100 text-green-800',
    Chemistry: 'bg-purple-100 text-purple-800',
    English: 'bg-pink-100 text-pink-800',
    'Physical Education': 'bg-red-100 text-red-800',
    'Physics Lab': 'bg-green-200 text-green-900',
    'Chemistry Lab': 'bg-purple-200 text-purple-900',
    Break: 'bg-gray-200 text-gray-800 font-extrabold',
    '-': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <StudentSidebar className="fixed top-0 left-0 w-64 h-full" />
      
      <div className="fixed top-0 left-64 right-0 z-10 bg-white shadow-md">
        <StudentNavbar />
      </div>
      
      <main className="pt-16 md:ml-64 p-6">
        <div className="space-y-6">
          <StudentAllSubject />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Upcoming Tests"
              icon={<FaCalendarAlt className="text-indigo-500" />}
              items={data.upcomingTests}
              filterKey="subject"
              emptyMessage={`No upcoming tests for ${activeSubject.name}`}
            />
            <Card
              title="Pending Assignments"
              icon={<FaClipboardList className="text-indigo-500" />}
              items={data.pendingAssignments}
              filterKey="subject"
              emptyMessage={`No pending assignments for ${activeSubject.name}`}
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" /> Timetable
            </h2>
            <table className="w-full border-separate border-spacing-2">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                  <th className="px-4 py-3 w-32 text-left text-sm font-extrabold uppercase tracking-wider sticky left-0 z-10 bg-indigo-50 border-b border-gray-200 rounded-tl-lg">Day</th>
                  {data.timeHeaders.map((time, index) => (
                    <th
                      key={index}
                      className={`px-4 py-3 w-32 text-center text-sm font-extrabold uppercase tracking-wider border-b border-gray-200 ${index === data.timeHeaders.length - 1 ? 'rounded-tr-lg' : ''}`}
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.timetable.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3 w-32 text-sm font-extrabold text-gray-800 sticky left-0 bg-white border-b border-gray-200 z-10">{item.day}</td>
                    {item.slots.map((subject, slotIndex) => (
                      <td
                        key={slotIndex}
                        className={`px-4 py-3 w-32 h-16 text-sm text-center border-b border-gray-200 ${subjectColors[subject] || 'bg-gray-100 text-gray-800'} rounded-md`}
                      >
                        <span className="inline-block w-full h-full flex items-center justify-center px-2 py-1 rounded-md">
                          {subject}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentSubject;