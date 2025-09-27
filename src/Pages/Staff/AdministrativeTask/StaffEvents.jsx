import React, { useState } from 'react';
import { 
  RiCalendar2Line,
  RiAddCircleLine,
  RiTeamLine,
  RiMoneyDollarCircleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiTaskLine
} from 'react-icons/ri';
import StaffSidebar from '../StaffSidebar';
import StaffHeader from '../StaffHeader';

const StaffEvents = () => {
  const EXCHANGE_RATE = 83; // 1 USD = 83 INR

  const [events, setEvents] = useState([
    { id: 1, title: 'Teacher Orientation', date: '2025-08-15', category: 'Professional Development', budget: 800, participants: 25, status: 'Upcoming', type: 'event' },
    { id: 2, title: 'Science Fair Prep', date: '2025-09-10', category: 'Student Activities', budget: 1200, participants: 15, status: 'Upcoming', type: 'event' },
    { id: 3, title: 'Parent-Teacher Conference', date: '2025-10-05', category: 'Community Engagement', budget: 300, participants: 30, status: 'Upcoming', type: 'event' },
    { id: 4, title: 'Summer Vacation', date: '2025-06-01', endDate: '2025-08-14', category: 'Holiday', budget: 0, participants: 0, status: 'Upcoming', type: 'holiday', reason: 'Summer Vacation' },
    { id: 5, title: 'Diwali Celebration', date: '2025-11-01', category: 'School Celebrations', budget: 500, participants: 0, status: 'Upcoming', type: 'festival', reason: 'Diwali' },
    { id: 6, title: 'Winter Vacation', date: '2025-12-20', endDate: '2026-01-05', category: 'Holiday', budget: 0, participants: 0, status: 'Upcoming', type: 'holiday', reason: 'Winter Vacation' },
    { id: 7, title: 'Christmas', date: '2025-12-25', category: 'Holiday', budget: 0, participants: 0, status: 'Upcoming', type: 'holiday', reason: 'Christmas' },
    { id: 8, title: 'Holi Celebration', date: '2025-03-14', category: 'School Celebrations', budget: 400, participants: 0, status: 'Upcoming', type: 'festival', reason: 'Holi' },
    { id: 9, title: 'Independence Day', date: '2025-07-04', category: 'Holiday', budget: 0, participants: 0, status: 'Upcoming', type: 'holiday', reason: 'Independence Day' },
  ]);

  const [staff] = useState([
    { id: 'STF-001', name: 'Alice Thompson', department: 'Mathematics', role: 'Teacher' },
    { id: 'STF-002', name: 'Robert Hayes', department: 'Science', role: 'Teacher' },
    { id: 'STF-003', name: 'Linda Patel', department: 'English', role: 'Teacher' },
    { id: 'STF-004', name: 'Mark Evans', department: 'Physical Education', role: 'Coach' },
    { id: 'STF-005', name: 'Susan Kim', department: 'Administration', role: 'Principal' },
    { id: 'STF-006', name: 'James Carter', department: 'Library', role: 'Librarian' },
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', endDate: '', category: '', budget: 0, organizers: '', type: 'event', reason: '' });
  const [attendance, setAttendance] = useState({});
  const [tasks, setTasks] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvents = events.slice();
    newEvents.push({
      ...newEvent,
      id: events.length + 1,
      participants: newEvent.type === 'event' ? 0 : 0,
      status: 'Upcoming',
      reason: newEvent.type === 'holiday' || newEvent.type === 'festival' ? newEvent.reason : ''
    });
    setEvents(newEvents);
    setNewEvent({ title: '', date: '', endDate: '', category: '', budget: 0, organizers: '', type: 'event', reason: '' });
  };

  const handleDeleteEvent = (id) => {
    const newEvents = [];
    for (let i = 0; i < events.length; i++) {
      if (events[i].id !== id) newEvents.push(events[i]);
    }
    setEvents(newEvents);
    setAttendance({ ...attendance });
    setTasks({ ...tasks });
  };

  const markAttendance = (eventId, staffId, present) => {
    const newAttendance = { ...attendance };
    if (!newAttendance[eventId]) newAttendance[eventId] = {};
    newAttendance[eventId][staffId] = present;
    setAttendance(newAttendance);
  };

  const assignTask = (eventId, task) => {
    const newTasks = { ...tasks };
    if (!newTasks[eventId]) newTasks[eventId] = [];
    newTasks[eventId].push(task);
    setTasks(newTasks);
  };

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let isHoliday = false, isFestival = false, isStaffEvent = false;
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event.endDate) {
          const d = new Date(dateStr);
          const s = new Date(event.date);
          const e = new Date(event.endDate);
          if (d >= s && d <= e) {
            if (event.type === 'holiday') isHoliday = true;
            if (event.type === 'festival') isFestival = true;
            if (event.type === 'event') isStaffEvent = true;
          }
        } else if (event.date === dateStr) {
          if (event.type === 'holiday') isHoliday = true;
          if (event.type === 'festival') isFestival = true;
          if (event.type === 'event') isStaffEvent = true;
        }
      }
      const hasEvent = isHoliday || isFestival || isStaffEvent;

      days.push(
        <div
          key={day}
          className={`p-3 text-center cursor-pointer rounded-full relative transition-all duration-200 transform hover:scale-110 ${
            isHoliday ? 'bg-red-300 text-red-900 font-bold' :
            isFestival ? 'bg-yellow-300 text-yellow-900 font-bold' :
            isStaffEvent ? 'bg-indigo-300 text-indigo-900 font-bold' :
            'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setCurrentDate(new Date(year, month, day))}
        >
          {day}
          {hasEvent && (
            <div className="text-xs mt-1 font-semibold">
              {isHoliday && <span className="text-red-700">Holiday</span>}
              {isFestival && <span className="text-yellow-700">Festival</span>}
              {isStaffEvent && <span className="text-indigo-700">Event</span>}
            </div>
          )}
        </div>
      );

      if ((firstDay + day) % 7 === 0 || day === totalDays) {
        weeks.push(<div key={`week-${day}`} className="grid grid-cols-7 gap-2">{days}</div>);
        days = [];
      }
    }

    return weeks;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex overflow-x-hidden font-sans">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffHeader />
        <div className="p-8 space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <RiCalendar2Line className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">Upcoming Events</p>
              <p className="text-2xl font-bold">{events.filter(e => e.status === 'Upcoming' && e.type === 'event').length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <RiTeamLine className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">Staff Participation</p>
              <p className="text-2xl font-bold">{Math.round((events.reduce((sum, e) => sum + (e.type === 'event' ? Object.values(attendance[e.id] || {}).filter(s => s).length : 0), 0) / (staff.length * events.filter(e => e.type === 'event').length)) * 100) || 0}%</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <RiMoneyDollarCircleLine className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">Total Budget</p>
              <p className="text-2xl font-bold">₹{(events.reduce((sum, e) => sum + e.budget, 0) * EXCHANGE_RATE).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
              <RiTaskLine className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">Pending Tasks</p>
              <p className="text-2xl font-bold">{Object.values(tasks).flat().length}</p>
            </div>
          </div>

          {/* Event Creation and Calendar */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 border-t-4 border-indigo-500">
              <h2 className="text-2xl font-extrabold text-indigo-700 mb-6">Schedule New Event</h2>
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Title (e.g., Sports Day)" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                <input type="date" value={newEvent.endDate} onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all">
                  <option value="">Select Category</option>
                  <option value="Professional Development">Professional Development</option>
                  <option value="Student Activities">Student Activities</option>
                  <option value="Community Engagement">Community Engagement</option>
                  <option value="School Celebrations">School Celebrations</option>
                  <option value="Faculty Meetings">Faculty Meetings</option>
                  <option value="Holiday">Holiday</option>
                </select>
                <input type="number" placeholder="Budget in USD (e.g., 500)" value={newEvent.budget} onChange={(e) => setNewEvent({ ...newEvent, budget: parseInt(e.target.value) || 0 })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                <input type="text" placeholder="Organizers (e.g., Ms. Kim)" value={newEvent.organizers} onChange={(e) => setNewEvent({ ...newEvent, organizers: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all">
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                  <option value="festival">Festival</option>
                </select>
                {(newEvent.type === 'holiday' || newEvent.type === 'festival') && (
                  <input type="text" placeholder="Reason (e.g., Christmas)" value={newEvent.reason} onChange={(e) => setNewEvent({ ...newEvent, reason: e.target.value })} className="border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all" />
                )}
                <button type="submit" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 flex items-center justify-center transition-all duration-300 shadow-md">
                  <RiAddCircleLine className="mr-2 h-5 w-5" /> Schedule Event
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 border-t-4 border-purple-500">
              <h2 className="text-2xl font-extrabold text-purple-700 mb-6">School Calendar</h2>
              <div className="max-w-full">
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => changeMonth(-1)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300">Previous</button>
                  <h3 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={() => changeMonth(1)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300">Next</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-800 mb-4 bg-gray-100 p-2 rounded-lg">
                  <div className="p-2">Sun</div>
                  <div className="p-2">Mon</div>
                  <div className="p-2">Tue</div>
                  <div className="p-2">Wed</div>
                  <div className="p-2">Thu</div>
                  <div className="p-2">Fri</div>
                  <div className="p-2">Sat</div>
                </div>
                {renderCalendar()}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800">Details for {currentDate.toDateString()}:</h3>
                  <ul className="mt-2 space-y-2">
                    {events.map(event => {
                      const d = new Date(currentDate.toISOString().split('T')[0]);
                      const s = new Date(event.date);
                      const e = event.endDate ? new Date(event.endDate) : s;
                      if ((event.endDate && d >= s && d <= e) || (!event.endDate && s.toDateString() === currentDate.toDateString())) {
                        return (
                          <li key={event.id} className={`p-3 rounded-lg shadow-md text-sm font-medium ${event.type === 'holiday' ? 'bg-red-100 text-red-800' : event.type === 'festival' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {event.title} {event.reason && ` - ${event.reason}`} {event.type === 'event' && ` (Event)`}
                            {event.budget > 0 && ` - Budget: ₹${(event.budget * EXCHANGE_RATE).toLocaleString('en-IN')}`}
                            {event.organizers && ` - Organizers: ${event.organizers}`}
                            {event.endDate && ` (${new Date(event.date).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()})`}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Event Management */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500">
            <h2 className="text-3xl font-extrabold text-teal-700 mb-8">Manage Events</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-teal-100">
                  <tr>
                    {['Title', 'Start Date', 'End Date', 'Category', 'Budget (₹)', 'Participants', 'Type', 'Reason', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-teal-800 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-teal-50 transition-all duration-200`}>
                      <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-gray-700">{event.date}</td>
                      <td className="px-6 py-4 text-gray-700">{event.endDate || '-'}</td>
                      <td className="px-6 py-4 text-gray-700">{event.category}</td>
                      <td className="px-6 py-4 text-gray-700">₹{(event.budget * EXCHANGE_RATE).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-gray-700">{event.type === 'event' ? Object.values(attendance[event.id] || {}).filter(s => s).length : '-'}</td>
                      <td className="px-6 py-4 text-gray-700 capitalize">{event.type}</td>
                      <td className="px-6 py-4 text-gray-700">{event.reason || '-'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-800 transform hover:scale-110 transition-all duration-200"><RiEditLine size={24} /></button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"><RiDeleteBinLine size={24} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Tracking */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
            <h2 className="text-3xl font-extrabold text-green-700 mb-8">Staff Attendance</h2>
            {events.filter(e => e.type === 'event').map(event => (
              <div key={event.id} className="mb-10">
                <h3 className="font-bold text-xl text-gray-900 mb-4">{event.title} <span className="text-gray-500 text-lg">({event.date})</span></h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-green-100">
                      <tr>
                        {['Staff ID', 'Name', 'Department', 'Role', 'Attendance'].map(header => (
                          <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((staffMember, index) => (
                        <tr key={staffMember.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition-all duration-200`}>
                          <td className="px-6 py-4 text-gray-900">{staffMember.id}</td>
                          <td className="px-6 py-4 text-gray-900">{staffMember.name}</td>
                          <td className="px-6 py-4 text-gray-700">{staffMember.department}</td>
                          <td className="px-6 py-4 text-gray-700">{staffMember.role}</td>
                          <td className="px-6 py-4 flex gap-4">
                            <button onClick={() => markAttendance(event.id, staffMember.id, true)} className={`px-4 py-2 rounded-lg text-white font-semibold ${attendance[event.id]?.[staffMember.id] === true ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} transition-all duration-200 shadow-md`}>
                              <RiCheckLine className="inline mr-2" /> Present
                            </button>
                            <button onClick={() => markAttendance(event.id, staffMember.id, false)} className={`px-4 py-2 rounded-lg text-white font-semibold ${attendance[event.id]?.[staffMember.id] === false ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'} transition-all duration-200 shadow-md`}>
                              Absent
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-gray-600 font-semibold">
                  Total Present: <span className="text-green-600">{Object.values(attendance[event.id] || {}).filter(s => s).length}</span> / {staff.length}
                </p>
              </div>
            ))}
          </div>

          {/* Task Assignment */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-orange-500">
            <h2 className="text-2xl font-extrabold text-orange-700 mb-6">Task Assignment</h2>
            {events.filter(e => e.type === 'event').map(event => (
              <div key={event.id} className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{event.title}</h3>
                <input
                  type="text"
                  placeholder="Add Task (e.g., Arrange Chairs)"
                  className="border-2 border-gray-300 p-3 rounded-lg w-full focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      assignTask(event.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <ul className="mt-3 space-y-2">
                  {tasks[event.id]?.map((task, index) => (
                    <li key={index} className="flex items-center text-gray-800 bg-orange-100 p-3 rounded-lg shadow-sm text-sm font-medium">
                      <RiTaskLine className="mr-2 text-orange-600 h-5 w-5" /> {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffEvents;