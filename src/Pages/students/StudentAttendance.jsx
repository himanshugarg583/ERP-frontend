import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import StudentNavbar from './StudentNavbar';
import StudentSidebar from './StudentSidebar';
import { FaClipboardList, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

const StudentAttendance = () => {
  const [attendanceData] = useState({
    summary: { totalClasses: 60, classesAttended: 48, percentage: 80 },
    records: [
      { date: "2025-03-01", subject: "Mathematics", course: "MATH-11", teacher: "Prof. Anil Kumar", status: "Present" },
      { date: "2025-03-02", subject: "Physics", course: "PHY-11", teacher: "Dr. Rakesh Sharma", status: "Absent" },
      { date: "2025-03-03", subject: "Mathematics", course: "MATH-11", teacher: "Prof. Anil Kumar", status: "Present" },
      { date: "2025-03-04", subject: "Physics", course: "PHY-11", teacher: "Dr. Rakesh Sharma", status: "Present" },
      { date: "2025-03-05", subject: "Chemistry", course: "CHEM-11", teacher: "Dr. Priya Gupta", status: "Absent" },
      { date: "2025-03-06", subject: "English", course: "ENG-11", teacher: "Ms. Shalini Verma", status: "Present" },
      { date: "2025-03-07", subject: "Computer Science", course: "CS-11", teacher: "Mr. Vikram Patel", status: "Present" },
      { date: "2025-03-08", subject: "Mathematics", course: "MATH-11", teacher: "Prof. Anil Kumar", status: "Absent" },
      { date: "2025-03-09", subject: "Physics", course: "PHY-11", teacher: "Dr. Rakesh Sharma", status: "Present" },
      { date: "2025-03-10", subject: "Chemistry", course: "CHEM-11", teacher: "Dr. Priya Gupta", status: "Present" },
      { date: "2025-03-11", subject: "English", course: "ENG-11", teacher: "Ms. Shalini Verma", status: "Absent" },
      { date: "2025-03-12", subject: "Computer Science", course: "CS-11", teacher: "Mr. Vikram Patel", status: "Present" },
      { date: "2025-03-13", subject: "Mathematics", course: "MATH-11", teacher: "Prof. Anil Kumar", status: "Present" },
      { date: "2025-03-14", subject: "Physics", course: "PHY-11", teacher: "Dr. Rakesh Sharma", status: "Present" },
      { date: "2025-03-15", subject: "Chemistry", course: "CHEM-11", teacher: "Dr. Priya Gupta", status: "Present" },
    ],
  });

  const [filters, setFilters] = useState({ subject: '' });
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '', status: 'Pending' });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const uniqueSubjects = [...new Set(attendanceData.records.map(r => r.subject))];
  const latestRecords = uniqueSubjects.map(subject => attendanceData.records.filter(r => r.subject === subject).slice(-1)[0]);
  const filteredRecords = filters.subject ? latestRecords.filter(r => r.subject === filters.subject) : latestRecords;

  const pieData = [
    { id: 0, value: attendanceData.summary.classesAttended, label: 'Attended', color: '#10B981' },
    { id: 1, value: attendanceData.summary.totalClasses - attendanceData.summary.classesAttended, label: 'Missed', color: '#EF4444' },
  ];

  const handleFilterChange = e => setFilters({ subject: e.target.value });
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
  const Card = ({ title, value, color }) => (
    <div 
      className={`relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-${color}-100 flex flex-col items-center justify-center`}
      // Container: White background, rounded corners, shadow, border, hover effects (lift and color-specific background)
    >
      <div className={`absolute top-0 left-0 w-full h-2 bg-${color}-500 rounded-t-xl opacity-75`} />
      {/* Top Bar: Color-specific bar at the top (blue, green, purple) */}
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
      {/* Title: Displays "Total Classes", "Classes Attended", or "Attendance" */}
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      {/* Value: Displays the number (e.g., 60, 48, 80%) in bold, color-specific text */}
    </div>
  );

  // Table component used for displaying attendance records
  const Table = ({ records, subjects, filters, onFilterChange, onSubjectClick, totalClasses, classesAttended }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FaClipboardList className="w-6 h-6 mr-2 text-indigo-600" /> Attendance Records
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0">
          <p className="text-sm font-medium text-gray-700">Total Attendance: <span className="text-indigo-600">{classesAttended}/{totalClasses}</span></p>
          <select
            name="subject"
            value={filters.subject}
            onChange={onFilterChange}
            className="w-full sm:w-52 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white shadow-sm transition-all duration-200 hover:border-indigo-400"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        {records.length ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                {["Date", "Subject", "Course", "Teacher"].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-gray-800">{record.date}</td>
                  <td 
                    className="px-6 py-4 text-sm text-indigo-600 font-medium cursor-pointer hover:underline hover:text-indigo-800" 
                    onClick={() => onSubjectClick(record.subject)}
                  >
                    {record.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-center py-6 text-gray-500 text-sm">No attendance records found.</p>}
      </div>
    </div>
  );

  // Popup component used for showing detailed attendance of a selected subject
  const Popup = ({ subject, records, onClose }) => {
    const totalClasses = records.length;
    const classesAttended = records.filter(r => r.status === "Present").length;
    const percentage = totalClasses > 0 ? Math.round((classesAttended / totalClasses) * 100) : 0;

    return (
      <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
              <FaClipboardList className="w-6 h-6 mr-2" /> {subject} Attendance
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors">×</button>
          </div>
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <p className="text-sm text-gray-700 font-medium">Total Classes: <span className="text-indigo-600 font-bold">{totalClasses}</span></p>
              <p className="text-sm text-gray-700 font-medium">Attended: <span className="text-indigo-600 font-bold">{classesAttended}</span></p>
              <p className="text-sm text-gray-700 font-medium">Percentage: <span className="text-indigo-600 font-bold">{percentage}%</span></p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    {["Date", "Course", "Teacher", "Status"].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record, index) => (
                    <tr key={index} className="hover:bg-indigo-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-800">{record.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.course}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.teacher}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full shadow-sm ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      {/* Sidebar: Fixed left panel */}
      <StudentSidebar className="fixed top-0 left-0 w-64 h-full" />
      {/* Navbar: Fixed top bar */}
      <div className="fixed top-0 left-64 right-0 z-10 bg-white shadow-md">
        <StudentNavbar />
      </div>
      {/* Main Content Area */}
      <main className="mt-16 md:ml-64 p-6 lg:p-8">
        <div className="max-w-9xl mx-auto space-y-8">
          {/* Summary Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Classes Card - Blue */}
            <Card title="Total Classes" value={attendanceData.summary.totalClasses} color="blue" />
            {/* Classes Attended Card - Green */}
            <Card title="Classes Attended" value={attendanceData.summary.classesAttended} color="green" />
            {/* Attendance Card - Purple */}
            <Card title="Attendance" value={`${attendanceData.summary.percentage}%`} color="purple" />
          </div>
          {/* Attendance Records Table */}
          <Table 
            records={filteredRecords} 
            subjects={uniqueSubjects} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onSubjectClick={setSelectedSubject} 
            totalClasses={attendanceData.summary.totalClasses} 
            classesAttended={attendanceData.summary.classesAttended} 
          />
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
          {attendanceData.summary.percentage < 75 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center animate-pulse">
              <FaExclamationCircle className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-700 text-sm font-medium">Warning: Your attendance is below 75%. Please attend classes regularly.</p>
            </div>
          )}
          {/* Subject Attendance Popup */}
          {selectedSubject && <Popup subject={selectedSubject} records={attendanceData.records.filter(r => r.subject === selectedSubject)} onClose={() => setSelectedSubject(null)} />}
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;