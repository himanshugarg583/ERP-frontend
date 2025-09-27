import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import Parent_Calendar from './Parent_Calendar';
import Parent_MonthlyAttendance from './Parent_MonthlyAttendance';
import Parent_YearlyAttendance from './Parent_YearlyAttendance';
import Parent_Card from './Parent_Card';
import Parent_TableRow from './Parent_TableRow';
import Parent_EventCard from './Parent_EventCard';
import Parent_HolidayCard from './Parent_HolidayCard';
import { FaExclamationCircle, FaCalendarAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';

// Static Data (can be replaced with API calls)
const EVENTS = [
    { date: '2023-05-25', title: 'Summer Vacation Start', description: 'School closed for summer', type: 'event' },
    { date: '2023-07-15', title: 'Summer Vacation End', description: 'School reopens', type: 'event' },
    { date: '2023-08-15', title: 'Independence Day', description: 'National holiday', type: 'event' },
    { date: '2023-09-02', title: "Teacher's Day", description: 'Celebration at school', type: 'event' },
    { date: '2023-09-10', title: 'Annual Sports Day', description: 'Mandatory attendance required', type: 'event' },
    { date: '2023-09-15', title: 'Parent-Teacher Meeting', description: 'Attendance progress discussion', type: 'meeting' },
    { date: '2023-09-22', title: 'Science Exhibition', description: 'Special attendance bonus', type: 'event' },
];

const LATE_EARLY_RECORDS = [
    { date: '15 Aug 2023', status: 'Late Arrival', time: '9:15 AM', comments: 'Traffic congestion', statusColor: 'bg-yellow-100 text-yellow-800' },
    { date: '10 Aug 2023', status: 'Early Leaving', time: '1:30 PM', comments: "Doctor's appointment", statusColor: 'bg-orange-100 text-orange-800' },
    { date: '5 Aug 2023', status: 'Late Arrival', time: '8:50 AM', comments: 'Bus delay', statusColor: 'bg-yellow-100 text-yellow-800' },
];

const HOLIDAY_CALENDAR = [
    { day: '25', title: 'Summer Vacation', duration: '25 May - 15 July, 2023' },
    { day: '15', title: 'Independence Day', duration: '15 August, 2023' },
    { day: '2', title: "Teacher's Day", duration: '2 September, 2023' },
];

const UPCOMING_EVENTS = [
    { title: 'Annual Sports Day', date: '10 September, 2023', description: 'Mandatory attendance required for all students.', badge: 'Important', badgeColor: 'bg-purple-100 text-purple-800' },
    { title: 'Parent-Teacher Meeting', date: '15 September, 2023', description: 'Attendance progress will be discussed.', badge: 'Mandatory', badgeColor: 'bg-purple-100 text-purple-800' },
    { title: 'Science Exhibition', date: '22 September, 2023', description: 'Special attendance bonus for participants.', badge: 'Optional', badgeColor: 'bg-green-100 text-green-800' },
];

const ParentAttendance = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added sidebar state
    const [currentAttendance] = useState(50); // Can be dynamic via API or props
    const isAboveThreshold = useMemo(() => currentAttendance >= 75, [currentAttendance]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const openCalendar = useCallback(() => setIsCalendarOpen(true), []);

    const dailyAttendance = useMemo(() => ({
        status: 'Present',
        arrival: '8:15 AM',
        departure: '3:30 PM',
    }), []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-auto lg:ml-64"> {/* Updated to lg:ml-64 */}
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Student Attendance Portal</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Daily Attendance Card */}
                            <Parent_Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-lg font-semibold mb-3">Daily Attendance</h2>
                                <div className="flex justify-between items-center mb-2">
                                    <span>Today's Status:</span>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">{dailyAttendance.status}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span>Arrival Time:</span>
                                    <span>{dailyAttendance.arrival}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Departure Time:</span>
                                    <span>{dailyAttendance.departure}</span>
                                </div>
                            </Parent_Card>

                            {/* Monthly Attendance Card */}
                            <Parent_MonthlyAttendance />

                            {/* Yearly Attendance Card */}
                            <Parent_YearlyAttendance />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Late Coming / Early Leaving Card */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-lg font-semibold mb-4">Late Coming / Early Leaving</h2>
                                <div className="overflow-auto max-h-[200px]">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {LATE_EARLY_RECORDS.map((record, index) => (
                                                <Parent_TableRow
                                                    key={index}
                                                    date={record.date}
                                                    status={record.status}
                                                    time={record.time}
                                                    comments={record.comments}
                                                    statusColor={record.statusColor}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Leave Application Card */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-lg font-semibold mb-4">Leave Application</h2>
                                <form>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Leave Type</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                                            <option>Sick Leave</option>
                                            <option>Casual Leave</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">From Date</label>
                                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">To Date</label>
                                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Reason</label>
                                        <textarea rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"></textarea>
                                    </div>
                                    <button type="button" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]">
                                        Submit Application
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Attendance Alert Card */}
                            <Parent_Card className={`${isAboveThreshold ? 'bg-green-50' : 'bg-red-50'}`}>
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaExclamationCircle className="mr-2" />
                                    Attendance Alert
                                </h2>
                                <div className="p-3 bg-white rounded-lg mb-3 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">Current Attendance</span>
                                        <span className="font-medium">{currentAttendance}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${isAboveThreshold ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${currentAttendance}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-3 text-sm">
                                        Minimum required attendance is 75%. Your child's attendance is currently at {currentAttendance}%.
                                        {isAboveThreshold
                                            ? ' Great job maintaining regular attendance!'
                                            : ' Please ensure regular attendance to meet the minimum requirement.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className={`w-full mt-2 bg-white border py-1.5 px-3 rounded-md hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${isAboveThreshold
                                        ? 'border-green-300 text-green-600 hover:bg-green-50 focus:ring-green-500'
                                        : 'border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-500'
                                        }`}
                                >
                                    View Detailed Report
                                </button>
                            </Parent_Card>

                            {/* Holiday Calendar Card */}
                            <Parent_Card className="bg-blue-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold flex items-center">
                                        <FaCalendarAlt className="mr-2" />
                                        Holiday Calendar
                                    </h2>
                                    <p onClick={openCalendar} className="text-blue-500 text-sm flex items-center cursor-pointer hover:underline">
                                        <MdEvent className="text-sm mr-1" />
                                        View calendar
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {HOLIDAY_CALENDAR.map((holiday, index) => (
                                        <Parent_HolidayCard key={index} day={holiday.day} title={holiday.title} duration={holiday.duration} />
                                    ))}
                                </div>
                            </Parent_Card>

                            {/* Upcoming Events Card */}
                            <Parent_Card className="bg-purple-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold flex items-center">
                                        <FaRegCalendarAlt className="mr-2" />
                                        Upcoming Events
                                    </h2>
                                    <p onClick={openCalendar} className="text-blue-500 text-sm flex items-center cursor-pointer hover:underline">
                                        <MdEvent className="text-sm mr-1" />
                                        View calendar
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {UPCOMING_EVENTS.map((event, index) => (
                                        <Parent_EventCard
                                            key={index}
                                            title={event.title}
                                            date={event.date}
                                            description={event.description}
                                            badge={event.badge}
                                            badgeColor={event.badgeColor}
                                        />
                                    ))}
                                </div>
                            </Parent_Card>
                        </div>

                        {/* Parent Calendar Modal */}
                        <Parent_Calendar isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} events={EVENTS} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentAttendance;