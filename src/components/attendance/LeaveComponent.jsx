import React, { useState } from 'react';

const LeaveComponent = () => {
  // Classes State
  const [classes, setClasses] = useState([
    { id: 1, name: 'Mathematics 101', teacher: 'Mr. Johnson', room: 'A-101', schedule: 'MWF 9:00-10:30', capacity: 30, enrolled: 24 },
    { id: 2, name: 'English Literature', teacher: 'Ms. Parker', room: 'B-205', schedule: 'TTh 11:00-12:30', capacity: 25, enrolled: 20 }
  ]);
  
  const [newClass, setNewClass] = useState({
    name: '',
    teacher: '',
    room: '',
    schedule: '',
    capacity: '',
    enrolled: 0
  });
  
  // Leave Applications State
  const [leaveApplications, setLeaveApplications] = useState([
    { id: 1, studentName: 'John Smith', studentId: 'S12345', class: 'Mathematics 101', leaveFrom: '2025-03-15', leaveTo: '2025-03-18', reason: 'Medical appointment', status: 'Approved' },
    { id: 2, studentName: 'Emma Davis', studentId: 'S12346', class: 'English Literature', leaveFrom: '2025-03-22', leaveTo: '2025-03-24', reason: 'Family event', status: 'Pending' }
  ]);
  
  const [newLeave, setNewLeave] = useState({
    studentName: '',
    studentId: '',
    class: '',
    leaveFrom: '',
    leaveTo: '',
    reason: '',
    status: 'Pending'
  });
  
  const [activeTab, setActiveTab] = useState('classes');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Class Handlers
  const handleClassInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: name === 'capacity' ? parseInt(value) || '' : value });
  };
  
  const handleClassSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newClass.name || !newClass.teacher || !newClass.room || !newClass.schedule || !newClass.capacity) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }
    
    // Add new class
    const newId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
    const classToAdd = { ...newClass, id: newId };
    
    setClasses([...classes, classToAdd]);
    setNewClass({ name: '', teacher: '', room: '', schedule: '', capacity: '', enrolled: 0 });
    setMessage({ text: 'Class added successfully!', type: 'success' });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  
  // Leave Application Handlers
  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave({ ...newLeave, [name]: value });
  };
  
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newLeave.studentName || !newLeave.studentId || !newLeave.class || !newLeave.leaveFrom || !newLeave.leaveTo || !newLeave.reason) {
      setMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }
    
    // Add new leave application
    const newId = leaveApplications.length > 0 ? Math.max(...leaveApplications.map(l => l.id)) + 1 : 1;
    const leaveToAdd = { ...newLeave, id: newId };
    
    setLeaveApplications([...leaveApplications, leaveToAdd]);
    setNewLeave({
      studentName: '',
      studentId: '',
      class: '',
      leaveFrom: '',
      leaveTo: '',
      reason: '',
      status: 'Pending'
    });
    setMessage({ text: 'Leave application submitted successfully!', type: 'success' });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  
  return (
    <div className="bg-slate-200 min-h-screen p-6 rounded-md">
      <div className="w-full mx-auto">
        {/* <header className="bg-blue-600 text-white p-4 rounded-t-lg shadow">
          <h1 className="text-2xl font-bold">School Management System</h1>
        </header> */}
        
        {/* Navigation Tabs */}
        {/* <div className="bg-white border-b">
          <nav className="flex">
            <button 
              onClick={() => setActiveTab('classes')} 
              className={`px-4 py-3 font-medium ${activeTab === 'classes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Manage Classes
            </button>
            <button 
              onClick={() => setActiveTab('leave')} 
              className={`px-4 py-3 font-medium ${activeTab === 'leave' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Student Leave
            </button>
          </nav>
        </div> */}
        
        {message.text && (
          <div className={`p-3 my-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        {/* Classes Tab
        {activeTab === 'classes' && (
          <>
            <div className="bg-white shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Class</h2>
              </div>
              
              <form onSubmit={handleClassSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Class Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newClass.name}
                      onChange={handleClassInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. Biology 101"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Teacher *</label>
                    <input
                      type="text"
                      name="teacher"
                      value={newClass.teacher}
                      onChange={handleClassInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. Ms. Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Room *</label>
                    <input
                      type="text"
                      name="room"
                      value={newClass.room}
                      onChange={handleClassInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. C-103"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Schedule *</label>
                    <input
                      type="text"
                      name="schedule"
                      value={newClass.schedule}
                      onChange={handleClassInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. MWF 9:00-10:30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={newClass.capacity}
                      onChange={handleClassInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. 30"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Class
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Classes</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Class Name</th>
                      <th className="border px-4 py-2 text-left">Teacher</th>
                      <th className="border px-4 py-2 text-left">Room</th>
                      <th className="border px-4 py-2 text-left">Schedule</th>
                      <th className="border px-4 py-2 text-center">Capacity</th>
                      <th className="border px-4 py-2 text-center">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(cls => (
                      <tr key={cls.id}>
                        <td className="border px-4 py-2">{cls.name}</td>
                        <td className="border px-4 py-2">{cls.teacher}</td>
                        <td className="border px-4 py-2">{cls.room}</td>
                        <td className="border px-4 py-2">{cls.schedule}</td>
                        <td className="border px-4 py-2 text-center">{cls.capacity}</td>
                        <td className="border px-4 py-2 text-center">{cls.enrolled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )} */}
        
        {/* Leave Application Tab */}
        {/* {activeTab === 'leave' && (
          <> */}
            <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold">Apply for Student Leave</h2>
              </div>
              
              <form onSubmit={handleLeaveSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={newLeave.studentName}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Student ID *</label>
                    <input
                      type="text"
                      name="studentId"
                      value={newLeave.studentId}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g. S12345"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Class *</label>
                    <select
                      name="class"
                      value={newLeave.class}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Leave From *</label>
                    <input
                      type="date"
                      name="leaveFrom"
                      value={newLeave.leaveFrom}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Leave To *</label>
                    <input
                      type="date"
                      name="leaveTo"
                      value={newLeave.leaveTo}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1">Reason for Leave *</label>
                    <textarea
                      name="reason"
                      value={newLeave.reason}
                      onChange={handleLeaveInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Explain the reason for leave request"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded">
                    Submit Leave Application
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Leave Applications</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Student Name</th>
                      <th className="border px-4 py-2 text-left">Student ID</th>
                      <th className="border px-4 py-2 text-left">Class</th>
                      <th className="border px-4 py-2 text-center">From</th>
                      <th className="border px-4 py-2 text-center">To</th>
                      <th className="border px-4 py-2 text-left">Reason</th>
                      <th className="border px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApplications.map(leave => (
                      <tr key={leave.id}>
                        <td className="border px-4 py-2">{leave.studentName}</td>
                        <td className="border px-4 py-2">{leave.studentId}</td>
                        <td className="border px-4 py-2">{leave.class}</td>
                        <td className="border px-4 py-2 text-center">{leave.leaveFrom}</td>
                        <td className="border px-4 py-2 text-center">{leave.leaveTo}</td>
                        <td className="border px-4 py-2">{leave.reason}</td>
                        <td className="border px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          {/* </>
        )} */}
      </div>
    </div>
  );
};

export default LeaveComponent;