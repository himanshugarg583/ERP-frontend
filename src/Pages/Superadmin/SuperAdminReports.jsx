import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaDownload, FaCalendarAlt, FaFileInvoice, FaMoneyCheckAlt, FaRegLightbulb, FaShippingFast, FaChevronDown } from 'react-icons/fa';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import { BarChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts";

const SuperAdminReports = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const revenueExpenseData = [
    { id: 0, value: 1245680, label: 'Revenue', color: '#3b82f6' },
    { id: 1, value: 832450, label: 'Expenses', color: '#ef4444' },
  ];
  const branchRevenueData = [
    { branch: 'Main Campus', revenue: 500000 },
    { branch: 'West Branch', revenue: 375000 },
    { branch: 'North Campus', revenue: 250000 },
    { branch: 'South Branch', revenue: 125000 },
  ];

  return (
    <div className="flex">
      <SuperAdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex-1">
        <SuperAdminHeader setIsSidebarOpen={setIsSidebarOpen} />

        <div className="p-6">
          
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <details className="group">
                <summary className="flex items-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-all duration-200">
                  <FaCalendarAlt className="mr-2" />
                  <span>2023-2024</span>
                  <FaChevronDown className="ml-2 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="absolute right-0 mt-2 w-35 bg-white rounded-md shadow-lg z-10 border">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">2023-2024</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">2021-2020</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">2019-2020</a>
                  </div>
                </div>
              </details>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
              <h3 className="text-gray-600 font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">₹{revenueExpenseData[0]?.value ?? 0}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="material-icons text-green-500 mr-1">trending_up</span>
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-2">vs last year</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200 shadow-sm">
              <h3 className="text-gray-600 font-medium">Total Expenses</h3>
              <p className="text-3xl font-bold mt-2">₹{revenueExpenseData[1]?.value ?? 0}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="material-icons text-red-500 mr-1">trending_up</span>
                <span className="text-red-500 font-medium">+8.3%</span>
                <span className="text-gray-500 ml-2">vs last year</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
              <h3 className="text-gray-600 font-medium">Net Profit</h3>
              <p className="text-3xl font-bold mt-2">₹{(revenueExpenseData[0]?.value ?? 0) - (revenueExpenseData[1]?.value ?? 0)}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="material-icons text-green-500 mr-1">trending_up</span>
                <span className="text-green-500 font-medium">+18.7%</span>
                <span className="text-gray-500 ml-2">vs last year</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-sm">
              <h3 className="text-gray-600 font-medium">Pending Fees</h3>
              <p className="text-3xl font-bold mt-2">₹{287500 ?? 0}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="material-icons text-red-500 mr-1">trending_down</span>
                <span className="text-red-500 font-medium">-5.3%</span>
                <span className="text-gray-500 ml-2">vs last year</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold">Revenue & Expenses Breakdown</h2>
              <PieChart
                series={[
                  {
                    data: revenueExpenseData,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 0,
                    cornerRadius: 0,
                  },
                ]}
                height={300}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
              />
            </div>
            <div className="bg-white p-5 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold">Branch-wise Revenue</h2>
              <BarChart
                xAxis={[{ scaleType: 'band', data: branchRevenueData.map(item => item.branch) }]}
                series={[{ 
                  data: branchRevenueData.map(item => item.revenue),
                  color: '#3b82f6',
                }]}
                height={300}
                margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors duration-200">
                  <span className="material-icons text-sm">search</span>
                </button>
                <button className="px-4 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors duration-200">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      icon: <FaFileInvoice className="mr-5 text-blue-500 bg-blue-50 p-1 rounded text-3xl" />,
                      title: "Fee Collection",
                      subtitle: "Rajesh Kumar",
                      date: "Jul 15, 2023",
                      branch: "Main Campus",
                      category: "Tuition Fee",
                      amount: "+ ₹42,500",
                      status: "Completed",
                      statusClass: "bg-green-100 text-green-800"
                    },
                    {
                      icon: <FaMoneyCheckAlt className="mr-5 text-red-500 bg-red-50 p-1 rounded text-3xl" />,
                      title: "Salary Payment",
                      subtitle: "Staff Payroll - July",
                      date: "Jul 10, 2023",
                      branch: "All Branches",
                      category: "Staff Salary",
                      amount: "- ₹4,85,000",
                      status: "Completed",
                      statusClass: "bg-green-100 text-green-800"
                    },
                    // Add more transactions as needed
                  ].map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {transaction.icon}
                          <div>
                            <div className="font-medium">{transaction.title}</div>
                            <div className="text-sm text-gray-500">{transaction.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{transaction.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium ${transaction.statusClass} rounded-full`}>{transaction.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;