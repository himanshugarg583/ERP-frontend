import React from 'react';

const Accountant_OverviewCard = ({ icon, title, amount, subtext, buttonText, buttonColor }) => {
  return (
    <div className={`bg-gradient-to-r ${buttonColor} rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        {icon} <span className="ml-2">{title}</span>
      </h2>
      <p className="text-2xl font-bold">{amount}</p>
      <p className="text-sm text-gray-600">{subtext}</p>
      {buttonText && (
        <button className="mt-2 text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Accountant_OverviewCard;