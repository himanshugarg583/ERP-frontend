import React from 'react';

const Accountant_Summary = ({ items }) => (
    <div className="mt-4 text-center text-sm text-gray-600 flex justify-center gap-4">
        {items.map((item, idx) => (
            <p key={idx} className={item.hidden ? 'hidden' : ''}>
                {item.label}: <span className={`font-semibold ${item.color}`}>{item.value}</span>
            </p>
        ))}
    </div>
);

export default Accountant_Summary;