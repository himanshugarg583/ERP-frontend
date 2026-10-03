import React, { useState } from 'react';
import OnlineLearningHeader from './OnlineLearningHeader';
import OnlineLearningSidebar from './OnlineLearningSidebar';
import { MdVideocam } from 'react-icons/md';
import { PieChart } from '@mui/x-charts/PieChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { getRandomUserImage } from '../../utils/assetUrls';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const OnlineLearningDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  const pieData = [
    { id: 0, value: 60, label: 'Reading', color: '#FFD700' },
    { id: 1, value: 20, label: 'Writing', color: '#8B5CF6' },
    { id: 2, value: 15, label: 'Video', color: '#60A5FA' },
    { id: 3, value: 4, label: 'Assignments', color: '#EF4444' },
  ];

  const progressData = [
    { course: 'Digital Marketing - Unit 3', progress: 40 },
    { course: 'Leadership Practical Skills - Unit 4', progress: 20 },
    { course: 'Financial Analyst Course - Unit 1', progress: 90 },
    { course: 'Financial Analyst Course - Unit 2', progress: 50 },
  ];

  const currentDate = new Date('2025-03-23');
  const currentMonth = format(currentDate, 'MMMM');
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start, end }) ?? [];

  const events = [
    { date: new Date(2025, 2, 10), type: 'Exam', description: 'Physics 101 Final Exam', color: '#FFD700' },
    { date: new Date(2025, 2, 15), type: 'Meeting', description: 'Math Department Meeting', color: '#60A5FA' },
    { date: new Date(2025, 2, 20), type: 'Online Class', description: 'Web Development Session', color: '#8B5CF6' },
    { date: new Date(2025, 2, 23), type: 'Exam', description: 'Data Science Midterm', color: '#FFD700' },
    { date: new Date(2025, 2, 25), type: 'Online Class', description: 'Graphic Design Workshop', color: '#8B5CF6' },
  ];

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value ?? '');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen overflow-hidden">
        <div 
          className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 md:min-h-screen`}>
          <OnlineLearningSidebar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <OnlineLearningHeader setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">My Classes</h2>
              <p className="text-gray-600 mb-6">Welcome back, John! You have 5 active classes and 2 upcoming live sessions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden">
                  <div className="h-32 bg-primary-600 relative">
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                      <span className="bg-amber-500 text-xs px-2 py-1 rounded font-medium">Science</span>
                      <h3 className="text-lg font-bold mt-1">Physics 101</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-3">
                        <img src={getRandomUserImage('women/32.jpg')} alt="Instructor" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">Dr. Elena Richards</p>
                        <p className="text-sm text-gray-500">Associate Professor</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Next session</p>
                          <p className="text-sm text-gray-500">Today, 10:00 AM</p>
                        </div>
                        <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                          <MdVideocam className="text-sm mr-1" />
                          Join
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">68% completed</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden">
                  <div className="h-32 bg-purple-600 relative">
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                      <span className="bg-blue-500 text-xs px-2 py-1 rounded font-medium">Math</span>
                      <h3 className="text-lg font-bold mt-1">Mathematics 202</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-3">
                        <img src={getRandomUserImage('men/45.jpg')} alt="Instructor" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">Prof. Michael Lee</p>
                        <p className="text-sm text-gray-500">Senior Lecturer</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Next session</p>
                          <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                        </div>
                        <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                          <MdVideocam className="text-sm mr-1" />
                          Join
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">45% completed</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden">
                  <div className="h-32 bg-green-600 relative">
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                      <span className="bg-green-400 text-xs px-2 py-1 rounded font-medium">Tech</span>
                      <h3 className="text-lg font-bold mt-1">Web Development 303</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-3">
                        <img src={getRandomUserImage('women/67.jpg')} alt="Instructor" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-500">Lead Developer</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Next session</p>
                          <p className="text-sm text-gray-500">Mar 25, 11:00 AM</p>
                        </div>
                        <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                          <MdVideocam className="text-sm mr-1" />
                          Join
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">82% completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-2">Time Spent on Learning</h3>
            <div className="flex justify-center flex-grow items-start pt-4">
    <PieChart
      series={[
        {
          data: pieData ?? [
            { id: 0, value: 40, label: 'Reading' },
            { id: 1, value: 30, label: 'Assignment' },
            { id: 2, value: 20, label: 'Practice' },
            { id: 3, value: 10, label: 'Others' },
          ],
          innerRadius: 20,
          outerRadius: 60,
          paddingAngle: 5,
          cornerRadius: 5,
        },
      ]}
      width={200}
      height={200}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'bottom', horizontal: 'middle' },
          padding: 5,
          itemMarkWidth: 10,
          itemMarkHeight: 10,
          labelStyle: { fontSize: 12 },
        },
      }}
    />
  </div>
</div>
              <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex flex-col justify-between">
                <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
                <div className="flex-grow">
                  {progressData?.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-sm text-gray-600">{item?.course ?? 'Unknown Course'}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${item?.progress ?? 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item?.progress ?? 0}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex flex-col justify-between">
                <h3 className="text-lg font-semibold mb-4">Test & Event</h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium">{currentMonth}</p>
                  <div className="flex space-x-2">
                    <button className="text-gray-500">&lt;</button>
                    <button className="text-gray-500">&gt;</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                  <div className="text-gray-500">Mon</div>
                  <div className="text-gray-500">Tue</div>
                  <div className="text-gray-500">Wed</div>
                  <div className="text-gray-500">Thu</div>
                  <div className="text-gray-500">Fri</div>
                  <div className="text-gray-500">Sat</div>
                  <div className="text-gray-500">Sun</div>
                  {daysInMonth.map((day, index) => {
                    const event = events?.find((e) => isSameDay(e?.date, day)) ?? null;
                    const isToday = isSameDay(day, currentDate);
                    return (
                      <div
                        key={index}
                        className={`p-1 rounded-full relative text-xs ${
                          isToday ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'
                        } ${event ? 'text-white' : ''} ${
                          event?.type === 'Exam'
                            ? 'bg-yellow-400'
                            : event?.type === 'Meeting'
                            ? 'bg-blue-400'
                            : event?.type === 'Online Class'
                            ? 'bg-purple-500'
                            : ''
                        }`}>
                        {format(day, 'd')}
                        {event && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">!</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex-grow max-h-24 overflow-y-auto">
                  <h4 className="text-sm font-medium mb-2">Scheduled Events</h4>
                  {events?.slice(0, 3).map((event, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-xs font-medium">
                        {format(event?.date ?? new Date(), 'MMM d, yyyy')} - {event?.type ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{event?.description ?? 'No description'}</p>
                    </div>
                  ))}
                  {events?.length > 3 && (
                    <p className="text-xs text-gray-500">Scroll for more events...</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <p className="text-blue-500 font-semibold">65%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">9.64GB used of 15GB</p>
                  <p className="text-xs text-gray-500">Storage Usage</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <p className="text-blue-500 font-semibold">32</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lectures were uploaded last week</p>
                  <p className="text-xs text-gray-500">Activity</p>
                </div>
              </div>
            </div>
          </main>
        </div>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default OnlineLearningDash;