import React from 'react';
import { MdExpandMore } from 'react-icons/md';

// Reusable Guideline Component
const Parent_Guideline = React.memo(({ title, icon, content }) => (
    <details className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
        <summary className="font-medium flex items-center justify-between">
            <span className="flex items-center">{icon} {title}</span>
            <MdExpandMore className="transform group-open:rotate-180 transition-transform duration-300" />
        </summary>
        <div className="pt-4 pl-8">{content}</div>
    </details>
));

export default Parent_Guideline;