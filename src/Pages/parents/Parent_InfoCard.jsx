import React from 'react';

// Reusable Info Card Component
const Parent_InfoCard = React.memo(({ title, value, className }) => (
    <div className={`mb-4 ${className}`}>
        <span className="text-gray-600 block mb-1">{title}</span>
        <span className="font-medium text-lg">{value}</span>
    </div>
));

export default Parent_InfoCard;