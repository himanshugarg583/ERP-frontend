import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';
import { FaBook, FaBookReader, FaUsers, FaCalendarTimes, FaBars } from 'react-icons/fa';

const STATS = [
  { title: 'Total Books', value: '2,543', icon: <FaBook />, color: 'blue', trend: 'up', percent: '12' },
  { title: 'Books Borrowed', value: '485', icon: <FaBookReader />, color: 'purple', trend: 'flat', percent: '0' },
  { title: 'Online Readers', value: '1,248', icon: <FaUsers />, color: 'amber', trend: 'up', percent: '8' },
  { title: 'Overdue Returns', value: '37', icon: <FaCalendarTimes />, color: 'emerald', trend: 'down', percent: '5' }
];

const BAR_CHART_DATA = {
  2025: { xAxis: [{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }], series: [{ data: [44, 55, 57, 56, 61, 58, 63, 59, 54, 60, 62, 65], label: 'Fiction', color: '#3b82f6' }, { data: [76, 85, 101, 98, 87, 105, 110, 95, 88, 92, 99, 103], label: 'Non-Fiction', color: '#8b5cf6' }, { data: [35, 41, 36, 26, 45, 48, 50, 43, 39, 42, 47, 49], label: 'Reference', color: '#f59e0b' }] },
  2024: { xAxis: [{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }], series: [{ data: [38, 48, 52, 50, 55, 53, 58, 54, 49, 55, 57, 60], label: 'Fiction', color: '#3b82f6' }, { data: [68, 77, 92, 89, 79, 96, 101, 88, 82, 85, 90, 94], label: 'Non-Fiction', color: '#8b5cf6' }, { data: [30, 36, 31, 22, 40, 43, 45, 38, 34, 37, 41, 44], label: 'Reference', color: '#f59e0b' }] },
  2023: { xAxis: [{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }], series: [{ data: [35, 42, 48, 45, 50, 47, 52, 49, 44, 50, 53, 55], label: 'Fiction', color: '#3b82f6' }, { data: [62, 70, 85, 82, 72, 88, 93, 80, 75, 78, 83, 87], label: 'Non-Fiction', color: '#8b5cf6' }, { data: [25, 31, 27, 18, 35, 38, 40, 33, 29, 32, 36, 39], label: 'Reference', color: '#f59e0b' }] }
};

const PIE_CHART_DATA = {
  2025: [{ id: 0, value: 44, label: 'Fiction', color: '#3b82f6' }, { id: 1, value: 55, label: 'Science', color: '#8b5cf6' }, { id: 2, value: 13, label: 'History', color: '#f59e0b' }, { id: 3, value: 43, label: 'Biography', color: '#10b981' }, { id: 4, value: 22, label: 'Others', color: '#ef4444' }],
  2024: [{ id: 0, value: 40, label: 'Fiction', color: '#3b82f6' }, { id: 1, value: 50, label: 'Science', color: '#8b5cf6' }, { id: 2, value: 15, label: 'History', color: '#f59e0b' }, { id: 3, value: 38, label: 'Biography', color: '#10b981' }, { id: 4, value: 20, label: 'Others', color: '#ef4444' }],
  2023: [{ id: 0, value: 35, label: 'Fiction', color: '#3b82f6' }, { id: 1, value: 45, label: 'Science', color: '#8b5cf6' }, { id: 2, value: 18, label: 'History', color: '#f59e0b' }, { id: 3, value: 35, label: 'Biography', color: '#10b981' }, { id: 4, value: 25, label: 'Others', color: '#ef4444' }]
};

const TEXT_TREND = { up: 'text-green-600', down: 'text-red-600', flat: 'text-yellow-600' };
const CARD_BASE = 'transition-all bg-white p-4 hover:shadow-xl';

const LibraryDashboard = () => {
  const [selectedBarYear, setSelectedBarYear] = useState(2025);
  const [selectedPieYear, setSelectedPieYear] = useState(2025);
  const [showBarDropdown, setShowBarDropdown] = useState(false);
  const [showPieDropdown, setShowPieDropdown] = useState(false);
  const years = Array.from({ length: 3 }, (_, i) => 2025 - i);

  const getStatus = (action, date) => {
    const actionYear = new Date(date).getFullYear();
    const statusStyles = {
      Return: { text: 'Completed', className: 'bg-blue-100 text-blue-800' },
      Borrowed: actionYear === 2025 
        ? { text: 'Active', className: 'bg-green-100 text-green-800' }
        : { text: 'Overdue', className: 'bg-red-100 text-red-800' }
    };
    return statusStyles[action] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
  };

  const Dropdown = ({ selectedYear, setYear, showDropdown, setShowDropdown }) => (
    <div className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="text-xl">
        <FaBars />
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
          {years.map(year => (
            <button key={year} onClick={() => { setYear(year); setShowDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md md:left-64"><LibraryNavbar /></div>
      <div className="hidden md:block fixed top-16 left-0 w-64 h-full bg-white shadow-md"><LibrarySidebar /></div>
      
      <main className="flex-1 md:ml-64 p-6 pt-16 overflow-x-auto">
        <header className="mb-8">
          <h1 className="font-bold text-3xl">Library Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm">Manage your school library resources effectively</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className={`${CARD_BASE} border-l-4 border-${stat.color}-500`}>
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <h2 className="font-bold text-2xl">{stat.value}</h2>
                </div>
                <div className={`text-3xl text-${stat.color}-500`}>{stat.icon}</div>
              </div>
              <p className={`mt-4 text-sm ${TEXT_TREND[stat.trend]}`}>
                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.percent}% {stat.trend === 'up' ? 'increase' : stat.trend === 'down' ? 'decrease' : 'stable'} from last month
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className={CARD_BASE}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Book Collection Overview - {selectedBarYear}</h3>
              <Dropdown selectedYear={selectedBarYear} setYear={setSelectedBarYear} showDropdown={showBarDropdown} setShowDropdown={setShowBarDropdown} />
            </div>
            <BarChart {...BAR_CHART_DATA[selectedBarYear]} height={300} />
          </div>

          <div className={CARD_BASE}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Popular Categories - {selectedPieYear}</h3>
              <Dropdown selectedYear={selectedPieYear} setYear={setSelectedPieYear} showDropdown={showPieDropdown} setShowDropdown={setShowPieDropdown} />
            </div>
            <PieChart series={[{ data: PIE_CHART_DATA[selectedPieYear], innerRadius: 20, paddingAngle: 2, cornerRadius: 4 }]} height={260} />
          </div>
        </section>

        <section className={CARD_BASE}>
          <h3 className="font-bold text-xl mb-4">Recent Activities</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px]">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {['Book', 'Student', 'Action', 'Date', 'Status'].map(header => (
                    <th key={header} className="p-3 text-left text-xs text-gray-600 uppercase">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['To Kill a Mockingbird', 'Rahul Sharma', 'Return', 'Jan 15, 2023'],
                  ['2 States', 'Riya Sharma', 'Borrowed', 'Jan 16, 2024']
                ].map(([book, student, action, date], i) => {
                  const { text, className } = getStatus(action, date);
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-4 text-sm">{book}</td>
                      <td className="p-4 text-sm">{student}</td>
                      <td className="p-4 text-sm">{action}</td>
                      <td className="p-4 text-sm">{date}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{text}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LibraryDashboard;