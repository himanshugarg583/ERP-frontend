import React from 'react';

// Reusable Table Row Component
const Parent_TableRow = React.memo(({ date, status, time, comments, statusColor }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm">{date}</td>
        <td className="px-4 py-3 text-sm">
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs`}>{status}</span>
        </td>
        <td className="px-4 py-3 text-sm">{time}</td>
        <td className="px-4 py-3 text-sm">{comments}</td>
    </tr>
));

export default Parent_TableRow;