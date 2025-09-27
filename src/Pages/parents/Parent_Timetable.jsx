import React, { useState } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import { FaCalendarAlt } from 'react-icons/fa';

// Constants for better maintainability
const TIME_SLOTS = [
    "8:00 - 8:45", "8:45 - 9:30", "9:30 - 10:15", "10:15 - 10:30", "10:30 - 11:15", "11:15 - 12:00", "12:00 - 12:45", "12:45 - 1:30"
];

const TIMETABLE_DATA = [
    { day: 'Monday', timeSlots: ['Physics', 'Mathematics', 'Chemistry', 'Break', 'Mathematics', 'Physics Lab', 'English', 'Physics'] },
    { day: 'Tuesday', timeSlots: ['Mathematics', 'Physics', 'Chemistry', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'] },
    { day: 'Wednesday', timeSlots: ['Chemistry', 'Mathematics', 'Physics', 'Break', 'English', 'Physics', 'Mathematics', 'Chemistry'] },
    { day: 'Thursday', timeSlots: ['Physics', 'Chemistry', 'Mathematics', 'Break', 'Chemistry Lab', 'Mathematics', 'English', 'Physics'] },
    { day: 'Friday', timeSlots: ['Mathematics', 'Physics', 'Chemistry', 'Break', 'Physics Lab', 'English', 'Mathematics', 'Physics'] },
    { day: 'Saturday', timeSlots: ['Chemistry', 'Mathematics', 'Physics', 'Break', 'Physical Education', 'Mathematics', '-', '-'] },
];

const subjectColors = {
    Mathematics: 'bg-blue-100 text-blue-800',
    Physics: 'bg-green-100 text-green-800',
    Chemistry: 'bg-purple-100 text-purple-800',
    'English': 'bg-pink-100 text-pink-800',
    'Physical Education': 'bg-red-100 text-red-800',
    Biology: 'bg-teal-100 text-teal-800',
    History: 'bg-orange-100 text-orange-800',
    'Computer Science': 'bg-indigo-100 text-indigo-800',
    Art: 'bg-yellow-100 text-yellow-800',
    Break: 'bg-gray-200 text-gray-800 font-bold',
    'Physics Lab': 'bg-green-200 text-green-900',
    'Chemistry Lab': 'bg-purple-200 text-purple-900',
    '-': 'bg-gray-100 text-gray-600'
};

const ParentTimeTable = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center">
                                <FaCalendarAlt className="mr-2 text-indigo-600 text-lg sm:text-xl" /> Timetable
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-1 sm:border-spacing-y-2 border-spacing-x-1 sm:border-spacing-x-2 table-auto">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider sticky left-0 z-10 bg-indigo-50 border-b border-gray-200 rounded-tl-lg min-w-[80px] sm:min-w-[100px]">
                                                Day
                                            </th>
                                            {TIME_SLOTS.map((time, index) => (
                                                <th
                                                    key={index}
                                                    className={`px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b border-gray-200 ${index === TIME_SLOTS.length - 1 ? 'rounded-tr-lg' : ''} min-w-[100px] sm:min-w-[120px]`}
                                                >
                                                    {time}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIMETABLE_DATA.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-extrabold text-gray-800 sticky left-0 bg-white border-b border-gray-200 z-10 min-w-[80px] sm:min-w-[100px]">
                                                    {item.day}
                                                </td>
                                                {item.timeSlots.map((subject, slotIndex) => (
                                                    <td
                                                        key={slotIndex}
                                                        className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center border-b border-gray-200 ${subjectColors[subject] || 'bg-gray-100 text-gray-800'} rounded-md min-w-[100px] sm:min-w-[120px]`}
                                                    >
                                                        <span className="inline-block px-1 sm:px-2 py-1 rounded-md">
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
                </main>
            </div>
        </div>
    );
};

export default ParentTimeTable;