import React, { useState } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaMoneyBillWave, FaExclamationCircle, FaCalendarAlt, FaWallet, FaChartPie } from 'react-icons/fa';
import { LineChart, PieChart } from '@mui/x-charts';

const FeeCollectionSummary = () => {
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

const ExpenseBreakdown = () => {
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

const AccountantDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Financial & Fee Management Portal</h1>

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaMoneyBillWave className="mr-2" /> Total Fees Collected
                                </h2>
                                <p className="text-2xl font-bold">₹1,75,000</p>
                                <p className="text-sm text-gray-600">This Month: ₹1,75,000 | This Year: ₹18,50,000</p>
                            </div>
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaExclamationCircle className="mr-2" /> Pending Fees
                                </h2>
                                <p className="text-2xl font-bold">₹45,000</p>
                                <p className="text-sm text-gray-600">Due by: 15 Mar 2025</p>
                                <button className="mt-2 text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">Send Reminder</button>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaCalendarAlt className="mr-2" /> Upcoming Payments
                                </h2>
                                <p className="text-2xl font-bold">₹30,000</p>
                                <p className="text-sm text-gray-600">Next 7 Days: ₹10,000 | Next 30 Days: ₹20,000</p>
                            </div>
                        </div>

                        {/* Fee Collection Summary & Expense Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <FeeCollectionSummary />
                            <ExpenseBreakdown />
                        </div>

                        {/* Pending Dues & Defaulters List */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-8 hover:shadow-lg transition-all duration-300">
                            <h2 className="text-lg font-semibold mb-4">Pending Dues & Defaulters</h2>
                            <div className="overflow-auto max-h-[200px]">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">John Doe</td>
                                            <td className="px-4 py-3 text-sm">₹15,000</td>
                                            <td className="px-4 py-3 text-sm">10 Mar 2025</td>
                                            <td className="px-4 py-3 text-sm">
                                                <button className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors">Send Reminder</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">Jane Smith</td>
                                            <td className="px-4 py-3 text-sm">₹10,000</td>
                                            <td className="px-4 py-3 text-sm">12 Mar 2025</td>
                                            <td className="px-4 py-3 text-sm">
                                                <button className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors">Send Reminder</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Salary & Payroll Status + Online Payment Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaWallet className="mr-2" /> Salary & Payroll Status
                                </h2>
                                <p>Staff Salary Paid: ₹4,50,000</p>
                                <p>Pending: ₹50,000</p>
                                <p className="text-sm text-gray-600 mt-2">Next Payroll: 15 Mar 2025</p>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <FaChartPie className="mr-2" /> Online Payment Status
                                </h2>
                                <p>Successful: 150 (₹1,50,000)</p>
                                <p>Failed/Pending: 5 (₹5,000)</p>
                                <p>Refunds: 2 (₹2,000)</p>
                            </div>
                        </div>

                        {/* Notifications & Alerts */}
                        <div className="bg-red-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-8">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <FaExclamationCircle className="mr-2" /> Notifications & Alerts
                            </h2>
                            <ul className="space-y-2 text-sm">
                                <li>Fee Due: ₹10,000 by 12 Mar 2025</li>
                                <li>Low Balance Warning: ₹50,000 remaining</li>
                                <li>Recent Payment: ₹5,000 received on 10 Mar 2025</li>
                            </ul>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountantDashboard;