import React, { useState, useEffect } from 'react';
import { getStudentReportByDate, getStudentReportByMonth, getClassWiseSummary, getAllClassesDropdown } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
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
      const response = await getAllClassesDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
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
      console.error('Error fetching date report:', error);
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
      console.error('Error fetching month report:', error);
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
      console.error('Error fetching class wise report:', error);
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

  return (
    <div className="bg-slate-200 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Attendance Reports</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('byDate')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'byDate'
                  ? 'border-b-2 border-violet-600 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Report by Date
            </button>
            <button
              onClick={() => setActiveTab('byMonth')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'byMonth'
                  ? 'border-b-2 border-violet-600 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Report by Month
            </button>
            <button
              onClick={() => setActiveTab('classWise')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'classWise'
                  ? 'border-b-2 border-violet-600 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Class Wise Report
            </button>
          </div>
        </div>

        {/* Report by Date */}
        {activeTab === 'byDate' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Report by Date</h2>
            <form onSubmit={handleDateReport} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Class & Section *</label>
                  <select
                    value={dateReport.class_id}
                    onChange={handleDateClassChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                <div>
                  <label className="block text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={dateReport.date}
                    onChange={(e) => setDateReport({ ...dateReport, date: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
              >
                {isLoading ? 'Loading...' : 'Generate Report'}
              </button>
            </form>

            {dateReportData && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Report Results</h3>
                {dateReportData.report_info && (
                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <h4 className="font-semibold mb-2">Report Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Class:</span> {dateReportData.report_info.class_name}
                      </div>
                      <div>
                        <span className="font-medium">Section:</span> {dateReportData.report_info.section_name}
                      </div>
                      <div>
                        <span className="font-medium">Room No:</span> {dateReportData.report_info.room_No || '-'}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {dateReportData.report_info.date || dateReport.date}
                      </div>
                    </div>
                  </div>
                )}
                {dateReportData.student_reports && dateReportData.student_reports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Student ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Roll Number</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dateReportData.student_reports.map((student, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{student.student_id || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.student_name || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.roll_number || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                student.status === 'present' ? 'bg-green-100 text-green-800' :
                                student.status === 'absent' ? 'bg-red-100 text-red-800' :
                                student.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Report by Month */}
        {activeTab === 'byMonth' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Report by Month</h2>
            <form onSubmit={handleMonthReport} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Class & Section *</label>
                  <select
                    value={monthReport.class_id}
                    onChange={handleMonthClassChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                <div>
                  <label className="block text-gray-700 mb-1">Month *</label>
                  <select
                    value={monthReport.month}
                    onChange={(e) => setMonthReport({ ...monthReport, month: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                <div>
                  <label className="block text-gray-700 mb-1">Year *</label>
                  <select
                    value={monthReport.year}
                    onChange={(e) => setMonthReport({ ...monthReport, year: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
              >
                {isLoading ? 'Loading...' : 'Generate Report'}
              </button>
            </form>

            {monthReportData && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Report Results</h3>
                {monthReportData.report_info && (
                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <h4 className="font-semibold mb-2">Report Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Class:</span> {monthReportData.report_info.class_name}
                      </div>
                      <div>
                        <span className="font-medium">Section:</span> {monthReportData.report_info.section_name}
                      </div>
                      <div>
                        <span className="font-medium">Room No:</span> {monthReportData.report_info.room_No || '-'}
                      </div>
                      <div>
                        <span className="font-medium">Month:</span> {monthReportData.report_info.month}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {monthReportData.report_info.year}
                      </div>
                      {monthReportData.report_info.date_range && (
                        <>
                          <div>
                            <span className="font-medium">From:</span> {new Date(monthReportData.report_info.date_range.from).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {new Date(monthReportData.report_info.date_range.to).toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {monthReportData.class_summary && (
                  <div className="bg-blue-50 p-4 rounded mb-4">
                    <h4 className="font-semibold mb-2">Class Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Students:</span> {monthReportData.class_summary.total_students || 0}
                      </div>
                      <div>
                        <span className="font-medium">Average Attendance:</span> {monthReportData.class_summary.average_attendance_percentage || '0.00'}%
                      </div>
                    </div>
                  </div>
                )}
                {monthReportData.student_reports && monthReportData.student_reports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Student ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Roll Number</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Total Days</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Present</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Absent</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Late</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthReportData.student_reports.map((student, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{student.student_id || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.student_name || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.roll_number || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {student.attendance_summary?.total_days_marked || 0}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-green-600 font-medium">
                                {student.attendance_summary?.present || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-red-600 font-medium">
                                {student.attendance_summary?.absent || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-yellow-600 font-medium">
                                {student.attendance_summary?.late || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                              {student.attendance_summary?.attendance_percentage || '0.00'}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Class Wise Report */}
        {activeTab === 'classWise' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Class Wise Attendance Report</h2>
            <form onSubmit={handleClassWiseReport} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={classWiseReport.date}
                    onChange={(e) => setClassWiseReport({ ...classWiseReport, date: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
              >
                {isLoading ? 'Loading...' : 'Generate Report'}
              </button>
            </form>

            {classWiseReportData && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Report Results</h3>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <h4 className="font-semibold mb-2">Overall Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date:</span> {classWiseReportData.date ? new Date(classWiseReportData.date).toLocaleDateString() : '-'}
                    </div>
                    <div>
                      <span className="font-medium">Total Students:</span> {classWiseReportData.overall_summary?.total_students || 0}
                    </div>
                    <div>
                      <span className="font-medium">Present:</span> <span className="text-green-600">{classWiseReportData.overall_summary?.present || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Absent:</span> <span className="text-red-600">{classWiseReportData.overall_summary?.absent || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Late:</span> <span className="text-yellow-600">{classWiseReportData.overall_summary?.late || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Not Marked:</span> {classWiseReportData.overall_summary?.not_marked || 0}
                    </div>
                    <div className="md:col-span-6">
                      <span className="font-medium">Overall Attendance Percentage:</span> 
                      <span className="ml-2 font-semibold text-violet-600">
                        {classWiseReportData.overall_summary?.attendance_percentage || '0.00'}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Total Classes:</span> {classWiseReportData.total_classes || 0}
                </div>
                {classWiseReportData.class_wise_reports && classWiseReportData.class_wise_reports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Class Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Room No</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Total Students</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Present</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Absent</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Late</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Not Marked</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classWiseReportData.class_wise_reports.map((classReport, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{classReport.class_name || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{classReport.section_name || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{classReport.room_No || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {classReport.summary?.total_students || 0}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-green-600 font-medium">
                                {classReport.summary?.present || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-red-600 font-medium">
                                {classReport.summary?.absent || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span className="text-yellow-600 font-medium">
                                {classReport.summary?.late || 0}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {classReport.summary?.not_marked || 0}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                              {classReport.summary?.attendance_percentage || '0.00'}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;

