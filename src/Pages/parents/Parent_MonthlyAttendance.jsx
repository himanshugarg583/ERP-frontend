import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

const Parent_MonthlyAttendance = () => {
    const presentDays = 16;
    const totalDays = 20; // Assuming 20 working days in a month
    const percentage = (presentDays / totalDays) * 100;

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg font-semibold mb-3">Monthly Attendance</h2>
            <div className="h-[120px] w-full flex items-center justify-center">
                <Gauge
                    value={percentage}
                    startAngle={-180} // Full circle starts at -180
                    endAngle={180}   // Full circle ends at 180
                    width={120}
                    height={120}
                    sx={{
                        '& .MuiGauge-valueArc': {
                            fill: '#6366f1', // Color for the gauge arc
                        },
                        '& .MuiGauge-referenceArc': {
                            fill: '#e5e7eb', // Background arc color
                        },
                        '& .MuiGauge-valueText': {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fill: '#6366f1', // Text color matching the arc
                        },
                    }}
                    text={({ value }) => `${Math.round(value)}%`}
                />
            </div>
            <div className="flex justify-between text-sm mt-3">
                <span>Present: {presentDays} days</span>
                <span>Absent: {totalDays - presentDays} days</span>
            </div>
        </div>
    );
};

export default Parent_MonthlyAttendance;