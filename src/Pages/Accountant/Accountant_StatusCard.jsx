import React from 'react';

const Accountant_StatusCard = ({ icon, title, details, gradient }) => {
    return (
        <div className={`bg-gradient-to-r ${gradient} rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
                {icon} <span className="ml-2">{title}</span>
            </h2>
            {details.map((detail, index) => (
                <p key={index}>{detail}</p>
            ))}
        </div>
    );
};

export default Accountant_StatusCard;