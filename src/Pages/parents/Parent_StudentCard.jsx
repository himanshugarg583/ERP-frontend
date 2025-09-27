import React from 'react';
import { FaUser } from 'react-icons/fa';

// Reusable Student Card Component
const Parent_StudentCard = React.memo(({ name, classInfo, relation, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-${color.split('-')[1]}-600`}>
                    <FaUser />
                </div>
                <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-gray-600">{classInfo}</p>
                </div>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {relation}
            </div>
        </div>
    </div>
));

export default Parent_StudentCard;