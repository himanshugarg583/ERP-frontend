import React, { useState, useEffect } from 'react';
import { getStudentReportByDate, getStudentReportByMonth, getClassWiseSummary, fetchAllClassesForAttendance } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import StandardStatCard from '../comman_components/StandardStatCard';
import { Users, Calendar, FileText, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceReport = () => {
  const [activeTab, setActiveTab] = useState('byDate');
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  
  // Form states
  const [dateReport, setDateReport] = useState({
    class_id: '',
    class_name: '',
    section_name: '',
    date: '',
  });
  
  const [monthReport, setMonthReport] = useState({
    class_id: '',
    class_name: '',
    section_name: '',
    month: '',
    year: new Date().getFullYear(),
  });
  
  const [classWiseReport, setClassWiseReport] = useState({
    date: '',
  });
  
  // Report data states
  const [dateReportData, setDateReportData] = useState(null);
  const [monthReportData, setMonthReportData] = useState(null);
  const [classWiseReportData, setClassWiseReportData] = useState(null);

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetchAllClassesForAttendance();
      if (response.success && response.data?.classes) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      toast.error('Error fetching classes');
    }
  };

  // Handle class selection for date report
  const handleDateClassChange = (e) => {
    const selectedClassId = e.target.value;
    const selectedClass = classes.find(cls => cls.id.toString() === selectedClassId);
    if (selectedClass) {
      setDateReport({
        ...dateReport,
        class_id: selectedClassId,
        class_name: selectedClass.class_name,
        section_name: selectedClass.section_name,
      });
    } else {
      setDateReport({
        ...dateReport,
        class_id: '',
        class_name: '',
        section_name: '',
      });
    }
  };

  // Handle class selection for month report
  const handleMonthClassChange = (e) => {
    const selectedClassId = e.target.value;
    const selectedClass = classes.find(cls => cls.id.toString() === selectedClassId);
    if (selectedClass) {
      setMonthReport({
        ...monthReport,
        class_id: selectedClassId,
        class_name: selectedClass.class_name,
        section_name: selectedClass.section_name,
      });
    } else {
      setMonthReport({
        ...monthReport,
        class_id: '',
        class_name: '',
        section_name: '',
      });
    }
  };

  // Handle date report
  const handleDateReport = async (e) => {
    e.preventDefault();
    if (!dateReport.class_name || !dateReport.section_name || !dateReport.date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getStudentReportByDate(
        dateReport.class_name,
        dateReport.section_name,
        dateReport.date
      );
      
      if (response.success && response.data) {
        setDateReportData(response.data);
        toast.success('Report fetched successfully');
      } else {
        toast.error('Failed to fetch report');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching report');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle month report
  const handleMonthReport = async (e) => {
    e.preventDefault();
    if (!monthReport.class_name || !monthReport.section_name || !monthReport.month || !monthReport.year) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getStudentReportByMonth(
        monthReport.class_name,
        monthReport.section_name,
        monthReport.month,
        monthReport.year
      );
      
      if (response.success && response.data) {
        setMonthReportData(response.data);
        toast.success('Report fetched successfully');
      } else {
        toast.error('Failed to fetch report');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching report');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle class wise report
  const handleClassWiseReport = async (e) => {
    e.preventDefault();
    if (!classWiseReport.date) {
      toast.error('Please select a date');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getClassWiseSummary(classWiseReport.date);
      
      if (response.success && response.data) {
        setClassWiseReportData(response.data);
        toast.success('Report fetched successfully');
      } else {
        toast.error('Failed to fetch report');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching report');
    } finally {
      setIsLoading(false);
    }
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Calculate stats for date report
  const getDateReportStats = () => {
    if (!dateReportData?.summary) return null;
    return {
      total: dateReportData.summary.total_students || 0,
      present: dateReportData.summary.present || 0,
      absent: dateReportData.summary.absent || 0,
      leave: dateReportData.summary.leave ?? dateReportData.summary.late ?? 0,
    };
  };

  // Calculate stats for month report
  const getMonthReportStats = () => {
    if (!monthReportData || !monthReportData.student_reports) return null;
    const reports = monthReportData.student_reports;
    const totalPresent = reports.reduce((sum, s) => sum + (s.attendance_summary?.present || 0), 0);
    const totalAbsent = reports.reduce((sum, s) => sum + (s.attendance_summary?.absent || 0), 0);
    const totalLeave = reports.reduce(
      (sum, s) => sum + (s.attendance_summary?.leave ?? s.attendance_summary?.late ?? 0),
      0
    );
    return {
      total: reports.length,
      present: totalPresent,
      absent: totalAbsent,
      leave: totalLeave,
      avgPercentage: monthReportData.class_summary?.average_attendance_percentage || '0.00',
    };
  };

  // Calculate stats for class wise report
  const getClassWiseStats = () => {
    if (!classWiseReportData || !classWiseReportData.overall_summary) return null;
    return {
      totalClasses: classWiseReportData.total_classes || 0,
      totalStudents: classWiseReportData.overall_summary.total_students || 0,
      present: classWiseReportData.overall_summary.present || 0,
      absent: classWiseReportData.overall_summary.absent || 0,
      leave: classWiseReportData.overall_summary.leave ?? classWiseReportData.overall_summary.late ?? 0,
      notMarked: classWiseReportData.overall_summary.not_marked || 0,
      avgPercentage: classWiseReportData.overall_summary.attendance_percentage || '0.00',
    };
  };

  const dateStats = getDateReportStats();
  const monthStats = getMonthReportStats();
  const classWiseStats = getClassWiseStats();

  return (
    <div className="w-full mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Attendance Reports</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('byDate')}
            className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors duration-200 ${
              activeTab === 'byDate'
                ? 'border-b-2 border-violet-600 text-violet-600 bg-violet-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Report by Date
          </button>
          <button
            onClick={() => setActiveTab('byMonth')}
            className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors duration-200 ${
              activeTab === 'byMonth'
                ? 'border-b-2 border-violet-600 text-violet-600 bg-violet-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Report by Month
          </button>
          <button
            onClick={() => setActiveTab('classWise')}
            className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors duration-200 ${
              activeTab === 'classWise'
                ? 'border-b-2 border-violet-600 text-violet-600 bg-violet-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Class Wise Report
          </button>
        </div>
      </div>

      {/* Report by Date */}
      {activeTab === 'byDate' && (
        <div className="space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Attendance Report by Date</h2>
              <form onSubmit={handleDateReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Class & Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dateReport.class_id}
                      onChange={handleDateClassChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                      required
                    >
                      <option value="">Select Class & Section</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.class_name} - {cls.section_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dateReport.date}
                      onChange={(e) => setDateReport({ ...dateReport, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm cursor-pointer ${
                      isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                  >
                    {isLoading ? 'Loading...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Cards */}
            {dateStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StandardStatCard 
                  name="Total Students" 
                  icon={Users} 
                  value={dateStats.total.toLocaleString()} 
                  color="#7c3aed"
                />
                <StandardStatCard 
                  name="Present" 
                  icon={CheckCircle} 
                  value={dateStats.present.toLocaleString()} 
                  color="#10b981"
                />
                <StandardStatCard 
                  name="Absent" 
                  icon={XCircle} 
                  value={dateStats.absent.toLocaleString()} 
                  color="#ef4444"
                />
                <StandardStatCard 
                  name="Leave" 
                  icon={FileText} 
                  value={dateStats.leave.toLocaleString()} 
                  color="#f59e0b"
                />
              </div>
            )}

            {/* Report Results */}
            {dateReportData && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Report Results</h3>
                {dateReportData.class_info && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Report Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Class:</span>
                        <span className="ml-2 text-gray-900">{dateReportData.class_info.class_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Section:</span>
                        <span className="ml-2 text-gray-900">{dateReportData.class_info.section_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Room No:</span>
                        <span className="ml-2 text-gray-900">{dateReportData.class_info.room_No || '-'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="ml-2 text-gray-900">
                          {dateReportData.class_info.date 
                            ? new Date(dateReportData.class_info.date).toLocaleDateString('en-GB')
                            : dateReport.date ? new Date(dateReport.date).toLocaleDateString('en-GB') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {dateReportData.attendance_records && dateReportData.attendance_records.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student ID</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Roll Number</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dateReportData.attendance_records.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.student_id || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.student_name || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.roll_number || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                student.attendance_status === 'present' ? 'bg-green-100 text-green-800' :
                                student.attendance_status === 'absent' ? 'bg-red-100 text-red-800' :
                                student.attendance_status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                                student.attendance_status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {student.attendance_status ? student.attendance_status.charAt(0).toUpperCase() + student.attendance_status.slice(1) : '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : dateReportData && (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>
            )}
          </div>
        )}

      {/* Report by Month */}
      {activeTab === 'byMonth' && (
        <div className="space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Attendance Report by Month</h2>
              <form onSubmit={handleMonthReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Class & Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={monthReport.class_id}
                      onChange={handleMonthClassChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                      required
                    >
                      <option value="">Select Class & Section</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.class_name} - {cls.section_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={monthReport.month}
                      onChange={(e) => setMonthReport({ ...monthReport, month: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                      required
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={monthReport.year}
                      onChange={(e) => setMonthReport({ ...monthReport, year: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                      required
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm cursor-pointer ${
                      isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                  >
                    {isLoading ? 'Loading...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Cards */}
            {monthStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StandardStatCard 
                  name="Total Students" 
                  icon={Users} 
                  value={monthStats.total.toLocaleString()} 
                  color="#7c3aed"
                />
                <StandardStatCard 
                  name="Present" 
                  icon={CheckCircle} 
                  value={monthStats.present.toLocaleString()} 
                  color="#10b981"
                />
                <StandardStatCard 
                  name="Absent" 
                  icon={XCircle} 
                  value={monthStats.absent.toLocaleString()} 
                  color="#ef4444"
                />
                <StandardStatCard 
                  name="Leave" 
                  icon={FileText} 
                  value={monthStats.leave.toLocaleString()} 
                  color="#f59e0b"
                />
                <StandardStatCard 
                  name="Avg Attendance" 
                  icon={TrendingUp} 
                  value={`${monthStats.avgPercentage}%`} 
                  color="#3b82f6"
                />
              </div>
            )}

            {/* Report Results */}
            {monthReportData && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Report Results</h3>
                {monthReportData.report_info && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Report Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Class:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.report_info.class_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Section:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.report_info.section_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Room No:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.report_info.room_No || '-'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Month:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.report_info.month}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Year:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.report_info.year}</span>
                      </div>
                      {monthReportData.report_info.date_range && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">From:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(monthReportData.report_info.date_range.from).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">To:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(monthReportData.report_info.date_range.to).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {monthReportData.class_summary && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Class Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Total Students:</span>
                        <span className="ml-2 text-gray-900">{monthReportData.class_summary.total_students || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Average Attendance:</span>
                        <span className="ml-2 font-semibold text-blue-600">
                          {monthReportData.class_summary.average_attendance_percentage || '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {monthReportData.student_reports && monthReportData.student_reports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student ID</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Roll Number</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Days</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Present</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Absent</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthReportData.student_reports.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.student_id || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.student_name || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.roll_number || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                              {student.attendance_summary?.total_days_marked || 0}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-green-600 font-medium">
                                {student.attendance_summary?.present || 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-red-600 font-medium">
                                {student.attendance_summary?.absent || 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-yellow-600 font-medium">
                                {student.attendance_summary?.leave ?? student.attendance_summary?.late ?? 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                              {student.attendance_summary?.attendance_percentage || '0.00'}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : monthReportData && (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>
            )}
          </div>
        )}

      {/* Class Wise Report */}
      {activeTab === 'classWise' && (
        <div className="space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Class Wise Attendance Report</h2>
              <form onSubmit={handleClassWiseReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={classWiseReport.date}
                      onChange={(e) => setClassWiseReport({ ...classWiseReport, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm cursor-pointer ${
                      isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                  >
                    {isLoading ? 'Loading...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Cards */}
            {classWiseStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <StandardStatCard 
                  name="Total Classes" 
                  icon={FileText} 
                  value={classWiseStats.totalClasses.toLocaleString()} 
                  color="#7c3aed"
                />
                <StandardStatCard 
                  name="Total Students" 
                  icon={Users} 
                  value={classWiseStats.totalStudents.toLocaleString()} 
                  color="#6366f1"
                />
                <StandardStatCard 
                  name="Present" 
                  icon={CheckCircle} 
                  value={classWiseStats.present.toLocaleString()} 
                  color="#10b981"
                />
                <StandardStatCard 
                  name="Absent" 
                  icon={XCircle} 
                  value={classWiseStats.absent.toLocaleString()} 
                  color="#ef4444"
                />
                <StandardStatCard 
                  name="Leave" 
                  icon={FileText} 
                  value={classWiseStats.leave.toLocaleString()} 
                  color="#f59e0b"
                />
                <StandardStatCard 
                  name="Avg Attendance" 
                  icon={TrendingUp} 
                  value={`${classWiseStats.avgPercentage}%`} 
                  color="#3b82f6"
                />
              </div>
            )}

            {/* Report Results */}
            {classWiseReportData && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Report Results</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Overall Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <span className="ml-2 text-gray-900">
                        {classWiseReportData.date 
                          ? new Date(classWiseReportData.date).toLocaleDateString('en-GB')
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Classes:</span>
                      <span className="ml-2 text-gray-900">{classWiseReportData.total_classes || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Students:</span>
                      <span className="ml-2 text-gray-900">{classWiseReportData.overall_summary?.total_students || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Present:</span>
                      <span className="ml-2 text-green-600 font-medium">
                        {classWiseReportData.overall_summary?.present || 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Absent:</span>
                      <span className="ml-2 text-red-600 font-medium">
                        {classWiseReportData.overall_summary?.absent || 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Leave:</span>
                      <span className="ml-2 text-yellow-600 font-medium">
                        {classWiseReportData.overall_summary?.leave ?? classWiseReportData.overall_summary?.late ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Not Marked:</span>
                      <span className="ml-2 text-gray-900">
                        {classWiseReportData.overall_summary?.not_marked || 0}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Overall Attendance Percentage:</span>
                    <span className="ml-2 font-semibold text-violet-600 text-base">
                      {classWiseReportData.overall_summary?.attendance_percentage || '0.00'}%
                    </span>
                  </div>
                </div>
                {classWiseReportData.class_wise_reports && classWiseReportData.class_wise_reports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Class Name</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Section</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room No</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Students</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Present</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Absent</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Not Marked</th>
                          <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {classWiseReportData.class_wise_reports.map((classReport, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{classReport.class_name || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{classReport.section_name || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">{classReport.room_No || '-'}</td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                              {classReport.summary?.total_students || 0}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-green-600 font-medium">
                                {classReport.summary?.present || 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-red-600 font-medium">
                                {classReport.summary?.absent || 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className="text-yellow-600 font-medium">
                                {classReport.summary?.leave ?? classReport.summary?.late ?? 0}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                              {classReport.summary?.not_marked || 0}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                              {classReport.summary?.attendance_percentage || '0.00'}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : classWiseReportData && (
                  <p className="text-gray-600 text-center py-8">No data available</p>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default AttendanceReport;

