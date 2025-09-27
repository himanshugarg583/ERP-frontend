import React, { useState } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaDollarSign, FaFileUpload, FaUsers, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

const ExpenseOverview = () => {
    const [period, setPeriod] = useState('Monthly');

    const pieData = [
        { id: 0, value: period === 'Monthly' ? 500000 : 6000000, label: 'Budget', color: '#4caf50' },
        { id: 1, value: period === 'Monthly' ? 450000 : 5500000, label: 'Actual', color: '#f87171' },
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const expenses = [300000, 320000, 450000, 400000, 420000, 460000];
    const budget = [500000, 480000, 500000, 490000, 510000, 500000];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base md:text-lg font-semibold flex items-center">
                        <FaDollarSign className="mr-2 text-green-600" /> Budget vs Expense
                    </h2>
                    <select
                        value={period ?? 'Monthly'}
                        onChange={(e) => setPeriod(e.target.value ?? 'Monthly')}
                        className="p-1.5 border rounded-md text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    >
                        <option>Monthly</option>
                        <option>Yearly</option>
                    </select>
                </div>
                <div className="flex justify-center">
                    <PieChart
                        series={[{ data: pieData ?? [], innerRadius: 40, outerRadius: 80, paddingAngle: 2, cornerRadius: 4 }]}
                        width={300}
                        height={200}
                        slotProps={{ legend: { hidden: true } }}
                    />
                </div>
                <div className="flex justify-between text-sm mt-3 text-gray-700">
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#4caf50] mr-1"></span>
                        Budget: ₹{period === 'Monthly' ? '5,00,000' : '60,00,000'}
                    </span>
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#f87171] mr-1"></span>
                        Expense: ₹{period === 'Monthly' ? '4,50,000' : '55,00,000'}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h2 className="text-base md:text-lg font-semibold mb-3 flex items-center">
                    <FaDollarSign className="mr-2 text-indigo-600" /> Expense Trend
                </h2>
                <div className="flex justify-center">
                    <LineChart
                        xAxis={[{ data: months ?? [], scaleType: 'point' }]}
                        series={[
                            { data: expenses ?? [], label: 'Actual Expenses', color: '#f87171', curve: 'linear' },
                            { data: budget ?? [], label: 'Budget', color: '#4caf50', curve: 'linear' },
                        ]}
                        width={450}
                        height={200}
                        grid={{ horizontal: true, vertical: true }}
                        slotProps={{ legend: { hidden: true } }}
                    />
                </div>
                <div className="flex justify-between text-sm mt-3 text-gray-700">
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#4caf50] mr-1"></span>
                        Budget Trend
                    </span>
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#f87171] mr-1"></span>
                        Expense Trend
                    </span>
                </div>
            </div>
        </div>
    );
};

const AccountantExpenseManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({ isOpen: false, category: '', description: '' });

    const categories = [
        'Staff Salaries & Benefits',
        'Utility Bills',
        'Maintenance & Repairs',
        'Classroom & Office Supplies',
        'Transportation Costs',
        'Examination & Event Expenses',
        'Vendor Payments',
    ];

    const categoryDescriptions = {
        'Staff Salaries & Benefits': 'Includes salaries, bonuses, and benefits for teaching and non-teaching staff.',
        'Utility Bills': 'Covers electricity, water, internet, and other utility expenses.',
        'Maintenance & Repairs': 'Expenses for maintaining and repairing school infrastructure.',
        'Classroom & Office Supplies': 'Costs for stationery, teaching aids, and office equipment.',
        'Transportation Costs': 'Fuel, maintenance, and driver salaries for school buses.',
        'Examination & Event Expenses': 'Fees for exams, events, and extracurricular activities.',
        'Vendor Payments': 'Payments to external suppliers and service providers.',
    };

    const categoryPieData = [
        { id: 0, value: 1500000, label: 'Staff Salaries & Benefits', color: '#6366f1' },
        { id: 1, value: 200000, label: 'Utility Bills', color: '#f43f5e' },
        { id: 2, value: 150000, label: 'Maintenance & Repairs', color: '#f59e0b' },
        { id: 3, value: 100000, label: 'Classroom & Office Supplies', color: '#10b981' },
        { id: 4, value: 250000, label: 'Transportation Costs', color: '#3b82f6' },
        { id: 5, value: 120000, label: 'Examination & Event Expenses', color: '#8b5cf6' },
        { id: 6, value: 180000, label: 'Vendor Payments', color: '#ec4899' },
    ];

    const totalExpenses = (categoryPieData ?? []).reduce((sum, item) => sum + (item.value ?? 0), 0);

    const handleInfoClick = (category) => {
        setInfoModal({
            isOpen: true,
            category: category ?? '',
            description: categoryDescriptions[category] ?? 'No description available.',
        });
    };

    const closeModal = () => {
        setInfoModal({ isOpen: false, category: '', description: '' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-3 md:p-4 lg:p-6 h-full">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">
                            Expense Management Portal
                        </h1>

                        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
                            <ExpenseOverview />
                        </div>

                        <div className="grid grid-cols-1 mb-6 md:mb-8">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex flex-col items-center mb-4">
                                    <h2 className="text-xl md:text-2xl font-semibold flex items-center text-indigo-700">
                                        <FaDollarSign className="mr-2 text-indigo-600" /> Expense Distribution by Category
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">Total Expenses: ₹{(totalExpenses ?? 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex flex-col items-center md:flex-row md:justify-center gap-6">
                                    <div className="flex-shrink-0">
                                        <PieChart
                                            series={[
                                                {
                                                    data: categoryPieData ?? [],
                                                    innerRadius: 50,
                                                    outerRadius: 100,
                                                    paddingAngle: 0,
                                                    cornerRadius: 0,
                                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                                    faded: { innerRadius: 30, additionalRadius: -20 },
                                                },
                                            ]}
                                            width={300}
                                            height={200}
                                            slotProps={{ legend: { hidden: true } }}
                                        />
                                    </div>
                                    <div className="md:mt-0 mt-4">
                                        <ul className="space-y-1 text-[10px] md:text-xs">
                                            {(categoryPieData ?? []).map((item) => (
                                                <li key={item.id ?? ''} className="flex items-center">
                                                    <span
                                                        className="w-3 h-3 rounded-full mr-1"
                                                        style={{ backgroundColor: item.color ?? '#000000' }}
                                                    ></span>
                                                    <span className="text-gray-700">
                                                        {item.label ?? 'N/A'}: ₹{(item.value ?? 0).toLocaleString('en-IN')} (
                                                        {((item.value ?? 0) / (totalExpenses || 1) * 100).toFixed(1)}%)
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Expense Categories</h2>
                                <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                                    {(categories ?? []).map((cat) => (
                                        <li
                                            key={cat ?? ''}
                                            className="p-2 rounded-md flex items-center justify-between"
                                        >
                                            <span>{cat ?? 'N/A'}</span>
                                            <FaInfoCircle
                                                className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                                onClick={() => handleInfoClick(cat)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                                    <FaFileUpload className="mr-2" /> Add New Expense
                                </h2>
                                <form className="text-sm md:text-base">
                                    <div className="mb-2 md:mb-3">
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select className="w-full p-2 border rounded-md">
                                            {(categories ?? []).map((cat) => (
                                                <option key={cat ?? ''}>{cat ?? 'N/A'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2 md:mb-3">
                                        <label className="block text-sm font-medium mb-1">Amount</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="₹0"
                                        />
                                    </div>
                                    <div className="mb-2 md:mb-3">
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input type="date" className="w-full p-2 border rounded-md" />
                                    </div>
                                    <div className="mb-2 md:mb-3">
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea className="w-full p-2 border rounded-md" rows="2"></textarea>
                                    </div>
                                    <div className="mb-2 md:mb-3">
                                        <label className="block text-sm font-medium mb-1">Upload Invoice</label>
                                        <input type="file" className="w-full p-2 border rounded-md" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Vendor & Supplier Payments</h2>
                                <table className="min-w-full text-sm md:text-base">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 md:px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500">Vendor</th>
                                            <th className="px-2 md:px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                            <th className="px-2 md:px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-2 md:px-4 py-2 md:py-3">ABC Supplies</td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span>
                                            </td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">₹1,20,000</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-2 md:px-4 py-2 md:py-3">XYZ Utilities</td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
                                            </td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">₹50,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className="mt-2 md:mt-3 w-full bg-white border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50 transition-all">
                                    Download Receipts
                                </button>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                                    <FaUsers className="mr-2" /> Salary & Payroll Expenses
                                </h2>
                                <p className="text-sm md:text-base">Monthly Total: ₹15,00,000</p>
                                <table className="min-w-full mt-2 md:mt-3 text-sm md:text-base">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 md:px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500">Employee</th>
                                            <th className="px-2 md:px-4 py-1 md:py-2 text-left text-xs font-medium text-gray-500">Net Pay</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-2 md:px-4 py-2 md:py-3">John Doe</td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">₹3,00,000</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-2 md:px-4 py-2 md:py-3">Jane Smith</td>
                                            <td className="px-2 md:px-4 py-2 md:py-3">₹2,80,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {(infoModal.isOpen ?? false) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">{infoModal.category ?? 'N/A'}</h3>
                            <p className="text-sm text-gray-700 mb-4">{infoModal.description ?? 'N/A'}</p>
                            <button
                                onClick={closeModal}
                                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountantExpenseManagement;