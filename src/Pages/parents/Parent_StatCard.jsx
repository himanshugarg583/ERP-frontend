import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

// Reusable Stat Card Component
const Parent_StatCard = React.memo(({ title, value, subtext, icon, iconBgColor, textColor, onClick }) => (
    <div
        className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className={`${textColor} text-sm flex items-center`}>
                    {title === 'Attendance' || title === 'Average Marks' ? <FaArrowUp className="text-sm mr-1" /> : null}
                    {subtext}
                </p>
            </div>
            <div className={`${iconBgColor} p-3 rounded-full`}>{icon}</div>
        </div>
    </div>
));

export default Parent_StatCard;