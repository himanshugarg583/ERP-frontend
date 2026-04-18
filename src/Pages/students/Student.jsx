import React, { useMemo, useState, memo, useEffect } from 'react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { getStudentDashboardStats, getTodayClasses, getWeeklyTimetable, getPendingAssignments, getAcademicPerformance, getExamTermDropdown, getExamDropdown, getStudentDashboardNotices } from '../../helper/requests-method/apiMethods';

const Student = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stats = dashboardData?.stats || dashboardData || {};
  const attendancePercentage =
    stats?.attendance_percentage_this_month ??
    dashboardData?.attendance?.attendance_percentage ??
    0;
  const markedDays = stats?.attendance_marked_days_this_month ?? 0;
  const classesToday = stats?.total_classes_today ?? 0;
  const pendingAssignmentsCount =
    stats?.pending_assignments ?? dashboardData?.assignments?.pending ?? 0;
  const totalNoticesCount = stats?.total_notices ?? 0;
  const pendingAssignmentsProgress = pendingAssignmentsCount > 0 ? '100%' : '0%';
  const classesTodayProgress = classesToday > 0 ? '100%' : '0%';
  const noticesProgress = totalNoticesCount > 0 ? '100%' : '0%';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentDashboardStats();
        
        console.log('Student Dashboard Stats Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData) {
          console.log('Dashboard Data:', apiData);
          setDashboardData(apiData);
        } else {
          console.error('Invalid data structure:', apiData);
          setError('No dashboard data available');
        }
      } catch (error) {
        console.error('Error fetching student dashboard stats:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 flex AddStudent">
        <StudentSidebar />
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
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
            <CircularProgress size={60} sx={{ color: '#6366f1' }} />
          </Box>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 flex AddStudent">
        <StudentSidebar />
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
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
            <Typography variant="h6" color="error">{error}</Typography>
          </Box>
        </div>
      </div>
    );
  }

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

        <main className="">
          <div className='p-4 md:p-6 lg:p-8'>
            {/* Student Info */}
            {dashboardData?.student && (
              <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <Typography variant="h6" fontWeight="bold" color="#6366f1" gutterBottom>
                  Roll No: {dashboardData.student.roll_number || '--'}
                </Typography>
                <Typography variant="body2" color="#666">
                  Student ID: {dashboardData.student.student_id || '--'}
                </Typography>
                <Typography variant="body2" color="#666">
                  Class Section ID: {dashboardData.student.class_section_id || '--'}
                </Typography>
                {dashboardData?.meta?.day && dashboardData?.meta?.date && (
                  <Typography variant="body2" color="#666" sx={{ mt: 1 }}>
                    {dashboardData.meta.day}, {dashboardData.meta.date}
                  </Typography>
                )}
              </div>
            )}
            
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-4">
              <Card 
                title="Attendance This Month" 
                percentage={`${attendancePercentage}%`}
                details={`Attendance marked on ${markedDays} day(s) this month`}
                color="green" 
              />
              <Card 
                title="Pending Assignments" 
                percentage={pendingAssignmentsProgress}
                details={`${pendingAssignmentsCount} pending assignment(s)`}
                color="blue" 
                pending={`${pendingAssignmentsCount} Pending`}
              />
              <Card 
                title="Today's Classes" 
                percentage={classesTodayProgress}
                details={`${classesToday} class(es) scheduled today`}
                color="indigo" 
              />
              <Card 
                title="Total Notices" 
                percentage={noticesProgress}
                details={`${totalNoticesCount} notice(s) available`}
                color="purple" 
              />
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
  const [activeTab, setActiveTab] = useState('today');
  const [showAll, setShowAll] = useState(false);
  const [classData, setClassData] = useState([]);
  const [loadingToday, setLoadingToday] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [dayInfo, setDayInfo] = useState({ day: '', total_classes: 0 });
  const [weeklyTimetable, setWeeklyTimetable] = useState([]);
  const [totalWeekClasses, setTotalWeekClasses] = useState(0);

  const extractApiData = (response) => {
    if (response?.data?.data) {
      return response.data.data;
    }
    if (response?.data) {
      return response.data;
    }
    return null;
  };

  useEffect(() => {
    const fetchTodayClasses = async () => {
      try {
        setLoadingToday(true);
        const response = await getTodayClasses();
        
        console.log('Today Classes Response:', response);
        
        const apiData = extractApiData(response);
        
        if (apiData?.classes && Array.isArray(apiData.classes)) {
          // Add colors to classes
          const colors = ['indigo', 'green', 'purple', 'blue', 'yellow', 'pink', 'orange'];
          const classesWithColors = apiData.classes.map((cls, index) => ({
            ...cls,
            color: colors[index % colors.length],
          }));
          
          console.log('Classes Data:', classesWithColors);
          setClassData(classesWithColors);
          setDayInfo({
            day: apiData.day || '',
            total_classes: apiData.total_classes || classesWithColors.length,
          });
        } else {
          console.error('Invalid data structure:', apiData);
          setClassData([]);
          setDayInfo({ day: '', total_classes: 0 });
        }
      } catch (error) {
        console.error('Error fetching today classes:', error);
        setClassData([]);
        setDayInfo({ day: '', total_classes: 0 });
      } finally {
        setLoadingToday(false);
      }
    };

    fetchTodayClasses();
  }, []);

  useEffect(() => {
    const fetchWeeklyClasses = async () => {
      try {
        setLoadingWeekly(true);
        const response = await getWeeklyTimetable();

        console.log('Weekly Timetable Response:', response);

        const apiData = extractApiData(response);
        if (apiData?.timetable && Array.isArray(apiData.timetable)) {
          setWeeklyTimetable(apiData.timetable);
          setTotalWeekClasses(apiData.total_week_classes || 0);
        } else {
          console.error('Invalid weekly timetable structure:', apiData);
          setWeeklyTimetable([]);
          setTotalWeekClasses(0);
        }
      } catch (error) {
        console.error('Error fetching weekly timetable:', error);
        setWeeklyTimetable([]);
        setTotalWeekClasses(0);
      } finally {
        setLoadingWeekly(false);
      }
    };

    fetchWeeklyClasses();
  }, []);

  const displayedClasses = showAll ? classData : classData.slice(0, 3);
  const weeklyColors = ['indigo', 'green', 'purple', 'blue', 'yellow', 'pink', 'orange'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Classes & Timetable</h3>
          {activeTab === 'today' && dayInfo.day && (
            <p className="text-sm text-gray-500">{dayInfo.day} - {dayInfo.total_classes} classes</p>
          )}
          {activeTab === 'weekly' && (
            <p className="text-sm text-gray-500">Total classes this week: {totalWeekClasses}</p>
          )}
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'today' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Timetable
          </button>
        </div>

        {activeTab === 'today' && classData.length > 3 && (
          <button onClick={() => setShowAll(!showAll)} className="text-indigo-600 text-sm hover:underline">
            {showAll ? "View Less" : "View All"}
          </button>
        )}
      </div>

      {activeTab === 'today' && loadingToday ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} sx={{ color: '#6366f1' }} />
        </Box>
      ) : activeTab === 'today' && classData.length > 0 ? (
        <div className="space-y-4">
          {displayedClasses.map((item, index) => (
            <ListItem key={index} data={item} type="class" color={item.color} />
          ))}
        </div>
      ) : activeTab === 'today' ? (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="body2" color="#666">No classes scheduled for today</Typography>
        </Box>
      ) : loadingWeekly ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} sx={{ color: '#6366f1' }} />
        </Box>
      ) : weeklyTimetable.length > 0 ? (
        <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '460px' }}>
          {weeklyTimetable.map((dayItem, dayIndex) => (
            <div key={dayItem.day || dayIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{dayItem.day || 'Day'}</h4>
                <span className="text-xs px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">
                  {dayItem.total_classes || 0} classes
                </span>
              </div>

              {Array.isArray(dayItem.classes) && dayItem.classes.length > 0 ? (
                <div className="space-y-2">
                  {dayItem.classes.map((cls, index) => (
                    <ListItem
                      key={`${dayItem.day || 'day'}-${index}`}
                      data={{
                        ...cls,
                        time: cls.time || `${cls.start_time || ''}${cls.end_time ? ` - ${cls.end_time}` : ''}`,
                      }}
                      type="class"
                      color={weeklyColors[(dayIndex + index) % weeklyColors.length]}
                    />
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="#666">No classes</Typography>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="body2" color="#666">No weekly timetable available</Typography>
        </Box>
      )}
    </div>
  );
};

// Pending Assignments
const PendingAssignments = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchPendingAssignments = async () => {
      try {
        setLoading(true);
        const response = await getPendingAssignments();
        
        console.log('Pending Assignments Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData?.assignments && Array.isArray(apiData.assignments)) {
          console.log('Assignments Data:', apiData.assignments);
          setAssignmentData(apiData.assignments);
          setTotalPending(apiData.total_pending || apiData.assignments.length);
        } else {
          console.error('Invalid data structure:', apiData);
          setAssignmentData([]);
        }
      } catch (error) {
        console.error('Error fetching pending assignments:', error);
        setAssignmentData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAssignments();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Pending Assignments</h3>
          {totalPending > 0 && (
            <p className="text-sm text-gray-500">{totalPending} pending</p>
          )}
        </div>
        <a href="#assignments" className="text-indigo-600 text-sm hover:underline">View All</a>
      </div>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} sx={{ color: '#6366f1' }} />
        </Box>
      ) : assignmentData.length > 0 ? (
        <div className="space-y-4">
          {assignmentData.map((item, index) => (
            <ListItem key={item.id || index} data={item} type="assignment" />
          ))}
        </div>
      ) : (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="body2" color="#666">No pending assignments</Typography>
        </Box>
      )}
    </div>
  );
};

// Academic Performance
const AcademicPerformance = () => {
  const [terms, setTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  // Fetch exam terms on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await getExamTermDropdown();
        
        console.log('Exam Terms Response:', response);
        
        let apiData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          apiData = response.data;
        }
        
        if (apiData && apiData.length > 0) {
          setTerms(apiData);
          // Auto-select first term
          setSelectedTerm(apiData[0].id);
        }
      } catch (error) {
        console.error('Error fetching exam terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Fetch exams when term changes
  useEffect(() => {
    if (!selectedTerm) return;

    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        setSelectedExam(''); // Reset exam selection
        setPerformanceData(null); // Clear performance data
        
        const response = await getExamDropdown(selectedTerm);
        
        console.log('Exams Response:', response);
        
        let apiData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          apiData = response.data;
        }
        
        if (apiData && apiData.length > 0) {
          setExams(apiData);
          // Auto-select first exam
          setSelectedExam(apiData[0].id);
        } else {
          setExams([]);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams([]);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [selectedTerm]);

  // Fetch performance data when exam changes
  useEffect(() => {
    if (!selectedExam) return;

    const fetchPerformance = async () => {
      try {
        setLoadingPerformance(true);
        const response = await getAcademicPerformance(selectedExam);
        
        console.log('Academic Performance Response:', response);
        
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData) {
          console.log('Performance Data:', apiData);
          setPerformanceData(apiData);
        }
      } catch (error) {
        console.error('Error fetching academic performance:', error);
        setPerformanceData(null);
      } finally {
        setLoadingPerformance(false);
      }
    };

    fetchPerformance();
  }, [selectedExam]);

  const subjects = useMemo(() => {
    if (!performanceData?.subjects || performanceData.subjects.length === 0) return [];
    return performanceData.subjects.map(item => item.subject);
  }, [performanceData]);

  const scores = useMemo(() => {
    if (!performanceData?.subjects || performanceData.subjects.length === 0) return [];
    return performanceData.subjects.map(item => parseFloat(item.percentage) || 0);
  }, [performanceData]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1, flexGrow: 2 }} className="col-span-2">
        <Typography variant="h6" fontWeight="bold" mb={2}>Academic Performance</Typography>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={50} sx={{ color: '#6366f1' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1, flexGrow: 2 }} className="col-span-2">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" fontWeight="bold">Academic Performance</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="term-select-label">Term</InputLabel>
            <Select
              labelId="term-select-label"
              value={selectedTerm}
              label="Term"
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map((term) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.term_name} ({term.academic_year})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small" disabled={loadingExams || exams.length === 0}>
            <InputLabel id="exam-select-label">Exam</InputLabel>
            <Select
              labelId="exam-select-label"
              value={selectedExam}
              label="Exam"
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              {exams.map((exam) => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.exam_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {loadingPerformance ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} sx={{ color: '#6366f1' }} />
        </Box>
      ) : performanceData && subjects.length > 0 ? (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="#666">
              {performanceData.exam_name} - {performanceData.total_subjects} subject(s)
            </Typography>
          </Box>
          <BarChart
            xAxis={[{ scaleType: 'band', data: subjects, label: 'Subjects' }]}
            yAxis={[{ label: 'Percentage (%)', min: 0, max: 100 }]}
            series={[{ data: scores, color: '#3f51b5', label: 'Percentage' }]}
            height={300}
            tooltip={{ trigger: 'item' }}
          />
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="body2" color="#666">
            {exams.length === 0 ? 'No exams available for selected term' : 'No performance data available'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Upcoming Events
const UpcomingEvents = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalNotices, setTotalNotices] = useState(0);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await getStudentDashboardNotices();
        
        console.log('Student Dashboard Notices Response:', response);
        
        // Handle both response formats
        let apiData = null;
        if (response?.data?.data) {
          apiData = response.data.data;
        } else if (response?.data) {
          apiData = response.data;
        }
        
        if (apiData?.notices && Array.isArray(apiData.notices)) {
          // Transform notices to event format
          const colors = ['indigo', 'green', 'purple', 'blue', 'yellow', 'pink', 'orange'];
          const eventsWithColors = apiData.notices.map((notice, index) => {
            // Parse the date if available
            let date = '';
            let month = '';
            if (notice.date) {
              const noticeDate = new Date(notice.date);
              date = noticeDate.getDate().toString();
              month = noticeDate.toLocaleString('en-US', { month: 'short' });
            }
            
            return {
              date: date || '--',
              month: month || '---',
              title: notice.title || 'Untitled',
              time: notice.time || '',
              color: colors[index % colors.length],
            };
          });
          
          console.log('Events Data:', eventsWithColors);
          setEventData(eventsWithColors);
          setTotalNotices(apiData.total_notices || eventsWithColors.length);
        } else {
          console.error('Invalid data structure:', apiData);
          setEventData([]);
        }
      } catch (error) {
        console.error('Error fetching student notices:', error);
        setEventData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          {totalNotices > 0 && (
            <p className="text-sm text-gray-500">{totalNotices} events</p>
          )}
        </div>
        <a href="#events" className="text-indigo-600 text-sm hover:underline">View All</a>
      </div>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} sx={{ color: '#6366f1' }} />
        </Box>
      ) : eventData.length > 0 ? (
        <div className="space-y-4">
          {eventData.map((item, index) => (
            <ListItem key={index} data={item} type="event" color={item.color} />
          ))}
        </div>
      ) : (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="body2" color="#666">No upcoming events</Typography>
        </Box>
      )}
    </div>
  );
};

export default memo(Student);
