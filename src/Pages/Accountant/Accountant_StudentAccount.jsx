import React, { useState } from 'react';
import { FaWallet, FaHistory, FaGift, FaCalendar, FaCreditCard, FaUser, FaDownload, FaPrint, FaPaperPlane } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_Table from './Accountant_Table1';
import Accountant_Card from './Accountant_Card';
import Accountant_SearchBar from './Accountant_SearchBar';
import Accountant_ActionButton from './Accountant_ActionButton';

const studentDataList = [
    { name: 'Aarav Patel', class: 'X', section: 'B', rollNumber: 'ST20230045', feeBreakdown: [{ type: 'Tuition', amount: 50000, status: 'Paid' }, { type: 'Transport', amount: 15000, status: 'Pending' }, { type: 'Hostel', amount: 30000, status: 'Partially Paid' }, { type: 'Exam', amount: 8000, status: 'Paid' }], totalFeesCharged: 103000, totalFeesPaid: 68000, pendingFees: 35000, dueDate: '20 Mar 2025', paymentHistory: [{ date: '15 Jan 2025', amount: 50000, mode: 'UPI', receiptId: 'RCT25001' }, { date: '10 Feb 2025', amount: 18000, mode: 'Credit Card', receiptId: 'RCT25002' }], scholarships: [{ type: 'Merit Scholarship', amount: 10000, validity: '2025-26', status: 'Approved' }, { type: 'Sibling Discount', amount: 5000, validity: '2025-26', status: 'Pending' }], upcomingPayments: [{ installment: '2nd Installment', amount: 35000, dueDate: '20 Mar 2025', latePenalty: '₹500/week' }], lastPaymentMode: 'UPI', transactions: [{ date: '15 Jan 2025', amount: 50000, mode: 'UPI', status: 'Successful' }, { date: '10 Feb 2025', amount: 18000, mode: 'Credit Card', status: 'Successful' }], parentDetails: { name: 'Mr. Rajesh Patel', contact: '+91 98765 43210', notifications: ['Email', 'WhatsApp'] } },
    { name: 'Priya Sharma', class: 'XI', section: 'A', rollNumber: 'ST20230046', feeBreakdown: [{ type: 'Tuition', amount: 55000, status: 'Paid' }, { type: 'Transport', amount: 12000, status: 'Paid' }], totalFeesCharged: 67000, totalFeesPaid: 67000, pendingFees: 0, dueDate: '15 Apr 2025', paymentHistory: [{ date: '20 Jan 2025', amount: 67000, mode: 'Bank Transfer', receiptId: 'RCT25003' }], scholarships: [], upcomingPayments: [], lastPaymentMode: 'Bank Transfer', transactions: [{ date: '20 Jan 2025', amount: 67000, mode: 'Bank Transfer', status: 'Successful' }], parentDetails: { name: 'Mrs. Neha Sharma', contact: '+91 87654 32109', notifications: ['SMS'] } }
];

const AccountantStudentAccounts = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(studentDataList[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSelectedStudent(term.trim() === '' ? studentDataList[0] : studentDataList.find(s => s.name.toLowerCase().includes(term.toLowerCase()) || s.rollNumber.toLowerCase().includes(term.toLowerCase())) || studentDataList[0]);
    };

    const actions = {
        downloadReceipt: (receiptId) => alert(`Downloading receipt ${receiptId || 'report'}`),
        printStatement: () => alert('Printing fee statement'),
        sendReminder: () => alert('Reminder sent to parent'),
        makePayment: () => alert('Redirecting to payment gateway')
    };

    const tables = {
        feeBreakdown: { headers: ['Fee Type', 'Amount (₹)', 'Status'], rowRenderer: f => <><td className="px-4 py-2">{f.type}</td><td className="px-4 py-2">{f.amount.toLocaleString()}</td><td className="px-4 py-2"><span className={`px-2 py-1 text-xs rounded-full ${f.status === 'Paid' ? 'bg-green-100 text-green-800' : f.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{f.status}</span></td></> },
        paymentHistory: { headers: ['Date', 'Amount (₹)', 'Mode', 'Receipt'], rowRenderer: p => <><td className="px-4 py-2">{p.date}</td><td className="px-4 py-2">{p.amount.toLocaleString()}</td><td className="px-4 py-2">{p.mode}</td><td className="px-4 py-2"><button onClick={() => actions.downloadReceipt(p.receiptId)} className="text-indigo-600 hover:underline flex items-center"><FaDownload className="mr-1" />Download</button></td></> },
        scholarships: { headers: ['Type', 'Amount (₹)', 'Validity', 'Status'], rowRenderer: s => <><td className="px-4 py-2">{s.type}</td><td className="px-4 py-2">{s.amount.toLocaleString()}</td><td className="px-4 py-2">{s.validity}</td><td className="px-4 py-2"><span className={`px-2 py-1 text-xs rounded-full ${s.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{s.status}</span></td></> },
        upcomingPayments: { headers: ['Installment', 'Amount (₹)', 'Due Date', 'Late Penalty'], rowRenderer: p => <><td className="px-4 py-2">{p.installment}</td><td className="px-4 py-2">{p.amount.toLocaleString()}</td><td className="px-4 py-2">{p.dueDate}</td><td className="px-4 py-2">{p.latePenalty}</td></> },
        transactions: { headers: ['Date', 'Amount (₹)', 'Mode', 'Status'], rowRenderer: t => <><td className="px-4 py-2">{t.date}</td><td className="px-4 py-2">{t.amount.toLocaleString()}</td><td className="px-4 py-2">{t.mode}</td><td className="px-4 py-2"><span className={`px-2 py-1 text-xs rounded-full ${t.status === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span></td></> }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center text-indigo-700">Student Accounts - Fee Management</h1>
                <div className="grid grid-cols-1 gap-6">
                    <Accountant_Card title="Student Fee Details" icon={<FaWallet className="text-indigo-500" />} defaultOpen>
                        <div className="flex justify-end mb-4"><Accountant_SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search by name or roll number..." /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><div><p className="text-gray-500">Student Name</p><p className="font-medium">{selectedStudent.name}</p></div><div><p className="text-gray-500">Class & Section</p><p className="font-medium">{selectedStudent.class}-{selectedStudent.section}</p></div><div><p className="text-gray-500">Roll Number</p><p className="font-medium">{selectedStudent.rollNumber}</p></div><div><p className="text-gray-500">Due Date</p><p className="font-medium text-red-600">{selectedStudent.dueDate}</p></div></div>
                        <div className="mb-6"><h3 className="font-medium text-gray-700 mb-2">Fee Category Breakdown</h3><Accountant_Table headers={tables.feeBreakdown.headers} data={selectedStudent.feeBreakdown} rowRenderer={tables.feeBreakdown.rowRenderer} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><p className="text-gray-500">Total Fees Charged</p><p className="font-medium text-indigo-700">₹{selectedStudent.totalFeesCharged.toLocaleString()}</p></div><div><p className="text-gray-500">Total Fees Paid</p><p className="font-medium text-green-600">₹{selectedStudent.totalFeesPaid.toLocaleString()}</p></div><div><p className="text-gray-500">Pending Fees</p><p className="font-medium text-red-600">₹{selectedStudent.pendingFees.toLocaleString()}</p></div></div>
                    </Accountant_Card>

                    <Accountant_Card title="Payment History" icon={<FaHistory className="text-indigo-500" />}><Accountant_Table headers={tables.paymentHistory.headers} data={selectedStudent.paymentHistory} rowRenderer={tables.paymentHistory.rowRenderer} /></Accountant_Card>
                    <Accountant_Card title="Scholarships & Discounts" icon={<FaGift className="text-indigo-500" />}><Accountant_Table headers={tables.scholarships.headers} data={selectedStudent.scholarships} rowRenderer={tables.scholarships.rowRenderer} /></Accountant_Card>
                    <Accountant_Card title="Pending & Upcoming Payments" icon={<FaCalendar className="text-indigo-500" />}><Accountant_Table headers={tables.upcomingPayments.headers} data={selectedStudent.upcomingPayments} rowRenderer={tables.upcomingPayments.rowRenderer} /></Accountant_Card>
                    <Accountant_Card title="Online Payment & Transactions" icon={<FaCreditCard className="text-indigo-500" />}><p className="mb-4">Last Payment Mode: <span className="font-medium">{selectedStudent.lastPaymentMode}</span></p><Accountant_Table headers={tables.transactions.headers} data={selectedStudent.transactions} rowRenderer={tables.transactions.rowRenderer} /></Accountant_Card>
                    <Accountant_Card title="Parent / Guardian Details" icon={<FaUser className="text-indigo-500" />}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><p className="text-gray-500">Name</p><p className="font-medium">{selectedStudent.parentDetails.name}</p></div><div><p className="text-gray-500">Contact</p><p className="font-medium">{selectedStudent.parentDetails.contact}</p></div><div><p className="text-gray-500">Notification Preferences</p><p className="font-medium">{selectedStudent.parentDetails.notifications.join(', ')}</p></div></div></Accountant_Card>
                    <Accountant_Card title="Actions & Quick Links" icon={<FaPaperPlane className="text-indigo-500" />}><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[
                        { label: 'Make a Payment', icon: <FaCreditCard />, onClick: actions.makePayment, bgColor: 'bg-indigo-600' },
                        { label: 'Send Reminder', icon: <FaPaperPlane />, onClick: actions.sendReminder, bgColor: 'bg-blue-600' },
                        { label: 'Download Fee Report', icon: <FaDownload />, onClick: actions.downloadReceipt, bgColor: 'bg-green-600' },
                        { label: 'Print Fee Statement', icon: <FaPrint />, onClick: actions.printStatement, bgColor: 'bg-gray-600' }
                    ].map((a, i) => <Accountant_ActionButton key={i} {...a} />)}</div></Accountant_Card>
                </div>
            </main>
        </div>
    );
};

export default AccountantStudentAccounts;