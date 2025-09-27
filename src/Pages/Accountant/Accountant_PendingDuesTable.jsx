import React from 'react';

const Accountant_PendingDuesTable = () => {
    const duesData = [
        { name: 'John Doe', amount: '₹15,000', dueDate: '10 Mar 2025' },
        { name: 'Jane Smith', amount: '₹10,000', dueDate: '12 Mar 2025' },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-8 hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">Pending Dues & Defaulters</h2>
            <div className="overflow-auto max-h-[200px]">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {duesData.map((due, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{due.name}</td>
                                <td className="px-4 py-3 text-sm">{due.amount}</td>
                                <td className="px-4 py-3 text-sm">{due.dueDate}</td>
                                <td className="px-4 py-3 text-sm">
                                    <button className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors">
                                        Send Reminder
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Accountant_PendingDuesTable;