import React, { useState, useEffect } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaMoneyBillWave, FaExclamationCircle, FaWallet, FaChartPie, FaUsers, FaReceipt } from 'react-icons/fa';
import { LineChart, BarChart } from '@mui/x-charts';
import { getAccountantDashboardStats, getAccountantMonthlyCollection, getAccountantIncomeExpenseChart, getAccountantRecentPayments } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const FeeCollectionSummary = ({ chartData, year }) => {
    if (!chartData || chartData.length === 0) return null;

    const lineData = {
        xAxis: [{
            data: chartData.map(item => item.month),
            scaleType: 'band',
        }],
        series: [{
            label: `Monthly Fee Collection ${year}`,
            data: chartData.map(item => parseFloat(item.amount)),
            color: '#6366f1',
            area: true,
            curve: 'linear',
            showMark: true,
        }],
    };

    const total = chartData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const average = Math.round(total / 12);
    const peak = Math.max(...chartData.map(item => parseFloat(item.amount)));

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg font-semibold mb-3">Monthly Fee Collection ({year})</h2>
            <div className="h-[200px] w-full">
                <LineChart
                    xAxis={lineData.xAxis}
                    series={lineData.series}
                    height={200}
                    margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
                    grid={{ vertical: true, horizontal: true }}
                    sx={{
                        '& .MuiLineElement-root': { strokeWidth: 2 },
                        '& .MuiAreaElement-root': { fillOpacity: 0.3 },
                    }}
                    yAxis={[{ valueFormatter: (value) => `₹${(value / 1000).toFixed(0)}k` }]}
                />
            </div>
            <div className="text-sm text-gray-600 mt-2">
                <span>Avg: ₹{(average / 1000).toFixed(1)}k | </span>
                <span>Peak: ₹{(peak / 1000).toFixed(1)}k | </span>
                <span>Total: ₹{(total / 1000).toFixed(1)}k</span>
            </div>
        </div>
    );
};

const IncomeExpenseChart = ({ chartData, year }) => {
    if (!chartData || chartData.length === 0) return null;

    const barData = {
        xAxis: [{
            data: chartData.map(item => item.month),
            scaleType: 'band',
        }],
        series: [
            {
                label: 'Income',
                data: chartData.map(item => parseFloat(item.income)),
                color: '#10b981',
            },
            {
                label: 'Expense',
                data: chartData.map(item => parseFloat(item.expense)),
                color: '#ef4444',
            }
        ],
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg font-semibold mb-3">Income vs Expense ({year})</h2>
            <div className="h-[200px] w-full">
                <BarChart
                    xAxis={barData.xAxis}
                    series={barData.series}
                    height={200}
                    margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
                    grid={{ horizontal: true }}
                    yAxis={[{ valueFormatter: (value) => `₹${(value / 1000).toFixed(0)}k` }]}
                />
            </div>
            <div className="flex justify-between text-sm mt-3">
                <span className="text-green-600 font-medium">Income</span>
                <span className="text-red-600 font-medium">Expense</span>
            </div>
        </div>
    );
};

const AccountantDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [monthlyCollection, setMonthlyCollection] = useState(null);
    const [incomeExpense, setIncomeExpense] = useState(null);
    const [recentPayments, setRecentPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllDashboardData();
    }, []);

    const fetchAllDashboardData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, collectionRes, incomeExpenseRes, paymentsRes] = await Promise.all([
                getAccountantDashboardStats(),
                getAccountantMonthlyCollection(),
                getAccountantIncomeExpenseChart(),
                getAccountantRecentPayments(10)
            ]);

            if (statsRes?.success) {
                setDashboardStats(statsRes.data);
            }
            if (collectionRes?.success) {
                setMonthlyCollection(collectionRes.data);
            }
            if (incomeExpenseRes?.success) {
                setIncomeExpense(incomeExpenseRes.data);
            }
            if (paymentsRes?.success) {
                setRecentPayments(paymentsRes.data?.payments || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentMethodBadge = (method) => {
        const methodConfig = {
            online: { bg: 'bg-blue-100', text: 'text-blue-800' },
            cash: { bg: 'bg-green-100', text: 'text-green-800' },
            cheque: { bg: 'bg-purple-100', text: 'text-purple-800' },
            bank_transfer: { bg: 'bg-indigo-100', text: 'text-indigo-800' }
        };
        const config = methodConfig[method] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {method?.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Financial & Fee Management Portal</h1>

                        {/* Overview Cards */}
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="mt-4 text-gray-600">Loading dashboard...</p>
                            </div>
                        ) : dashboardStats ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <h2 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaMoneyBillWave className="mr-2" /> Fee Collection
                                        </h2>
                                        <p className="text-2xl font-bold">₹{parseFloat(dashboardStats.fee_collection?.today || 0).toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">This Month: ₹{parseFloat(dashboardStats.fee_collection?.this_month || 0).toLocaleString()} | This Year: ₹{parseFloat(dashboardStats.fee_collection?.this_year || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <h2 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaExclamationCircle className="mr-2" /> Pending Fees
                                        </h2>
                                        <p className="text-2xl font-bold">₹{parseFloat(dashboardStats.pending_fees?.total_amount || 0).toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">Overdue Count: {dashboardStats.pending_fees?.overdue_count || 0}</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <h2 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaUsers className="mr-2" /> Students with Fees
                                        </h2>
                                        <p className="text-2xl font-bold">{dashboardStats.students?.total_with_fees || 0}</p>
                                        <p className="text-sm text-gray-600">Total students assigned with fee structures</p>
                                    </div>
                                </div>

                                {/* Income/Expense & Payments Count */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <h2 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaWallet className="mr-2" /> Income & Expense
                                        </h2>
                                        <p className="text-sm text-gray-600">Monthly Income: <span className="font-bold text-green-600">₹{parseFloat(dashboardStats.income_expense?.monthly_income || 0).toLocaleString()}</span></p>
                                        <p className="text-sm text-gray-600">Monthly Expense: <span className="font-bold text-red-600">₹{parseFloat(dashboardStats.income_expense?.monthly_expense || 0).toLocaleString()}</span></p>
                                        <p className="text-sm text-gray-600 mt-2">Net: <span className="font-bold text-indigo-600">₹{parseFloat(dashboardStats.income_expense?.monthly_net || 0).toLocaleString()}</span></p>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <h2 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaChartPie className="mr-2" /> Payments Count
                                        </h2>
                                        <p className="text-sm text-gray-600">Today: <span className="font-bold text-blue-600">{dashboardStats.payments_count?.today || 0} payments</span></p>
                                        <p className="text-sm text-gray-600">This Month: <span className="font-bold text-indigo-600">{dashboardStats.payments_count?.this_month || 0} payments</span></p>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {/* Fee Collection Summary & Income Expense Chart */}
                        {monthlyCollection && incomeExpense && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <FeeCollectionSummary chartData={monthlyCollection.chart_data} year={monthlyCollection.year} />
                                <IncomeExpenseChart chartData={incomeExpense.chart_data} year={incomeExpense.year} />
                            </div>
                        )}

                        {/* Recent Payments Table */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-8 hover:shadow-lg transition-all duration-300">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FaReceipt className="mr-2 text-indigo-600" /> Recent Payments
                            </h2>
                            {recentPayments.length > 0 ? (
                                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Receipt #</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Class</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Method</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentPayments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">{payment.receipt_number}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        <div>{payment.student?.User?.name}</div>
                                                        <div className="text-xs text-gray-500">{payment.student?.User?.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {payment.student?.ClassSection?.class_name} - {payment.student?.ClassSection?.section_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="font-bold text-green-600">₹{parseFloat(payment.total_paid).toLocaleString()}</div>
                                                        {parseFloat(payment.late_fee_paid) > 0 && (
                                                            <div className="text-xs text-orange-600">Late Fee: ₹{parseFloat(payment.late_fee_paid).toLocaleString()}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{getPaymentMethodBadge(payment.payment_method)}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No recent payments found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountantDashboard;