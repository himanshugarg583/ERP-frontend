import React from 'react';
import { LineChart } from '@mui/x-charts';

const Accountant_FeeCollectionSummary = () => {
    const lineData = {
        xAxis: [{
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            scaleType: 'band',
        }],
        series: [{
            label: 'Monthly Fee Collection',
            data: [120000, 130000, 115000, 140000, 135000, 145000, 150000, 155000, 160000, 165000, 170000, 175000],
            color: '#6366f1',
            area: true,
            curve: 'linear',
            showMark: false,
        }],
    };

    const average = Math.round(lineData.series[0].data.reduce((a, b) => a + b) / 12 / 1000);
    const peak = Math.max(...lineData.series[0].data) / 1000;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg font-semibold mb-3">Fee Collection Summary</h2>
            <div className="h-[200px] w-full">
                <LineChart
                    xAxis={lineData.xAxis}
                    series={lineData.series}
                    height={200}
                    margin={{ top: 20, bottom: 30, left: 50, right: 20 }}
                    grid={{ vertical: true, horizontal: true }}
                    sx={{
                        '& .MuiLineElement-root': { strokeWidth: 2 },
                        '& .MuiAreaElement-root': { fillOpacity: 0.3 },
                    }}
                    yAxis={[{ valueFormatter: (value) => `₹${(value / 1000)}k` }]}
                    tooltip={{
                        trigger: 'axis',
                        itemContent: ({ itemData }) => (
                            <div style={{ padding: '5px 10px' }}>
                                <div>{itemData?.xAxisValue}</div>
                                <div>Amount: ₹{itemData?.series?.data[itemData.dataIndex]?.toLocaleString()}</div>
                            </div>
                        ),
                    }}
                />
            </div>
            <div className="text-sm text-gray-600 mt-2">
                <span>Avg: ₹{average}k | </span>
                <span>Peak: ₹{peak}k</span>
            </div>
        </div>
    );
};

export default Accountant_FeeCollectionSummary;