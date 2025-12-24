import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import StudentAllSubject from './StudentAllSubject';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentTimetable } from '../../helper/requests-method/apiMethods';

const StudentSubject = () => {
  const [timetable, setTimetable] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await getStudentTimetable();
      if (response.success && response.data) {
        setClassInfo(response.data.class_info);
        setTimetable(response.data.timetable);
      } else {
        toast.error(response.message || 'Failed to fetch timetable');
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Helper function to get all unique time slots from timetable
  const getTimeSlots = () => {
    if (!timetable) return [];
    const allSlots = [];
    days.forEach(day => {
      if (timetable[day]) {
        timetable[day].forEach(period => {
          const timeSlot = `${formatTime(period.start_time)} - ${formatTime(period.end_time)}`;
          if (!allSlots.includes(timeSlot)) {
            allSlots.push(timeSlot);
          }
        });
      }
    });
    return allSlots.sort();
  };



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
        <div className="space-y-6">
          <StudentAllSubject />
          <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" /> Timetable
              {classInfo && <span className="ml-4 text-sm font-normal text-gray-600">({classInfo.display_name})</span>}
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : timetable ? (
              <table className="w-full border-separate border-spacing-2">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                    <th className="px-4 py-3 w-32 text-left text-sm font-extrabold uppercase tracking-wider sticky left-0 z-10 bg-indigo-50 border-b border-gray-200 rounded-tl-lg">Day</th>
                    {getTimeSlots().map((time, index) => (
                      <th
                        key={index}
                        className={`px-4 py-3 w-32 text-center text-sm font-extrabold uppercase tracking-wider border-b border-gray-200 ${index === getTimeSlots().length - 1 ? 'rounded-tr-lg' : ''}`}
                      >
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, dayIndex) => {
                    const dayPeriods = timetable[day] || [];
                    return (
                      <tr key={dayIndex} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 w-32 text-sm font-extrabold text-gray-800 sticky left-0 bg-white border-b border-gray-200 z-10">{day}</td>
                        {getTimeSlots().map((timeSlot, slotIndex) => {
                          const period = dayPeriods[slotIndex];
                          if (!period) {
                            return (
                              <td key={slotIndex} className="px-4 py-3 w-32 h-16 text-sm text-center border-b border-gray-200 bg-gray-100 text-gray-800 rounded-md">
                                <span className="inline-block w-full h-full flex items-center justify-center px-2 py-1 rounded-md">-</span>
                              </td>
                            );
                          }
                          if (period.is_break) {
                            return (
                              <td key={slotIndex} className="px-4 py-3 w-32 h-16 text-sm text-center border-b border-gray-200 bg-gray-200 text-gray-800 font-extrabold rounded-md">
                                <span className="inline-block w-full h-full flex items-center justify-center px-2 py-1 rounded-md">Break</span>
                              </td>
                            );
                          }
                          const subject = period.subject;
                          return (
                            <td
                              key={slotIndex}
                              className="px-4 py-3 w-32 h-16 text-sm text-center border-b border-gray-200 bg-indigo-100 text-indigo-800 rounded-md"
                            >
                              <div className="flex flex-col items-center justify-center px-2 py-1">
                                <span className="font-medium">{subject?.subject_name || '-'}</span>
                                {period.teacher && (
                                  <span className="text-xs text-gray-600 mt-1">{period.teacher.name}</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No timetable available
              </div>
            )}
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
        </main>
      </div>
    </div>
  );
};

export default StudentSubject;