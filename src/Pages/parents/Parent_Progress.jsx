import React, { useState, useMemo, useCallback } from 'react';
import {
    FaChartLine, FaExpand, FaGraduationCap, FaBook, FaClipboardList, FaChartBar,
    FaCalendarCheck, FaCalendarDay, FaTasks, FaClipboardCheck, FaClock, FaCalendarTimes, FaLightbulb
} from 'react-icons/fa';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import LinearProgress from '@mui/material/LinearProgress';
import Parent_GradeGauge from './Parent_GradeGauge';
import Parent_SubjectGrade from './Parent_SubjectGrade';
import Parent_ExamRow from './Parent_ExamRow';
import Parent_AssignmentRow from './Parent_AssignmentRow';

// Helper function to determine grade based on percentage
const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

const ParentProgress = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    // Dynamic data (could come from props or API)
    const months = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const attendanceData = useMemo(() => ({
        0: { present: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], absent: [11, 12], late: [13] },
        1: { present: [1, 2, 3, 4, 5, 6, 7, 8, 9], absent: [10, 11], late: [12] },
    }), []);

    const subjectsData = useMemo(() => [
        { subject: 'Mathematics', percentage: 92 },
        { subject: 'Science', percentage: 88 },
        { subject: 'English', percentage: 95 },
        { subject: 'History', percentage: 78 },
    ], []);

    const examResults = useMemo(() => [
        { examType: 'Mid-term', subject: 'Mathematics', score: 88, date: 'Oct 15, 2023' },
        { examType: 'Unit Test', subject: 'Science', score: 92, date: 'Nov 5, 2023' },
        { examType: 'Final', subject: 'English', score: 95, date: 'Dec 20, 2023' },
    ], []);

    const performanceData = useMemo(() => [
        { year: 2021, score: 55 },
        { year: 2022, score: 65 },
        { year: 2023, score: 75 },
        { year: 2024, score: 55 },
        { year: 2025, score: 92 },
    ], []);

    const assignmentData = useMemo(() => [
        { title: 'Research Paper', subject: 'Science', dueDate: 'Nov 12, 2023', status: 'Completed', score: 92, feedback: 'Excellent analysis.' },
        { title: 'Math Problem Set', subject: 'Mathematics', dueDate: 'Nov 18, 2023', status: 'Completed', score: 88, feedback: 'Good work.' },
        { title: 'Book Report', subject: 'English', dueDate: 'Nov 25, 2023', status: 'Late', score: 85, feedback: 'Interesting perspective.' },
    ], []);

    const assignmentBreakdown = useMemo(() => ({
        completedOnTime: 18,
        completedLate: 4,
        missing: 2,
    }), []);

    const previousYearPercentage = 82.5;
    const currentYearPercentage = 92.5;
    const assignmentCompletionValue = 90;

    const daysInMonth = useMemo(() => new Date(2023, selectedMonth + 1, 0).getDate(), [selectedMonth]);
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const presentCount = attendanceData[selectedMonth]?.present.length || 0;
    const absentCount = attendanceData[selectedMonth]?.absent.length || 0;
    const lateCount = attendanceData[selectedMonth]?.late.length || 0;

    const pieChartData = useMemo(() => [
        { label: 'Present', value: presentCount, color: '#4caf50' },
        { label: 'Absent', value: absentCount, color: '#f44336' },
        { label: 'Late', value: lateCount, color: '#ffeb3b' },
    ], [presentCount, absentCount, lateCount]);

    const xAxisData = useMemo(() => performanceData.map(item => item.year), [performanceData]);
    const seriesData = useMemo(() => performanceData.map(item => item.score), [performanceData]);

    const handleMonthChange = useCallback((e) => setSelectedMonth(Number(e.target.value)), []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div id="webcrumbs">
                            <div className="mb-6 text-center">
                                <h1 className="text-2xl sm:text-3xl font-bold">Student Progress Dashboard</h1>
                            </div>

                            {/* Academic Performance Section */}
                            <details className="mb-6 bg-white rounded-lg shadow-md overflow-hidden group" open>
                                <summary className="flex justify-between items-center p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <FaChartLine className="text-blue-600 text-lg sm:text-xl" />
                                        <h2 className="text-lg sm:text-xl font-semibold">Academic Performance</h2>
                                    </div>
                                    <FaExpand className="transform group-open:rotate-180 transition-transform duration-300" />
                                </summary>
                                <div className="p-4 sm:p-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                                <FaGraduationCap className="text-blue-600" />
                                                Overall Grade Summary
                                            </h3>
                                            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                                                <Parent_GradeGauge percentage={currentYearPercentage} label="Current Year" />
                                                <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 w-full">
                                                    <div className="mb-2">
                                                        <div className="flex justify-between mb-1 text-xs sm:text-sm">
                                                            <span>Previous Year</span>
                                                            <span>{getGradeFromPercentage(previousYearPercentage)} ({previousYearPercentage}%)</span>
                                                        </div>
                                                        <LinearProgress variant="determinate" value={previousYearPercentage} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#3b82f6' } }} />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1 text-xs sm:text-sm">
                                                            <span>Current Year</span>
                                                            <span>{getGradeFromPercentage(currentYearPercentage)} ({currentYearPercentage}%)</span>
                                                        </div>
                                                        <LinearProgress variant="determinate" value={currentYearPercentage} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#3b82f6' } }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                                <FaBook className="text-blue-600" />
                                                Subject-wise Marks & Grades
                                            </h3>
                                            <ul className="space-y-2 sm:space-y-3">
                                                {subjectsData.map((subject, index) => (
                                                    <Parent_SubjectGrade key={index} subject={subject.subject} percentage={subject.percentage} />
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                            <FaClipboardList className="text-blue-600" />
                                            Exam Results
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {examResults.map((exam, index) => (
                                                        <Parent_ExamRow key={index} {...exam} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                            <FaChartBar className="text-blue-600" />
                                            Performance Trends (Yearly)
                                        </h3>
                                        <div className="w-full h-[200px] sm:h-[250px] lg:h-[300px]">
                                            {xAxisData.length > 0 && seriesData.length > 0 ? (
                                                <LineChart
                                                    xAxis={[{
                                                        data: xAxisData,
                                                        label: 'Year',
                                                        scaleType: 'band',
                                                    }]}
                                                    yAxis={[{
                                                        label: 'Average Score',
                                                        min: 0,
                                                        max: 100,
                                                    }]}
                                                    series={[{
                                                        data: seriesData,
                                                        label: 'Yearly Performance',
                                                        color: '#3b82f6',
                                                        curve: 'linear',
                                                        showMark: true,
                                                    }]}
                                                    height={300} // Controlled by container height
                                                    width={undefined} // Let it take full container width
                                                    margin={{ top: 40, bottom: 40, left: 40, right: 20 }}
                                                    grid={{ vertical: false, horizontal: true }}
                                                    slotProps={{
                                                        legend: {
                                                            hidden: false,
                                                            position: { vertical: 'top', horizontal: 'center' },
                                                            padding: { top: 10 },
                                                            labelStyle: { fontSize: 12, fill: '#333' },
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-red-500 text-center">No data available for the chart.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </details>

                            {/* Attendance Report Section */}
                            <details className="mb-6 bg-white rounded-lg shadow-md overflow-hidden group">
                                <summary className="flex justify-between items-center p-4 cursor-pointer bg-green-50 hover:bg-green-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <FaCalendarCheck className="text-green-600 text-lg sm:text-xl" />
                                        <h2 className="text-lg sm:text-xl font-semibold">Attendance Report</h2>
                                    </div>
                                    <FaExpand className="transform group-open:rotate-180 transition-transform duration-300" />
                                </summary>
                                <div className="p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row justify-between mb-4">
                                        <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">Select Month:</label>
                                        <select
                                            id="month-select"
                                            value={selectedMonth}
                                            onChange={handleMonthChange}
                                            className="w-full sm:w-32 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {months.map((month, index) => (
                                                <option key={index} value={index}>{month}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                            <FaCalendarDay className="text-green-600" />
                                            Monthly Attendance Summary for {months[selectedMonth]}
                                        </h3>
                                        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                                            {days.map((day) => {
                                                const isPresent = attendanceData[selectedMonth]?.present.includes(day);
                                                const isAbsent = attendanceData[selectedMonth]?.absent.includes(day);
                                                const isLate = attendanceData[selectedMonth]?.late.includes(day);
                                                return (
                                                    <div key={day} className={`h-8 sm:h-10 rounded-md flex items-center justify-center text-xs sm:text-sm font-medium ${isPresent ? 'bg-green-100 text-green-800' : isAbsent ? 'bg-red-100 text-red-800' : isLate ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-opacity`}>
                                                        {day}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-wrap justify-center mt-4 space-x-4 sm:space-x-6">
                                            <div className="flex items-center mb-2 sm:mb-0">
                                                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded bg-green-100 mr-2"></div>
                                                <span className="text-xs sm:text-sm">Present</span>
                                            </div>
                                            <div className="flex items-center mb-2 sm:mb-0">
                                                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded bg-red-100 mr-2"></div>
                                                <span className="text-xs sm:text-sm">Absent</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-3 sm:w-4 h-3 sm:h-4 rounded bg-yellow-100 mr-2"></div>
                                                <span className="text-xs sm:text-sm">Late</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-5">
                                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                            <FaCalendarDay className="text-green-600" />
                                            Attendance Overview
                                        </h3>
                                        <div className="flex flex-col items-center">
                                            <div className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px] h-[200px] sm:h-[250px]">
                                                <PieChart
                                                    series={[{
                                                        data: pieChartData,
                                                        innerRadius: 40,
                                                        outerRadius: 80,
                                                        paddingAngle: 0,
                                                        cornerRadius: 0,
                                                    }]}
                                                    width={undefined} // Full container width
                                                    height={250} // Controlled by container height
                                                    slotProps={{ legend: { hidden: true } }}
                                                />
                                            </div>
                                            <div className="mt-4 text-center text-xs sm:text-sm">
                                                <p>Present: {presentCount}</p>
                                                <p>Absent: {absentCount}</p>
                                                <p>Late: {lateCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            {/* Homework & Assignments Section */}
                            <details className="mb-6 bg-white rounded-lg shadow-md overflow-hidden group">
                                <summary className="flex justify-between items-center p-4 cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all duration-300">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <FaTasks className="text-purple-600 text-lg sm:text-xl" />
                                        <h2 className="text-lg sm:text-xl font-semibold">Homework & Assignments Performance</h2>
                                    </div>
                                    <FaExpand className="transform group-open:rotate-180 transition-transform duration-300" />
                                </summary>
                                <div className="p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row mb-6">
                                        <div className="w-full sm:w-1/2 pr-0 sm:pr-4 mb-4 sm:mb-0">
                                            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                                <FaTasks className="text-purple-600" />
                                                Assignment Completion Status
                                            </h3>
                                            <div className="relative w-full max-w-[200px] sm:max-w-[250px] mx-auto h-[200px] sm:h-[250px]">
                                                <Gauge
                                                    value={assignmentCompletionValue}
                                                    valueMax={100}
                                                    startAngle={-180}
                                                    endAngle={180}
                                                    innerRadius="70%"
                                                    outerRadius="100%"
                                                    sx={{
                                                        '& .MuiGauge-valueArc': { fill: '#8b5cf6' },
                                                        '& .MuiGauge-referenceArc': { fill: '#e5e7eb' },
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl sm:text-3xl font-bold text-gray-800">{assignmentCompletionValue}%</span>
                                                    <span className="text-xs sm:text-sm text-gray-600">Completed</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
                                            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                                <FaClipboardCheck className="text-purple-600" />
                                                Assignment Status Breakdown
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between mb-1 text-xs sm:text-sm">
                                                        <span className="flex items-center gap-1"><FaClipboardCheck className="text-green-600" /> Completed on Time</span>
                                                        <span>{assignmentBreakdown.completedOnTime}</span>
                                                    </div>
                                                    <LinearProgress variant="determinate" value={75} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#34C759' } }} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1 text-xs sm:text-sm">
                                                        <span className="flex items-center gap-1"><FaClock className="text-yellow-600" /> Completed Late</span>
                                                        <span>{assignmentBreakdown.completedLate}</span>
                                                    </div>
                                                    <LinearProgress variant="determinate" value={15} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#F7DC6F' } }} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1 text-xs sm:text-sm">
                                                        <span className="flex items-center gap-1"><FaCalendarTimes className="text-red-600" /> Missing</span>
                                                        <span>{assignmentBreakdown.missing}</span>
                                                    </div>
                                                    <LinearProgress variant="determinate" value={10} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#FF3737' } }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                                            <FaLightbulb className="text-purple-600" />
                                            Teacher Feedback & Marks on Assignments
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {assignmentData.map((assignment, index) => (
                                                        <Parent_AssignmentRow key={index} {...assignment} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentProgress;