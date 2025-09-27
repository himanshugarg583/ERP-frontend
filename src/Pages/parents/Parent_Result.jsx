import React, { useState, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Paper, SvgIcon, CircularProgress } from '@mui/material';
import Parent_ProgressBar from './Parent_ProgressBar';
import Parent_ExamDetail from './Parent_ExamDetail';

const ParentResult = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added sidebar state

    // Dynamic State (could come from props or API)
    const [studentData, setStudentData] = useState({
        name: 'Arun Kumar Singh',
        rollNumber: 'STU2023045',
        classSection: '10th Grade - Section A',
        academicYear: '2023-2024',
        totalMarks: 458,
        maxMarks: 500,
        status: 'PASS',
        currentGPA: 9.2,
        previousGPA: 8.5,
        attendance: 95,
        classRank: { rank: 3, total: 40 },
        sectionRank: { rank: 1, total: 25 },
    });

    const [performanceData, setPerformanceData] = useState([
        { label: 'Unit Test 1', percentage: 82 },
        { label: 'Unit Test 2', percentage: 85 },
        { label: 'Mid-Term', percentage: 88 },
        { label: 'Unit Test 3', percentage: 90 },
        { label: 'Final Exam', percentage: 92 },
    ]);

    const [subjects, setSubjects] = useState([
        { name: 'Mathematics', marks: '95/100', grade: 'A+', comment: 'Exceptional problem-solving skills. Keep up the good work!' },
        { name: 'Science', marks: '92/100', grade: 'A+', comment: 'Strong understanding of concepts. Excellent lab work.' },
        { name: 'English', marks: '88/100', grade: 'A', comment: 'Good writing skills. Can improve in vocabulary usage.' },
        { name: 'Social Studies', marks: '85/100', grade: 'A', comment: 'Shows keen interest in history. Can improve in geography.' },
        { name: 'Hindi', marks: '98/100', grade: 'A+', comment: 'Outstanding command over the language. Excellent expression.' },
    ]);

    const [examBreakdown, setExamBreakdown] = useState([
        {
            title: 'Unit Tests',
            data: {
                'Unit Test 1': '82%',
                'Unit Test 2': '85%',
                'Unit Test 3': '90%',
            },
            suggestion: 'Work on improving time management during tests.',
        },
        {
            title: 'Mid-Term Exam',
            data: { Marks: '440/500', Percentage: '88%', Grade: 'A', Rank: '5th in class' },
            suggestion: 'Focus more on practical applications in Science subjects.',
        },
        {
            title: 'Final Exam',
            data: { Marks: '458/500', Percentage: '91.6%', Grade: 'A+', Rank: '3rd in class' },
            suggestion: 'Continue with the current study plan, with more focus on critical thinking.',
        },
    ]);

    const [hoveredBar, setHoveredBar] = useState(null);

    // Dynamic Calculations
    const percentage = useMemo(() => (studentData.totalMarks / studentData.maxMarks) * 100, [studentData.totalMarks, studentData.maxMarks]);
    const improvement = useMemo(() => studentData.currentGPA - studentData.previousGPA, [studentData.currentGPA, studentData.previousGPA]);
    const termComparison = useMemo(() => [
        { term: 'Term 1', percentage: performanceData[0].percentage, color: '#60a5fa' },
        { term: 'Term 2', percentage: performanceData[performanceData.length - 1].percentage, color: '#2563eb' },
    ], [performanceData]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Updated wrapper */}
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Sidebar with props */}
                <main className="flex-1 overflow-y-auto lg:ml-64"> {/* Updated to lg:ml-64 */}
                    <Header setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Header with prop */}
                    <div className="p-4 md:p-6">
                        <div id="webcrumbs" className="w-full max-w-7xl mx-auto p-4">
                            <div className="p-6 grid grid-cols-12 gap-6">
                                {/* Student Information */}
                                <div className="col-span-12 lg:col-span-4 bg-blue-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Student Information
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Student Name:</span>
                                            <span className="font-semibold">{studentData.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Roll Number:</span>
                                            <span>{studentData.rollNumber}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Class & Section:</span>
                                            <span>{studentData.classSection}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium w-32">Academic Year:</span>
                                            <span>{studentData.academicYear}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Results Summary */}
                                <div className="col-span-12 lg:col-span-8 bg-green-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Exam Results Summary
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                            <p className="text-lg font-bold text-green-600">{studentData.status}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Total Marks</p>
                                            <p className="text-lg font-bold">{studentData.totalMarks} / {studentData.maxMarks}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Percentage</p>
                                            <p className="text-lg font-bold">{percentage.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">A+</div>
                                            <div className="ml-6">
                                                <p className="text-sm text-gray-500">Grade Point Average (GPA)</p>
                                                <p className="text-3xl font-bold">{studentData.currentGPA}/10</p>
                                                <p className="mt-1 text-sm text-green-600 font-medium">Excellent Performance</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Progress from Last Year</p>
                                            <div className="flex items-center justify-end">
                                                <p className={`text-xl font-bold ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {improvement > 0 ? `+${improvement.toFixed(2)}` : improvement.toFixed(2)}
                                                </p>
                                                {improvement > 0 ? (
                                                    <SvgIcon sx={{ color: 'green', ml: 1 }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                                                        </svg>
                                                    </SvgIcon>
                                                ) : (
                                                    <SvgIcon sx={{ color: 'red', ml: 1 }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 0l4 4m-4-4l-4 4" />
                                                        </svg>
                                                    </SvgIcon>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">(Last Year GPA: {studentData.previousGPA})</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subject-wise Marks & Grades */}
                                <div className="col-span-12 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Subject-wise Marks & Grades
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher's Comments</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {subjects.map((subject, idx) => (
                                                    <tr key={idx} className="hover:bg-blue-50 transition-all">
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{subject.marks}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{subject.grade}</span>
                                                        </td>
                                                        <td className="px-6 py-4">{subject.comment}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Performance Trends & Graphs */}
                                <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <SvgIcon sx={{ mr: 1, color: 'blue' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </SvgIcon>
                                        <Typography variant="h6" fontWeight="bold">Performance Trends & Graphs</Typography>
                                    </Box>
                                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', height: 300 }}>
                                        <BarChart
                                            xAxis={[{ scaleType: 'band', data: performanceData.map(item => item.label) }]}
                                            series={[{ data: performanceData.map(item => item.percentage), color: '#3b82f6' }]}
                                            height={250}
                                            tooltip={{
                                                trigger: 'item',
                                                formatter: (params) => {
                                                    const index = params.dataIndex;
                                                    setHoveredBar(index); // Update hovered bar state
                                                    return `${performanceData[index].label}: ${performanceData[index].percentage}%`;
                                                },
                                            }}
                                            onMouseLeave={() => setHoveredBar(null)} // Reset on mouse leave
                                        />
                                    </Paper>
                                    <Box mt={2} p={2} bgcolor="blue.50" borderRadius={2}>
                                        <Typography variant="body2">
                                            <strong>Improvement:</strong> +{(termComparison[1].percentage - termComparison[0].percentage)}% from Term 1 to Term 2
                                        </Typography>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Consistent Growth:</strong> Performance has steadily improved across all exams
                                        </Typography>
                                        {hoveredBar !== null && (
                                            <Typography variant="body2" mt={1}>
                                                <strong>Hovered:</strong> {performanceData[hoveredBar].label} - {performanceData[hoveredBar].percentage}%
                                            </Typography>
                                        )}
                                    </Box>
                                </div>

                                {/* Exam-wise Breakdown */}
                                <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        Exam-wise Breakdown
                                    </h2>
                                    {examBreakdown.map((exam, idx) => (
                                        <Parent_ExamDetail key={idx} title={exam.title} data={exam.data} suggestion={exam.suggestion} />
                                    ))}
                                </div>

                                {/* Attendance Impact on Results */}
                                <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Attendance Impact on Results
                                    </h2>
                                    <div className="flex items-center justify-center mt-2 mb-4">
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={studentData.attendance}
                                                size={144}
                                                thickness={4}
                                                sx={{ color: '#22c55e', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
                                            />
                                            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h5" component="div" color="text.secondary">{studentData.attendance}%</Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                    <div className="mt-4 bg-green-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-green-800 mb-2">Attendance & Performance Correlation</h3>
                                        <p className="text-sm mb-2">Your child's high attendance rate of <span className="font-semibold">{studentData.attendance}%</span> has positively impacted their academic performance.</p>
                                        <div className="space-y-4 mt-3">
                                            <Parent_ProgressBar value={studentData.attendance} label="Attendance" color="#22c55e" />
                                            <Parent_ProgressBar value={percentage} label="Performance" color="#3b82f6" />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 italic">Students with attendance above 90% typically score 15% higher than those with attendance below 80%.</p>
                                    </div>
                                </div>

                                {/* Ranking & Comparison */}
                                <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                                    <h2 className="text-xl font-bold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        Ranking & Comparison
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Class Rank</p>
                                            <p className="text-2xl font-bold">{studentData.classRank.rank}<span className="text-sm align-top">rd</span></p>
                                            <p className="text-xs text-gray-500 mt-1">Out of {studentData.classRank.total} students</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Section Rank</p>
                                            <p className="text-2xl font-bold">{studentData.sectionRank.rank}<span className="text-sm align-top">st</span></p>
                                            <p className="text-xs text-gray-500 mt-1">Out of {studentData.sectionRank.total} students</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h3 className="font-semibold mb-2">Past Performance Comparison</h3>
                                        <div className="space-y-2">
                                            {termComparison.map((term, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-sm">{term.term}</span>
                                                    <Box sx={{ width: '70%' }}>
                                                        <Parent_ProgressBar value={term.percentage} label="" color={term.color} />
                                                    </Box>
                                                    <span className="text-sm font-medium">{term.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-green-600 font-medium mt-2">
                                            Improved by {(termComparison[1].percentage - termComparison[0].percentage)}% from previous term!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-6 mb-6">
                                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-sm flex items-center transition-all hover:translate-y-[-2px]">
                                    Download Report Card
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentResult;