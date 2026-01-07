import React, { useState, useEffect, useCallback } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { FaCheckCircle, FaChalkboardTeacher, FaUsers, FaChevronLeft, FaCalendarAlt, FaRegClock, FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { 
  getTeacherClasses, 
  getStudentsByClassForAttendance, 
  markClassAttendance, 
  getClassAttendanceByDate 
} from '../../helper/requests-method/apiMethods';

const ClassCard = ({ cls, onClick, studentCount, todayStats }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5">
        <h3 className="text-white text-lg font-semibold">{cls?.display_name || cls?.name || ''}</h3>
        <p className="text-indigo-200 text-sm mt-1">Class: {cls?.class_name || ''} - {cls?.section_name || ''}</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center text-gray-700">
          <FaUsers className="text-indigo-500 mr-2" size={18} />
          <span className="font-medium">{studentCount || 0} Students</span>
        </div>
        {todayStats && (
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <p className="text-xs text-gray-600 mb-1">Today's Attendance</p>
            <p className="text-sm font-semibold text-indigo-700">{todayStats.present || 0}/{todayStats.total || 0} Present</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AttendanceView = ({ 
  classId, 
  classes, 
  attendance, 
  setAttendance, 
  history, 
  setHistory, 
  setActiveClass,
  onSaveAttendance,
  onViewPastAttendance,
  loading 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isCurrentDate, setIsCurrentDate] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const cls = classes?.find(c => c?.class_section_id === classId) ?? {};

  // Get max date (today) for date input
  const maxDate = today;

  // Handle date change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const isToday = date === today;
    setIsCurrentDate(isToday);
    setIsLoadingData(true);

    try {
      if (isToday) {
        // For current date, fetch students list
        await onViewPastAttendance(classId, date, true);
      } else {
        // For past date, fetch attendance by date
        await onViewPastAttendance(classId, date, false);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const stats = attendance?.[classId]?.reduce((acc, s) => ({
    total: acc.total + 1,
    present: acc.present + (s?.status === 'present' || s?.status === true ? 1 : 0),
    absent: acc.absent + (s?.status === 'absent' || s?.status === false ? 1 : 0),
    leave: acc.leave + (s?.status === 'leave' ? 1 : 0),
  }), { total: 0, present: 0, absent: 0, leave: 0 }) ?? { total: 0, present: 0, absent: 0, leave: 0 };
  stats.unmarked = stats.total - (stats.present ?? 0) - (stats.absent ?? 0) - (stats.leave ?? 0);

  const handleAttendanceChange = (userId, status) => {
    if (!isCurrentDate) {
      toast.warning('Cannot modify past attendance');
      return;
    }
    setAttendance(prev => ({
      ...prev,
      [classId]: prev?.[classId]?.map(s => s?.user_id === userId ? { ...s, status } : s) ?? [],
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!isCurrentDate) {
      toast.warning('Cannot save attendance for past dates');
      return;
    }
    onSaveAttendance(classId, selectedDate);
  };

  const handleMarkAllPresent = () => {
    if (!isCurrentDate) {
      toast.warning('Cannot modify past attendance');
      return;
    }
    setAttendance(prev => ({ 
      ...prev, 
      [classId]: prev?.[classId]?.map(s => ({ ...s, status: 'present' })) ?? [] 
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveClass(null)}
            className="text-indigo-600 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
            aria-label="Back to classes"
          >
            <FaChevronLeft size={18} />
          </button>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">{cls?.display_name || cls?.name || ''}</h3>
            <p className="text-sm text-gray-500 mt-1">Class: {cls?.class_name || ''} - Section: {cls?.section_name || ''}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 w-full sm:w-auto">
            <FaCalendarAlt className="text-indigo-600" />
            <input
              type="date"
              value={selectedDate ?? ''} 
              onChange={(e) => handleDateChange(e.target.value)}
              max={maxDate}
              className="border-0 bg-transparent focus:outline-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
              disabled={loading || isLoadingData}
            />
          </div>
          {!isCurrentDate && (
            <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">
              View Only
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="p-4 rounded-xl shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-xl md:text-2xl font-bold text-indigo-600">{stats?.total ?? 0}</p>
        </div>
        <div className="p-4 rounded-xl shadow-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Present</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">{stats?.present ?? 0}</p>
        </div>
        <div className="p-4 rounded-xl shadow-sm bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Absent</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">{stats?.absent ?? 0}</p>
        </div>
        <div className="p-4 rounded-xl shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Unmarked</p>
          <p className="text-xl md:text-2xl font-bold text-gray-600">{stats?.unmarked ?? 0}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {isCurrentDate && (
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
          <button
            onClick={handleMarkAllPresent}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isLoadingData}
          >
            <FaCheck size={16} /> Mark All Present
          </button>
          <button 
            onClick={handleSaveAttendance} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isLoadingData}
          >
            <FaSave size={16} /> {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingData && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading attendance...</span>
        </div>
      )}

      {/* Attendance Table */}
      {!isLoadingData && (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 md:p-4 font-semibold text-gray-700 text-sm border-b-2 border-indigo-200 rounded-t-lg">
              <div className="col-span-1 text-center">No.</div>
              <div className="col-span-2 md:col-span-2">Roll No</div>
              <div className="col-span-5 md:col-span-6">Name</div>
              <div className="col-span-4 md:col-span-3 text-center">Status</div>
            </div>
            
            {/* Table Body */}
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto border border-gray-200 rounded-b-lg">
              {attendance?.[classId]?.length > 0 ? (
                attendance[classId].map((s, i) => (
                  <div 
                    key={s?.user_id ?? i} 
                    className={`grid grid-cols-12 p-3 md:p-4 border-b border-gray-100 last:border-b-0 ${
                      i % 2 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <div className="col-span-1 text-center text-gray-600 font-medium">{i + 1}</div>
                    <div className="col-span-2 md:col-span-2 text-gray-700 font-medium">{s?.roll_number || s?.rollNo || 'N/A'}</div>
                    <div className="col-span-5 md:col-span-6 text-gray-800 font-medium truncate">{s?.student_name || s?.name || ''}</div>
                    <div className="col-span-4 md:col-span-3 flex justify-center gap-2">
                      {isCurrentDate ? (
                        <>
                          <button
                            onClick={() => handleAttendanceChange(s?.user_id, 'present')}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                              s?.status === 'present' || s?.status === true 
                                ? 'bg-green-500 text-white shadow-md ring-2 ring-green-300' 
                                : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                            }`}
                            disabled={loading || isLoadingData}
                            title="Mark Present"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(s?.user_id, 'absent')}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                              s?.status === 'absent' || s?.status === false 
                                ? 'bg-red-500 text-white shadow-md ring-2 ring-red-300' 
                                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                            }`}
                            disabled={loading || isLoadingData}
                            title="Mark Absent"
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
                      ) : (
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          s?.status === 'present' || s?.status === true
                            ? 'bg-green-100 text-green-800'
                            : s?.status === 'absent' || s?.status === false
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {s?.status === 'present' || s?.status === true ? 'Present' : 
                           s?.status === 'absent' || s?.status === false ? 'Absent' : 
                           'Not Marked'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>No students found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TeacherAttendance = () => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Attendance');
  const [activeClass, setActiveClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [classStudentCounts, setClassStudentCounts] = useState({});
  const [classTodayStats, setClassTodayStats] = useState({});

  // Fetch teacher classes on mount
  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      const response = await getTeacherClasses();
      if (response.success && response.data?.classes) {
        const mappedClasses = response.data.classes.map(cls => ({
          class_section_id: cls.class_section_id,
          class_name: cls.class_name,
          section_name: cls.section_name,
          display_name: cls.display_name,
        }));
        setClasses(mappedClasses);
      } else {
        toast.error(response.message || 'Failed to fetch classes');
      }
    } catch (error) {
      console.error('Failed to fetch teacher classes:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when a class is selected
  const fetchStudentsByClass = useCallback(async (classId) => {
    try {
      setLoading(true);
      const response = await getStudentsByClassForAttendance(classId);
      if (response.success && response.data?.students) {
        const mappedStudents = response.data.students.map(student => ({
          user_id: student.user_id,
          student_name: student.student_name,
          roll_number: student.roll_number || '',
          status: null,
        }));
        setAttendance(prev => ({
          ...prev,
          [classId]: mappedStudents,
        }));
        setClassStudentCounts(prev => ({
          ...prev,
          [classId]: response.data.total_students || mappedStudents.length,
        }));
        return true;
      } else {
        toast.error(response.message || 'Failed to fetch students');
        return false;
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch students');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle class selection
  const handleClassClick = async (classId) => {
    setActiveClass(classId);
    const today = new Date().toISOString().split('T')[0];
    // Load students for current date when class is selected
    await fetchStudentsByClass(classId);
  };

  // Save attendance
  const handleSaveAttendance = async (classId, date) => {
    const students = attendance[classId] || [];
    const attendanceData = students.map(student => ({
      user_id: student.user_id,
      status: student.status || 'absent', // Default to absent if not marked
    })).filter(s => s.status !== null);

    if (attendanceData.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        class_section_id: classId,
        date: date,
        marked_by: user?.id || 2,
        attendance: attendanceData,
      };

      const response = await markClassAttendance(payload);
      if (response.success) {
        toast.success(response.message || 'Attendance marked successfully');
        // Refresh the attendance view
        await fetchStudentsByClass(classId);
        // Update history
        setHistory(prev => ({
          ...prev,
          [classId]: [...(prev[classId] || []), { date, data: [...students] }],
        }));
      } else {
        toast.error(response.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  // View past attendance or load students for current date
  const handleViewPastAttendance = async (classId, date, isCurrentDate = false) => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    try {
      setLoading(true);
      
      if (isToday || isCurrentDate) {
        // For current date, fetch students list
        await fetchStudentsByClass(classId);
      } else {
        // For past date, fetch attendance by date
        const response = await getClassAttendanceByDate(classId, date);
        if (response.success && response.data?.attendance) {
          const mappedAttendance = response.data.attendance.map(att => ({
            user_id: att.user_id,
            student_name: att.student_name,
            roll_number: att.roll_number || '',
            status: att.status,
          }));
          setAttendance(prev => ({
            ...prev,
            [classId]: mappedAttendance,
          }));
          
          // Update summary stats
          const summary = response.data.summary || {};
          setClassTodayStats(prev => ({
            ...prev,
            [classId]: {
              total: summary.total || 0,
              present: summary.present || 0,
              absent: summary.absent || 0,
              leave: summary.leave || 0,
            },
          }));
          
          toast.success('Attendance loaded successfully');
        } else {
          // If no attendance found, load the student list without attendance marked
          await fetchStudentsByClass(classId);
          toast.info('No attendance found for this date.');
        }
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      // If error, just load the student list
      await fetchStudentsByClass(classId);
      if (activeClass === classId) {
        toast.error(error.response?.data?.message || 'Failed to fetch attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <ToastContainer position="top-right" autoClose={3000} />
            {activeMenu === 'Attendance' ? (
              activeClass ? (
                <AttendanceView
                  classId={activeClass}
                  classes={classes}
                  attendance={attendance}
                  setAttendance={setAttendance}
                  history={history}
                  setHistory={setHistory}
                  setActiveClass={setActiveClass}
                  onSaveAttendance={handleSaveAttendance}
                  onViewPastAttendance={handleViewPastAttendance}
                  loading={loading}
                />
              ) : (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Classes</h2>
                    <p className="text-gray-600">Select a class to mark attendance</p>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : classes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {classes.map(cls => (
                        <ClassCard 
                          key={cls.class_section_id} 
                          cls={cls} 
                          onClick={() => handleClassClick(cls.class_section_id)}
                          studentCount={classStudentCounts[cls.class_section_id]}
                          todayStats={classTodayStats[cls.class_section_id]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-center bg-white rounded-xl shadow-lg p-8">
                      <div>
                        <FaChalkboardTeacher className="text-6xl text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Classes Assigned</h3>
                        <p className="text-gray-500">You don't have any classes assigned yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-center bg-white rounded-xl shadow-lg p-8">
                <div>
                  <FaChalkboardTeacher className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">{activeMenu ?? ''} Module</h3>
                  <p className="text-gray-500">Click Attendance in sidebar to proceed</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherAttendance;
