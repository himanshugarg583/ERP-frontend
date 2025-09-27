import React from 'react';

const Accountant_Table = ({ headers, data, renderRow, noDataMessage = 'No data available' }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
            <thead>
                <tr className="bg-gray-100">
                    {headers.map((header, idx) => (
                        <th key={idx} className="p-2 text-center">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, idx) => renderRow(item, idx))
                ) : (
                    <tr>
                        <td colSpan={headers.length} className="p-2 text-center text-gray-500">
                            {noDataMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default Accountant_Table;