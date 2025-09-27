import React from 'react';

// Helper function to determine grade based on percentage
const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

// Reusable ExamRow Component
const Parent_ExamRow = React.memo(({ examType, subject, score, date }) => (
    <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">{examType}</td>
        <td className="px-6 py-4 whitespace-nowrap">{subject}</td>
        <td className="px-6 py-4 whitespace-nowrap">{score}/100</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">{getGradeFromPercentage(score)}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{date}</td>
    </tr>
));

export default Parent_ExamRow;