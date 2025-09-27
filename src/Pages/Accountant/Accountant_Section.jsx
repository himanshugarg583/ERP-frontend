import React from 'react';
import { FaExpand } from 'react-icons/fa';

const Accountant_Section = ({ title, icon: Icon, children, defaultOpen = false, bgColor = 'blue' }) => {
    const bgColors = {
        blue: 'bg-blue-50 hover:bg-blue-100',
        green: 'bg-green-50 hover:bg-green-100',
        red: 'bg-red-50 hover:bg-red-100',
        yellow: 'bg-yellow-50 hover:bg-yellow-100',
        purple: 'bg-purple-50 hover:bg-purple-100',
        teal: 'bg-teal-50 hover:bg-teal-100',
    };

    return (
        <details className="mb-6 bg-white rounded-lg shadow-md overflow-hidden group" open={defaultOpen}>
            <summary className={`flex justify-between items-center p-4 cursor-pointer ${bgColors[bgColor]} transition-all duration-300`}>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className={`text-${bgColor}-600 text-lg sm:text-xl`} />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">{title}</h2>
                </div>
                <FaExpand className="transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="p-4 sm:p-5">{children}</div>
        </details>
    );
};

export default Accountant_Section;