import React, { useState, useEffect, useCallback } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { FaCheckCircle, FaChalkboardTeacher, FaUsers, FaChevronLeft, FaCalendarAlt, FaRegClock, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { 
  getTeacherClasses, 
  getStudentsByClass, 
  markClassAttendance, 
  getClassAttendanceByDate 
} from '../../helper/requests-method/apiMethods';

const ClassCard = ({ cls, onClick, studentCount, todayStats }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all border border-gray-100" 
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-lg">
        <h3 className="text-white text-lg font-semibold">{cls?.display_name || cls?.name || ''}</h3>
        <p className="text-blue-200 text-sm">Class: {cls?.class_name || ''} - {cls?.section_name || ''}</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center text-gray-600">
          <FaUsers className="text-blue-500 mr-2" />
          <span>{studentCount || 0} Students</span>
        </div>
        {todayStats && (
          <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Today's Attendance</p>
              <p className="text-sm font-medium text-gray-700">{todayStats.present || 0}/{todayStats.total || 0} Present</p>
            </div>
            <FaCheckCircle className="text-green-500" />
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
  const cls = classes?.find(c => c?.class_section_id === classId) ?? {};
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0] ?? '');

  const stats = attendance?.[classId]?.reduce((acc, s) => ({
    total: acc.total + 1,
    present: acc.present + (s?.status === 'present' || s?.status === true ? 1 : 0),
    absent: acc.absent + (s?.status === 'absent' || s?.status === false ? 1 : 0),
    leave: acc.leave + (s?.status === 'leave' ? 1 : 0),
  }), { total: 0, present: 0, absent: 0, leave: 0 }) ?? { total: 0, present: 0, absent: 0, leave: 0 };
  stats.unmarked = stats.total - (stats.present ?? 0) - (stats.absent ?? 0) - (stats.leave ?? 0);

  const handleAttendanceChange = (userId, status) => {
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
    onSaveAttendance(classId, selectedDate);
  };

  const handleViewPastAttendance = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    onViewPastAttendance(classId, selectedDate);
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setActiveClass(null)}
            className="mr-4 text-blue-600 bg-blue-100 p-2 rounded-full hover:bg-blue-200">
            <FaChevronLeft />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{cls?.display_name || cls?.name || ''}</h3>
            <p className="text-sm text-gray-500">Class: {cls?.class_name || ''} - Section: {cls?.section_name || ''}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <input
            type="date"
            value={selectedDate ?? ''} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="border rounded-md p-1"
          />
          <button 
            onClick={handleViewPastAttendance} 
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View Past Attendance'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg shadow-sm bg-blue-50">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.total ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow-sm bg-green-50">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-600">{stats?.present ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow-sm bg-red-50">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold text-red-600">{stats?.absent ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow-sm bg-gray-50">
          <p className="text-sm text-gray-600">Unmarked</p>
          <p className="text-2xl font-bold text-gray-600">{stats?.unmarked ?? 0}</p>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => setAttendance(prev => ({ ...prev, [classId]: prev?.[classId]?.map(s => ({ ...s, status: 'present' })) ?? [] }))}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          disabled={loading}
        >
          <FaCheck className="mr-2" /> Mark All Present
        </button>
        <button 
          onClick={handleSaveAttendance} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-9 bg-gray-50 p-3 font-medium text-gray-700">
          <div className="col-span-1">No.</div>
          <div className="col-span-2">Roll No</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-2 text-center">Status</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {attendance?.[classId]?.map((s, i) => (
            <div key={s?.user_id ?? i} className={`grid grid-cols-9 p-3 ${i % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
              <div className="col-span-1">{i + 1}</div>
              <div className="col-span-2">{s?.roll_number || s?.rollNo || 'N/A'}</div>
              <div className="col-span-4 font-medium">{s?.student_name || s?.name || ''}</div>
              <div className="col-span-2 flex justify-center space-x-2">
                <button
                  onClick={() => handleAttendanceChange(s?.user_id, 'present')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${s?.status === 'present' || s?.status === true ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  disabled={loading}
                >
                  <FaCheck size={16} />
                </button>
                <button
                  onClick={() => handleAttendanceChange(s?.user_id, 'absent')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${s?.status === 'absent' || s?.status === false ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  disabled={loading}
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>
          )) ?? []}
        </div>
      </div>
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
      const response = await getStudentsByClass(classId);
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
      } else {
        toast.error(response.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle class selection
  const handleClassClick = async (classId) => {
    setActiveClass(classId);
    if (!attendance[classId] || attendance[classId].length === 0) {
      await fetchStudentsByClass(classId);
    }
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
        marked_by: user?.id || 2, // Use user ID from auth, fallback to 2
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

  // View past attendance
  const handleViewPastAttendance = async (classId, date) => {
    try {
      setLoading(true);
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
        if (!attendance[classId] || attendance[classId].length === 0) {
          await fetchStudentsByClass(classId);
        } else {
          // Reset status to null for all students if no attendance found
          setAttendance(prev => ({
            ...prev,
            [classId]: prev[classId].map(s => ({ ...s, status: null })),
          }));
        }
        toast.info('No attendance found for this date. You can mark it now.');
      }
    } catch (error) {
      console.error('Failed to fetch past attendance:', error);
      // If error, just load the student list
      if (!attendance[classId] || attendance[classId].length === 0) {
        await fetchStudentsByClass(classId);
      }
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
          <div className="flex-1 p-6 bg-white overflow-auto">
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
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-center h-64 text-center">
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
              <div className="flex items-center justify-center h-full text-center">
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