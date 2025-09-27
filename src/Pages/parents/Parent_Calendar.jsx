import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaBell, FaFileAlt } from 'react-icons/fa';

const Parent_Calendar = ({ isOpen, onClose, events }) => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Default to current date

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const hasEvent = events.some(event => event.date === dateStr);

            days.push(
                <div
                    key={day}
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors
                        ${isToday ? 'bg-blue-500 text-white font-bold' : 'text-gray-800 hover:bg-gray-100'}
                        ${hasEvent && !isToday ? 'border-2 border-red-500' : ''}`}
                >
                    {day}
                    {hasEvent && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                </div>
            );
        }

        return days;
    };

    const getMonthEvents = () => {
        const today = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year && eventDate >= today;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-lg">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()))}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()))}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <FaChevronRight />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <div key={index} className="text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                    {renderCalendar()}
                </div>
                <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Upcoming Events</h4>
                    {getMonthEvents().length > 0 ? (
                        getMonthEvents().map((event, index) => (
                            <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className={`mr-2 ${event.type === 'meeting' ? 'text-purple-500' : 'text-blue-500'}`}>
                                    {event.type === 'meeting' ? <FaBell /> : <FaFileAlt />}
                                </span>
                                <div>
                                    <p className="text-sm font-medium">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.date} • {event.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500">No events this month</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Parent_Calendar;