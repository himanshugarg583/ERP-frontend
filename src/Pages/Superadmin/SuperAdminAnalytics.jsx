import React, { useState } from 'react';
import SuperAdminHeader from './SuperAdminHeader'; 
import SuperAdminSidebar from './SuperAdminSidebar'; 
import { BarChart, LineChart, PieChart } from '@mui/x-charts'; 

const SuperAdminAnalytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('School A');
  const schools = ['School A', 'School B', 'School C'];
  const schoolData = {
    'School A': {
      enrollmentData: [
        { quarter: 'Q1', enrollments: 140 },
        { quarter: 'Q2', enrollments: 120 },
        { quarter: 'Q3', enrollments: 150 },
        { quarter: 'Q4', enrollments: 130 },
      ],
      satisfactionData: [
        { category: 'Very Satisfied', percentage: 75, color: '#22c55e' },
        { category: 'Satisfied', percentage: 60, color: '#3b82f6' },
        { category: 'Neutral', percentage: 30, color: '#fbbf24' },
        { category: 'Unsatisfied', percentage: 10, color: '#ef4444' },
      ],
      studentPerformanceData: [
        { subject: 'Science', percentage: 89, color: '#4338ca' },
        { subject: 'Math', percentage: 78, color: '#3b82f6' },
        { subject: 'English', percentage: 72, color: '#60a5fa' },
        { subject: 'History', percentage: 67, color: '#93c5fd' },
      ],
      teacherPerformanceData: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        assessmentSpeed: [25, 45, 55, 65, 75],
        studentEngagement: [15, 25, 35, 30, 45],
      },
      financialPerformanceData: [
        { value: 75, color: '#3b82f6' },
        { value: 25, color: '#e5e7eb' },
      ],
    },
    'School B': {
      enrollmentData: [
        { quarter: 'Q1', enrollments: 110 },
        { quarter: 'Q2', enrollments: 130 },
        { quarter: 'Q3', enrollments: 140 },
        { quarter: 'Q4', enrollments: 115 },
      ],
      satisfactionData: [
        { category: 'Very Satisfied', percentage: 65, color: '#22c55e' },
        { category: 'Satisfied', percentage: 55, color: '#3b82f6' },
        { category: 'Neutral', percentage: 25, color: '#fbbf24' },
        { category: 'Unsatisfied', percentage: 15, color: '#ef4444' },
      ],
      studentPerformanceData: [
        { subject: 'Science', percentage: 85, color: '#4338ca' },
        { subject: 'Math', percentage: 80, color: '#3b82f6' },
        { subject: 'English', percentage: 70, color: '#60a5fa' },
        { subject: 'History', percentage: 65, color: '#93c5fd' },
      ],
      teacherPerformanceData: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        assessmentSpeed: [30, 50, 60, 70, 80],
        studentEngagement: [20, 30, 40, 35, 50],
      },
      financialPerformanceData: [
        { value: 80, color: '#3b82f6' },
        { value: 20, color: '#e5e7eb' },
      ],
    },
    'School C': {
      enrollmentData: [
        { quarter: 'Q1', enrollments: 100 },
        { quarter: 'Q2', enrollments: 110 },
        { quarter: 'Q3', enrollments: 120 },
        { quarter: 'Q4', enrollments: 105 },
      ],
      satisfactionData: [
        { category: 'Very Satisfied', percentage: 70, color: '#22c55e' },
        { category: 'Satisfied', percentage: 50, color: '#3b82f6' },
        { category: 'Neutral', percentage: 20, color: '#fbbf24' },
        { category: 'Unsatisfied', percentage: 20, color: '#ef4444' },
      ],
      studentPerformanceData: [
        { subject: 'Science', percentage: 82, color: '#4338ca' },
        { subject: 'Math', percentage: 75, color: '#3b82f6' },
        { subject: 'English', percentage: 68, color: '#60a5fa' },
        { subject: 'History', percentage: 60, color: '#93c5fd' },
      ],
      teacherPerformanceData: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        assessmentSpeed: [20, 40, 50, 60, 70],
        studentEngagement: [10, 20, 30, 25, 40],
      },
      financialPerformanceData: [
        { value: 70, color: '#3b82f6' },
        { value: 30, color: '#e5e7eb' },
      ],
    },
  };

  const selectedSchoolData = schoolData[selectedSchool] ?? {};
  const enrollmentData = selectedSchoolData.enrollmentData ?? [];
  const satisfactionData = selectedSchoolData.satisfactionData ?? [];
  const studentPerformanceData = selectedSchoolData.studentPerformanceData ?? [];
  const teacherPerformanceData = selectedSchoolData.teacherPerformanceData ?? { months: [], assessmentSpeed: [], studentEngagement: [] };
  const financialPerformanceData = selectedSchoolData.financialPerformanceData ?? [{ value: 0, color: '#3b82f6' }, { value: 100, color: '#e5e7eb' }];

  return (
    <div className="flex">
      <SuperAdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <SuperAdminHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Analytics Overview</h1>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Enrollment Trends Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Enrollment Trends ({selectedSchool})</h3>
              </div>
              <div className="h-[200px]">
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: enrollmentData?.map(item => item.quarter) ?? [],
                      label: 'Quarter',
                    },
                  ]}
                  yAxis={[
                    {
                      label: 'Enrollments',
                    },
                  ]}
                  series={[
                    {
                      data: enrollmentData?.map(item => item.enrollments) ?? [],
                      color: '#3b82f6',
                      label: 'Enrollments',
                    },
                  ]}
                  height={200}
                  margin={{ top: 20, bottom: 40, left: 40, right: 20 }}/>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm text-gray-500">New Enrollments</p>
                  <p className="font-semibold">{enrollmentData?.reduce((sum, item) => sum + (item.enrollments ?? 0), 0) ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dropout Rate</p>
                  <p className="font-semibold">3.2%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Growth</p>
                  <p className="font-semibold text-green-500">+8.5%</p>
                </div>
              </div>
            </div>
            {/* Financial Performance Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Financial Performance ({selectedSchool})</h3>
              </div>
              <div className="h-[200px] relative flex items-center justify-center">
                <PieChart
                  series={[
                    {
                      data: financialPerformanceData ?? [],
                      innerRadius: 60,
                      outerRadius: 80,
                      startAngle: 0,
                      endAngle: 360,
                      paddingAngle: 0,
                      cornerRadius: 0,
                      arcLabel: () => '',
                    },
                  ]}
                  height={200}
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  sx={{
                    '& .MuiPieArc-root': {
                      stroke: 'none',
                    },
                    '& .MuiPieArcLabel-root': {
                      display: 'none',
                    },
                  }}/>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold text-gray-900">{financialPerformanceData?.[0]?.value ?? 0}%</p>
                  <p className="text-sm text-gray-500">Collection Rate</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="font-semibold">₹{(financialPerformanceData?.[0]?.value ?? 0) * 0.0456}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expenses</p>
                  <p className="font-semibold">₹{(financialPerformanceData?.[0]?.value ?? 0) * 0.029}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net</p>
                  <p className="font-semibold text-green-500">₹{(financialPerformanceData?.[0]?.value ?? 0) * 0.0166}M</p>
                </div>
              </div>
            </div>

            {/* Parent Satisfaction Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Parent Satisfaction ({selectedSchool})</h3>
              </div>
              <div className="h-[200px]">
                <BarChart
                  yAxis={[
                    {
                      scaleType: 'band',
                      data: satisfactionData?.map(item => item.category) ?? [],
                    },
                  ]}
                  xAxis={[
                    {
                      label: 'Percentage (%)',
                      min: 0,
                      max: 100,
                    },
                  ]}
                  series={[
                    {
                      data: satisfactionData?.map(item => item.percentage) ?? [],
                      valueFormatter: (value, { dataIndex }) => `${value}% - ${satisfactionData?.[dataIndex]?.category ?? ''}`,
                    },
                  ]}
                  layout="horizontal"
                  height={200}
                  margin={{ top: 20, bottom: 40, left: 100, right: 40 }}
                  barLabel="value"
                  sx={{
                    '& .MuiBarElement-root': {
                      fill: (params) => satisfactionData?.[params.dataIndex]?.color ?? '#22c55e',
                    },
                    '& .MuiChartsAxis-label': {
                      fill: '#4b5563',
                    },
                    '& .MuiBarLabel-root': {
                      fill: (params) => (satisfactionData?.[params.dataIndex]?.percentage > 50 ? '#fff' : '#000'),
                      fontSize: '12px',
                    },
                  }}/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Student Performance Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Student Performance ({selectedSchool})</h3>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option>Last Quarter</option>
                  <option>Last Semester</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: studentPerformanceData?.map(item => item.subject) ?? [],
                      label: 'Subjects',
                    },
                  ]}
                  yAxis={[
                    {
                      label: 'Percentage (%)',
                      min: 0,
                      max: 100,
                    },
                  ]}
                  series={[
                    {
                      data: studentPerformanceData?.map(item => item.percentage) ?? [],
                      valueFormatter: (value) => `${value}%`,
                    },
                  ]}
                  height={300}
                  margin={{ top: 20, bottom: 60, left: 60, right: 20 }}
                  barLabel="value"
                  sx={{
                    '& .MuiBarElement-root': {
                      fill: (params) => studentPerformanceData?.[params.dataIndex]?.color ?? '#4338ca',
                    },
                    '& .MuiChartsAxis-label': {
                      fill: '#4b5563',
                    },
                    '& .MuiBarLabel-root': {
                      fill: '#fff',
                      fontSize: '12px',
                    },
                  }}/>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {(studentPerformanceData ?? []).map((item, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm text-gray-500">{item?.subject ?? 'N/A'}</p>
                    <p className="font-semibold">{item?.percentage ?? 0}%</p>
                    <p className="text-xs text-green-500">+{index % 2 === 0 ? '5.2' : '2.7'}%</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Teacher Performance Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Teacher Performance ({selectedSchool})</h3>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option>Last Quarter</option>
                  <option>Last Semester</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <LineChart
                  xAxis={[
                    {
                      scaleType: 'point',
                      data: teacherPerformanceData?.months ?? [],
                      label: 'Months',
                      tickLabelStyle: { fontSize: 12, fill: '#4b5563' },
                    },
                  ]}
                  yAxis={[
                    {
                      min: 0,
                      max: 100,
                      valueFormatter: (value) => `${value}%`,
                      tickLabelStyle: { fontSize: 12, fill: '#4b5563' },
                    },
                  ]}
                  series={[
                    {
                      data: teacherPerformanceData?.assessmentSpeed ?? [],
                      label: 'Assessment Speed',
                      color: '#3b82f6',
                      showMark: true,
                      curve: 'linear',
                      strokeWidth: 3,
                    },
                    {
                      data: teacherPerformanceData?.studentEngagement ?? [],
                      label: 'Student Engagement',
                      color: '#10b981',
                      showMark: true,
                      curve: 'linear',
                      strokeWidth: 3,
                    },
                  ]}
                  height={300}
                  margin={{ top: 40, bottom: 60, left: 60, right: 40 }}
                  grid={{ vertical: true, horizontal: true }}
                  sx={{
                    '& .MuiChartsAxis-label': {
                      fill: '#4b5563',
                      fontSize: '14px',
                    },
                    '& .MuiLineElement-root': {
                      strokeWidth: 3,
                    },
                    '& .MuiMarkElement-root': {
                      r: 4,
                      fill: (params) => (params.seriesId === 'Assessment Speed' ? '#3b82f6' : '#10b981'),
                      stroke: (params) => (params.seriesId === 'Assessment Speed' ? '#3b82f6' : '#10b981'),
                      strokeWidth: 1,
                    },
                    '& .MuiChartsLegend-root': {
                      display: 'none',
                    },
                  }}/>
              </div>
              <div className="flex items-center justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Assessment Speed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Student Engagement</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminAnalytics;