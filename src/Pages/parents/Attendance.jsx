import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronDown, FaExclamationCircle } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts';

const Attendance = () => {
    const [selectedMonth, setSelectedMonth] = useState('This Month');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([
        { id: 0, value: 22, label: 'Present', color: '#28a745' },
        { id: 1, value: 3, label: 'Absent', color: '#dc3545' },
    ]);

    const months = ['This Month', 'Last Month', 'Next Month'];

    const updateAttendanceData = (month) => {
        switch (month) {
            case 'This Month':
                setAttendanceData([
                    { id: 0, value: 22, label: 'Present', color: '#28a745' },
                    { id: 1, value: 3, label: 'Absent', color: '#dc3545' },
                ]);
                break;
            case 'Last Month':
                setAttendanceData([
                    { id: 0, value: 20, label: 'Present', color: '#28a745' },
                    { id: 1, value: 5, label: 'Absent', color: '#dc3545' },
                ]);
                break;
            case 'Next Month':
                setAttendanceData([
                    { id: 0, value: 25, label: 'Present', color: '#28a745' },
                    { id: 1, value: 0, label: 'Absent', color: '#dc3545' },
                ]);
                break;
            default:
                break;
        }
    };

    const today = new Date('2025-03-17');
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last7Days.push({
            day: date.toLocaleString('en-US', { weekday: 'short' }).charAt(0),
            date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            isoDate: date.toISOString().split('T')[0],
        });
    }

    const attendanceRecord = {
        '2025-03-11': 'Present',
        '2025-03-12': 'Absent',
        '2025-03-13': 'Present',
        '2025-03-14': 'Present',
        '2025-03-15': 'Absent',
        '2025-03-16': 'Present',
        '2025-03-17': 'Present',
    };

    const getDayColor = (isoDate) => {
        if (new Date(isoDate) > today) {
            return 'bg-gray-300';
        } else {
            const status = attendanceRecord[isoDate] || 'Absent';
            return status === 'Present' ? 'bg-green-500' : 'bg-red-500';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Attendance</h1>
                <div className="relative">
                    <button
                        className="flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <FaCalendarAlt />
                        <span>{selectedMonth}</span>
                        <FaChevronDown />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {months.map((month) => (
                                <div
                                    key={month}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedMonth(month);
                                        setIsDropdownOpen(false);
                                        updateAttendanceData(month);
                                    }}
                                >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-4">
                <p className="text-gray-600">
                    <FaExclamationCircle className="mr-2 inline" />
                    No of total working days
                    <span className="font-bold"> 25 Days</span>
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                    <p className="text-gray-600">Present</p>
                    <p className="text-2xl font-bold">{attendanceData[0].value}</p>
                </div>
                <div>
                    <p className="text-gray-600">Absent</p>
                    <p className="text-2xl font-bold">{attendanceData[1].value}</p>
                </div>
                <div>
                    <p className="text-gray-600">Halfday</p>
                    <p className="text-2xl font-bold">0</p>
                </div>
            </div>
            <div className="h-[150px] w-full flex items-center justify-center mb-6">
                <PieChart
                    series={[
                        {
                            data: attendanceData,
                            innerRadius: 30,
                            outerRadius: 60,
                            paddingAngle: 0,
                            cornerRadius: 0,
                        },
                    ]}
                    width={200}
                    height={200}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                />
            </div>
            <div className="text-center mb-6">
                <p className="text-green-500 inline-block mx-2">■ Present</p>
                <p className="text-red-500 inline-block mx-2">■ Absent</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold">Last 7 Days</p>
                    <p className="text-gray-600">
                        {last7Days[0].date} - {last7Days[6].date}
                    </p>
                </div>
                <div className="flex justify-center space-x-2">
                    {last7Days.map((day, index) => (
                        <div
                            key={index}
                            className={`w-8 h-8 flex items-center justify-center rounded text-white ${getDayColor(day.isoDate)}`}
                        >
                            {day.day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Attendance;