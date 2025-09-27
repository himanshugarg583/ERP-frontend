import React, { useState } from 'react';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import { IconButton, Select, MenuItem, Modal, Box, Button } from '@mui/material';
import { FaEllipsisH, FaFilter, FaDownload, FaBook, FaUsers, FaBell, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';

const StatCard = ({ title, value, icon, trend, trendColor }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-base sm:text-lg text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">{value}</p>
    {trend && (
      <div className={`flex items-center text-${trendColor}-600`}>
        {trend.includes('+') ? <FaArrowUp className="text-xs sm:text-sm mr-1" /> : <FaArrowDown className="text-xs sm:text-sm mr-1" />}
        <span className="text-xs sm:text-sm font-medium">{trend}</span>
      </div>
    )}
  </div>
);

const ChartCard = ({ title, children, showMenu = true, onYearSelect, showFilter = false, onFilterClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          {showFilter && <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-blue-100 text-xs sm:text-sm" onClick={onFilterClick}><FaFilter className="text-xs sm:text-sm" /> Filter</button>}
          {showMenu && (
            <div className="relative">
              <IconButton className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsDropdownOpen(prev => !prev)}>
                <FaEllipsisH className="text-sm sm:text-base" />
              </IconButton>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {['2023', '2024', '2025'].map(year => (
                      <li key={year} className="px-3 sm:px-4 py-1 sm:py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-xs sm:text-sm" onClick={() => { onYearSelect?.(year); setIsDropdownOpen(false); }}>{year}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

const LibraryReports = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2023', '2024', '2025'];

  const monthlyCirculationData = {
    2023: { fiction: [40, 45, 50, 48, 55, 60, 58, 62, 65, 70, 68, 72], nonFiction: [70, 75, 80, 85, 90, 88, 92, 95, 98, 100, 105, 110], reference: [30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58] },
    2024: { fiction: [45, 50, 55, 60, 65, 70, 68, 72, 75, 80, 78, 82], nonFiction: [80, 85, 90, 95, 100, 105, 108, 112, 115, 120, 125, 130], reference: [35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62] },
    2025: { fiction: [50, 55, 60, 65, 70, 75, 78, 82, 85, 90, 88, 92], nonFiction: [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145], reference: [40, 42, 45, 48, 50, 55, 58, 60, 62, 65, 68, 70] }
  };
  
  const categoryDistributionData = {
    2023: [{ label: 'Fiction', value: 1300, color: '#3B82F6' }, { label: 'Science', value: 850, color: '#8B5CF6' }, { label: 'History', value: 550, color: '#10B981' }, { label: 'Biography', value: 400, color: '#F59E0B' }, { label: 'Children', value: 300, color: '#EF4444' }, { label: 'Reference', value: 250, color: '#EC4899' }, { label: 'Other', value: 180, color: '#6B7280' }],
    2024: [{ label: 'Fiction', value: 1360, color: '#3B82F6' }, { label: 'Science', value: 910, color: '#8B5CF6' }, { label: 'History', value: 590, color: '#10B981' }, { label: 'Biography', value: 450, color: '#F59E0B' }, { label: 'Children', value: 325, color: '#EF4444' }, { label: 'Reference', value: 265, color: '#EC4899' }, { label: 'Other', value: 190, color: '#6B7280' }],
    2025: [{ label: 'Fiction', value: 1423, color: '#3B82F6' }, { label: 'Science', value: 968, color: '#8B5CF6' }, { label: 'History', value: 624, color: '#10B981' }, { label: 'Biography', value: 482, color: '#F59E0B' }, { label: 'Children', value: 351, color: '#EF4444' }, { label: 'Reference', value: 280, color: '#EC4899' }, { label: 'Other', value: 200, color: '#6B7280' }]
  };
  
  const booksUsageDataByYear = {
    2023: [{ title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', borrowings: 120, availability: 'Available (4/8)', trend: [10, 12, 15, 13, 18, 20, 22, 25, 23, 28, 30, 32], color: '#3B82F6' }, { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', borrowings: 85, availability: 'Available (2/5)', trend: [8, 10, 12, 11, 15, 17, 19, 21, 18, 22, 25, 27], color: '#10B981' }, { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Children', borrowings: 65, availability: 'Checked Out (0/4)', trend: [7, 9, 11, 10, 13, 16, 18, 20, 17, 21, 23, 25], color: '#EF4444' }],
    2024: [{ title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', borrowings: 142, availability: 'Available (5/8)', trend: [12, 14, 18, 16, 20, 22, 24, 28, 25, 30, 32, 35], color: '#3B82F6' }, { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', borrowings: 98, availability: 'Available (3/5)', trend: [10, 12, 15, 14, 18, 20, 22, 24, 20, 25, 28, 30], color: '#10B981' }, { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Children', borrowings: 75, availability: 'Checked Out (0/4)', trend: [8, 10, 12, 11, 15, 18, 20, 22, 19, 23, 25, 27], color: '#EF4444' }],
    2025: [{ title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', borrowings: 155, availability: 'Available (6/8)', trend: [14, 16, 20, 18, 22, 25, 27, 30, 28, 32, 35, 38], color: '#3B82F6' }, { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', borrowings: 105, availability: 'Available (4/5)', trend: [12, 14, 17, 16, 20, 22, 24, 26, 23, 27, 30, 33], color: '#10B981' }, { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Children', borrowings: 82, availability: 'Available (1/4)', trend: [9, 11, 13, 12, 16, 19, 21, 23, 20, 24, 27, 29], color: '#EF4444' }]
  };
  
  const userActivityData = {
    students: [31, 40, 28, 51, 42, 109, 100, 90, 95, 85, 100, 120],
    faculty: [11, 32, 45, 32, 34, 52, 41, 35, 28, 32, 40, 38],
    stats: [
      { title: 'Most Active Time', value: '3:00 PM - 5:00 PM', desc: 'Peak borrowing hours on weekdays', bg: 'blue', text: 'blue' },
      { title: 'Average Visit Duration', value: '1 hour 14 minutes', desc: '20% increase from previous month', bg: 'purple', text: 'purple' },
      { title: 'Return Rate', value: '94.8%', desc: '3.2% improvement since last quarter', bg: 'green', text: 'green' }
    ]
  };

  const [selectedCirculationYear, setSelectedCirculationYear] = useState('2024');
  const [selectedCategoryYear, setSelectedCategoryYear] = useState('2024');
  const [selectedBooksYear, setSelectedBooksYear] = useState('2024');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  const filteredBooks = booksUsageDataByYear[selectedBooksYear]?.filter(book => 
    (filterCategory ? book?.category === filterCategory : true) && 
    (filterAvailability ? book?.availability?.includes(filterAvailability) : true)
  ) || [];

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md md:left-64"><LibraryNavbar /></div>
      <div className="flex flex-1 flex-col md:flex-row pt-16">
        <div className="fixed top-16 left-0 w-full md:w-64 h-auto md:h-full bg-white shadow-xl border-r border-gray-100 md:block hidden"><LibrarySidebar /></div>
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
              <StatCard title="Total Books" value="4,328" icon={<FaBook className="text-blue-600 text-lg sm:text-xl" />} trend="+12% from last month" trendColor="green" />
              <StatCard title="Active Borrowers" value="752" icon={<FaUsers className="text-purple-600 text-lg sm:text-xl" />} trend="-3% from last month" trendColor="red" />
              <StatCard title="Books Due Today" value="28" icon={<FaBell className="text-amber-600 text-lg sm:text-xl" />} trend="Updated 5 mins ago" trendColor="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
              <ChartCard title={`Monthly Circulation (${selectedCirculationYear})`} onYearSelect={setSelectedCirculationYear}>
                <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                  <BarChart 
                    xAxis={[{ scaleType: 'band', data: months }]} 
                    series={[
                      { data: monthlyCirculationData[selectedCirculationYear]?.fiction, label: 'Fiction', color: '#3B82F6' },
                      { data: monthlyCirculationData[selectedCirculationYear]?.nonFiction, label: 'Non-Fiction', color: '#8B5CF6' },
                      { data: monthlyCirculationData[selectedCirculationYear]?.reference, label: 'Reference', color: '#F59E0B' }
                    ]} 
                    height={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300} 
                    width={window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 400 : 500} 
                    yAxis={[{ label: 'Books' }]} 
                    margin={{ top: 20, right: 10, bottom: 50, left: 40 }} 
                  />
                </div>
              </ChartCard>

              <ChartCard title={`Category Distribution (${selectedCategoryYear})`} onYearSelect={setSelectedCategoryYear}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1 h-[200px] sm:h-[250px] lg:h-[300px] bg-gray-50 rounded-lg p-2 sm:p-4">
                    <PieChart 
                      series={[{ 
                        data: categoryDistributionData[selectedCategoryYear], 
                        innerRadius: window.innerWidth < 640 ? 30 : 40, 
                        outerRadius: window.innerWidth < 640 ? 70 : window.innerWidth < 1024 ? 100 : 120, 
                        paddingAngle: 2, 
                        highlightScope: { faded: 'global', highlighted: 'item' }, 
                        faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' } 
                      }]} 
                      height={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300} 
                      width={window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300} 
                      margin={{ top: 20, right: 10, bottom: 20, left: 10 }} 
                      slotProps={{ legend: { hidden: true } }} 
                    />
                  </div>
                  <div className="w-full sm:w-1/2 bg-gray-50 p-2 sm:p-4 rounded-lg h-[200px] sm:h-[250px] lg:h-[300px] overflow-y-auto">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-4">Category Breakdown ({selectedCategoryYear})</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {categoryDistributionData[selectedCategoryYear]?.map((category, index) => {
                        const total = categoryDistributionData[selectedCategoryYear]?.reduce((sum, item) => sum + (item?.value || 0), 0) || 1;
                        return (
                          <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2" style={{ backgroundColor: category?.color }}></span>
                              <span className="text-xs sm:text-sm font-medium text-gray-600">{category?.label}</span>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <span className="text-xs sm:text-sm text-gray-600">{category?.value}</span>
                              <span className="text-xs sm:text-sm text-gray-600">({((category?.value / total) * 100).toFixed(1)}%)</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </ChartCard>
            </div>

            <ChartCard 
              title={`Books Usage Report (${selectedBooksYear})`} 
              onYearSelect={setSelectedBooksYear} 
              showFilter 
              onFilterClick={() => setFilterModalOpen(true)}
            >
              <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  bgcolor: 'white', 
                  p: { xs: 2, sm: 4 }, 
                  borderRadius: 2, 
                  width: { xs: '90%', sm: 400 }, 
                  maxHeight: '90vh', 
                  overflowY: 'auto' 
                }}>
                  <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Filter Books</h2>
                  {[
                    { label: 'Category', value: filterCategory, onChange: setFilterCategory, options: ['', 'Fiction', 'History', 'Children'], display: ['All Categories', 'Fiction', 'History', 'Children'] },
                    { label: 'Availability', value: filterAvailability, onChange: setFilterAvailability, options: ['', 'Available', 'Checked Out'], display: ['All', 'Available', 'Checked Out'] }
                  ].map(({ label, value, onChange, options, display }) => (
                    <div key={label} className="mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <Select 
                        fullWidth 
                        value={value} 
                        onChange={e => onChange(e.target.value)} 
                        displayEmpty 
                        size="small"
                      >
                        {options.map((opt, i) => <MenuItem key={opt} value={opt}>{display[i]}</MenuItem>)}
                      </Select>
                    </div>
                  ))}
                  <Button variant="contained" size="small" onClick={() => setFilterModalOpen(false)}>Apply Filters</Button>
                </Box>
              </Modal>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Book Title', 'Category', 'Borrowings', 'Availability', 'Usage Trend'].map(header => (
                        <th 
                          key={header} 
                          scope="col" 
                          className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBooks?.map((book, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{book?.title}</div>
                          <div className="text-xs text-gray-500">{book?.author}</div>
                        </td>
                        <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <span className="px-1 sm:px-2 py-1 text-xs rounded-full bg-gray-100" style={{ color: book?.color }}>{book?.category}</span>
                        </td>
                        <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">{book?.borrowings}</td>
                        <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <span className="flex items-center">
                            <span 
                              className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full mr-1 sm:mr-2" 
                              style={{ backgroundColor: book?.availability?.includes('Available') ? '#10B981' : '#EF4444' }}
                            ></span>
                            <span className="text-xs sm:text-sm text-gray-700">{book?.availability}</span>
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <LineChart 
                            xAxis={[{ scaleType: 'point', data: months, disableTicks: true }]} 
                            series={[{ data: book?.trend, color: book?.color, curve: 'catmullRom', showMark: false }]} 
                            height={window.innerWidth < 640 ? 40 : window.innerWidth < 1024 ? 50 : 60} 
                            width={window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 150 : 200} 
                            grid={{ vertical: false, horizontal: false }} 
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }} 
                            slotProps={{ legend: { hidden: true } }} 
                            sx={{ '& .MuiChartsAxis-line': { stroke: 'none' }, '& .MuiChartsAxis-tick': { display: 'none' } }} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-3 border-t border-gray-200 gap-2">
                <div className="text-xs sm:text-sm text-gray-500">
                  Showing {filteredBooks?.length || 0} of {booksUsageDataByYear[selectedBooksYear]?.length || 0} books
                </div>
                <div className="flex">
                  <button className="px-2 sm:px-3 py-1 rounded-l-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm">Previous</button>
                  <button className="px-2 sm:px-3 py-1 rounded-r-md border border-gray-300 border-l-0 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm">Next</button>
                </div>
              </div>
            </ChartCard>

            <div className="mt-8 sm:mt-10 lg:mt-12">
              <ChartCard title="User Activity Analysis">
                <div className="h-[250px] sm:h-[300px] lg:h-[360px] bg-gray-50 p-2 sm:p-4 rounded-lg">
                  <LineChart 
                    xAxis={[{ scaleType: 'point', data: months, label: 'Months', tickLabelStyle: { fontSize: window.innerWidth < 640 ? 10 : 12, angle: 45, textAnchor: 'start' } }]} 
                    series={[
                      { data: userActivityData?.students, label: 'Students', color: '#3B82F6', curve: 'catmullRom', showMark: true },
                      { data: userActivityData?.faculty, label: 'Faculty', color: '#8B5CF6', curve: 'catmullRom', showMark: true }
                    ]} 
                    height={window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 300 : 360} 
                    width={window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 500 : 800} 
                    yAxis={[{ label: 'Number of Visits', tickLabelStyle: { fontSize: window.innerWidth < 640 ? 10 : 12 } }]} 
                    grid={{ vertical: true, horizontal: true }} 
                    margin={{ top: 50, right: 10, bottom: 70, left: 40 }} 
                    slotProps={{ legend: { direction: 'row', position: { vertical: 'top', horizontal: 'middle' }, padding: 0 } }} 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {userActivityData?.stats?.map(stat => (
                    <div 
                      key={stat?.title} 
                      className={`p-2 sm:p-4 bg-${stat?.bg}-50 rounded-lg hover:bg-${stat?.bg}-100 transition-colors duration-200`}
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-700">{stat?.title}</h3>
                      <p className={`text-sm sm:text-lg font-medium mt-1 text-${stat?.text}-800`}>{stat?.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{stat?.desc}</p>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LibraryReports;