import React from 'react';

const Accountant_ActionButton = ({ label, icon, onClick, bgColor }) => (
  <button
    onClick={onClick}
    className={`${bgColor} text-white py-2 px-4 rounded-md hover:${bgColor.replace('600', '700')} flex items-center justify-center`}
  >
    {icon} <span className="ml-2">{label}</span>
  </button>
);

export default Accountant_ActionButton;