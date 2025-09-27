import React from 'react';
import { PieChart } from '@mui/x-charts';

const Accountant_ExpenseBreakdown = () => {
  const pieData = [
    { label: 'Salaries', value: 500000, color: '#6366f1' },
    { label: 'Maintenance', value: 200000, color: '#f87171' },
    { label: 'Bills', value: 150000, color: '#fbbf24' },
    { label: 'Others', value: 100000, color: '#34d399' },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-lg font-semibold mb-3">Expense Breakdown</h2>
      <div className="h-[150px] w-full flex items-center justify-center">
        <PieChart
          series={[{ data: pieData, innerRadius: 30, outerRadius: 60, paddingAngle: 2, cornerRadius: 5 }]}
          height={150}
          legend={{ hidden: true }}
        />
      </div>
      <div className="flex justify-between text-sm mt-3">
        <span>Salaries: ₹5L</span>
        <span>Maintenance: ₹2L</span>
      </div>
    </div>
  );
};

export default Accountant_ExpenseBreakdown;