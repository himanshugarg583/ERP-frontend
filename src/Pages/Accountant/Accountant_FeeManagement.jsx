import React, { useState, useMemo } from 'react';
import { FaMoneyBillWave, FaUsers, FaLayerGroup, FaSchool, FaCalendarAlt, FaClock, FaEnvelope, FaHistory, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_Section from './Accountant_Section';
import Accountant_Table from './Accountant_Table';
import Accountant_PieChartCard from './Accountant_PieChartCard';
import Accountant_SearchInput from './Accountant_SearchInput';
import Accountant_LateFeeModal from './Accountant_LateFeeModal';

const AccountantFeeManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [studentFeeSearchQuery, setStudentFeeSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lateFeeRules, setLateFeeRules] = useState({ percentage: 5, days: 5 });
    const [tempLateFeeRules, setTempLateFeeRules] = useState(lateFeeRules);
    const [formData, setFormData] = useState({
        studentId: '', studentName: '', classSection: '', parentName: '', parentContact: '', email: '',
        feeType: '', feeAmount: 0, discount: 0, lateFee: 0, totalPayable: 0,
        paymentMode: '', transactionRef: '', chequeNumber: '', bankName: '', chequeDate: '', receivedAmount: 0, balanceDue: 0, paymentStatus: 'Pending',
        remarks: '', attachments: null, dueAmount: 0 // Added dueAmount to formData
    });
    const [feeRecords, setFeeRecords] = useState([]);

    const feeData = useMemo(() => ({
        students: [
            { id: 1, name: 'John Doe', class: '10A', due: 5000, paid: 3000, dueDate: '2025-03-15', parentName: 'Robert Doe', parentContact: '9876543210', email: 'robert.doe@example.com' },
            { id: 2, name: 'Jane Smith', class: '9B', due: 4500, paid: 0, dueDate: '2025-03-10', parentName: 'Mary Smith', parentContact: '8765432109', email: 'mary.smith@example.com' },
            { id: 3, name: 'Alice Johnson', class: '10A', due: 6000, paid: 2000, dueDate: '2025-03-20', parentName: 'James Johnson', parentContact: '7654321098', email: 'james.j@example.com' },
            { id: 4, name: 'Bob Brown', class: '9B', due: 4000, paid: 1500, dueDate: '2025-03-25', parentName: 'Sarah Brown', parentContact: '6543210987', email: 'sarah.b@example.com' },
            { id: 5, name: 'Charlie Davis', class: '10C', due: 5500, paid: 3000, dueDate: '2025-03-30', parentName: 'Emma Davis', parentContact: '5432109876', email: 'emma.d@example.com' },
            { id: 6, name: 'Diana Prince', class: '9A', due: 5000, paid: 0, dueDate: '2025-03-12', parentName: 'William Prince', parentContact: '4321098765', email: 'william.p@example.com' }
        ],
        feeCategories: [
            { name: 'Tuition', amount: 3000, type: 'Recurring', frequency: 'Monthly' },
            { name: 'Transport', amount: 1500, type: 'Recurring', frequency: 'Quarterly' },
            { name: 'Library', amount: 500, type: 'Recurring', frequency: 'Yearly' },
            { name: 'Sports', amount: 1000, type: 'One-time', frequency: 'Annually' }
        ],
        transactions: [
            { id: 'TXN001', student: 'John Doe', amount: 3000, status: 'Success', date: '2025-03-01' },
            { id: 'TXN002', student: 'Jane Smith', amount: 4500, status: 'Failed', date: '2025-03-02' },
            { id: 'TXN003', student: 'Alice Johnson', amount: 2000, status: 'Success', date: '2025-03-05' },
            { id: 'TXN004', student: 'Bob Brown', amount: 1500, status: 'Success', date: '2025-03-06' },
            { id: 'TXN005', student: 'Charlie Davis', amount: 3000, status: 'Pending', date: '2025-03-07' },
            { id: 'TXN006', student: 'Diana Prince', amount: 5000, status: 'Success', date: '2025-03-08' }
        ]
    }), []);

    const chartData = useMemo(() => ({
        q1_2025: [{ label: 'Paid', value: 75000, color: '#4caf50' }, { label: 'Pending', value: 25000, color: '#f44336' }],
        q4_2024: [{ label: 'Paid', value: 65000, color: '#4caf50' }, { label: 'Pending', value: 35000, color: '#f44336' }],
        q3_2024: [{ label: 'Paid', value: 80000, color: '#4caf50' }, { label: 'Pending', value: 20000, color: '#f44336' }]
    }), []);

    const filteredStudentDetails = useMemo(() => feeData.students.filter(s => s.name.toLowerCase().includes(studentFeeSearchQuery.toLowerCase())), [studentFeeSearchQuery, feeData.students]);

    const updatedStudents = useMemo(() => {
        const studentsMap = new Map(feeData.students.map(s => [s.id, { ...s }]));
        feeRecords.forEach(record => {
            const student = studentsMap.get(parseInt(record.studentId));
            if (student) {
                student.paid += parseFloat(record.receivedAmount);
                student.due += parseFloat(record.balanceDue);
            }
        });
        return Array.from(studentsMap.values());
    }, [feeRecords, feeData.students]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'studentId') {
                const student = updatedStudents.find(s => s.id === parseInt(value));
                if (student) {
                    updated.studentName = student.name;
                    updated.classSection = student.class;
                    updated.parentName = student.parentName;
                    updated.parentContact = student.parentContact;
                    updated.email = student.email;
                    updated.dueAmount = student.due - student.paid; // Set dueAmount from updatedStudents
                } else {
                    updated.studentName = '';
                    updated.classSection = '';
                    updated.parentName = '';
                    updated.parentContact = '';
                    updated.email = '';
                    updated.feeAmount = 0;
                    updated.totalPayable = 0;
                    updated.dueAmount = 0;
                }
            }

            if (name === 'feeType') {
                const feeCategory = feeData.feeCategories.find(c => c.name === value);
                if (feeCategory) {
                    updated.feeAmount = feeCategory.amount;
                } else {
                    updated.feeAmount = 0;
                }
                updated.totalPayable = (parseFloat(updated.feeAmount) || 0) - (parseFloat(updated.discount) || 0) + (parseFloat(updated.lateFee) || 0);
            }

            if (['discount', 'lateFee'].includes(name)) {
                updated.totalPayable = (parseFloat(updated.feeAmount) || 0) - (parseFloat(updated.discount) || 0) + (parseFloat(updated.lateFee) || 0);
            }

            if (name === 'receivedAmount') {
                updated.balanceDue = updated.totalPayable - (parseFloat(value) || 0);
                updated.paymentStatus = updated.balanceDue === 0 ? 'Paid' : updated.balanceDue < updated.totalPayable ? 'Partially Paid' : 'Pending';
            }

            return updated;
        });
    };

    const isFormValid = () => {
        const requiredFields = [
            formData.studentId,
            formData.feeType,
            formData.paymentMode,
            formData.receivedAmount > 0 ? String(formData.receivedAmount) : ''
        ];

        if (formData.paymentMode === 'Cheque') {
            requiredFields.push(formData.chequeNumber, formData.bankName, formData.chequeDate);
        }
        if (['UPI', 'Net Banking', 'Cheque'].includes(formData.paymentMode)) {
            requiredFields.push(formData.transactionRef);
            if (!formData.attachments) requiredFields.push('');
        }

        return requiredFields.every(field => field && field.trim() !== '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            alert('Please fill all required fields before submitting.');
            return;
        }

        setFeeRecords(prev => [...prev, { ...formData, date: new Date().toISOString().split('T')[0] }]);
        setFormData({
            studentId: '', studentName: '', classSection: '', parentName: '', parentContact: '', email: '',
            feeType: '', feeAmount: 0, discount: 0, lateFee: 0, totalPayable: 0,
            paymentMode: '', transactionRef: '', chequeNumber: '', bankName: '', chequeDate: '', receivedAmount: 0, balanceDue: 0, paymentStatus: 'Pending',
            remarks: '', attachments: null, dueAmount: 0
        });
        alert('Fee collected successfully! Receipt generated and sent.');
    };

    const sendNotification = (type, studentName) => alert({ reminder: `Reminder sent to the parent of ${studentName} for due fees.`, action: `Action notification sent to admin for ${studentName}.` }[type]);
    const handleSaveRules = () => setLateFeeRules(tempLateFeeRules) || setIsModalOpen(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">Fee Management Dashboard</h1>

                <Accountant_Section title="Fee Collection" icon={FaMoneyBillWave} defaultOpen bgColor="blue">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2"><FaUsers className="text-blue-600" />Collect Fees</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block mb-1">Student ID <span className="text-red-500">*</span></label><input type="number" name="studentId" value={formData.studentId} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Student ID" required /></div>
                                <div><label className="block mb-1">Student Name</label><input type="text" name="studentName" value={formData.studentName} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Class & Section</label><input type="text" name="classSection" value={formData.classSection} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Parent Name</label><input type="text" name="parentName" value={formData.parentName} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Contact</label><input type="text" name="parentContact" value={formData.parentContact} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Email</label><input type="email" name="email" value={formData.email} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block mb-1">Fee Type <span className="text-red-500">*</span></label><select name="feeType" value={formData.feeType} onChange={handleInputChange} className="w-full p-2 border rounded" required><option value="">Select Fee Type</option>{feeData.feeCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
                                <div><label className="block mb-1">Fee Amount (₹)</label><input type="number" name="feeAmount" value={formData.feeAmount} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Discount (₹)</label><input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Discount" /></div>
                                <div><label className="block mb-1">Late Fee (₹)</label><input type="number" name="lateFee" value={formData.lateFee} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Late Fee" /></div>
                                <div><label className="block mb-1">Total Payable (₹)</label><input type="number" name="totalPayable" value={formData.totalPayable} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Due Amount (₹)</label><input type="number" name="dueAmount" value={formData.dueAmount} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block mb-1">Payment Mode <span className="text-red-500">*</span></label><select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} className="w-full p-2 border rounded" required><option value="">Select Mode</option><option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Card">Credit/Debit Card</option><option value="Net Banking">Net Banking</option><option value="Cheque">Cheque</option></select></div>
                                {formData.paymentMode === 'Cheque' && (
                                    <>
                                        <div><label className="block mb-1">Cheque Number <span className="text-red-500">*</span></label><input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Cheque Number" required /></div>
                                        <div><label className="block mb-1">Bank Name <span className="text-red-500">*</span></label><input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Bank Name" required /></div>
                                        <div><label className="block mb-1">Cheque Date <span className="text-red-500">*</span></label><input type="date" name="chequeDate" value={formData.chequeDate} onChange={handleInputChange} className="w-full p-2 border rounded" required /></div>
                                    </>
                                )}
                                {['UPI', 'Net Banking', 'Cheque'].includes(formData.paymentMode) && (
                                    <div><label className="block mb-1">Transaction Ref Number <span className="text-red-500">*</span></label><input type="text" name="transactionRef" value={formData.transactionRef} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Transaction Ref" required /></div>
                                )}
                                <div><label className="block mb-1">Received Amount (₹) <span className="text-red-500">*</span></label><input type="number" name="receivedAmount" value={formData.receivedAmount} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter Received Amount" required /></div>
                                <div><label className="block mb-1">Balance Due (₹)</label><input type="number" name="balanceDue" value={formData.balanceDue} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                                <div><label className="block mb-1">Payment Status</label><input type="text" name="paymentStatus" value={formData.paymentStatus} readOnly className="w-full p-2 border rounded bg-gray-100" /></div>
                            </div>

                            <div>
                                <label className="block mb-1">Remarks</label>
                                <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter any remarks"></textarea>
                                {['UPI', 'Net Banking', 'Cheque'].includes(formData.paymentMode) && (
                                    <div className="mt-2">
                                        <label className="block mb-1">Upload Documents <span className="text-red-500">*</span></label>
                                        <input type="file" name="attachments" onChange={(e) => setFormData(prev => ({ ...prev, attachments: e.target.files[0] }))} className="w-full p-2 border rounded" required />
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={!isFormValid()} className={`w-full p-2 rounded text-white ${isFormValid() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}>Collect Fee & Generate Receipt</button>
                        </form>
                    </div>
                </Accountant_Section>

                <Accountant_Section title="Fee Structure & Categories" icon={FaLayerGroup} bgColor="green">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-green-50 p-4 rounded-lg"><h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2"><FaSchool className="text-green-600" />Define Fee Categories</h3><Accountant_Table headers={['Category', 'Amount', 'Type']} data={feeData.feeCategories} renderRow={c => <tr key={c.name} className="hover:bg-gray-50"><td className="p-2 text-center">{c.name}</td><td className="text-center">₹{c.amount.toLocaleString()}</td><td className="text-center">{c.type} ({c.frequency})</td></tr>} /></div>
                        <div className="bg-green-50 p-4 rounded-lg"><h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2"><FaClock className="text-green-600" />Late Payment Rules</h3><div className="space-y-4 text-center"><p className="text-sm sm:text-base">Late Fee: {lateFeeRules.percentage}% after {lateFeeRules.days} days</p><button className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base" onClick={() => setIsModalOpen(true)}>Configure Rules</button></div></div>
                    </div>
                </Accountant_Section>

                <Accountant_LateFeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lateFeeRules={tempLateFeeRules} setLateFeeRules={setTempLateFeeRules} onSave={handleSaveRules} />

                <Accountant_Section title="Due Fees & Defaulters List" icon={FaCalendarAlt} bgColor="red">
                    <Accountant_Table headers={['Name', 'Class', 'Due Amount', 'Due Date', 'Actions']} data={updatedStudents.filter(s => s.due > s.paid)} renderRow={s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-2 text-center">{s.name}</td>
                            <td className="text-center">{s.class}</td>
                            <td className="text-center">₹{(s.due - s.paid).toLocaleString()}</td>
                            <td className="text-center">{s.dueDate}</td>
                            <td className="text-center">
                                <div className="flex flex-col sm:flex-row justify-center gap-2">
                                    <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 text-xs sm:text-sm" onClick={() => sendNotification('reminder', s.name)}><FaEnvelope />Remind</button>
                                    <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-sm" onClick={() => sendNotification('action', s.name)}>Action</button>
                                </div>
                            </td>
                        </tr>
                    )} />
                </Accountant_Section>

                <Accountant_Section title="Student Fee Details" icon={FaHistory} bgColor="yellow">
                    <Accountant_SearchInput value={studentFeeSearchQuery} onChange={e => setStudentFeeSearchQuery(e.target.value)} placeholder="Search student" />
                    {filteredStudentDetails.length > 0 && studentFeeSearchQuery && <div className="bg-yellow-50 p-4 rounded-lg text-sm sm:text-base">{filteredStudentDetails.map(s => (
                        <div key={s.id}><h3 className="text-base sm:text-lg font-medium mb-3">Fee Status: {s.name}</h3><p>Total Due: ₹{s.due.toLocaleString()} | Paid: ₹{s.paid.toLocaleString()} | Pending: ₹{(s.due - s.paid).toLocaleString()}</p><p>Payment History: <a href="#" className="text-blue-500">View Receipts</a></p><p>Scholarships: ₹500 applied</p></div>
                    ))}</div>}
                </Accountant_Section>

                <Accountant_Section title="Online Payment Transactions" icon={FaMoneyCheckAlt} bgColor="purple">
                    <Accountant_Table headers={['Transaction ID', 'Student', 'Amount', 'Status', 'Date']} data={feeData.transactions} renderRow={t => (
                        <tr key={t.id} className="hover:bg-gray-50"><td className="p-2 text-center">{t.id}</td><td className="text-center">{t.student}</td><td className="text-center">₹{t.amount.toLocaleString()}</td><td className={`text-center ${t.status === 'Success' ? 'text-green-600' : t.status === 'Failed' ? 'text-red-600' : 'text-yellow-600'}`}>{t.status}</td><td className="text-center">{t.date}</td></tr>
                    )} />
                </Accountant_Section>

                <Accountant_Section title="Reports & Analytics" icon={FaChartLine} bgColor="teal">
                    <div className="bg-teal-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">{['q1_2025', 'q4_2024', 'q3_2024'].map(q => <Accountant_PieChartCard key={q} title={q.toUpperCase().replace('_', ' ')} data={chartData[q]} />)}</div>
                </Accountant_Section>
            </main>
        </div>
    );
};

export default AccountantFeeManagement;