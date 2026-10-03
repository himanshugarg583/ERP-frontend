import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaReceipt, FaRupeeSign, FaPlus, FaCheckCircle } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { getFeePayments, getClassDropdown, getStudentsByClass, getStudentInstallments, fillPayment } from '../../helper/requests-method/feeV1Api';
import { toast } from 'react-toastify';

const OnlinePaymentPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // New states for payment form
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [installments, setInstallments] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedInstallments, setSelectedInstallments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Payment form data
    const [paymentData, setPaymentData] = useState({
        amount_paid: '',
        late_fee_paid: '',
        payment_method: 'cash',
        transaction_id: '',
        cheque_number: '',
        bank_name: '',
        remarks: ''
    });

    useEffect(() => {
        fetchPayments();
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedStudent) {
            fetchInstallments(selectedStudent);
        }
    }, [selectedStudent]);

    // Auto-fill payment amounts when installments are selected
    useEffect(() => {
        if (selectedInstallments.length > 0) {
            const totalDue = calculateTotalDue();
            const totalLateFee = calculateTotalLateFee();
            
            setPaymentData(prev => ({
                ...prev,
                amount_paid: totalDue.toString(),
                late_fee_paid: totalLateFee.toString()
            }));
        }
    }, [selectedInstallments]);

    const fetchClasses = async () => {
        try {
            const response = await getClassDropdown();
            if (response?.success) {
                setClasses(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Failed to fetch classes');
        }
    };

    const fetchStudents = async (classId) => {
        try {
            const response = await getStudentsByClass(classId);
            if (response?.success) {
                setStudents(response.data || []);
                setSelectedStudent('');
                setInstallments([]);
                setSelectedInstallments([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students');
        }
    };

    const fetchInstallments = async (studentId) => {
        try {
            const response = await getStudentInstallments(studentId);
            if (response?.success) {
                setInstallments(response.data?.installments || []);
                setSelectedInstallments([]);
            }
        } catch (error) {
            console.error('Error fetching installments:', error);
            toast.error('Failed to fetch installments');
        }
    };

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const response = await getFeePayments();
            if (response?.success) {
                setPayments(response.data?.payments || []);
                setSummary(response.data?.summary || null);
                setTotalRecords(response.data?.total_records || 0);
            } else {
                toast.error('Failed to fetch payments');
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch fee payments');
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentMethodBadge = (method) => {
        const methodConfig = {
            online: { bg: 'bg-blue-100', text: 'text-blue-800' },
            cash: { bg: 'bg-green-100', text: 'text-green-800' },
            cheque: { bg: 'bg-purple-100', text: 'text-purple-800' },
            bank_transfer: { bg: 'bg-indigo-100', text: 'text-indigo-800' }
        };
        const config = methodConfig[method] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {method?.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const handleInstallmentSelection = (installmentId) => {
        setSelectedInstallments(prev => {
            const newSelection = prev.includes(installmentId)
                ? prev.filter(id => id !== installmentId)
                : [...prev, installmentId];
            return newSelection;
        });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedStudent) {
            toast.error('Please select a student');
            return;
        }

        if (selectedInstallments.length === 0) {
            toast.error('Please select at least one installment');
            return;
        }

        if (!paymentData.amount_paid || parseFloat(paymentData.amount_paid) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                student_id: parseInt(selectedStudent),
                amount_paid: parseFloat(paymentData.amount_paid),
                late_fee_paid: parseFloat(paymentData.late_fee_paid) || 0,
                payment_method: paymentData.payment_method,
                transaction_id: paymentData.transaction_id || null,
                cheque_number: paymentData.cheque_number || null,
                bank_name: paymentData.bank_name || null,
                remarks: paymentData.remarks,
                installment_ids: selectedInstallments
            };

            const response = await fillPayment(submitData);
            
            if (response?.success) {
                toast.success('Payment submitted successfully!');
                setShowPaymentForm(false);
                resetForm();
                fetchPayments();
            } else {
                toast.error(response?.message || 'Failed to submit payment');
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            toast.error('Failed to submit payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSelectedClass('');
        setSelectedStudent('');
        setSelectedInstallments([]);
        setStudents([]);
        setInstallments([]);
        setPaymentData({
            amount_paid: '',
            late_fee_paid: '',
            payment_method: 'cash',
            transaction_id: '',
            cheque_number: '',
            bank_name: '',
            remarks: ''
        });
    };

    const calculateTotalDue = () => {
        return installments
            .filter(inst => selectedInstallments.includes(inst.installment_id))
            .reduce((sum, inst) => sum + parseFloat(inst.due_amount || 0), 0);
    };

    const calculateTotalLateFee = () => {
        return installments
            .filter(inst => selectedInstallments.includes(inst.installment_id))
            .reduce((sum, inst) => sum + parseFloat(inst.late_fee || 0), 0);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700">
                            Fee Payments
                        </h1>
                        <button
                            onClick={() => setShowPaymentForm(!showPaymentForm)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaPlus />
                            {showPaymentForm ? 'View Payments' : 'Fill Payment'}
                        </button>
                    </div>

                    {showPaymentForm ? (
                        /* Payment Form */
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fill Student Fee Payment</h2>
                            
                            <form onSubmit={handlePaymentSubmit}>
                                {/* Class and Student Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Class *
                                        </label>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.class_name} - {cls.section_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Student *
                                        </label>
                                        <select
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={!selectedClass}
                                            required
                                        >
                                            <option value="">Select Student</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name} ({student.roll_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Installments Selection */}
                                {installments.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Installments</h3>
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Select</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Installment</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Paid</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Late Fee</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {installments.map((inst) => (
                                                        <tr key={inst.installment_id} className={inst.status === 'paid' ? 'bg-green-50' : ''}>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedInstallments.includes(inst.installment_id)}
                                                                    onChange={() => handleInstallmentSelection(inst.installment_id)}
                                                                    disabled={inst.status === 'paid'}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{inst.installment_name}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">₹{parseFloat(inst.amount).toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-sm text-green-600">₹{parseFloat(inst.paid_amount).toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-sm text-red-600">₹{parseFloat(inst.due_amount).toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-sm text-orange-600">₹{parseFloat(inst.late_fee || 0).toLocaleString()}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600">{new Date(inst.due_date).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    inst.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {inst.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Total Summary */}
                                        {selectedInstallments.length > 0 && (
                                            <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Due Amount</p>
                                                        <p className="text-xl font-bold text-indigo-700">₹{calculateTotalDue().toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Late Fee</p>
                                                        <p className="text-xl font-bold text-orange-600">₹{calculateTotalLateFee().toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Installments Selected</p>
                                                        <p className="text-xl font-bold text-gray-700">{selectedInstallments.length}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Grand Total</p>
                                                        <p className="text-xl font-bold text-green-600">
                                                            ₹{(calculateTotalDue() + calculateTotalLateFee()).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payment Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount Paid *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={paymentData.amount_paid}
                                            onChange={(e) => setPaymentData({...paymentData, amount_paid: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Late Fee Paid
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={paymentData.late_fee_paid}
                                            onChange={(e) => setPaymentData({...paymentData, late_fee_paid: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method *
                                        </label>
                                        <select
                                            value={paymentData.payment_method}
                                            onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="online">Online</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    </div>

                                    {(paymentData.payment_method === 'online' || paymentData.payment_method === 'bank_transfer') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Transaction ID
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.transaction_id}
                                                onChange={(e) => setPaymentData({...paymentData, transaction_id: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    )}

                                    {paymentData.payment_method === 'cheque' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Cheque Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentData.cheque_number}
                                                    onChange={(e) => setPaymentData({...paymentData, cheque_number: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bank Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentData.bank_name}
                                                    onChange={(e) => setPaymentData({...paymentData, bank_name: e.target.value})}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Remarks
                                        </label>
                                        <textarea
                                            value={paymentData.remarks}
                                            onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Add any additional remarks..."
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPaymentForm(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || selectedInstallments.length === 0}
                                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                Submit Payment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            {summary && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-linear-to-r from-blue-50 to-blue-100 p-5 rounded-lg shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                                                <p className="text-2xl font-bold text-blue-700">₹{parseFloat(summary.total_amount_paid).toLocaleString()}</p>
                                            </div>
                                            <FaRupeeSign className="text-4xl text-blue-600 opacity-50" />
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-orange-50 to-orange-100 p-5 rounded-lg shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Total Late Fee Paid</p>
                                                <p className="text-2xl font-bold text-orange-700">₹{parseFloat(summary.total_late_fee_paid).toLocaleString()}</p>
                                            </div>
                                            <FaMoneyBillWave className="text-4xl text-orange-600 opacity-50" />
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-green-50 to-green-100 p-5 rounded-lg shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Total Collected</p>
                                                <p className="text-2xl font-bold text-green-700">₹{parseFloat(summary.total_paid).toLocaleString()}</p>
                                            </div>
                                            <FaReceipt className="text-4xl text-green-600 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            )}

                    {/* Payments Table */}
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-indigo-600 text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-800">Payment Records</h2>
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Records: <span className="font-semibold text-indigo-600">{totalRecords}</span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="mt-4 text-gray-600">Loading payments...</p>
                            </div>
                        ) : payments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-indigo-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Receipt Number</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Roll Number</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Class</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Paid</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Late Fee</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Paid</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Method</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment, index) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                    {payment.receipt_number}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {payment.student?.User?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {payment.student?.roll_number || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {payment.student?.ClassSection?.class_name} - {payment.student?.ClassSection?.section_name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                                                    ₹{parseFloat(payment.amount_paid).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-600">
                                                    ₹{parseFloat(payment.late_fee_paid).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    ₹{parseFloat(payment.total_paid).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    {getPaymentMethodBadge(payment.payment_method)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(payment.payment_date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <FaMoneyBillWave className="mx-auto text-5xl text-gray-300 mb-4" />
                                <p className="text-lg">No payment records found</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    </main>
</div>
);
};

export default OnlinePaymentPage;