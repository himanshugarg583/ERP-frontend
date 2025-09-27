import React, { useState } from 'react';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';
import { MdExpandMore, MdChevronLeft, MdChevronRight, MdAdd, MdNotifications } from 'react-icons/md';

const StaffAttendence = () => {
  // State for attendance and leave data
  const [attendanceData, setAttendanceData] = useState([
    { employee: { name: 'John Doe', id: '#EMP10023', initials: 'JD' }, department: 'Administration', date: '2023-10-15', checkIn: '09:02 AM', checkOut: '05:30 PM', hours: 8.5, status: 'Present' },
    { employee: { name: 'Mary Smith', id: '#EMP10045', initials: 'MS' }, department: 'Library', date: '2023-10-15', checkIn: '09:45 AM', checkOut: '05:15 PM', hours: 7.5, status: 'Late' },
    { employee: { name: 'Robert Johnson', id: '#EMP10067', initials: 'RJ' }, department: 'IT Support', date: '2023-10-15', checkIn: '08:30 AM', checkOut: '01:15 PM', hours: 4.75, status: 'Half-day' },
    { employee: { name: 'Amanda Patel', id: '#EMP10089', initials: 'AP' }, department: 'Maintenance', date: '2023-10-15', checkIn: null, checkOut: null, hours: 0, status: 'Absent' },
  ]);

  const [leaveData, setLeaveData] = useState([
    { employee: { name: 'Mary Smith', id: '#EMP10045', initials: 'MS' }, department: 'Library', leaveType: 'Medical', period: { start: '2023-10-18', end: '2023-10-20' }, days: 3, reason: 'Doctor\'s appointment', status: 'Approved', approver: 'Dr. Williams' },
    { employee: { name: 'Robert Johnson', id: '#EMP10067', initials: 'RJ' }, department: 'IT Support', leaveType: 'Casual', period: { start: '2023-10-26', end: '2023-10-27' }, days: 2, reason: 'Family function', status: 'Pending', approver: 'Mrs. Chen' },
    { employee: { name: 'Amanda Patel', id: '#EMP10089', initials: 'AP' }, department: 'Maintenance', leaveType: 'Emergency', period: { start: '2023-10-15', end: '2023-10-15' }, days: 1, reason: 'Family emergency', status: 'Under Review', approver: 'Mr. Garcia' },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: { name: 'John Doe', id: '#EMP10023', initials: 'JD' }, department: 'Administration', leaveType: 'Casual', period: { start: '2023-11-01', end: '2023-11-02' }, days: 2, reason: 'Personal time off', status: 'Pending' },
    { employee: { name: 'Mary Smith', id: '#EMP10045', initials: 'MS' }, department: 'Library', leaveType: 'Medical', period: { start: '2023-11-05', end: '2023-11-06' }, days: 2, reason: 'Surgery', status: 'Pending' },
  ]);

  // Filter states (kept for UI but not functional)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [filteredAttendance, setFilteredAttendance] = useState(attendanceData);

  // State to toggle visibility of leave requests
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);

  // Handle leave request approval
  const handleApproveLeave = (request) => {
    const approvedLeave = { ...request, status: 'Approved', approver: 'Admin' };
    setLeaveData([...leaveData, approvedLeave]);
    setLeaveRequests(leaveRequests.filter((req) => req.id !== request.id));
    
    setAttendanceData(attendanceData.map((record) =>
      record.employee.id === request.employee.id && request.period.start === record.date
        ? { ...record, status: 'Leave', checkIn: null, checkOut: null, hours: 0 }
        : record
    ));
    setFilteredAttendance(filteredAttendance.map((record) =>
      record.employee.id === request.employee.id && request.period.start === record.date
        ? { ...record, status: 'Leave', checkIn: null, checkOut: null, hours: 0 }
        : record
    ));
  };

  // Handle leave request rejection
  const handleRejectLeave = (request) => {
    setLeaveRequests(leaveRequests.filter((req) => req.id !== request.id));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffHeader />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8 bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Staff Attendance Dashboard
              </h1>
              <p className="text-gray-500 mt-2 text-lg">Non-Teaching Staff Management Portal</p>
            </header>

            {/* Attendance Records */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Attendance Records</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <div className="relative">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                    >
                      <option>All Departments</option>
                      <option>Administration</option>
                      <option>IT Support</option>
                      <option>Maintenance</option>
                      <option>Library</option>
                    </select>
                    <MdExpandMore className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="p-4">Employee</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Check-in</th>
                      <th className="p-4">Check-out</th>
                      <th className="p-4">Hours</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAttendance?.length > 0 ? (
                      filteredAttendance.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                {record?.employee?.initials}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{record?.employee?.name}</div>
                                <div className="text-sm text-gray-500">{record?.employee?.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{record?.department}</td>
                          <td className="p-4 text-sm text-gray-600">{record?.date}</td>
                          <td className="p-4 text-sm text-gray-600">{record?.checkIn || '--'}</td>
                          <td className="p-4 text-sm text-gray-600">{record?.checkOut || '--'}</td>
                          <td className="p-4 text-sm text-gray-600">{record?.hours}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                record?.status === 'Present'
                                  ? 'bg-green-100 text-green-800'
                                  : record?.status === 'Late'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : record?.status === 'Half-day'
                                  ? 'bg-orange-100 text-orange-800'
                                  : record?.status === 'Leave'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record?.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing 1 to {filteredAttendance?.length || 0} of {attendanceData?.length || 0} results
                </p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <MdChevronLeft size={20} />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 bg-blue-50 text-blue-600">1</button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">2</button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <MdChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Leave Applications */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4 relative">
                <h2 className="text-2xl font-semibold text-gray-800">Leave Applications</h2>
                <div className="relative">
                  <button
                    onClick={() => setShowLeaveRequests(!showLeaveRequests)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <MdAdd size={18} />
                    <span>{showLeaveRequests ? 'Hide Requests' : 'New Leave Request'}</span>
                  </button>

                  {/* Dropdown-style Leave Requests */}
                  {showLeaveRequests && leaveRequests?.length > 0 && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg p-4 z-10 animate-slide-up">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <MdNotifications className="mr-2 text-blue-600" /> Pending Requests
                      </h3>
                      {leaveRequests.map((request) => (
                        <div key={request?.id} className="border-b py-2 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request?.employee?.name} ({request?.employee?.id})</p>
                            <p className="text-xs text-gray-600">{request?.leaveType}: {request?.period?.start} - {request?.period?.end} ({request?.days} days)</p>
                            <p className="text-xs text-gray-500">Reason: {request?.reason}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveLeave(request)}
                              className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectLeave(request)}
                              className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="p-4">Employee</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Leave Type</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Days</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Approver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaveData?.length > 0 ? (
                      leaveData.map((leave, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                {leave?.employee?.initials}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{leave?.employee?.name}</div>
                                <div className="text-sm text-gray-500">{leave?.employee?.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{leave?.department}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                leave?.leaveType === 'Medical'
                                  ? 'bg-blue-100 text-blue-800'
                                  : leave?.leaveType === 'Casual'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {leave?.leaveType}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {leave?.period?.start} to {leave?.period?.end}
                          </td>
                          <td className="p-4 text-sm text-gray-600">{leave?.days}</td>
                          <td className="p-4 text-sm text-gray-600">
                            <details className="group cursor-pointer relative">
                              <summary className="text-blue-600 hover:text-blue-700 transition-colors">
                                View
                              </summary>
                              <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-10 group-open:block hidden">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Reason for Leave</h4>
                                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded-md">
                                  {leave?.reason}
                                </p>
                              </div>
                            </details>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                leave?.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : leave?.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {leave?.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{leave?.approver}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="p-4 text-center text-gray-500">
                          No leave records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing 1 to {leaveData?.length || 0} of {leaveData?.length || 0} results
                </p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <MdChevronLeft size={20} />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 bg-blue-50 text-blue-600">1</button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">2</button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <MdChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StaffAttendence;