import React, { useState, useMemo } from 'react';
import { FaWallet, FaTree, FaMoneyBillWave, FaHistory, FaDownload, FaInfoCircle, FaCreditCard, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import LinearProgress from '@mui/material/LinearProgress';
import Parent_FeeTable from './Parent_FeeTable';
import Parent_PaymentMethod from './Parent_PaymentMethod';

const ParentFees = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added sidebar state

    // Dynamic State (could come from props or API)
    const [studentInfo, setStudentInfo] = useState({
        name: 'Rahul Sharma',
        classSection: 'IX-A',
        rollNumber: 'ST20230089',
        academicYear: '2023-2024',
        totalFee: 82500,
    });

    const [feeStructure, setFeeStructure] = useState([
        { type: 'Admission Fees', amount: 15000, period: 'One-time', status: 'Paid' },
        { type: 'Tuition Fees', amount: 40000, period: 'Annual', status: 'Partially Paid' },
        { type: 'Examination Fees', amount: 8000, period: 'Annual', status: 'Paid' },
        { type: 'Library Fees', amount: 5000, period: 'Annual', status: 'Due' },
        { type: 'Transport Fees', amount: 7500, period: 'Quarterly', status: 'Partially Paid' },
        { type: 'Sports / Extracurricular Fees', amount: 4000, period: 'Annual', status: 'Due' },
        { type: 'Miscellaneous Charges', amount: 3000, period: 'Annual', status: 'Paid' },
    ]);

    const [paymentStatus, setPaymentStatus] = useState({
        paidAmount: 53625,
        pendingAmount: 28875,
        nextDueDate: '15 Nov 2023',
        nextDueAmount: 12500,
        lateFeePenalty: '₹500/week',
        installments: [
            { name: '1st Installment', dueDate: '30 May 2023', amount: 27500, status: 'Paid' },
            { name: '2nd Installment', dueDate: '15 Aug 2023', amount: 27500, status: 'Paid' },
            { name: '3rd Installment', dueDate: '15 Nov 2023', amount: 27500, status: 'Due' },
        ],
    });

    const [paymentHistory, setPaymentHistory] = useState([
        { receiptId: 'RCT23001', date: '25 May 2023', amount: 27500, mode: 'Online (UPI)', status: 'Successful', action: 'download' },
        { receiptId: 'RCT23055', date: '12 Aug 2023', amount: 27500, mode: 'Net Banking', status: 'Successful', action: 'download' },
        { receiptId: 'RCT23071', date: '28 Sep 2023', amount: 5125, mode: 'Credit Card', status: 'Successful', action: 'download' },
    ]);

    const [selectedPayment, setSelectedPayment] = useState({
        installment: '3rd Installment',
        dueDate: '15 Nov 2023',
        amount: 27500,
        convenienceFee: 0,
    });

    // Dynamic Calculations
    const paymentProgress = useMemo(() => (paymentStatus.paidAmount / studentInfo.totalFee) * 100, [paymentStatus.paidAmount, studentInfo.totalFee]);
    const totalPaymentAmount = useMemo(() => selectedPayment.amount + selectedPayment.convenienceFee, [selectedPayment]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Updated wrapper */}
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Sidebar with props */}
                <main className="flex-1 overflow-y-auto lg:ml-64"> {/* Updated to lg:ml-64 */}
                    <Header setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Header with prop */}
                    <div className="p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">Fee Management Portal</h1>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Fee Summary */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaWallet className="mr-2 text-indigo-500" />
                                    Fee Summary
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Student Name</p>
                                        <p className="font-medium">{studentInfo.name}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Class & Section</p>
                                        <p className="font-medium">{studentInfo.classSection}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Roll Number / ID</p>
                                        <p className="font-medium">{studentInfo.rollNumber}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Academic Year</p>
                                        <p className="font-medium">{studentInfo.academicYear}</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-sm text-gray-500">Total Fee Amount</p>
                                        <p className="font-medium text-indigo-700">₹{studentInfo.totalFee.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Structure Breakdown */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaTree className="mr-2 text-indigo-500" />
                                    Fee Structure Breakdown
                                </h2>
                                <Parent_FeeTable
                                    headers={['Fee Type', 'Amount (₹)', 'Period', 'Status']}
                                    data={feeStructure.map(fee => ({ type: fee.type, amount: fee.amount.toLocaleString(), period: fee.period, status: fee.status }))}
                                />
                            </div>

                            {/* Payment Status */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaMoneyBillWave className="mr-2 text-indigo-500" />
                                    Payment Status
                                </h2>
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Overall Payment Status</span>
                                        <span className="text-gray-600">{paymentProgress.toFixed(0)}% Completed</span>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={paymentProgress}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: '#e5e7eb',
                                            '& .MuiLinearProgress-bar': { borderRadius: 5, backgroundColor: '#4f46e5' },
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-indigo-700 mb-3">Payment Overview</h3>
                                        <div className="flex justify-between mb-2">
                                            <span>Total Fee Amount:</span>
                                            <span className="font-semibold">₹{studentInfo.totalFee.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Paid Amount:</span>
                                            <span className="font-semibold text-green-600">₹{paymentStatus.paidAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Pending Amount:</span>
                                            <span className="font-semibold text-red-600">₹{paymentStatus.pendingAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-indigo-700 mb-3">Upcoming Payments</h3>
                                        <div className="flex justify-between mb-2">
                                            <span>Next Due Date:</span>
                                            <span className="font-semibold">{paymentStatus.nextDueDate}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Amount Due:</span>
                                            <span className="font-semibold">₹{paymentStatus.nextDueAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Late Fee Penalty:</span>
                                            <span className="font-semibold text-red-600">{paymentStatus.lateFeePenalty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-medium text-gray-700 mb-3">Installment Details</h3>
                                    <Parent_FeeTable
                                        headers={['Installment', 'Due Date', 'Amount (₹)', 'Status']}
                                        data={paymentStatus.installments.map(installment => ({
                                            name: installment.name,
                                            dueDate: installment.dueDate,
                                            amount: installment.amount.toLocaleString(),
                                            status: installment.status,
                                        }))}
                                    />
                                </div>
                            </div>

                            {/* Payment History */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaHistory className="mr-2 text-indigo-500" />
                                    Payment History
                                </h2>
                                <Parent_FeeTable
                                    headers={['Receipt ID', 'Date', 'Amount (₹)', 'Payment Mode', 'Status', 'Action']}
                                    data={paymentHistory.map(history => ({
                                        receiptId: history.receiptId,
                                        date: history.date,
                                        amount: history.amount.toLocaleString(),
                                        mode: history.mode,
                                        status: history.status,
                                        action: history.action,
                                    }))}
                                />
                            </div>

                            {/* Online Payment */}
                            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaMoneyBillWave className="mr-2 text-indigo-500" />
                                    Online Payment
                                </h2>
                                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                    <div className="flex items-center">
                                        <FaInfoCircle className="text-indigo-600 mr-2" />
                                        <p className="text-indigo-700">
                                            Please pay your next installment of ₹{selectedPayment.amount.toLocaleString()} before {selectedPayment.dueDate} to avoid late fee penalty.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-4">Choose Payment Method</h3>
                                        <div className="space-y-3">
                                            <Parent_PaymentMethod
                                                icon={<FaCreditCard className="mr-3 text-indigo-600" />}
                                                title="Credit / Debit Card"
                                            >
                                                <form>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                                        <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                            <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                            <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                                                        <input type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                                    </div>
                                                </form>
                                            </Parent_PaymentMethod>

                                            <Parent_PaymentMethod
                                                icon={<FaQrcode className="mr-3 text-indigo-600" />}
                                                title="UPI Payment"
                                            >
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                                                    <input type="text" placeholder="username@upi" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                                </div>
                                                <div className="text-center mt-4">
                                                    <p className="text-sm text-gray-500 mb-2">Or scan QR code</p>
                                                    <img src="https://cdn-icons-png.flaticon.com/128/4903/4903482.png" alt="QR Code" className="h-32 mx-auto" />
                                                </div>
                                                <div className="flex justify-center space-x-3 mt-4">
                                                    <div className="text-center">
                                                        <img src="https://cdn-icons-png.flaticon.com/128/270/270799.png" alt="PhonePe" className="h-10 mx-auto mb-1" />
                                                        <p className="text-xs">PhonePe</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <img src="https://cdn-icons-png.flaticon.com/128/5968/5968416.png" alt="GPay" className="h-10 mx-auto mb-1" />
                                                        <p className="text-xs">Google Pay</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <img src="https://cdn-icons-png.flaticon.com/128/825/825454.png" alt="Paytm" className="h-10 mx-auto mb-1" />
                                                        <p className="text-xs">Paytm</p>
                                                    </div>
                                                </div>
                                            </Parent_PaymentMethod>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-4">Payment Summary</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="border-b pb-3 mb-3">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Installment</span>
                                                    <span>{selectedPayment.installment}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Due Date</span>
                                                    <span>{selectedPayment.dueDate}</span>
                                                </div>
                                            </div>
                                            <div className="border-b pb-3 mb-3">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Amount</span>
                                                    <span>₹{selectedPayment.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Convenience Fee</span>
                                                    <span>₹{selectedPayment.convenienceFee.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between font-semibold">
                                                <span>Total Amount</span>
                                                <span>₹{totalPaymentAmount.toLocaleString()}</span>
                                            </div>

                                            <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                                <FaCheckCircle className="mr-2" />
                                                Pay Now
                                            </button>

                                            <div className="mt-4 text-center">
                                                <p className="text-xs text-gray-500">By proceeding with the payment, you agree to our Terms and Conditions</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 bg-green-50 rounded-lg p-4">
                                            <h4 className="font-medium text-green-700 flex items-center">
                                                <FaCheckCircle className="mr-2" />
                                                Secure Payment
                                            </h4>
                                            <p className="text-sm text-green-600 mt-1">Your payment information is securely processed. We do not store credit card details.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentFees;