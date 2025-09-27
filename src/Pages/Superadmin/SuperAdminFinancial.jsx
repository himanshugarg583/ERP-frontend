import React from 'react';
import { FaDownload, FaPrint, FaRegClock, FaEye, FaFileDownload } from 'react-icons/fa';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import SuperAdminHeader from './SuperAdminHeader'; // Imported Header
import SuperAdminSidebar from './SuperAdminSidebar'; // Imported Sidebar

const SuperAdminFinancial = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 220000, expenses: 180000 },
    { month: 'Feb', revenue: 240000, expenses: 170000 },
    { month: 'Mar', revenue: 190000, expenses: 160000 },
    { month: 'Apr', revenue: 220000, expenses: 150000 },
    { month: 'May', revenue: 260000, expenses: 140000 },
    { month: 'Jun', revenue: 240000, expenses: 170000 },
    { month: 'Jul', revenue: 250000, expenses: 180000 },
    { month: 'Aug', revenue: 230000, expenses: 160000 },
    { month: 'Sep', revenue: 220000, expenses: 150000 },
    { month: 'Oct', revenue: 230000, expenses: 145000 },
    { month: 'Nov', revenue: 240000, expenses: 160000 },
    { month: 'Dec', revenue: 310000, expenses: 195000 },
  ];

  const expenseData = [
    { category: 'Salaries', value: 65 },
    { category: 'Maintenance', value: 15 },
    { category: 'Utilities', value: 8 },
    { category: 'Supplies', value: 7 },
    { category: 'Miscellaneous', value: 5 },
  ];

  const profitLossData = [
    { month: 'Jan', profit: 40000, loss: 0 },
    { month: 'Feb', profit: 70000, loss: 0 },
    { month: 'Mar', profit: 30000, loss: 0 },
    { month: 'Apr', profit: 70000, loss: 0 },
    { month: 'May', profit: 120000, loss: 0 },
    { month: 'Jun', profit: 70000, loss: 0 },
    { month: 'Jul', profit: 70000, loss: 0 },
    { month: 'Aug', profit: 70000, loss: 0 },
    { month: 'Sep', profit: 70000, loss: 0 },
    { month: 'Oct', profit: 85000, loss: 0 },
    { month: 'Nov', profit: 80000, loss: 0 },
    { month: 'Dec', profit: 115000, loss: 0 },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <SuperAdminHeader />
        <div className="max-w-screen-xl mx-auto p-6 mt-16 bg-white rounded-xl shadow-lg">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Financial Reports</h1>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <select
                    defaultValue="Last 30 days"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5"
                  >
                    <option>Last 30 days</option>
                    <option>Last quarter</option>
                    <option>Last 6 months</option>
                    <option>This year</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                  <FaDownload className="mr-1" /> Export
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">
                  <FaPrint className="mr-1" /> Print
                </button>
              </div>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
                <FaRegClock className="mr-1" /> Auto-Schedule Reports
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue & Expenses</h3>
              <div className="h-[300px]">
                <BarChart
                  dataset={monthlyData}
                  xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                  series={[
                    { dataKey: 'revenue', label: 'Revenue', color: '#1976d2' },
                    { dataKey: 'expenses', label: 'Expenses', color: '#d32f2f' },
                  ]}
                  height={280}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
              <div className="h-[300px]">
                <PieChart
                  series={[
                    {
                      data: expenseData.map((item) => ({
                        id: item.category,
                        value: item.value,
                        label: item.category,
                      })),
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 0,
                      cornerRadius: 0,
                    },
                  ]}
                  height={280}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Profit & Loss Trend</h3>
            <div className="h-[300px]">
              <LineChart
                dataset={profitLossData}
                xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
                series={[
                  { dataKey: 'profit', label: 'Profit', color: '#388e3c' },
                  { dataKey: 'loss', label: 'Loss', color: '#f44336' },
                ]}
                height={280}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow mb-8 border border-gray-100">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-semibold">Schools Financial Overview</h3>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <input
                    type="text"
                    placeholder="Search schools..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Sort by: Name</option>
                  <option>Sort by: Revenue (High to Low)</option>
                  <option>Sort by: Revenue (Low to High)</option>
                  <option>Sort by: Profit (High to Low)</option>
                  <option>Sort by: Pending Fees (High to Low)</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Deducted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Meridian School', earnings: '₹ 8,45,000', expenses: '₹ 6,12,000', profit: '₹ 2,33,000', pending: '₹ 1,25,000', tax: '₹ 84,500' },
                    { name: 'Sunshine Central', earnings: '₹ 7,65,000', expenses: '₹ 5,81,000', profit: '₹ 1,84,000', pending: '₹ 95,500', tax: '₹ 76,500' },
                    { name: 'Global Institute', earnings: '₹ 8,75,000', expenses: '₹ 6,49,000', profit: '₹ 2,26,000', pending: '₹ 1,56,000', tax: '₹ 87,500' },
                  ].map((school, index) => (
                    <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">MS</div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{school.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{school.earnings}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{school.expenses}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{school.profit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{school.pending}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{school.tax}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FaEye />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaFileDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                <span className="material-icons mr-1">receipt</span> Generate Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: '#INV-2023-6745', school: 'Meridian School', date: 'Nov 15, 2023', amount: '₹ 85,000', mode: 'Net Banking', status: 'Paid' },
                    { id: '#INV-2023-6744', school: 'Sunshine Central', date: 'Nov 12, 2023', amount: '₹ 67,500', mode: 'Credit Card', status: 'Paid' },
                    { id: '#INV-2023-6743', school: 'Global Institute', date: 'Nov 10, 2023', amount: '₹ 92,000', mode: 'UPI', status: 'Pending' },
                  ].map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">MS</div>
                          <div className="ml-3 text-sm font-medium">{transaction.school}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.mode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FaEye />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaFileDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminFinancial;