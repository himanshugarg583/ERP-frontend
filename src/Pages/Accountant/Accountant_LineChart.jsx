import React from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts';

const Accountant_LineChart = ({ height, series, xAxis, yAxis, sx, slotProps, gradientId }) => (
    <MuiLineChart
        height={height}
        series={series}
        xAxis={xAxis}
        yAxis={yAxis}
        sx={sx}
        slotProps={slotProps}
    >
        <defs>
            <linearGradient id={`${gradientId}Gradient`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={series[0]?.gradientStart || '#f87171'} />
                <stop offset="100%" stopColor={series[0]?.color || '#ef4444'} />
            </linearGradient>
        </defs>
    </MuiLineChart>
);

export default Accountant_LineChart;