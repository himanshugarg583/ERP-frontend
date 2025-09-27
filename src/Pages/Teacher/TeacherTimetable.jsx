import React, { useState } from 'react';
import Sidebar from './TeacherSidebar'; 
import Header from './TeacherHeader';   
import { FaClock, FaBook, FaChalkboardTeacher } from 'react-icons/fa';

const TeacherTimetable = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [timetable] = useState({
    Monday: [
      { time: '8:00 - 8:45', class: 'Class 10A', subject: 'Mathematics' },
      { time: '8:45 - 9:30', class: 'Class 9B', subject: 'Physics' },
      { time: '10:15 - 11:00', class: 'Class 11A', subject: 'Mathematics' },
    ],
    Tuesday: [
      { time: '11:45 - 12:30', class: 'Class 9B', subject: 'Physics' },
      { time: '12:30 - 12:15', class: 'Class 10A', subject: 'Mathematics' },
    ],
    Wednesday: [
      { time: '10:15 - 11:00', class: 'Class 11A', subject: 'Mathematics' },
      { time: '1:15 - 2:00', class: 'Class 9B', subject: 'Physics' },
    ],
    Thursday: [
      { time: '9:30 - 10:15', class: 'Class 10A', subject: 'Mathematics' },
      { time: '11:45 - 12:30', class: 'Class 11A', subject: 'Mathematics' },
    ],
    Friday: [
      { time: '1:15 - 2:00', class: 'Class 10A', subject: 'Mathematics' },
    ],
    Saturday: [  
      { time: '10:00 - 11:00', class: 'Class 9B', subject: 'Physics' }
    ]
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const getMaxPeriods = () => {
    try {
      if (!timetable || !days?.length) return 0;
      return Math.max(...days.map((day) => timetable[day]?.length || 0));
    } catch (error) {
      console.error('Error calculating max periods:', error);
      return 0;
    }
  };

  const maxPeriods = getMaxPeriods();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen w-full">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64"> 
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <FaChalkboardTeacher className="text-4xl text-indigo-600 mr-3" />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      {days.map((day) => (
                        <th 
                          key={day} 
                          className="py-4 px-6 text-left text-sm font-semibold">
                          {day || 'Unnamed Day'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {maxPeriods > 0 ? (
                      Array.from({ length: maxPeriods }).map((_, periodIndex) => (
                        <tr 
                          key={periodIndex} 
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                          {days.map((day) => (
                            <td 
                              key={`${day}-${periodIndex}`} 
                              className="py-4 px-6 align-top min-w-[180px]">
                              {timetable[day] && timetable[day][periodIndex] ? (
                                <div className="bg-indigo-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out">
                                  <p className="text-sm font-semibold text-indigo-700 flex items-center">
                                    <FaClock className="mr-2" />
                                    {timetable[day][periodIndex].time || 'No time'}
                                  </p>
                                  <p className="text-lg font-medium text-gray-800">
                                    {timetable[day][periodIndex].class || 'No class'}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <FaBook className="mr-2" />
                                    {timetable[day][periodIndex].subject || 'No subject'}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Free Period</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td 
                          colSpan={days.length} 
                          className="py-4 px-6 text-center text-gray-500">
                          No timetable data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-gray-600 text-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <p>
                Total Classes: {Object.values(timetable || {}).reduce((sum, day) => sum + (day?.length || 0), 0)}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTimetable;