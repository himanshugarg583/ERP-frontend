import React from 'react';
import { PieChart } from '@mui/x-charts';

const Accountant_PieChartCard = ({ title, data }) => (
    <div className="flex flex-col items-center justify-center">
        <h3 className="text-base sm:text-lg font-medium mb-4 text-teal-800">{title}</h3>
        <PieChart
            series={[
                {
                    data,
                    innerRadius: 20,
                    outerRadius: 60,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                },
            ]}
            width={220}
            height={160}
            sx={{ '& .MuiChartsLegend-root': { display: 'none' } }}
            slotProps={{
                legend: {
                    hidden: false,
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                },
            }}
            className="w-full sm:w-auto"
        />
        <div className="mt-4 text-center space-y-1 text-xs sm:text-sm">
            {data.map((item, idx) => (
                <p key={idx} className="text-gray-700">
                    {item.label}: ₹{item.value.toLocaleString()}
                </p>
            ))}
        </div>
    </div>
);

export default Accountant_PieChartCard;