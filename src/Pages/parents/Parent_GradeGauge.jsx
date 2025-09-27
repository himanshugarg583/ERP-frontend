import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

// Helper function to determine grade based on percentage
const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

// Reusable GradeGauge Component
const Parent_GradeGauge = React.memo(({ percentage, label }) => (
    <div className="text-center">
        <div className="w-28 h-28">
            <Gauge
                value={percentage}
                valueMax={100}
                startAngle={-180}
                endAngle={180}
                innerRadius="70%"
                outerRadius="100%"
                sx={{
                    '& .MuiGauge-valueArc': { fill: '#3b82f6' },
                    '& .MuiGauge-referenceArc': { fill: '#e5e7eb' },
                }}
            />
        </div>
        <div className="mt-2">
            <span className="text-2xl font-bold">{getGradeFromPercentage(percentage)}</span>
            <p className="text-sm text-gray-600">{label}: {percentage}%</p>
        </div>
    </div>
));

export default Parent_GradeGauge;