import React from 'react';

// Reusable AssignmentRow Component
const Parent_AssignmentRow = React.memo(({ title, subject, dueDate, status, score, feedback }) => (
    <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap font-medium">{title}</td>
        <td className="px-6 py-4 whitespace-nowrap">{subject}</td>
        <td className="px-6 py-4 whitespace-nowrap">{dueDate}</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 rounded text-xs ${status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {status}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{score}/100</td>
        <td className="px-6 py-4">{feedback}</td>
    </tr>
));

export default Parent_AssignmentRow;