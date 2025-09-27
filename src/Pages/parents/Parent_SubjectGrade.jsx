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

// Reusable SubjectGrade Component
const Parent_SubjectGrade = React.memo(({ subject, percentage }) => (
    <li className="flex justify-between items-center">
        <span className="font-medium">{subject}</span>
        <div className="flex items-center">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${percentage >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {percentage}%
            </span>
            <span className="font-semibold">{getGradeFromPercentage(percentage)}</span>
        </div>
    </li>
));

export default Parent_SubjectGrade;