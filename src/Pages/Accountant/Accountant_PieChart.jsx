import React from 'react';
import { PieChart as MuiPieChart } from '@mui/x-charts';

const Accountant_PieChart = ({ series, width, height, slotProps, sx, gradientIds = [] }) => (
    <MuiPieChart
        series={series}
        width={width}
        height={height}
        slotProps={slotProps}
        sx={sx}
    >
        <defs>
            {gradientIds.map((id, idx) => (
                <linearGradient key={idx} id={`${id}Gradient`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={series[0].data[idx]?.gradientStart || '#6b7280'} />
                    <stop offset="100%" stopColor={series[0].data[idx]?.color || '#4f46e5'} />
                </linearGradient>
            ))}
        </defs>
    </MuiPieChart>
);

export default Accountant_PieChart;