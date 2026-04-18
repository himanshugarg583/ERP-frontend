import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { FaClipboardList, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentAttendance, applyStudentLeave } from '../../helper/requests-method/apiMethods';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    summary: { total_days_marked: 0, present: 0, absent: 0, leave: 0, attendance_percentage: 0 },
    attendance: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({ subject: '' });
  const [leaveForm, setLeaveForm] = useState({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
  const [isLeaveSubmitting, setIsLeaveSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

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

  const pieData = [
    { id: 0, value: attendanceData.summary.present || 0, label: 'Present', color: '#10B981' },
    { id: 1, value: attendanceData.summary.absent || 0, label: 'Absent', color: '#EF4444' },
    { id: 2, value: attendanceData.summary.leave || 0, label: 'Leave', color: '#F59E0B' },
  ].filter(item => item.value > 0);

  const totalDays = attendanceData.summary.total_days_marked || 0;
  const classesAttended = attendanceData.summary.present || 0;
  const attendancePercentage = parseFloat(attendanceData.summary.attendance_percentage || 0);

  const handleLeaveFormChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const { leaveType, startDate, endDate, reason } = leaveForm;

    if (!startDate || !endDate || !reason.trim()) {
      setFormError('Please fill all required fields');
      setFormSuccess('');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End date cannot be before start date');
      setFormSuccess('');
      return;
    }

    const payload = {
      leave_type: leaveType || 'casual',
      start_date: startDate,
      end_date: endDate,
      reason: reason.trim(),
    };

    try {
      setIsLeaveSubmitting(true);
      const response = await applyStudentLeave(payload);

      if (response?.success) {
        setFormSuccess(response?.message || 'Leave request submitted successfully!');
        setFormError('');
        setLeaveForm({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
        toast.success(response?.message || 'Leave request submitted successfully');
      } else {
        const message = response?.message || 'Failed to submit leave request';
        setFormError(message);
        setFormSuccess('');
        toast.error(message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to submit leave request';
      setFormError(message);
      setFormSuccess('');
      toast.error(message);
    } finally {
      setIsLeaveSubmitting(false);
      setTimeout(() => setFormSuccess(''), 3000);
    }
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
                <div>
                  <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={leaveForm.leaveType}
                    onChange={handleLeaveFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white shadow-sm transition-all duration-200 hover:border-indigo-400"
                    required
                  >
                    <option value="casual">Casual</option>
                    <option value="sick">Sick</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                <button
                  type="submit"
                  disabled={isLeaveSubmitting}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md ${
                    isLeaveSubmitting
                      ? 'bg-indigo-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                  }`}
                >
                  {isLeaveSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
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