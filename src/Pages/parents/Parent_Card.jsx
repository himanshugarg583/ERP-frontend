import React from 'react';

// Reusable Card Component
const Parent_Card = React.memo(({ children, className }) => (
    <div className={`rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
        {children}
    </div>
));

export default Parent_Card;