import React from 'react';

const Accountant_ChartCard = ({ title, period, children, gradientFrom = 'white', gradientTo, borderColor = 'gray-100' }) => (
  <div
    className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-${borderColor}`}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title ?? 'Untitled'}</h2>
      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{period ?? 'N/A'}</span>
    </div>
    <div className="w-full flex flex-col">{children}</div>
  </div>
);

export default Accountant_ChartCard;