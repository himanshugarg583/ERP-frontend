import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminSidebar from './SuperAdminSidebar';
import { FaSchool, FaUsers, FaBuilding, FaTrash, FaChartBar,FaChartLine, FaUserShield, FaBellSlash, FaHistory,
  FaUsersCog, FaMoneyCheckAlt, FaMoneyBillWave} from 'react-icons/fa';

const SuperAdminDash = () => {
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Added new school', details: 'Westlake Academy was added.' },
    { id: 2, action: 'Updated subscription', details: 'Brighton International subscription updated.' },
  ]);
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');
  const [schools, setSchools] = useState([
    { name: 'Westlake Academy', status: 'Active', students: '456', revenue: '₹52,450' },
    { name: 'Hillcrest High', status: 'Active', students: '387', revenue: '₹41,200' },
    { name: 'Riverdale Elementary', status: 'Active', students: '512', revenue: '₹48,750' },
    { name: 'Oakridge Montessori', status: 'Inactive', students: '0', revenue: '₹0' },
  ]);
  const transactions = [
    { name: 'Westlake Academy', type: 'Monthly subscription', amount: '+₹4,250', date: 'Today', isIncome: true },
    { name: 'Server Maintenance', type: 'Cloud Infrastructure', amount: '-₹850', date: 'Mar 12, 2025', isIncome: false },
    { name: 'Hillcrest High', type: 'Monthly subscription', amount: '+₹3,750', date: 'Mar 10, 2025', isIncome: true },
  ];
  const reports = [
    { icon: <FaUserShield className="text-blue-600" />, text: 'Manage Admins', sub: 'Add, Remove, Update',link: '/SuperAdminDetails' },
    { icon: <FaChartBar className="text-blue-600" />, text: 'Student Performance', sub: 'Across All Schools' },
    { icon: <FaUsersCog className="text-purple-600" />, text: 'Teacher Efficiency', sub: 'Feedback & Metrics',link:'/SuperAdminAnalytics' },
    { icon: <FaMoneyCheckAlt className="text-green-600" />, text: 'Financial Reports', sub: 'Earnings & Deductions',link:'/SuperAdminFinancial' },
  ];
  const stats = [
    { label: 'Schools Managed', value: schools.length, icon: <FaSchool className="text-indigo-600 group-hover:text-indigo-800" />, growth: '+2 this month', bg: 'bg-indigo-200', hoverBg: 'hover:bg-indigo-100' },
    { label: 'Total Admins & Staff', value: '142', icon: <FaUsers className="text-teal-600 group-hover:text-teal-800" />, growth: '+5 this week', bg: 'bg-teal-200', hoverBg: 'hover:bg-teal-100' },
    { label: 'Total Students', value: '8,547', icon: <FaUsers className="text-orange-600 group-hover:text-orange-800" />, growth: '+120 this month', bg: 'bg-orange-200', hoverBg: 'hover:bg-orange-100' },
    { label: 'Total Revenue', value: '₹386,290', icon: <FaMoneyBillWave className="text-lime-600 group-hover:text-lime-800" />, growth: '+8.3% YoY', bg: 'bg-lime-200', hoverBg: 'hover:bg-lime-100' },
  ];
  const quickActions = [
    { icon: <FaSchool className="text-indigo-600" />, text: 'Add New School', sub: 'Register a new school', link: '/SuperAdminSchool' },
    { icon: <FaChartBar className="text-indigo-600" />, text: 'Generate Reports', sub: 'View analytics',link:'/SuperAdminReports' },
  ];
  const handleActionClick = (action) => {
    switch (action.text) {
      case 'Add New School':
        break;
      case 'Generate Reports':
        break;
      default:
        break;
    }
  };
  const handleReportClick = (item) =>{};
  const handleDeleteSchool = (schoolName) => {
    const updatedSchools = schools.filter(school => school.name !== schoolName);
    setSchools(updatedSchools);
    setRecentActivities(prev => [
      { id: prev.length + 1, action: 'Deleted school', details: `${schoolName} was removed.` },
      ...prev.slice(0, 4) 
    ]);
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <SuperAdminHeader />
        <div className="p-4 md:p-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SchoolsOverview
              schools={schools}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              onDelete={handleDeleteSchool}
            />
            <RecentTransactions transactions={transactions} />
          </section>
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardGrid title="Reports & Analytics" items={reports} onClick={handleReportClick} />
            <CardGrid title="Quick Actions" items={quickActions} onClick={handleActionClick} />
          </section>
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivities activities={recentActivities} />
          </section>
        </div>
      </main>
    </div>
  );
};
// Reusable Components
const StatCard = ({ label, value, icon, growth, bg, hoverBg }) => (
  <div className={`group bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border ${bg} ${hoverBg}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-2 text-gray-800">{value}</h3>
        <p className="text-xs text-gray-500">{growth}</p>
      </div>
      {icon}
    </div>
  </div>
);

const SchoolsOverview = ({ schools, timeFilter, setTimeFilter, onDelete }) => (
  <div className="lg:col-span-2 bg-white p-5 rounded-xl border shadow-sm">
    <div className="flex justify-between mb-6 items-center">
      <h3 className="font-semibold text-gray-800">Schools Overview</h3>
      <select
        className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-blue-200 transition-colors"
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
      >
        {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'].map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {['School Name', 'Status', 'Students', 'Revenue', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {schools.map((school) => (
            <tr key={school.name}>
              <td className="px-4 py-3">{school.name}</td>
              <td className="px-4 py-3">{school.status}</td>
              <td className="px-4 py-3">{school.students}</td>
              <td className="px-4 py-3">{school.revenue}</td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(school.name)} className="text-red-600 hover:text-red-800">
                  <FaTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-between text-sm">
      <span className="text-gray-600">Showing {schools.length} of {schools.length} schools</span>
      <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
        View All Schools →
      </button>
    </div>
  </div>
);

const RecentTransactions = ({ transactions }) => (
  <div className="bg-white p-5 rounded-xl border shadow-sm">
    <div className="flex justify-between mb-6 items-center">
      <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
      <button className="text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors">View All</button>
    </div>
    <div className="space-y-4">
      {transactions.map((txn, i) => (
        <div key={i} className={`flex justify-between ${txn.isIncome ? 'text-green-600' : 'text-red-600'}`}>
          <div>
            <h4 className="text-sm font-medium text-gray-800">{txn.name}</h4>
            <p className="text-gray-600 text-xs">{txn.type} - {txn.date}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">{txn.amount}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-800">This Month</h4>
          <p className="text-gray-600 text-xs">Mar 1 - Mar 19, 2025</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-800">₹42,530</p>
          <p className="text-xs text-green-600 flex items-center justify-end">
            <FaChartLine className="mr-0.5" />+12.5% from last month
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CardGrid = ({ title, items, onClick }) => (
  <div className="bg-white p-5 rounded-xl border shadow-sm">
    <h3 className="font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <GridItem key={i} item={item} onClick={() => onClick(item)} />
      ))}
    </div>
  </div>
);

const RecentActivities = ({ activities }) => (
  <div className="bg-white p-5 rounded-xl border shadow-sm">
    <div className="flex justify-between mb-6 items-center">
      <h3 className="font-semibold text-gray-800">Recent Activities</h3>
      <button className="text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors">View All</button>
    </div>
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex justify-between text-gray-600">
          <div>
            <h4 className="text-sm font-medium text-gray-800">{activity.action}</h4>
            <p className="text-gray-600 text-xs">{activity.details}</p>
          </div>
          <FaBuilding className="text-green-600" size={20} />
        </div>
      ))}
    </div>
  </div>
);

const GridItem = ({ item, onClick }) => (
  <div
    className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
    onClick={onClick}
  >
    {item.link ? (
      <Link to={item.link} className="flex items-center">
        <div className="mr-3">{item.icon}</div>
        <div>
          <h4 className="font-semibold text-gray-800">{item.text}</h4>
          <p className="text-sm text-gray-600">{item.sub}</p>
        </div>
      </Link>
    ) : (
      <div className="flex items-center">
        <div className="mr-3">{item.icon}</div>
        <div>
          <h4 className="font-semibold text-gray-800">{item.text}</h4>
          <p className="text-sm text-gray-600">{item.sub}</p>
        </div>
      </div>
    )}
  </div>
);

export default SuperAdminDash;