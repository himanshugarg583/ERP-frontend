import React from 'react';

// Reusable Holiday Card Component
const Parent_HolidayCard = React.memo(({ day, title, duration }) => (
    <div className="p-4 bg-white rounded-lg flex items-center shadow-sm hover:shadow-xl transition-all">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-blue-700">{day}</span>
        </div>
        <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-xs text-gray-500">{duration}</p>
        </div>
    </div>
));

export default Parent_HolidayCard;