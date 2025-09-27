import React from 'react';

const Accountant_Navigation = ({ activeSection, onClick, items }) => (
    <div className="space-y-4">
        <h3 className="font-medium text-lg border-b border-gray-200 pb-2">Navigation</h3>
        <ul className="space-y-2">
            {(items ?? []).map(({ section, icon, label }) => (
                <li
                    key={section ?? ''}
                    className={`p-2 rounded-lg font-medium flex items-center cursor-pointer transition-colors duration-200 ${activeSection === section ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    onClick={() => onClick(section)}
                >
                    <span className="mr-3">{icon}</span>
                    {label ?? 'N/A'}
                </li>
            ))}
        </ul>
    </div>
);

export default Accountant_Navigation;