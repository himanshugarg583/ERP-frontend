import React from 'react';

// Reusable Event Card Component
const Parent_EventCard = React.memo(({ title, date, description, badge, badgeColor }) => (
    <div className="p-3 bg-white rounded-lg shadow-sm hover:shadow transition-all">
        <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">{title}</h3>
            <span className={`text-xs ${badgeColor} px-2 py-0.5 rounded-full`}>{badge}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">{date}</p>
        <p className="text-sm">{description}</p>
    </div>
));

export default Parent_EventCard;