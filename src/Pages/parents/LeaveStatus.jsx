import React from 'react';
import { FaExclamationCircle, FaMedkit } from 'react-icons/fa';

const LeaveStatus = () => {
    const leaves = [
        { type: 'Emergency Leave', date: '15 Mar 2025', status: 'Pending', icon: <FaExclamationCircle className="text-red-500" />, bgColor: 'bg-red-100' },
        { type: 'Medical Leave', date: '15 Mar 2025', status: 'Approved', icon: <FaMedkit className="text-blue-500" />, bgColor: 'bg-blue-100' },
        { type: 'Medical Leave', date: '16 Mar 2025', status: 'Declined', icon: <FaMedkit className="text-blue-500" />, bgColor: 'bg-blue-100' },
        { type: 'Fever', date: '16 Mar 2025', status: 'Approved', icon: <FaExclamationCircle className="text-red-500" />, bgColor: 'bg-red-100' },
    ];

    const statusColors = {
        Pending: 'bg-blue-500',
        Approved: 'bg-green-500',
        Declined: 'bg-red-500',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Leave Status</h2>
            </div>
            <div className="space-y-4">
                {leaves.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${leave.bgColor} flex items-center justify-center rounded-full`}>
                                {leave.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold">{leave.type}</h3>
                                <p className="text-sm text-gray-600">Date: {leave.date}</p>
                            </div>
                        </div>
                        <span className={`${statusColors[leave.status]} text-white text-sm px-2 py-1 rounded-full`}>
                            {leave.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveStatus;