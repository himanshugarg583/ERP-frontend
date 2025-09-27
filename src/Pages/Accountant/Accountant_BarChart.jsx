import React from 'react';
import { BarChart as MuiBarChart } from '@mui/x-charts';

const Accountant_BarChart = ({
    height,
    series,
    xAxis,
    yAxis,
    layout = 'vertical',
    sx,
    slotProps,
    gradientIds = [],
}) => (
    <MuiBarChart
        height={height}
        series={series}
        xAxis={xAxis}
        yAxis={yAxis}
        layout={layout}
        sx={sx}
        slotProps={{
            ...slotProps,
            bar: {
                style: {
                    fill: (datum) => `url(#${datum.label.toLowerCase().replace(/\s+/g, '')}Gradient)`,
                },
            },
        }}
    >
        <defs>
            {gradientIds.map((id, idx) => (
                <linearGradient key={idx} id={`${id}Gradient`} x1="0" y1="0" x2={layout === 'horizontal' ? '1' : '0'} y2={layout === 'horizontal' ? '0' : '1'}>
                    <stop offset="0%" stopColor={series[idx]?.gradientStart || '#6b7280'} />
                    <stop offset="100%" stopColor={series[idx]?.color || '#4f46e5'} />
                </linearGradient>
            ))}
        </defs>
    </MuiBarChart>
);

export default Accountant_BarChart;