import React, { useState, useMemo, useEffect } from 'react';
import { FaMoneyBillWave, FaUsers, FaBus, FaBuilding, FaChartPie, FaDownload, FaHistory, FaFileInvoiceDollar, FaRedo, FaCog, FaWallet, FaCreditCard, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import Accountant_Section from './Accountant_Section';
import Accountant_Table from './Accountant_Table';
import Accountant_PieChartCard from './Accountant_PieChartCard';
import Accountant_SearchInput from './Accountant_SearchInput';
import Accountant_PaymentMethod from './Accountant_PaymentMethod';
import Accountant_SettingsModal from './Accountant_SettingsModal';

const OnlinePaymentPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQueries, setSearchQueries] = useState({ student: '', employee: '', vendor: '', transaction: '' });
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState({ upi: true, cards: true, netBanking: true, wallets: true, transactionFee: 2, reminders: true });
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [bankDetails, setBankDetails] = useState({ accountNo: '', ifsc: '', name: '' });
    const [leaves, setLeaves] = useState({ full: 0, half: 0 });

    const paymentData = useMemo(() => ({
        overview: { todayCollected: 15000, monthlyCollected: 450000, yearlyCollected: 5400000, pendingPayments: 120000, successfulTx: 85, failedTx: 15, paymentMethods: [{ label: 'UPI', value: 60 }, { label: 'Cards', value: 25 }, { label: 'Net Banking', value: 10 }, { label: 'Wallets', value: 5 }] },
        students: [{ id: 1, name: 'John Doe', class: '10A', rollNo: 'A001', totalFee: 5000, paid: 3000, date: '2025-03-15', mode: 'UPI', status: 'Successful', lateFee: 0 }, { id: 2, name: 'Jane Smith', class: '9B', rollNo: 'B002', totalFee: 4500, paid: 0, date: '2025-03-10', mode: 'Cards', status: 'Failed', lateFee: 225 }],
        employees: [
            { id: 'E001', name: 'Mr. Sharma', dept: 'Teaching', salary: 50000, paid: 50000, deductions: 5000, bonus: 2000, mode: 'Bank Transfer', status: 'Paid', date: '2025-03-01', fullDayLeaves: 2, halfDayLeaves: 1, bankDetails: { accountNo: '1234567890', ifsc: 'SBIN0001234', name: 'Mr. Sharma' } },
            { id: 'E002', name: 'Ms. Patel', dept: 'Admin', salary: 35000, paid: 0, deductions: 3000, bonus: 0, mode: 'UPI', status: 'Pending', date: '2025-03-05', fullDayLeaves: 1, halfDayLeaves: 3, bankDetails: { accountNo: '0987654321', ifsc: 'HDFC0005678', name: 'Ms. Patel' } },
            { id: 'E003', name: 'Mr. Kumar', dept: 'IT', salary: 45000, paid: 0, deductions: 4000, bonus: 1000, mode: 'Net Banking', status: 'Pending', date: '2025-03-10', fullDayLeaves: 0, halfDayLeaves: 2, bankDetails: { accountNo: '4567891230', ifsc: 'ICIC0009012', name: 'Mr. Kumar' } }
        ],
        vendors: [{ id: 'V001', name: 'Transport Co.', invoice: 'INV001', due: 20000, paid: 20000, mode: 'Net Banking', status: 'Paid', date: '2025-03-10' }, { id: 'V002', name: 'Book Supplier', invoice: 'INV002', due: 15000, paid: 0, mode: 'Cards', status: 'Pending', date: '2025-03-15' }],
        transport: [{ id: 'T001', student: 'John Doe', total: 1500, paid: 1500, mode: 'UPI', status: 'Paid', date: '2025-03-12' }, { id: 'T002', student: 'Jane Smith', total: 1500, paid: 0, mode: 'Wallets', status: 'Pending', date: '2025-03-14' }],
        expenses: [{ type: 'Electricity', total: 50000, spent: 45000, budget: 60000, date: '2025-03-01' }, { type: 'Canteen', total: 30000, spent: 25000, budget: 35000, date: '2025-03-05' }],
        transactions: [{ id: 'TX001', type: 'Student Fee', amount: 3000, mode: 'UPI', status: 'Successful', date: '2025-03-15' }, { id: 'TX002', type: 'Salary', amount: 50000, mode: 'Bank Transfer', status: 'Paid', date: '2025-03-01' }],
        refunds: [{ id: 'R001', requester: 'John Doe', amount: 500, reason: 'Overpayment', status: 'Approved', date: '2025-03-10' }, { id: 'R002', requester: 'Vendor Co.', amount: 1000, reason: 'Cancellation', status: 'Pending', date: '2025-03-12' }]
    }), []);

    const filters = {
        students: (paymentData.students ?? []).filter(s => [s.name ?? '', s.class ?? '', s.rollNo ?? ''].some(v => v.toLowerCase().includes((searchQueries.student ?? '').toLowerCase()))),
        employees: (paymentData.employees ?? []).filter(e => [e.name ?? '', e.id ?? ''].some(v => v.toLowerCase().includes((searchQueries.employee ?? '').toLowerCase()))),
        vendors: (paymentData.vendors ?? []).filter(v => [v.name ?? '', v.invoice ?? ''].some(v => v.toLowerCase().includes((searchQueries.vendor ?? '').toLowerCase()))),
        transactions: (paymentData.transactions ?? []).filter(t => [t.id ?? '', t.type ?? ''].some(v => v.toLowerCase().includes((searchQueries.transaction ?? '').toLowerCase())))
    };

    const departments = ['Teaching', 'Admin', 'IT', 'Security', 'Vendor'];
    const employeesByDept = (paymentData.employees ?? []).filter(e => (e.dept ?? '') === (selectedDepartment ?? ''));
    const workingDays = 30 - 4 - 2;

    const calculateSalaryBreakdown = () => {
        if (!selectedEmployee) return null;
        const salary = selectedEmployee.salary ?? 0;
        const components = { basic: 0.5, hra: 0.15, da: 0.1, special: 0.15, conveyance: 0.1 };
        const grossSalary = Object.values(components).reduce((sum, rate) => sum + salary * rate, 0);
        const dailySalary = salary / workingDays;
        const leaveDeduction = (leaves.full ?? 0) * dailySalary + (leaves.half ?? 0) * dailySalary * 0.5;
        const deductions = { 
            pf: components.basic * salary * 0.12, 
            pt: 200, 
            tds: (grossSalary - components.hra * salary - components.basic * salary * 0.12) * 0.1, 
            leave: leaveDeduction 
        };
        const totalDeductions = Object.values(deductions ?? {}).reduce((sum, val) => sum + (val ?? 0), 0);
        return { 
            ...Object.fromEntries(Object.entries(components).map(([k, v]) => [k + 'Salary', salary * v])), 
            grossSalary, 
            ...deductions, 
            totalDeductions, 
            netSalary: grossSalary - totalDeductions 
        };
    };

    const salaryBreakdown = calculateSalaryBreakdown();

    useEffect(() => {
        setLeaves(selectedEmployee ? { full: selectedEmployee.fullDayLeaves ?? 0, half: selectedEmployee.halfDayLeaves ?? 0 } : { full: 0, half: 0 });
        setBankDetails(selectedEmployee ? {
            accountNo: selectedEmployee.bankDetails?.accountNo ?? '',
            ifsc: selectedEmployee.bankDetails?.ifsc ?? '',
            name: selectedEmployee.bankDetails?.name ?? ''
        } : { accountNo: '', ifsc: '', name: '' });
    }, [selectedEmployee]);

    const handlers = {
        download: (type, id) => alert(`Downloading ${type ?? 'N/A'} for ${id ?? 'unknown'}`),
        retry: id => alert(`Retrying transaction ${id ?? 'unknown'}`),
        saveSettings: () => setIsSettingsModalOpen(false) || alert('Settings saved!'),
        paySalary: () => !selectedEmployee || !Object.values(bankDetails ?? {}).every(Boolean) ? alert('Please fill all bank details and select an employee.') : alert(`Paying ₹${(salaryBreakdown?.netSalary ?? 0).toLocaleString()} to ${selectedEmployee.name ?? 'N/A'}`),
        search: (type) => e => setSearchQueries(q => ({ ...q, [type]: e.target.value ?? '' }))
    };

    const tableConfigs = {
        students: { 
            headers: ['Name', 'Class', 'Roll No', 'Total', 'Paid', 'Pending', 'Date', 'Mode', 'Status', 'Action'], 
            data: filters.students, 
            row: s => [s.name ?? 'N/A', s.class ?? 'N/A', s.rollNo ?? 'N/A', s.totalFee ?? 0, s.paid ?? 0, (s.totalFee ?? 0) - (s.paid ?? 0), s.date ?? 'N/A', s.mode ?? 'N/A', s.status ?? 'N/A', <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-sm flex items-center gap-1 mx-auto" onClick={() => handlers.download('receipt', s.id)}><FaDownload />Receipt</button>], 
            statusColor: { Successful: 'green-600', Failed: 'red-600', Pending: 'yellow-600' } 
        },
        employees: { 
            headers: ['Name', 'ID', 'Dept', 'Salary', 'Paid', 'Deductions', 'Bonus', 'Mode', 'Status', 'Action'], 
            data: filters.employees, 
            row: e => [e.name ?? 'N/A', e.id ?? 'N/A', e.dept ?? 'N/A', e.salary ?? 0, e.paid ?? 0, e.deductions ?? 0, e.bonus ?? 0, e.mode ?? 'N/A', e.status ?? 'N/A', <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-sm flex items-center gap-1 mx-auto" onClick={() => handlers.download('slip', e.id)}><FaDownload />Slip</button>], 
            statusColor: { Paid: 'green-600', Pending: 'yellow-600' } 
        },
        vendors: { 
            headers: ['Vendor', 'Invoice', 'Due', 'Paid', 'Mode', 'Status', 'Date', 'Action'], 
            data: filters.vendors, 
            row: v => [v.name ?? 'N/A', v.invoice ?? 'N/A', v.due ?? 0, v.paid ?? 0, v.mode ?? 'N/A', v.status ?? 'N/A', v.date ?? 'N/A', <button className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs sm:text-sm flex items-center gap-1 mx-auto" onClick={() => handlers.download('receipt', v.id)}><FaDownload />Receipt</button>], 
            statusColor: { Paid: 'green-600', Pending: 'yellow-600' } 
        },
        transport: { 
            headers: ['Student', 'Total', 'Paid', 'Pending', 'Mode', 'Status', 'Date', 'Action'], 
            data: paymentData.transport ?? [], 
            row: t => [t.student ?? 'N/A', t.total ?? 0, t.paid ?? 0, (t.total ?? 0) - (t.paid ?? 0), t.mode ?? 'N/A', t.status ?? 'N/A', t.date ?? 'N/A', <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm flex items-center gap-1 mx-auto" onClick={() => handlers.download('receipt', t.id)}><FaDownload />Receipt</button>], 
            statusColor: { Paid: 'green-600', Pending: 'yellow-600' } 
        },
        expenses: { 
            headers: ['Type', 'Total', 'Spent', 'Budget', 'Date'], 
            data: paymentData.expenses ?? [], 
            row: e => [e.type ?? 'N/A', e.total ?? 0, e.spent ?? 0, e.budget ?? 0, e.date ?? 'N/A'] 
        },
        transactions: { 
            headers: ['ID', 'Type', 'Amount', 'Mode', 'Status', 'Date', 'Action'], 
            data: filters.transactions, 
            row: t => [t.id ?? 'N/A', t.type ?? 'N/A', t.amount ?? 0, t.mode ?? 'N/A', t.status ?? 'N/A', t.date ?? 'N/A', (t.status ?? '') === 'Failed' && <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm flex items-center gap-1 mx-auto" onClick={() => handlers.retry(t.id)}><FaRedo />Retry</button>], 
            statusColor: { Successful: 'green-600', Paid: 'green-600', Pending: 'yellow-600' } 
        },
        refunds: { 
            headers: ['Requester', 'Amount', 'Reason', 'Status', 'Date'], 
            data: paymentData.refunds ?? [], 
            row: r => [r.requester ?? 'N/A', r.amount ?? 0, r.reason ?? 'N/A', r.status ?? 'N/A', r.date ?? 'N/A'], 
            statusColor: { Approved: 'green-600', Pending: 'yellow-600' } 
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Online Payment Management</h1>

                <Accountant_Section title="Payment Overview" icon={FaChartPie} defaultOpen bgColor="teal">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">{[
                        ['Today Collected', paymentData.overview?.todayCollected ?? 0, 'teal-600'], 
                        ['Monthly Collected', paymentData.overview?.monthlyCollected ?? 0, 'teal-600'],
                        ['Yearly Collected', paymentData.overview?.yearlyCollected ?? 0, 'teal-600'], 
                        ['Pending Payments', paymentData.overview?.pendingPayments ?? 0, 'red-600']
                    ].map(([title, value, color], i) => (
                        <div key={i} className="bg-teal-50 p-4 rounded-lg text-center">
                            <h3 className="text-sm sm:text-base font-medium">{title}</h3>
                            <p className={`text-lg sm:text-xl font-bold text-${color}`}>₹{value.toLocaleString()}</p>
                        </div>
                    ))}</div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Accountant_PieChartCard title="Payment Methods" data={paymentData.overview?.paymentMethods ?? []} />
                        <Accountant_PieChartCard title="Transaction Status" data={[
                            { label: 'Successful', value: paymentData.overview?.successfulTx ?? 0 }, 
                            { label: 'Failed', value: paymentData.overview?.failedTx ?? 0 }
                        ]} />
                    </div>
                </Accountant_Section>

                <Accountant_Section title="Online Payment" icon={FaMoneyBillWave} bgColor="blue">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-medium mb-4">Pay Staff, Teachers, Admins, Vendors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                                <select 
                                    value={selectedDepartment ?? ''} 
                                    onChange={e => setSelectedDepartment(e.target.value ?? '')} 
                                    className="w-full p-2 border rounded-md mb-4"
                                >
                                    <option value="">-- Select --</option>
                                    {(departments ?? []).map(d => <option key={d ?? ''} value={d ?? ''}>{d ?? 'N/A'}</option>)}
                                </select>
                                {selectedDepartment && (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                                        <select 
                                            value={selectedEmployee?.id ?? ''} 
                                            onChange={e => setSelectedEmployee((paymentData.employees ?? []).find(emp => emp.id === e.target.value) ?? null)} 
                                            className="w-full p-2 border rounded-md mb-4"
                                        >
                                            <option value="">-- Select --</option>
                                            {(employeesByDept ?? []).map(emp => <option key={emp.id ?? ''} value={emp.id ?? ''}>{emp.name ?? 'N/A'}</option>)}
                                        </select>
                                    </>
                                )}
                                {selectedEmployee && (
                                    <>
                                        <h4 className="text-sm font-medium mb-2">Bank Details</h4>
                                        {['accountNo', 'ifsc', 'name'].map((field, i) => (
                                            <input 
                                                key={i} 
                                                type="text" 
                                                placeholder={field === 'accountNo' ? 'Account Number' : field === 'ifsc' ? 'IFSC Code' : 'Account Holder Name'} 
                                                value={bankDetails[field] ?? ''} 
                                                onChange={e => setBankDetails({ ...bankDetails, [field]: e.target.value ?? '' })} 
                                                className="w-full p-2 border rounded-md mb-2" 
                                            />
                                        ))}
                                        <h4 className="text-sm font-medium mb-2">Leave Details</h4>
                                        {['full', 'half'].map((type, i) => (
                                            <div key={i} className="mb-2">
                                                <label className="block text-sm text-gray-600">{type === 'full' ? 'Full' : 'Half'} Day Leaves</label>
                                                <input 
                                                    type="number" 
                                                    value={leaves[type] ?? 0} 
                                                    onChange={e => setLeaves({ ...leaves, [type]: Number(e.target.value ?? 0) })} 
                                                    className="w-full p-2 border rounded-md" 
                                                    min="0" 
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            {salaryBreakdown && (
                                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2"><FaWallet className="text-indigo-600" />Salary Breakdown</h3>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 flex items-center justify-between">
                                            <span>Working Days</span>
                                            <span className="font-medium">{workingDays} (Excl. 4 Sundays, 2 Holidays)</span>
                                        </div>
                                        {[['Earnings', { basicSalary: 'Basic Salary', hra: 'HRA', da: 'DA', specialSalary: 'Special Allowance', conveyanceSalary: 'Conveyance' }, 'green', '+'], ['Deductions', { pf: 'PF (12%)', pt: 'Professional Tax', tds: 'TDS', leaveDeduction: 'Leave Deduction' }, 'red', '-']].map(([title, fields, color, sign], i) => (
                                            <div key={i} className="border-b pb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    {Object.entries(fields).map(([k, v]) => (
                                                        <div key={k} className={`flex justify-between items-center p-2 bg-${color}-50 rounded-md hover:bg-${color}-100 transition-colors`}>
                                                            <span className="text-gray-600">{v}</span>
                                                            <span className={`font-semibold text-${color}-700`}>{sign}₹{(salaryBreakdown[k] ?? 0).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={`flex justify-between items-center mt-3 p-2 bg-${color}-100 rounded-md`}>
                                                    <span className="text-gray-700 font-medium">Total {title}</span>
                                                    <span className={`text-lg font-bold text-${color}-800`}>{sign}₹{(salaryBreakdown[i === 0 ? 'grossSalary' : 'totalDeductions'] ?? 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center p-3 bg-indigo-100 rounded-md">
                                            <span className="text-gray-700 font-medium">Net Salary</span>
                                            <span className="text-xl font-bold text-indigo-800">₹{(salaryBreakdown.netSalary ?? 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h4>
                                        <Accountant_PaymentMethod icon={<FaCreditCard className="mr-3 text-indigo-600" />} title="Credit / Debit Card">
                                            <form>
                                                <input type="text" placeholder="Card Number" className="w-full p-2 border rounded-md mb-2" />
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md" />
                                                    <input type="text" placeholder="CVV" className="w-full p-2 border rounded-md" />
                                                </div>
                                                <input type="text" placeholder="Card Holder Name" className="w-full p-2 border rounded-md" />
                                            </form>
                                        </Accountant_PaymentMethod>
                                        <Accountant_PaymentMethod icon={<FaQrcode className="mr-3 text-indigo-600" />} title="UPI Payment">
                                            <input type="text" placeholder="username@upi" className="w-full p-2 border rounded-md mb-2" />
                                            <img src="https://cdn-icons-png.flaticon.com/128/4903/4903482.png" alt="QR Code" className="h-24 mx-auto" />
                                        </Accountant_PaymentMethod>
                                    </div>
                                    <button 
                                        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg" 
                                        onClick={handlers.paySalary}
                                    >
                                        <FaCheckCircle className="text-lg" />Pay Now (₹{(salaryBreakdown.netSalary ?? 0).toLocaleString()})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Accountant_Section>

                {Object.entries({
                    'Student Fee Payments': { icon: FaMoneyBillWave, bgColor: 'blue', search: 'student' },
                    'Employee Salary Payments': { icon: FaUsers, bgColor: 'green', search: 'employee' },
                    'Vendor & Supplier Payments': { icon: FaFileInvoiceDollar, bgColor: 'purple', search: 'vendor' },
                    'Transport Payments': { icon: FaBus, bgColor: 'yellow' },
                    'Expense & Maintenance Payments': { icon: FaBuilding, bgColor: 'red' },
                    'Transaction History & Logs': { icon: FaHistory, bgColor: 'purple', search: 'transaction' },
                    'Refunds & Chargebacks': { icon: FaRedo, bgColor: 'yellow' }
                }).map(([title, { icon, bgColor, search }], i) => {
                    const key = title.toLowerCase().replace(/ & /g, ' ').split(' ')[0] + 's';
                    const config = tableConfigs[key];

                    return (
                        <Accountant_Section key={i} title={title} icon={icon} bgColor={bgColor}>
                            {search && (
                                <Accountant_SearchInput 
                                    value={searchQueries[search] ?? ''} 
                                    onChange={handlers.search(search)} 
                                    placeholder={`Search by ${search === 'student' ? 'name, class, or roll number' : search === 'employee' ? 'name or ID' : search === 'vendor' ? 'vendor name or invoice' : 'ID or type'}`} 
                                />
                            )}
                            {config ? (
                                <Accountant_Table 
                                    headers={config.headers} 
                                    data={config.data} 
                                    renderRow={item => (
                                        <tr key={item.id ?? item.type ?? ''} className="hover:bg-gray-50">
                                            {config.row(item).map((cell, j) => (
                                                <td 
                                                    key={j} 
                                                    className={`p-2 text-center ${j === 8 && config.statusColor?.[item.status ?? ''] ? `text-${config.statusColor[item.status ?? '']}` : ''}`}
                                                >
                                                    {typeof cell === 'number' ? `₹${cell.toLocaleString()}` : cell}
                                                </td>
                                            ))}
                                        </tr>
                                    )} 
                                />
                            ) : (
                                <p>No data available for {title}</p> // Fallback message
                            )}
                        </Accountant_Section>
                    );
                })}

                <Accountant_Section title="Settings & Configurations" icon={FaCog} bgColor="blue">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base" 
                        onClick={() => setIsSettingsModalOpen(true)}
                    >
                        Configure Payment Settings
                    </button>
                </Accountant_Section>

                <Accountant_SettingsModal 
                    isOpen={isSettingsModalOpen ?? false} 
                    onClose={() => setIsSettingsModalOpen(false)} 
                    settings={paymentSettings ?? {}} 
                    onSettingsChange={setPaymentSettings} 
                    onSave={handlers.saveSettings} 
                />
            </main>
        </div>
    );
};

export default OnlinePaymentPage;