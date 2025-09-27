import React from 'react';

// Reusable Notification Component
const Parent_Notification = React.memo(({ type, title, message, time, icon, borderColor }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${borderColor}`}>
        <div className="flex">
            <div className="flex-shrink-0 mr-3">{icon}</div>
            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-gray-600">{message}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    </div>
));

export default Parent_Notification;