import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar'; 
import Header from '../../components/comman_components/Header';   
import { FaClock, FaBook, FaChalkboardTeacher, FaChevronLeft, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherMyTimetable, getTeacherClassTimetable } from '../../helper/requests-method/timetableApi';

const TeacherTimetable = () => {
  const [loading, setLoading] = useState(false);
  const [teacherTimetable, setTeacherTimetable] = useState(null);
  const [classTimetable, setClassTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('teacher'); // 'teacher' or 'class'
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch teacher timetable on mount
  useEffect(() => {
    fetchTeacherTimetable();
  }, []);

  const fetchTeacherTimetable = async () => {
    try {
      setLoading(true);
      const response = await getTeacherMyTimetable();
      if (response.success && response.data) {
        setTeacherTimetable(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch teacher timetable');
      }
    } catch (error) {
      console.error('Failed to fetch teacher timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch teacher timetable');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassTimetable = async (classSectionId) => {
    try {
      setLoading(true);
      const response = await getTeacherClassTimetable(classSectionId);
      if (response.success && response.data) {
        setClassTimetable(response.data);
        setViewMode('class');
      } else {
        toast.error(response.message || 'Failed to fetch class timetable');
      }
    } catch (error) {
      console.error('Failed to fetch class timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch class timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classSectionId) => {
    setSelectedClass(classSectionId);
    fetchClassTimetable(classSectionId);
  };

  const handleBackToTeacherView = () => {
    setViewMode('teacher');
    setSelectedClass(null);
    setClassTimetable(null);
  };

  // Format time from HH:MM:SS to HH:MM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Get HH:MM from HH:MM:SS
  };

  // Get max periods for a timetable
  const getMaxPeriods = (timetable) => {
    if (!timetable) return 0;
    try {
      return Math.max(...days.map((day) => timetable[day]?.length || 0));
    } catch (error) {
      return 0;
    }
  };

  // Get unique classes from teacher timetable
  const getUniqueClasses = () => {
    if (!teacherTimetable?.timetable) return [];
    const classesMap = new Map();
    
    days.forEach(day => {
      const periods = teacherTimetable.timetable[day] || [];
      periods.forEach(period => {
        if (period.class_info && !period.is_break) {
          const key = period.class_info.id;
          if (!classesMap.has(key)) {
            classesMap.set(key, {
              id: period.class_info.id,
              class_name: period.class_info.class_name,
              section_name: period.class_info.section_name,
              display: period.class_info.display || `${period.class_info.class_name} ${period.class_info.section_name}`,
            });
          }
        }
      });
    });
    
    return Array.from(classesMap.values());
  };

  const renderTeacherTimetable = () => {
    if (!teacherTimetable?.timetable) {
      return (
        <tr>
          <td colSpan={days.length} className="py-8 text-center text-gray-500">
            No timetable data available
          </td>
        </tr>
      );
    }

    const maxPeriods = getMaxPeriods(teacherTimetable.timetable);

    if (maxPeriods === 0) {
      return (
        <tr>
          <td colSpan={days.length} className="py-8 text-center text-gray-500">
            No timetable data available
          </td>
        </tr>
      );
    }

    return Array.from({ length: maxPeriods }).map((_, periodIndex) => (
      <tr 
        key={periodIndex} 
        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {days.map((day) => {
          const period = teacherTimetable.timetable[day]?.[periodIndex];
          return (
            <td 
              key={`${day}-${periodIndex}`} 
              className="py-4 px-6 align-top min-w-45"
            >
              {period && !period.is_break ? (
                <div 
                  className="bg-indigo-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer"
                  onClick={() => handleClassClick(period.class_info.id)}
                >
                  <p className="text-sm font-semibold text-indigo-700 flex items-center">
                    <FaClock className="mr-2" />
                    {formatTime(period.start_time)} - {formatTime(period.end_time)}
                  </p>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {period.class_info?.display || `${period.class_info?.class_name} ${period.class_info?.section_name}`}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <FaBook className="mr-2" />
                    {period.subject_info?.subject_name || 'No subject'}
                  </p>
                </div>
              ) : period && period.is_break ? (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-700 flex items-center">
                    <FaClock className="mr-2" />
                    {formatTime(period.start_time)} - {formatTime(period.end_time)}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">Break</p>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Free Period</span>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  const renderClassTimetable = () => {
    if (!classTimetable?.timetable) {
      return (
        <tr>
          <td colSpan={days.length} className="py-8 text-center text-gray-500">
            No timetable data available
          </td>
        </tr>
      );
    }

    const maxPeriods = getMaxPeriods(classTimetable.timetable);

    if (maxPeriods === 0) {
      return (
        <tr>
          <td colSpan={days.length} className="py-8 text-center text-gray-500">
            No timetable data available
          </td>
        </tr>
      );
    }

    return Array.from({ length: maxPeriods }).map((_, periodIndex) => (
      <tr 
        key={periodIndex} 
        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {days.map((day) => {
          const period = classTimetable.timetable[day]?.[periodIndex];
          return (
            <td 
              key={`${day}-${periodIndex}`} 
              className="py-4 px-6 align-top min-w-45"
            >
              {period && !period.is_break ? (
                <div className="bg-indigo-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out">
                  <p className="text-sm font-semibold text-indigo-700 flex items-center">
                    <FaClock className="mr-2" />
                    {formatTime(period.start_time)} - {formatTime(period.end_time)}
                  </p>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {period.subject?.subject_name || 'No subject'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <FaUser className="mr-2" />
                    {period.teacher?.name || 'No teacher'}
                  </p>
                  {period.subject?.subject_code && (
                    <p className="text-xs text-gray-500 mt-1">
                      Code: {period.subject.subject_code}
                    </p>
                  )}
                </div>
              ) : period && period.is_break ? (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-700 flex items-center">
                    <FaClock className="mr-2" />
                    {formatTime(period.start_time)} - {formatTime(period.end_time)}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">Break</p>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Free Period</span>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  const getTotalClasses = () => {
    const timetable = viewMode === 'teacher' ? teacherTimetable?.timetable : classTimetable?.timetable;
    if (!timetable) return 0;
    return Object.values(timetable).reduce((sum, day) => sum + (day?.filter(p => !p.is_break)?.length || 0), 0);
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

        <main className="w-full px-4 md:px-6 py-6">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                {viewMode === 'class' && (
                  <button
                    onClick={handleBackToTeacherView}
                    className="mr-4 text-indigo-600 bg-indigo-100 p-2 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                )}
                <FaChalkboardTeacher className="text-4xl text-indigo-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {viewMode === 'class' 
                      ? `${classTimetable?.class_info?.display_name || 'Class'} Timetable`
                      : 'My Timetable'
                    }
                  </h1>
                  {viewMode === 'class' && classTimetable?.class_info && (
                    <p className="text-sm text-gray-600 mt-1">
                      {classTimetable.class_info.class_name} - Section {classTimetable.class_info.section_name}
                    </p>
                  )}
                  {viewMode === 'teacher' && teacherTimetable?.teacher_info && (
                    <p className="text-sm text-gray-600 mt-1">
                      {teacherTimetable.teacher_info.name} - {teacherTimetable.teacher_info.qualification}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {viewMode === 'teacher' && teacherTimetable && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">My Classes</h2>
                <div className="flex flex-wrap gap-2">
                  {getUniqueClasses().map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => handleClassClick(cls.id)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                    >
                      {cls.display}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading timetable...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        {days.map((day) => (
                          <th 
                            key={day} 
                            className="py-4 px-6 text-left text-sm font-semibold"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {viewMode === 'teacher' ? renderTeacherTimetable() : renderClassTimetable()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 text-gray-600 text-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <p>
                Total Classes: {getTotalClasses()}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTimetable;
