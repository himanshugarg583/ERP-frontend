import React, { useState, useEffect } from 'react';
import TeacherHeader from './TeacherHeader';
import TeacherSidebar from './TeacherSidebar';
import { FaSearch, FaBus, FaExchangeAlt, FaBell, FaUser, FaUsers } from 'react-icons/fa';

const TeacherTransportation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Emma Johnson was dropped off at 3:45 PM', time: '10 minutes ago' },
    { id: 2, message: 'Bus 7 will be delayed by 10 minutes', time: '25 minutes ago' },
    { id: 3, message: 'Olivia Brown was dropped off at 3:45 PM', time: '1 hour ago' },
  ]);
  const [busChangeRequests, setBusChangeRequests] = useState([
    { id: 1, studentName: 'Noah Wilson', oldBus: 'Bus 9', newBus: 'Bus 5', status: 'Pending' },
    { id: 2, studentName: 'Sophia Martinez', oldBus: 'Bus 7', newBus: 'Bus 5', status: 'Approved' },
  ]);

  useEffect(() => {
    setStudents([
      { id: 1, name: 'Emma Johnson', grade: '5th', bus: 'Bus 12', pickup: '123 Maple Street', dropoff: '456 Oak Avenue', status: 'Dropped Off' },
      { id: 2, name: 'Ethan Davis', grade: '3rd', bus: 'Bus 7', pickup: '789 Pine Road', dropoff: '234 Cedar Lane', status: 'On Bus' },
      { id: 3, name: 'Sophia Martinez', grade: '4th', bus: 'Bus 5', pickup: '567 Birch Boulevard', dropoff: '890 Elm Street', status: 'On Bus' },
      { id: 4, name: 'Noah Wilson', grade: '6th', bus: 'Bus 9', pickup: '901 Spruce Drive', dropoff: '345 Walnut Court', status: 'Absent' },
      { id: 5, name: 'Olivia Brown', grade: '5th', bus: 'Bus 12', pickup: '678 Aspen Avenue', dropoff: '123 Maple Street', status: 'Dropped Off' },
    ]);
  }, []);

  const handleApproveBusChange = (studentName, oldBus, newBus) => {
    setNotifications(prev => [
      { id: Date.now(), message: `${studentName ?? 'Unknown'}'s bus change from ${oldBus ?? 'N/A'} to ${newBus ?? 'N/A'} was approved`, time: 'Just now' },
      ...(prev ?? [])
    ]);
    setBusChangeRequests(prev => (prev ?? []).map(r => 
      (r?.studentName === studentName) ? { ...r, status: 'Approved' } : r
    ));
  };

  const filteredStudents = (students ?? []).filter(s => 
    (s?.name ?? '').toLowerCase().includes((searchQuery ?? '').toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      <div className={`${isSidebarOpen ? 'fixed inset-y-0 left-0 w-64 z-50' : 'hidden'} md:block md:w-64 md:static md:flex-shrink-0 transition-all duration-300`}>
        <TeacherSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 w-full md:ml-0">
        <TeacherHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow mx-auto max-w-7xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6 rounded-t-lg text-white">
              <h1 className="text-xl sm:text-2xl font-bold">Student Transportation Management</h1>
              <p className="text-sm">Monitor and manage student bus assignments</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="relative mb-4 sm:mb-6">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 p-2 border rounded-lg text-sm sm:text-base"
                  placeholder="Search students..."
                  value={searchQuery ?? ''}
                  onChange={(e) => setSearchQuery(e.target.value ?? '')}/>
              </div>

              <div className="mb-6 overflow-x-auto">
                <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-9 gap-2 bg-gray-100 text-xs sm:text-sm py-2 sm:py-3 px-2">
                  <div className="col-span-2 sm:col-span-2 md:col-span-2">Student Name</div>
                  <div className="hidden sm:block sm:col-span-1 md:col-span-1">Grade</div>
                  <div className="hidden sm:block sm:col-span-1 md:col-span-1">Bus #</div>
                  <div className="hidden md:block md:col-span-2">Pickup Location</div>
                  <div className="hidden md:block md:col-span-2">Drop-off Location</div>
                  <div className="col-span-1 sm:col-span-1 md:col-span-1">Status</div>
                </div>
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <div key={s?.id ?? Math.random()} className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-9 gap-2 py-2 sm:py-4 border-t px-2 text-xs sm:text-sm">
                    <div className="col-span-2 sm:col-span-2 md:col-span-2">{s?.name ?? 'N/A'}</div>
                    <div className="hidden sm:block sm:col-span-1 md:col-span-1">{s?.grade ?? 'N/A'}</div>
                    <div className="hidden sm:block sm:col-span-1 md:col-span-1">{s?.bus ?? 'N/A'}</div>
                    <div className="hidden md:block md:col-span-2 truncate">{s?.pickup ?? 'N/A'}</div>
                    <div className="hidden md:block md:col-span-2 truncate">{s?.dropoff ?? 'N/A'}</div>
                    <div className="col-span-1 sm:col-span-1 md:col-span-1">
                      <span className={`px-1 sm:px-2 py-1 text-xs rounded-full ${s?.status === 'Dropped Off' ? 'bg-green-100 text-green-800' : s?.status === 'On Bus' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {s?.status ?? 'Unknown'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-4 text-center text-gray-500 text-sm">No students found</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-5 rounded-lg border">
                  <div className="flex items-center mb-4">
                    <FaExchangeAlt className="text-blue-600 text-xl sm:text-2xl mr-2 sm:mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold">Bus Change Requests</h3>
                  </div>
                  {(busChangeRequests ?? []).length > 0 ? busChangeRequests.map(r => (
                    <div key={r?.id ?? Math.random()} className="p-3 bg-gray-50 rounded-lg border mb-3 text-sm">
                      <div className="flex justify-between flex-wrap gap-2">
                        <span>{r?.studentName ?? 'N/A'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${r?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {r?.status ?? 'N/A'}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Bus: {r?.oldBus ?? 'N/A'} → {r?.newBus ?? 'N/A'}
                      </div>
                      {r?.status === 'Pending' && (
                        <div className="mt-2 flex gap-2">
                          <button 
                            className="flex-1 p-1 bg-green-600 text-white rounded text-xs sm:text-sm"
                            onClick={() => handleApproveBusChange(r?.studentName, r?.oldBus, r?.newBus)}
                          >
                            Approve
                          </button>
                          <button className="flex-1 p-1 bg-red-600 text-white rounded text-xs sm:text-sm">Deny</button>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-3 text-gray-500 text-sm">No bus change requests</div>
                  )}
                  <button className="w-full py-2 bg-gray-100 rounded-lg text-sm">View All Requests</button>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-lg border">
                  <div className="flex items-center mb-4">
                    <FaBell className="text-blue-600 text-xl sm:text-2xl mr-2 sm:mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold">Recent Notifications</h3>
                  </div>
                  {(notifications ?? []).length > 0 ? notifications.slice(0, 3).map(n => (
                    <div key={n?.id ?? Math.random()} className="p-3 bg-gray-50 rounded-lg border mb-3 text-sm">
                      <div className="flex">
                        <FaBell className="text-blue-600 mr-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm">{n?.message ?? 'No message'}</p>
                          <p className="text-xs text-gray-500">{n?.time ?? 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-3 text-gray-500 text-sm">No notifications</div>
                  )}
                  <button className="w-full py-2 bg-gray-100 rounded-lg text-sm">View All Notifications</button>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-lg border">
                  <div className="flex items-center mb-4">
                    <FaBus className="text-blue-600 text-xl sm:text-2xl mr-2 sm:mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold">Bus Status</h3>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                    <div className="flex justify-between flex-wrap gap-2">
                      <span>Bus 5</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">On Route</span>
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-gray-600 flex items-center">
                      <FaUser className="mr-1" /> Driver: Michael Clark
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-gray-600 flex items-center">
                      <FaUsers className="mr-1" /> Students: 18/22
                    </div>
                    <button className="w-full mt-3 p-1 bg-blue-600 text-white rounded text-xs sm:text-sm">
                      Track Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTransportation;