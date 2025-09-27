import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import Parent_Calendar from './Parent_Calendar';
import LeaveStatus from './LeaveStatus';
import Attendance from './Attendance';
import Parent_StatCard from './Parent_StatCard';
import Parent_TimetableSlot from './Parent_TimetableSlot';
import { FaClipboardCheck, FaMoneyBillWave, FaChartLine, FaBus, FaCreditCard, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';

// Constants for Timetable
const TIME_SLOTS = [
    "8:00 - 8:45", "8:45 - 9:30", "9:30 - 10:15", "10:15 - 10:30", "10:30 - 11:15", "11:15 - 12:00", "12:00 - 12:45", "12:45 - 1:30"
];

const TIMETABLE_DATA = [
    {
        day: 'Monday',
        timeSlots: [
            'Physics', 'Mathematics', 'Chemistry', 'Break', 'Mathematics', 'Physics Lab', 'English', 'Physics'
        ]
    },
    {
        day: 'Tuesday',
        timeSlots: [
            'Mathematics', 'Physics', 'Chemistry', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'
        ]
    },
    {
        day: 'Wednesday',
        timeSlots: [
            'Chemistry', 'Mathematics', 'Physics', 'Break', 'English', 'Physics', 'Mathematics', 'Chemistry'
        ]
    },
    {
        day: 'Thursday',
        timeSlots: [
            'Physics', 'Chemistry', 'Mathematics', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'
        ]
    },
    {
        day: 'Friday',
        timeSlots: [
            'Mathematics', 'Physics', 'Chemistry', 'Break', 'Physics Lab', 'English', 'Mathematics', 'Physics'
        ]
    },
    {
        day: 'Saturday',
        timeSlots: [
            'Chemistry', 'Mathematics', 'Physics', 'Break', 'Physical Education', 'Mathematics', '-', '-'
        ]
    }
];

const subjectColors = {
    Mathematics: 'bg-blue-100 text-blue-800',
    Physics: 'bg-green-100 text-green-800',
    Chemistry: 'bg-purple-100 text-purple-800',
    'English Literature': 'bg-pink-100 text-pink-800',
    'Physical Education': 'bg-red-100 text-red-800',
    Biology: 'bg-teal-100 text-teal-800',
    History: 'bg-orange-100 text-orange-800',
    'Computer Science': 'bg-indigo-100 text-indigo-800',
    Art: 'bg-yellow-100 text-yellow-800',
    Break: 'bg-gray-200 text-gray-800 font-bold'
};

// Static Data
const EVENTS = [
    { date: '2025-03-25', title: 'Parent-Teacher Meeting', description: 'Discuss student progress with teachers', type: 'meeting' },
    { date: '2025-03-29', title: 'Holi Celebration', description: 'School closed for Holi festival', type: 'event' },
    { date: '2025-04-15', title: 'Annual Day', description: 'Cultural performances by students', type: 'event' },
];

const FEE_SUMMARY = [
    { label: 'Term 2 Tuition', amount: '₹50,000' },
    { label: 'Term 1 Tuition', amount: '₹50,000' },
    { label: 'Lab Fees', amount: '₹5,000' },
    { label: 'Transport Fees', amount: '₹10,000' },
    { label: 'Extracurricular', amount: '₹3,000' },
];

// Main Dashboard Component
const ParentDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dropdown {
                0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-dropdown { animation: dropdown 0.25s ease-out forwards; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const getMonthEvents = useCallback(() => {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        return EVENTS.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year && eventDate >= today;
        });
    }, []);

    const openCalendarModal = useCallback(() => setIsCalendarModalOpen(true), []);

    const statCards = useMemo(() => [
        { title: 'Attendance', value: '92%', subtext: '2% from last month', icon: <FaClipboardCheck className="text-blue-500" />, iconBgColor: 'bg-blue-100', textColor: 'text-green-500' },
        { title: 'Fees Due', value: '₹15,000', subtext: 'Due in 7 days', icon: <FaMoneyBillWave className="text-red-500" />, iconBgColor: 'bg-red-100', textColor: 'text-red-500' },
        { title: 'Average Marks', value: '85%', subtext: 'Improved since last term', icon: <FaChartLine className="text-green-500" />, iconBgColor: 'bg-green-100', textColor: 'text-green-500' },
        { title: 'Upcoming Events', value: getMonthEvents().length, subtext: 'View calendar', icon: <MdEvent className="text-purple-500" />, iconBgColor: 'bg-purple-100', textColor: 'text-blue-500', onClick: openCalendarModal },
    ], [getMonthEvents, openCalendarModal]);

    const subjects = useMemo(() => ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'], []);

    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[today.getDay()];
    const todayTimetableData = TIMETABLE_DATA.find(item => item.day === currentDay)?.timeSlots || [];

    let teacherCount = 1; // Start counting teachers from 1
    const TODAY_TIMETABLE = todayTimetableData
        .map((subject, index) => {
            let teacher = null;
            if (subject === 'Break' || subject === '-') {
                teacher = null;
            } else {
                teacher = 'Teacher ' + teacherCount;
                teacherCount++;
            }
            return {
                time: TIME_SLOTS[index],
                subject: subject,
                teacher: teacher
            };
        })
        .filter(slot => slot.subject !== 'Break' && slot.subject !== '-');

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {statCards.map((card, index) => (
                                <Parent_StatCard
                                    key={index}
                                    title={card.title}
                                    value={card.value}
                                    subtext={card.subtext}
                                    icon={card.icon}
                                    iconBgColor={card.iconBgColor}
                                    textColor={card.textColor}
                                    onClick={card.onClick}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <LeaveStatus />
                            <Attendance />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg md:text-xl font-bold">Academic Progress</h3>
                                </div>
                                <div className="h-80 bg-gray-50 rounded-lg mb-4">
                                    <div className="p-4">
                                        {subjects.map((subject, index) => {
                                            const progressValue = Math.floor(Math.random() * 40) + 60;
                                            return (
                                                <div className="mb-6" key={index}>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium">{subject}</span>
                                                        <span className="text-sm font-medium">{progressValue}%</span>
                                                    </div>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={progressValue}
                                                        sx={{
                                                            height: 10,
                                                            borderRadius: 5,
                                                            backgroundColor: '#e5e7eb',
                                                            '& .MuiLinearProgress-bar': { backgroundColor: '#2563eb', borderRadius: 5 },
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg md:text-xl font-bold">Today's Timetable</h3>
                                    <button onClick={() => setIsTimetableModalOpen(true)} className="text-sm text-blue-500 hover:underline">
                                        View Full
                                    </button>
                                </div>
                                <div className="space-y-4 max-h-[340px] overflow-y-auto">
                                    {TODAY_TIMETABLE.map((slot, index) => (
                                        <Parent_TimetableSlot
                                            key={index}
                                            time={slot.time}
                                            subject={slot.subject}
                                            teacher={slot.teacher}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg md:text-xl font-bold">Upcoming Events</h3>
                                    <button onClick={openCalendarModal} className="text-sm text-blue-500 hover:underline">View Calendar</button>
                                </div>
                                <div className="space-y-4">
                                    {getMonthEvents().length > 0 ? (
                                        getMonthEvents().map((event, index) => (
                                            <div className="flex hover:bg-gray-200 transition-colors p-2 rounded-lg" key={index}>
                                                <div className="mr-4 flex flex-col items-center justify-center">
                                                    <div className="bg-blue-500 text-white text-sm font-bold rounded-t-lg w-12 text-center py-1">{event.date.split('-')[1]}</div>
                                                    <div className="bg-gray-100 w-12 h-12 flex items-center justify-center text-lg font-bold rounded-b-lg border border-gray-200">{event.date.split('-')[2]}</div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{event.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                                                    <div className="flex items-center mt-2">
                                                        <span className="material-symbols-outlined text-gray-400 text-sm mr-1">schedule</span>
                                                        <p className="text-xs text-gray-400">{event.time || 'All Day'}</p>
                                                        <span className="material-symbols-outlined text-gray-400 text-sm ml-3 mr-1">location_on</span>
                                                        <p className="text-xs text-gray-400">{event.location || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No upcoming events this month</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isTimetableModalOpen && (
                            <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
                                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[95vw] max-h-[80vh] overflow-y-auto relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-indigo-600" /> Timetable
                                        </h2>
                                        <button onClick={() => setIsTimetableModalOpen(false)} className="text-gray-600 hover:text-gray-900 text-2xl font-bold">✕</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-separate border-spacing-y-2 border-spacing-x-2 table-fixed">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                                                    <th className="px-4 py-3 text-left text-sm font-extrabold uppercase tracking-wider sticky left-0 z-10 bg-indigo-50 border-b border-gray-200 rounded-tl-lg">
                                                        Day
                                                    </th>
                                                    {TIME_SLOTS.map((time, index) => (
                                                        <th
                                                            key={index}
                                                            className={`px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider border-b border-gray-200 ${index === TIME_SLOTS.length - 1 ? 'rounded-tr-lg' : ''}`}
                                                        >
                                                            {time}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TIMETABLE_DATA.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                                        <td className="px-4 py-3 text-sm font-extrabold text-gray-800 sticky left-0 bg-white border-b border-gray-200 z-10">
                                                            {item.day}
                                                        </td>
                                                        {item.timeSlots.map((subject, slotIndex) => (
                                                            <td
                                                                key={slotIndex}
                                                                className={`px-4 py-3 text-sm text-center border-b border-gray-200 ${subjectColors[subject] || 'bg-gray-100 text-gray-800'} rounded-md`}
                                                            >
                                                                <span className="inline-block px-2 py-1 rounded-md">
                                                                    {subject}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Parent_Calendar isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} events={EVENTS} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg md:text-xl font-bold">Transport Status</h3>
                                    <Link to="/ParentTransport" className="text-sm text-blue-500 hover:underline">View Details</Link>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <FaBus className="text-yellow-500 mr-2" />
                                            <span className="font-medium">Bus #MH-04-1234</span>
                                        </div>
                                        <div>
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">On Route</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">15 minutes away</span></div>
                                                <div className="text-right"><span className="text-xs font-semibold inline-block text-blue-800">ETA: 3:30 PM</span></div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
                                                <div style={{ width: '60%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>School</span><span>Current Location</span><span>Home</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mb-3">
                                    <h4 className="font-medium">Driver Information</h4>
                                </div>
                                <div className="flex items-center mb-4">
                                    <img src="https://i.pravatar.cc/150?img=70" className="w-12 h-12 rounded-full mr-4" alt="Driver" />
                                    <div>
                                        <p className="font-medium">Ramesh Yadav</p>
                                        <p className="text-sm text-gray-500">8+ years experience</p>
                                        <div className="flex items-center mt-1">
                                            <span className="material-symbols-outlined text-gray-400 text-sm mr-1">call</span>
                                            <p className="text-xs text-blue-500">+91 98765 43210</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg md:text-xl font-bold">Fee Summary</h3>
                                    <Link to="/ParentFees" className="text-sm text-blue-500 hover:underline">View All</Link>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                    {FEE_SUMMARY.map((fee, index) => (
                                        <div className="flex justify-between mb-2" key={index}>
                                            <p className="text-gray-500">{fee.label}</p>
                                            <p className="font-medium">{fee.amount}</p>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-300 mt-3 pt-3">
                                        <div className="flex justify-between">
                                            <p className="font-bold">Total Due</p>
                                            <p className="font-bold">₹68,000</p>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <p className="text-gray-500 text-sm">Due Date</p>
                                            <p className="text-sm text-red-500">31 Mar 2025</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                                    <FaCreditCard className="mr-2" /> Pay Now
                                </button>
                                <div className="mt-4">
                                    <Link to="/ParentFees" className="text-sm text-blue-500 hover:underline">
                                        <summary className="font-medium flex items-center text-gray-600 hover:text-gray-900">
                                            <FaHistory className="mr-2" /> Payment History
                                        </summary>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentDashboard;