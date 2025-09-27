import React from 'react';

const Accountant_Table1 = ({ headers, data, rowRenderer }) => (
    <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
            <tr>
                {headers.map((header, idx) => (
                    <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.length > 0 ? (
                data.map((item, index) => (
                    <tr key={index} className="hover:bg-indigo-50">
                        {rowRenderer(item, index)}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={headers.length} className="px-4 py-2 text-center text-gray-500">
                        No data available
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

export default Accountant_Table1;