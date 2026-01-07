import React, { useEffect, useMemo, useState, memo } from 'react';
import { FaUsers, FaCheckCircle, FaChartLine, FaClipboardList, FaArrowRight, FaChevronLeft, FaChevronRight, FaBell, FaFileAlt, FaSync, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, CircularProgress, Typography } from '@mui/material';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { getTeacherDashboardStats, getTeacherTodayClasses } from '../../helper/requests-method/apiMethods';

const TeacherPortal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [leaveApplications, setLeaveApplications] = useState([
    { type: 'Sick Leave', reason: 'Fever and Flu', date: '2025-03-07 to 2025-03-09', status: 'Pending' },
    { type: 'Personal Leave', reason: 'Family Event', date: '2025-03-10 to 2025-03-11', status: 'Approved' },
    { type: 'Emergency Leave', reason: 'Medical Emergency', date: '2025-03-12 to 2025-03-13', status: 'Pending' },
  ]);

  const [newLeave, setNewLeave] = useState({
    type: '', reason: '', startDate: '', endDate: '',
  });

  const events = [
    { date: '2025-03-05', title: 'Faculty Meeting', description: 'Discussion on Exams', type: 'meeting' },
    { date: '2025-03-07', title: 'Parent-Teacher Conference', description: 'Grade 10A', type: 'event' },
    { date: '2025-03-10', title: 'Science Exhibition', description: 'School Event', type: 'event' },
  ];

  const attendanceData = [
    { id: 0, value: 20, label: 'Present', color: '#22c55e' },
    { id: 1, value: 5, label: 'Absent', color: '#ef4444' },
    { id: 2, value: 3, label: 'Halfday', color: '#f59e0b' },
    { id: 3, value: 2, label: 'Late', color: '#3b82f6' },
  ];

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        day: date.getDate(),
        isoDate: date.toISOString().split('T')?.[0] ?? '',
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? '',
      });
    }
    return days;
  };

  const last7Days = useMemo(() => getLast7Days(), []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await getTeacherDashboardStats();
        
        console.log('Teacher Dashboard Stats Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData) {
          console.log('Teacher Stats Data:', apiData);
          setDashboardStats(apiData);
        } else {
          console.error('Invalid data structure:', apiData);
        }
      } catch (error) {
        console.error('Error fetching teacher dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchTodayClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await getTeacherTodayClasses();
        
        console.log('Teacher Today Classes Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData?.classes && Array.isArray(apiData.classes)) {
          console.log('Today Classes Data:', apiData.classes);
          setTodayClasses(apiData.classes);
        } else {
          console.error('Invalid data structure:', apiData);
          setTodayClasses([]);
        }
      } catch (error) {
        console.error('Error fetching teacher today classes:', error);
        setTodayClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchTodayClasses();
  }, []);

  const getDayColor = (isoDate) => {
    if ((attendanceData?.[0]?.value ?? 0) > 0 && isoDate <= '2025-03-21') return 'bg-green-500';
    if ((attendanceData?.[1]?.value ?? 0) > 0 && isoDate <= '2025-03-21') return 'bg-red-500';
    if ((attendanceData?.[2]?.value ?? 0) > 0 && isoDate <= '2025-03-21') return 'bg-yellow-500';
    if ((attendanceData?.[3]?.value ?? 0) > 0 && isoDate <= '2025-03-21') return 'bg-blue-500';
    return 'bg-gray-300';
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dropdown {
        0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .animate-dropdown { animation: dropdown 0.25s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const renderCalendar = () => {
    const month = currentDate?.getMonth?.() ?? 0;
    const year = currentDate?.getFullYear?.() ?? new Date().getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay() ?? 0;
    const today = new Date().toISOString().split('T')?.[0] ?? '';
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-8 md:h-10"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === today;
      const hasEvent = events?.some(event => event?.date === dateStr) ?? false;
      days.push(
        <div
          key={day}
          className={`h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full text-xs md:text-sm cursor-pointer transition-colors
            ${isToday ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}
            ${hasEvent ? 'relative border-2 border-red-500' : ''}`}>
          {day}
          {hasEvent && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>}
        </div>
      );
    }
    return days;
  };

  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target ?? {};
    setNewLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    const newLeaveEntry = {
      type: newLeave?.type ?? '',
      reason: newLeave?.reason ?? '',
      date: `${newLeave?.startDate ?? ''} to ${newLeave?.endDate ?? ''}`,
      status: 'Pending',
    };
    setLeaveApplications((prev) => [...(prev ?? []), newLeaveEntry]);
    setNewLeave({ type: '', reason: '', startDate: '', endDate: '' });
    setIsLeaveFormOpen(false);
  };

  const currentMonthEvents = events?.filter(event => {
    const eventDate = new Date(event?.date ?? '');
    return (eventDate.getMonth() === currentDate?.getMonth?.()) && (eventDate.getFullYear() === currentDate?.getFullYear?.());
  }) ?? [];

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
          <div className="p-2 sm:p-4 md:p-6">
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress size={50} sx={{ color: '#6366f1' }} />
              </Box>
            ) : (
              <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              {[
                { 
                  title: 'Total Students', 
                  value: dashboardStats?.stats?.total_students?.toString() || '0', 
                  change: `${dashboardStats?.stats?.total_subjects || 0} subjects`, 
                  icon: <FaUsers />, 
                  color: 'bg-blue-100', 
                  textColor: 'text-blue-500' 
                },
                { 
                  title: 'Attendance Rate', 
                  value: `${dashboardStats?.today_attendance?.attendance_percentage?.toFixed(2) || 0}%`, 
                  change: `${dashboardStats?.today_attendance?.present || 0}/${dashboardStats?.today_attendance?.total_marked || 0} present`, 
                  icon: <FaCheckCircle />, 
                  color: 'bg-green-100', 
                  textColor: 'text-green-500' 
                },
                { 
                  title: "Today's Classes", 
                  value: dashboardStats?.stats?.total_classes_today?.toString() || '0', 
                  change: 'Scheduled', 
                  icon: <FaChartLine />, 
                  color: 'bg-purple-100', 
                  textColor: 'text-purple-500' 
                },
                { 
                  title: 'Pending Assignments', 
                  value: dashboardStats?.stats?.pending_assignments?.toString() || '0', 
                  change: 'To review', 
                  icon: <FaClipboardList />, 
                  color: 'bg-amber-100', 
                  textColor: 'text-amber-500' 
                },
              ].map((card, index) => (
                <div key={index} className={`bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow ${card?.color ?? 'bg-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">{card?.title ?? ''}</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{card?.value ?? ''}</h3>
                      <p className={`${card?.textColor ?? 'text-gray-500'} text-xs sm:text-sm mt-1 md:mt-2 flex items-center`}>
                        <span className="material-symbols-outlined text-xs sm:text-sm mr-1">
                          {card?.change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                        </span>
                        {card?.change ?? ''}
                      </p>
                    </div>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full ${card?.color ?? 'bg-gray-100'} flex items-center justify-center`}>{card?.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">Today's Schedule</h3>
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-xs sm:text-sm">
                    View All <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                  </button>
                </div>
                {loadingClasses ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={40} sx={{ color: '#6366f1' }} />
                  </Box>
                ) : todayClasses.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {todayClasses.map((schedule, index) => {
                      const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-amber-100', 'bg-pink-100', 'bg-indigo-100'];
                      const bgColor = bgColors[index % bgColors.length];
                      
                      return (
                        <div key={index} className={`flex flex-col sm:flex-row p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors ${bgColor}`}>
                          <div className="w-full sm:w-20 md:w-24 text-center sm:text-left mb-1 sm:mb-0">
                            <p className="text-xs text-gray-500">{schedule?.start_time || ''}</p>
                            <p className="text-xs text-gray-400">{schedule?.duration || ''}</p>
                          </div>
                          <div className="ml-0 sm:ml-3 md:ml-4 flex-1">
                            <h4 className="font-semibold text-xs sm:text-sm md:text-base">
                              {schedule?.subject_name || ''} - {schedule?.class_name || ''} {schedule?.section_name || ''}
                            </h4>
                            <p className="text-xs text-gray-500">{schedule?.room_number || 'Room TBA'}</p>
                          </div>
                          <div className="flex items-center mt-1 sm:mt-0">
                            <span className={`inline-block w-2 h-2 ${schedule?.status === 'Ongoing' ? 'bg-green-500' : 'bg-gray-300'} rounded-full mr-1 sm:mr-2`}></span>
                            <span className="text-gray-500 text-xs">{schedule?.status || 'Scheduled'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Box display="flex" justifyContent="center" py={4}>
                    <Typography variant="body2" color="#666">No classes scheduled for today</Typography>
                  </Box>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">
                    {currentDate?.toLocaleString?.('default', { month: 'long', year: 'numeric' }) ?? ''}
                  </h3>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate?.getFullYear?.() ?? 0, (currentDate?.getMonth?.() ?? 0) - 1, 1))}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <FaChevronLeft className="text-xs sm:text-sm" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate?.getFullYear?.() ?? 0, (currentDate?.getMonth?.() ?? 0) + 1, 1))}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <FaChevronRight className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={index} className="text-xs font-medium text-gray-500">{day}</div>
                  ))}
                  {renderCalendar()}
                </div>
                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-xs sm:text-sm mb-2">Upcoming Events</h4>
                  {events
                    ?.filter(event => new Date(event?.date ?? '') >= new Date())
                    ?.slice(0, 3)
                    ?.map((event, index) => (
                      <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className={`mr-2 ${event?.type === 'meeting' ? 'text-purple-500' : 'text-blue-500'}`}>
                          {event?.type === 'meeting' ? <FaBell className="text-xs sm:text-sm" /> : <FaFileAlt className="text-xs sm:text-sm" />}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{event?.title ?? ''}</p>
                          <p className="text-xs text-gray-500">{event?.date ?? ''} • {event?.description ?? ''}</p>
                        </div>
                      </div>
                    )) ?? []}
                </div>
              </div>

              {/* Recent Activities Card */}
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">Recent Activities</h3>
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-xs sm:text-sm">
                    View All <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { action: 'You graded', subject: 'Physics Test for Grade 11B', time: '30 minutes ago', icon: <FaCheckCircle />, color: 'bg-red-100' },
                    { action: 'You uploaded', subject: 'Mathematics assignment for Grade 10A', time: '1 hour ago', icon: <FaFileAlt />, color: 'bg-blue-100' },
                    ...(currentMonthEvents?.map(event => ({
                      action: 'Upcoming', subject: event?.title ?? '', time: event?.date ?? '', icon: <FaBell />, color: 'bg-purple-100'
                    })) ?? []),
                    { action: 'You marked', subject: 'attendance for Grade 10C', time: '3 hours ago', icon: <FaCheckCircle />, color: 'bg-green-100' },
                  ].slice(0, 4).map((activity, index) => (
                    <div key={index} className={`flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors ${activity?.color ?? 'bg-gray-100'}`}>
                      <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">{activity?.icon}</div>
                      <div>
                        <p className="text-xs sm:text-sm">
                          <span className="font-semibold">{activity?.action ?? ''}</span> {activity?.subject ?? ''}
                        </p>
                        <p className="text-xs text-gray-500">{activity?.time ?? ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">Assignment Submission Status</h3>
                  <div className="relative">
                    <details className="group">
                      <summary className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center text-xs sm:text-sm">
                        Options <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                      </summary>
                      <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white shadow-lg rounded-lg z-10 p-2 group-open:animate-dropdown">
                        <ul>
                          <li className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm">Export as PDF</li>
                          <li className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm">View All Submissions</li>
                          <li className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm">Send Reminders</li>
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
                <div className="mb-4 md:mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs sm:text-sm">Progress</span>
                    <span className="text-xs sm:text-sm font-medium">72%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { title: 'Mathematics Assignment #12', grade: 'Grade 10A', due: 'Due Today', submissions: '36/42', icon: <FaClipboardList /> },
                    { title: 'Physics Lab Report', grade: 'Grade 11B', due: 'Due Tomorrow', submissions: '28/38', icon: <FaClipboardList /> },
                    { title: 'Chemistry Worksheet', grade: 'Grade 10C', due: 'Due in 2 Days', submissions: '19/36', icon: <FaClipboardList /> },
                  ].map((assignment, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center mb-1 sm:mb-0">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">{assignment?.icon}</div>
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm md:text-base">{assignment?.title ?? ''}</h4>
                          <p className="text-xs text-gray-500">{assignment?.grade ?? ''} • {assignment?.due ?? ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-xs sm:text-sm md:text-base">{assignment?.submissions ?? ''}</p>
                        <p className="text-xs text-gray-500">Submissions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">My Attendance</h3>
                  <div className="flex space-x-1 sm:space-x-2">
                    <select className="text-xs border rounded-md px-1 sm:px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>This Year</option>
                    </select>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <FaSync className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    <FaExclamationCircle className="mr-1 sm:mr-2 inline text-xs sm:text-sm" />
                    No of total working days <span className="font-bold">25 Days</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center mb-4 sm:mb-6">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Present</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{attendanceData?.[0]?.value ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Absent</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{attendanceData?.[1]?.value ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Halfday</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{attendanceData?.[2]?.value ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Late</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{attendanceData?.[3]?.value ?? 0}</p>
                  </div>
                </div>
                <div className="h-[120px] sm:h-[150px] w-full flex items-center justify-center mb-4 sm:mb-6">
                  <PieChart
                    series={[{ data: attendanceData ?? [], innerRadius: 25, outerRadius: 50 }]}
                    width={150}
                    height={150}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </div>
                <div className="text-center mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                  <p className="text-green-500 text-xs sm:text-sm inline-block">■ Present</p>
                  <p className="text-red-500 text-xs sm:text-sm inline-block">■ Absent</p>
                  <p className="text-yellow-500 text-xs sm:text-sm inline-block">■ Halfday</p>
                  <p className="text-blue-500 text-xs sm:text-sm inline-block">■ Late</p>
                </div>
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <p className="font-bold text-xs sm:text-sm">Last 7 Days</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{last7Days?.[0]?.date ?? ''} - {last7Days?.[6]?.date ?? ''}</p>
                  </div>
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {last7Days?.map((day, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded text-white text-xs sm:text-sm ${getDayColor(day?.isoDate ?? '')}`}
                      >
                        {day?.day ?? ''}
                      </div>
                    )) ?? []}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 md:mb-5">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">Leave Applications</h3>
                  <button
                    onClick={() => setIsLeaveFormOpen(true)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-xs sm:text-sm"
                  >
                    View All <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {leaveApplications?.map((leave, index) => (
                    <div key={index} className="flex flex-col sm:flex-row p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50">
                      <div className="flex items-center mb-1 sm:mb-0">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center mr-2 sm:mr-3 bg-indigo-100 text-indigo-600">
                          <FaCalendarAlt className="text-xs sm:text-sm md:text-base" />
                        </div>
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm md:text-base">{leave?.type ?? ''}</h4>
                          <p className="text-xs text-gray-500">{leave?.reason ?? ''}</p>
                        </div>
                      </div>
                      <div className="sm:ml-auto flex flex-col sm:flex-row items-start sm:items-center">
                        <p className="text-xs text-gray-600 mb-1 sm:mb-0 sm:mr-2 md:mr-4">{leave?.date ?? ''}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            leave?.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                          {leave?.status ?? ''}
                        </span>
                      </div>
                    </div>
                  )) ?? []}
                </div>
              </div>
            </div>
            {isLeaveFormOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
                <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Apply for Leave</h3>
                  <form onSubmit={handleLeaveSubmit}>
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Leave Type</label>
                      <select
                        name="type"
                        value={newLeave?.type ?? ''}
                        onChange={handleLeaveInputChange}
                        className="mt-1 block w-full border rounded-md p-2 bg-gray-50 text-xs sm:text-sm"
                        required
                      >
                        <option value="">Select Leave Type</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Personal Leave">Personal Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                      </select>
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Reason</label>
                      <textarea
                        name="reason"
                        value={newLeave?.reason ?? ''}
                        onChange={handleLeaveInputChange}
                        className="mt-1 block w-full border rounded-md p-2 bg-gray-50 text-xs sm:text-sm"
                        rows="3"
                        placeholder="Enter reason for leave"
                        required
                      />
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={newLeave?.startDate ?? ''}
                        onChange={handleLeaveInputChange}
                        className="mt-1 block w-full border rounded-md p-2 bg-gray-50 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={newLeave?.endDate ?? ''}
                        onChange={handleLeaveInputChange}
                        className="mt-1 block w-full border rounded-md p-2 bg-gray-50 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsLeaveFormOpen(false)}
                        className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}            </>
            )}          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(TeacherPortal);