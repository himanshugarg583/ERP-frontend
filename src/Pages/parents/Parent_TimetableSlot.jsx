import React from 'react';

// Reusable Timetable Slot Component
const Parent_TimetableSlot = React.memo(({ time, subject, teacher, index }) => (
    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 hover:border-blue-500 transition-colors">
        <p className="text-sm text-gray-500">{time}</p>
        <p className="font-medium">{subject}</p>
        <div className="flex items-center mt-2">
            <img
                src={`https://i.pravatar.cc/150?img=${index + 59}`}
                className="w-6 h-6 rounded-full mr-2"
                alt="Teacher"
            />
            <p className="text-sm">{teacher}</p>
        </div>
    </div>
));

export default Parent_TimetableSlot;