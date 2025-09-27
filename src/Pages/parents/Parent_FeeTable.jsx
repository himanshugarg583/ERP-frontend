import React from 'react';
import ParentReceiptDownload from './Parent_Receipt';

// Reusable Fee Table Component
const Parent_FeeTable = React.memo(({ headers, data }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50 transition-colors duration-150">
                        {Object.values(row).map((value, i) => (
                            <td key={i} className="px-6 py-4 whitespace-nowrap">
                                {typeof value === 'string' && (value.includes('Paid') || value.includes('Due') || value.includes('Partially Paid') || value.includes('Successful')) ? (
                                    <span className={`px-2 py-1 text-xs rounded-full ${value.includes('Paid') || value.includes('Successful') ? 'bg-green-100 text-green-800' : value.includes('Due') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {value}
                                    </span>
                                ) : value === 'download' ? <ParentReceiptDownload /> : value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));

export default Parent_FeeTable;