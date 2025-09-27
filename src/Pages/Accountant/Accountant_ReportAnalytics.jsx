import React, { useState } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_ChartCard from './Accountant_ChartCard';
import Accountant_BarChart from './Accountant_BarChart';
import Accountant_PieChart from './Accountant_PieChart';
import Accountant_LineChart from './Accountant_LineChart';
import Accountant_Summary from './Accountant_Summary';

const Reports = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const chartConfigs = [
        {
            title: 'Financial Overview',
            period: 'Yearly',
            gradientTo: 'blue-50',
            chart: (
                <Accountant_BarChart
                    height={300}
                    series={[
                        { data: [44000, 55000, 41000, 67000, 22000, 43000, 21000, 49000, 35000, 56000, 54000, 60000], label: 'Revenue', stack: 'total', color: '#4f46e5', gradientStart: '#6b7280' },
                        { data: [23000, 36000, 30000, 37000, 15000, 25000, 16000, 29000, 28000, 31000, 32000, 35000], label: 'Expenses', stack: 'total', color: '#ef4444', gradientStart: '#f87171' },
                        { data: [21000, 19000, 11000, 30000, 7000, 18000, 5000, 20000, 7000, 25000, 22000, 25000], label: 'Net Profit/Loss', stack: 'total', color: '#10b981', gradientStart: '#34d399' }
                    ]}
                    xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], label: 'Month', tickLabelStyle: { fontSize: 12, fill: '#6b7280', fontWeight: 500 } }]}
                    yAxis={[{ label: 'Amount (₹)', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600, transform: 'translate(-40px, 0)' }, valueFormatter: v => `₹${v.toLocaleString()}`, min: 0, max: 150000, tickSize: 5, tickLabelStyle: { fontSize: 12, fill: '#6b7280', transform: 'translateX(-10px)' } }]}
                    sx={{ '& .MuiChartsLegend-root': { marginBottom: '12px' }, '& .MuiBarElement-root': { rx: 0, ry: 0, strokeWidth: 1, stroke: '#ffffff' }, '& .MuiChartsAxis-left': { marginRight: '20px' }, padding: '0 20px' }}
                    slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' }, padding: 0, itemMarkWidth: 14, itemMarkHeight: 14, labelStyle: { fontSize: 12, fill: '#374151', fontWeight: 500 } } }}
                    gradientIds={['revenue', 'expenses', 'netprofitloss']}
                />
            ),
            summary: [{ label: 'Total Revenue', value: '₹5,58,000', color: 'text-indigo-600' }, { label: 'Total Expenses', value: '₹3,36,000', color: 'text-red-600' }, { label: 'Net Profit', value: '₹2,22,000', color: 'text-green-600' }]
        },
        {
            title: 'Fee Collection Reports',
            period: 'Current Term',
            gradientTo: 'orange-50',
            chart: (
                <div className="flex flex-col items-center justify-center">
                    <Accountant_PieChart
                        series={[{ data: [{ label: 'Fees Collected', value: 75, color: '#4f46e5', gradientStart: '#6b7280' }, { label: 'Pending Fees', value: 25, color: '#f97316', gradientStart: '#fb923c' }], innerRadius: 50, outerRadius: 100, highlightScope: { faded: 'global', highlighted: 'item' }, faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' } }]}
                        width={380}
                        height={250}
                        slotProps={{ legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' }, padding: { left: 20 }, itemMarkWidth: 12, itemMarkHeight: 12, markGap: 8, labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 500, maxWidth: 150, whiteSpace: 'normal' } } }}
                        sx={{ '& .MuiPieArc-root': { stroke: '#ffffff', strokeWidth: 1 }, '& .MuiChartsLegend-root': { marginLeft: '20px' } }}
                        gradientIds={['collected', 'pending']}
                    />
                </div>
            ),
            summary: [{ label: 'Total Fees', value: '₹25,50,000', color: 'text-gray-800' }, { label: 'Collected', value: '₹19,12,500 (75%)', color: 'text-indigo-600' }, { label: 'Pending', value: '₹6,37,500 (25%)', color: 'text-orange-600' }]
        },
        {
            title: 'Salary & Payroll Reports',
            period: 'Monthly',
            gradientTo: 'green-50',
            chart: (
                <Accountant_BarChart
                    height={280}
                    series={[
                        { data: [95000, 75000, 85000, 45000, 35000], label: 'Basic Salary', color: '#4f46e5', gradientStart: '#6b7280' },
                        { data: [15000, 12000, 14000, 8000, 6000], label: 'Deductions', color: '#ef4444', gradientStart: '#f87171' },
                        { data: [20000, 15000, 18000, 10000, 7000], label: 'Bonuses', color: '#10b981', gradientStart: '#34d399' }
                    ]}
                    xAxis={[{ scaleType: 'band', data: ['Teaching', 'Admin', 'IT', 'Security', 'Support'], label: 'Department', tickLabelStyle: { fontSize: 12, fill: '#6b7280', fontWeight: 500 } }]}
                    yAxis={[{ label: 'Salary Amount (₹)', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600, transform: 'translate(-40px, 0)' }, valueFormatter: v => `₹${v.toLocaleString()}`, min: 0, max: 120000, tickSize: 5, tickLabelStyle: { fontSize: 12, fill: '#6b7280', transform: 'translateX(-10px)' } }]}
                    sx={{ '& .MuiChartsLegend-root': { marginBottom: '12px' }, '& .MuiBarElement-root': { rx: 0, ry: 0, strokeWidth: 1, stroke: '#ffffff' }, '& .MuiChartsAxis-left': { marginRight: '20px' }, padding: '0 20px' }}
                    slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' }, padding: 0, itemMarkWidth: 14, itemMarkHeight: 14, labelStyle: { fontSize: 12, fill: '#374151', fontWeight: 500 } } }}
                    gradientIds={['basicsalary', 'deductions', 'bonuses']}
                />
            ),
            summary: [{ label: 'Total Salary', value: '₹3,55,000', color: 'text-indigo-600' }, { label: 'Deductions', value: '₹55,000', color: 'text-red-600' }, { label: 'Bonuses', value: '₹70,000', color: 'text-green-600', hidden: true }]
        },
        {
            title: 'Expense & Budget Reports',
            period: 'Yearly',
            gradientTo: 'red-50',
            chart: (
                <Accountant_LineChart
                    height={300}
                    series={[{ data: [23000, 36000, 30000, 37000, 15000, 25000, 16000, 29000, 28000, 31000, 32000, 35000], label: 'Total Expenses', color: '#ef4444', gradientStart: '#f87171', curve: 'natural', showMark: true, markSize: 6 }]}
                    xAxis={[{ scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], label: 'Months', tickLabelStyle: { fontSize: 12, fill: '#6b7280', fontWeight: 500 } }]}
                    yAxis={[{ label: 'Expense Amount (₹)', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600, transform: 'translate(-20px, -150px) rotate(-90deg)' }, valueFormatter: v => `₹${v.toLocaleString()}`, min: 0, max: 40000, tickSize: 5, tickLabelStyle: { fontSize: 12, fill: '#6b7280', transform: 'translateX(-10px)' } }]}
                    sx={{ '& .MuiLineElement-root': { strokeWidth: 3, stroke: 'url(#totalexpensesGradient)' }, '& .MuiMarkElement-root': { fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1 }, '& .MuiChartsAxis-left': { marginRight: '20px' }, '& .MuiChartsLegend-root': { marginBottom: '12px' }, padding: '0 30px' }}
                    slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' }, padding: 0, itemMarkWidth: 14, itemMarkHeight: 14, labelStyle: { fontSize: 12, fill: '#374151', fontWeight: 500 } } }}
                    gradientId="totalexpenses"
                />
            ),
            summary: [{ label: 'Total Expenses', value: '₹3,36,000', color: 'text-red-600' }, { label: 'Avg. Monthly', value: '₹28,000', color: 'text-gray-800' }, { label: 'Peak Month', value: 'Apr (₹37,000)', color: 'text-red-800' }]
        },
        {
            title: 'Vendor & Supplier Payment Reports',
            period: 'Yearly',
            gradientTo: 'purple-50',
            chart: (
                <Accountant_BarChart
                    layout="horizontal"
                    height={320}
                    series={[{ data: [50000, 35000, 45000, 20000, 30000], label: 'Payments', color: '#8b5cf6', gradientStart: '#a78bfa' }]}
                    yAxis={[{ scaleType: 'band', data: ['Books', 'IT', 'Transport', 'Security', 'Maintenance'], label: 'Vendor Names', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600, transform: 'translate(-50px, -160px) rotate(-90deg)' }, tickLabelStyle: { fontSize: 12, fill: '#6b7280', fontWeight: 500, angle: 0, textAnchor: 'end', dominantBaseline: 'middle' } }]}
                    xAxis={[{ label: 'Payment Amount (₹)', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600 }, valueFormatter: v => `₹${v.toLocaleString()}`, min: 0, max: 60000, tickSize: 5, tickLabelStyle: { fontSize: 12, fill: '#6b7280', transform: 'translateY(5px)' } }]}
                    sx={{ '& .MuiBarElement-root': { rx: 6, ry: 6, strokeWidth: 1, stroke: '#ffffff' }, '& .MuiChartsAxis-bottom': { marginTop: '20px' }, '& .MuiChartsAxis-left': { marginRight: '80px' }, '& .MuiChartsLegend-root': { marginBottom: '12px' }, padding: '0 30px' }}
                    slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' }, padding: 0, itemMarkWidth: 14, itemMarkHeight: 14, labelStyle: { fontSize: 12, fill: '#374151', fontWeight: 500 } } }}
                    gradientIds={['payments']}
                />
            ),
            summary: [{ label: 'Total Payments', value: '₹1,80,000', color: 'text-purple-600' }, { label: 'Avg. Payment', value: '₹36,000', color: 'text-gray-800' }, { label: 'Highest', value: 'Books (₹50,000)', color: 'text-purple-800' }]
        },
        {
            title: 'Transport & Hostel Fee Reports',
            period: 'Current Term',
            gradientTo: 'teal-50',
            chart: (
                <Accountant_BarChart
                    height={300}
                    series={[{ data: [45000, 38000, 52000, 30000, 42000], label: 'Collected Fees', color: '#14b8a6', gradientStart: '#5eead4' }]}
                    xAxis={[{ scaleType: 'band', data: ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'], label: 'Transport Routes', tickLabelStyle: { fontSize: 12, fill: '#6b7280', fontWeight: 500 } }]}
                    yAxis={[{ label: 'Collected Fees (₹)', labelStyle: { fontSize: 14, fill: '#374151', fontWeight: 600, transform: 'translate(-40px, -150px) rotate(-90deg)' }, valueFormatter: v => `₹${v.toLocaleString()}`, min: 0, max: 60000, tickSize: 5, tickLabelStyle: { fontSize: 12, fill: '#6b7280', transform: 'translateX(-10px)' } }]}
                    sx={{ '& .MuiBarElement-root': { rx: 0, ry: 0, strokeWidth: 1, stroke: '#ffffff' }, '& .MuiChartsAxis-left': { marginRight: '20px' }, '& .MuiChartsLegend-root': { marginBottom: '12px' }, padding: '0 30px' }}
                    slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' }, padding: 0, itemMarkWidth: 14, itemMarkHeight: 14, labelStyle: { fontSize: 12, fill: '#374151', fontWeight: 500 } } }}
                    gradientIds={['collectedfees']}
                />
            ),
            summary: [{ label: 'Total Collected', value: '₹2,07,000', color: 'text-teal-600' }, { label: 'Avg. per Route', value: '₹41,400', color: 'text-gray-800' }, { label: 'Highest', value: 'Route C (₹52,000)', color: 'text-teal-800' }]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="bg-white p-6 font-sans">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-center text-gray-800">Reports & Analytics</h1>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chartConfigs.map((config, i) => (
                            <Accountant_ChartCard key={i} title={config.title} period={config.period} gradientTo={config.gradientTo}>
                                {config.chart}
                                <Accountant_Summary items={config.summary} />
                            </Accountant_ChartCard>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;