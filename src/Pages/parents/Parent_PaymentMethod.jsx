import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

// Reusable Payment Method Component
const Parent_PaymentMethod = React.memo(({ icon, title, children }) => (
    <details className="group bg-gray-50 rounded-lg">
        <summary className="flex items-center justify-between cursor-pointer p-4">
            <div className="flex items-center">
                {icon}
                <span>{title}</span>
            </div>
            <FaChevronDown className="group-open:rotate-180 transition-transform duration-200" />
        </summary>
        <div className="p-4 border-t">{children}</div>
    </details>
));

export default Parent_PaymentMethod;