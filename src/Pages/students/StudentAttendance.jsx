import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { FaClipboardList, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentAttendance, getStudentSubjects, getStudentTimetable } from '../../helper/requests-method/apiMethods';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    summary: { total_days_marked: 0, present: 0, absent: 0, leave: 0, attendance_percentage: 0 },
    attendance: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({ subject: '' });
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '', status: 'Pending' });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studentClassInfo, setStudentClassInfo] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [todayTimetable, setTodayTimetable] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchStudentAttendanceSupportData();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getStudentAttendance(selectedMonth, selectedYear);
      if (response.success && response.data) {
        setAttendanceData({
          summary: response.data.summary || { total_days_marked: 0, present: 0, absent: 0, leave: 0, attendance_percentage: 0 },
          attendance: response.data.attendance || [],
        });
      } else {
        toast.error(response.message || 'Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendanceSupportData = async () => {
    try {
      const [subjectsResponse, timetableResponse] = await Promise.all([
        getStudentSubjects(),
        getStudentTimetable(),
      ]);

      if (subjectsResponse?.success && subjectsResponse?.data) {
        setStudentClassInfo(subjectsResponse.data.class_info || null);
        setStudentSubjects(subjectsResponse.data.subjects || []);
      }

      if (timetableResponse?.success && timetableResponse?.data?.timetable) {
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setTodayTimetable(timetableResponse.data.timetable[dayName] || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load class and timetable details');
    }
  };

  const pieData = [
    { id: 0, value: attendanceData.summary.present || 0, label: 'Present', color: '#10B981' },
    { id: 1, value: attendanceData.summary.absent || 0, label: 'Absent', color: '#EF4444' },
    { id: 2, value: attendanceData.summary.leave || 0, label: 'Leave', color: '#F59E0B' },
  ].filter(item => item.value > 0);

  const totalDays = attendanceData.summary.total_days_marked || 0;
  const classesAttended = attendanceData.summary.present || 0;
  const attendancePercentage = parseFloat(attendanceData.summary.attendance_percentage || 0);

  const handleLeaveFormChange = e => setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  const handleLeaveSubmit = e => {
    e.preventDefault();
    const { startDate, endDate, reason } = leaveForm;
    if (!startDate || !endDate || !reason) return setFormError('Please fill all required fields'), setFormSuccess('');
    if (new Date(endDate) < new Date(startDate)) return setFormError('End date cannot be before start date'), setFormSuccess('');
    setLeaveRequests(prev => [...prev, { ...leaveForm, id: Date.now(), submittedDate: new Date().toISOString().split('T')[0] }]);
    setFormSuccess('Leave request submitted successfully!');
    setFormError('');
    setLeaveForm({ startDate: '', endDate: '', reason: '', status: 'Pending' });
    setTimeout(() => setFormSuccess(''), 3000);
  };

  // Card component used for Total Classes, Classes Attended, and Attendance summary
  const Card = ({ title, value, color, details }) => (
    <div 
      className={`relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center justify-center`}
    >
      <div className={`absolute top-0 left-0 w-full h-2 bg-${color}-500 rounded-t-xl opacity-75`} />
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      {details && <p className="text-xs text-gray-500 mt-2">{details}</p>}
    </div>
  );

  // Table component used for displaying attendance records
  const Table = ({ records, totalDays, classesAttended }) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaClipboardList className="w-6 h-6 mr-2 text-indigo-600" /> Attendance Records
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0">
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <p className="text-sm font-medium text-gray-700">Total Attendance: <span className="text-indigo-600">{classesAttended}/{totalDays}</span></p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          {records.length ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  {["Date", "Status", "Marked At"].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.marked_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-center py-6 text-gray-500 text-sm">No attendance records found for this month.</p>}
        </div>
      </div>
    );
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
        <div className="max-w-9xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Days Card - Blue */}
                <Card title="Total Days" value={totalDays} color="blue" details={`Days marked: ${totalDays}`} />
                {/* Present Card - Green */}
                <Card title="Present" value={attendanceData.summary.present || 0} color="green" details={`Days present`} />
                {/* Absent Card - Red */}
                <Card title="Absent" value={attendanceData.summary.absent || 0} color="red" details={`Days absent`} />
                {/* Attendance Card - Purple */}
                <Card title="Attendance" value={`${attendancePercentage.toFixed(1)}%`} color="purple" details={`Attendance percentage`} />
              </div>
              {/* Attendance Records Table */}
              <Table 
                records={attendanceData.attendance} 
                totalDays={totalDays}
                classesAttended={classesAttended}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Class & Subjects</h2>
                  {studentClassInfo ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Class:</span> {studentClassInfo.display_name || `${studentClassInfo.class_name || ''} ${studentClassInfo.section_name || ''}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Room:</span> {studentClassInfo.room_no || '-'}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Total Subjects:</span> {studentSubjects.length}
                      </p>
                      <div className="pt-2 border-t border-gray-200 space-y-2 max-h-48 overflow-y-auto">
                        {studentSubjects.length > 0 ? (
                          studentSubjects.map((subject) => (
                            <div key={subject.subject_id} className="flex items-center justify-between text-sm bg-indigo-50 rounded-lg px-3 py-2">
                              <span className="font-medium text-gray-800">{subject.subject_name}</span>
                              <span className="text-indigo-700">{subject.subject_code}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No subjects available</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Class details are not available.</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today&apos;s Timetable</h2>
                  {todayTimetable.length > 0 ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {todayTimetable.map((period) => (
                        <div key={period.id} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                          <p className="font-semibold text-gray-800 text-sm">{period.period_name}</p>
                          <p className="text-sm text-gray-600">
                            {period.start_time} - {period.end_time}
                          </p>
                          <p className="text-sm text-indigo-700">
                            {period.subject?.subject_name || 'No Subject'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No timetable periods found for today.</p>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Pie Chart and Leave Form Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaClipboardList className="w-6 h-6 mr-2 text-indigo-600" /> Attendance Overview
              </h2>
              <div className="flex-1 flex justify-center items-center bg-indigo-50 rounded-lg p-4">
                <PieChart
                  series={[{ data: pieData, innerRadius: 60, outerRadius: 120, paddingAngle: 0, cornerRadius: 0, highlightScope: { faded: 'global', highlighted: 'item' }, faded: { innerRadius: 50, additionalRadius: -20, color: 'gray' }, label: false }]}
                  width={340}
                  height={350}
                  slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, padding: 20, labelStyle: { fontSize: 14, fontWeight: 600, fill: '#4B5563' } } }}
                />
              </div>
            </div>
            {/* Leave Request Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaCalendarAlt className="w-6 h-6 mr-2 text-indigo-600" /> Request Leave
              </h2>
              <form onSubmit={handleLeaveSubmit} className="space-y-6">
                {['startDate', 'endDate'].map(name => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{name === 'startDate' ? 'Start' : 'End'} Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="date"
                        id={name}
                        name={name}
                        value={leaveForm[name]}
                        onChange={handleLeaveFormChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white shadow-sm transition-all duration-200 hover:border-indigo-400"
                        required
                      />
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                    </div>
                  </div>
                ))}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason <span className="text-red-500">*</span></label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={leaveForm.reason}
                    onChange={handleLeaveFormChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white shadow-sm transition-all duration-200 hover:border-indigo-400 resize-none"
                    placeholder="Please explain your reason for leave..."
                    required
                  />
                </div>
                {formError && <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-red-700 text-sm animate-fade-in">{formError}</div>}
                {formSuccess && <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md text-green-700 text-sm animate-fade-in">{formSuccess}</div>}
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">Submit Request</button>
              </form>
            </div>
          </div>
          {/* Low Attendance Warning */}
          {attendancePercentage < 75 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center animate-pulse">
              <FaExclamationCircle className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-700 text-sm font-medium">Warning: Your attendance is below 75%. Please attend classes regularly.</p>
            </div>
          )}
        </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentAttendance;