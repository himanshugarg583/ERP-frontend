import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

const Parent_YearlyAttendance = () => {
    const presentDays = 153;
    const totalDays = 180; // Assuming 180 working days in a year
    const percentage = (presentDays / totalDays) * 100;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg font-semibold mb-3">Yearly Attendance</h2>
            <div className="h-[120px] w-full flex items-center justify-center">
                <Gauge
                    value={percentage}
                    startAngle={-180} // Full circle starts at -180
                    endAngle={180}   // Full circle ends at 180
                    width={120}
                    height={120}
                    sx={{
                        '& .MuiGauge-valueArc': {
                            fill: '#FFA500', // Color for the gauge arc
                        },
                        '& .MuiGauge-referenceArc': {
                            fill: '#e5e7eb', // Background arc color
                        },
                        '& .MuiGauge-valueText': {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fill: '#FFA500', // Text color matching the arc
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

export default Parent_YearlyAttendance;