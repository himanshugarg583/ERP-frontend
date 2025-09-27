import React from 'react';

const Accountant_Card = ({ title, icon, children, defaultOpen = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <details open={defaultOpen}>
            <summary className="text-xl font-semibold mb-4 flex items-center cursor-pointer">
                {icon} <span className="ml-2">{title}</span>
            </summary>
            {children}
        </details>
    </div>
);

export default Accountant_Card;