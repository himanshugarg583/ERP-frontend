import React, { useState, useEffect } from 'react';
import { FaWallet, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentFeesDetails, getStudentInstallments, getStudentPaymentHistory, createPaymentOrder, verifyPayment } from '../../helper/requests-method/feeV1Api';

const StudentFees = () => {
  const [feesData, setFeesData] = useState(null);
  const [installmentsData, setInstallmentsData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'installments', or 'history'
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchFeesData();
    fetchInstallmentsData();
    fetchPaymentHistory();
  }, []);

  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const response = await getStudentFeesDetails();
      if (response.success && response.data) {
        setFeesData(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch fee details');
      }
    } catch (error) {
      console.error('Failed to fetch fee details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch fee details');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallmentsData = async () => {
    try {
      const response = await getStudentInstallments();
      if (response.success && response.data) {
        setInstallmentsData(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch installments');
      }
    } catch (error) {
      console.error('Failed to fetch installments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch installments');
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await getStudentPaymentHistory();
      if (response.success && response.data) {
        setPaymentHistory(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'paid') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"><FaCheckCircle /> Paid</span>;
    } else if (statusLower === 'pending') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1"><FaClock /> Pending</span>;
    } else if (statusLower === 'overdue') {
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1"><FaExclamationTriangle /> Overdue</span>;
    }
    return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  };

  const handleInstallmentSelection = (installmentId, installment) => {
    setSelectedInstallments(prev => {
      const isSelected = prev.some(item => item.installment_id === installmentId);
      if (isSelected) {
        return prev.filter(item => item.installment_id !== installmentId);
      } else {
        // Only allow pending installments
        if (installment.status?.toLowerCase() !== 'paid') {
          return [...prev, installment];
        }
        return prev;
      }
    });
  };

  const handleSelectAllInFee = (installments) => {
    const pendingInstallments = installments.filter(inst => inst.status?.toLowerCase() !== 'paid');
    const allSelected = pendingInstallments.every(inst => 
      selectedInstallments.some(selected => selected.installment_id === inst.installment_id)
    );

    if (allSelected) {
      // Deselect all from this fee
      setSelectedInstallments(prev => 
        prev.filter(selected => 
          !pendingInstallments.some(inst => inst.installment_id === selected.installment_id)
        )
      );
    } else {
      // Select all pending from this fee
      setSelectedInstallments(prev => {
        const newSelections = pendingInstallments.filter(inst => 
          !prev.some(selected => selected.installment_id === inst.installment_id)
        );
        return [...prev, ...newSelections];
      });
    }
  };

  const calculateSelectedTotal = () => {
    return selectedInstallments.reduce((total, inst) => {
      return total + parseFloat(inst.remaining_amount || 0) + parseFloat(inst.calculated_late_fee || 0);
    }, 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaySelected = async () => {
    if (selectedInstallments.length === 0) {
      toast.warning('Please select at least one installment to pay');
      return;
    }

    if (selectedInstallments.length > 1) {
      toast.warning('Please select only one installment at a time for payment');
      return;
    }

    setPaymentLoading(true);
    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      const installmentId = selectedInstallments[0].installment_id;
      const totalAmount = calculateSelectedTotal();

      // Create payment order
      const orderResponse = await createPaymentOrder(installmentId);
      
      if (!orderResponse.success || !orderResponse.data) {
        toast.error(orderResponse.message || 'Failed to create payment order');
        setPaymentLoading(false);
        return;
      }

      const { order_id, amount, currency, key_id } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: key_id || 'rzp_test_YOUR_KEY_ID', // Razorpay Key ID from backend
        amount: amount, // Amount in paise
        currency: currency || 'INR',
        name: 'School ERP',
        description: `Payment for Installment #${selectedInstallments[0].installment_number}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              installment_id: installmentId
            };

            const verifyResponse = await verifyPayment(verifyData);

            if (verifyResponse.success) {
              toast.success(verifyResponse.message || 'Payment successful!');
              // Refresh data
              await fetchInstallmentsData();
              await fetchPaymentHistory();
              setSelectedInstallments([]);
            } else {
              toast.error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: feesData?.student_name || '',
          email: feesData?.student_email || '',
          contact: feesData?.student_phone || ''
        },
        theme: {
          color: '#6366F1'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setPaymentLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!feesData || !feesData.fees) return { totalAmount: 0, paidAmount: 0, dueAmount: 0 };
    
    const totals = feesData.fees.reduce((acc, fee) => {
      acc.totalAmount += parseFloat(fee.final_amount || 0);
      return acc;
    }, { totalAmount: 0, paidAmount: 0, dueAmount: 0 });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          <div className="max-w-9xl mx-auto space-y-6 py-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <FaWallet className="mr-3 text-indigo-600" />
                Fee Management
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Fee Assigned</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(feesData?.total_fees_assigned || 0)}</p>
                      </div>
                      <FaMoneyBillWave className="text-3xl text-indigo-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Fee Records</p>
                        <p className="text-2xl font-bold text-green-600">{feesData?.total_fee_records || 0}</p>
                      </div>
                      <FaCheckCircle className="text-3xl text-green-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Student ID</p>
                        <p className="text-2xl font-bold text-yellow-600">{feesData?.student_id || '-'}</p>
                      </div>
                      <FaClock className="text-3xl text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">User ID</p>
                        <p className="text-2xl font-bold text-purple-600">{feesData?.user_id || '-'}</p>
                      </div>
                      <FaInfoCircle className="text-3xl text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                          activeTab === 'overview'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Fee Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('installments')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                          activeTab === 'installments'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Installments
                      </button>
                      <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                          activeTab === 'history'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Payment History
                      </button>
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {feesData && feesData.fees && feesData.fees.length > 0 ? (
                          feesData.fees.map((fee, index) => (
                            <div key={fee.id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {fee.fee_structure_name || 'Fee Structure'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Academic Year: <span className="font-medium text-indigo-600">{fee.academic_year || 'N/A'}</span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 mb-1">Fee Record ID</p>
                                  <p className="text-lg font-bold text-gray-700">#{fee.id}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <FaMoneyBillWave className="text-blue-500" />
                                    Original Amount
                                  </p>
                                  <p className="text-xl font-semibold text-blue-600">{formatCurrency(fee.original_amount)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <FaInfoCircle className="text-green-500" />
                                    Discount Applied
                                  </p>
                                  <p className="text-xl font-semibold text-green-600">
                                    {fee.discount_amount > 0 ? `-${formatCurrency(fee.discount_amount)}` : formatCurrency(0)}
                                  </p>
                                  {fee.discount_reason && (
                                    <p className="text-xs text-gray-500 mt-1 italic">{fee.discount_reason}</p>
                                  )}
                                </div>
                                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm border border-indigo-200">
                                  <p className="text-xs text-indigo-600 mb-1 flex items-center gap-1 font-medium">
                                    <FaCheckCircle className="text-indigo-500" />
                                    Final Amount
                                  </p>
                                  <p className="text-2xl font-bold text-indigo-700">{formatCurrency(fee.final_amount)}</p>
                                </div>
                              </div>

                              {fee.discount_amount > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                                  <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-600" />
                                    <div>
                                      <p className="text-sm font-medium text-green-800">
                                        Discount of {formatCurrency(fee.discount_amount)} applied
                                      </p>
                                      {fee.discount_reason && (
                                        <p className="text-xs text-green-700 mt-1">Reason: {fee.discount_reason}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FaInfoCircle className="text-4xl mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No fee records found</p>
                            <p className="text-sm mt-2">There are no fee structures assigned to your account yet.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'installments' && (
                      <div className="space-y-6">
                        {/* Summary and Action Bar */}
                        {selectedInstallments.length > 0 && (
                          <div className="bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 sticky top-0 z-10 shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <p className="text-sm font-medium text-indigo-700 mb-1">
                                  {selectedInstallments.length} Installment(s) Selected
                                </p>
                                <p className="text-2xl font-bold text-indigo-900">
                                  Total: {formatCurrency(calculateSelectedTotal())}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedInstallments([])}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer"
                                >
                                  Clear Selection
                                </button>
                                <button
                                  onClick={handlePaySelected}
                                  disabled={paymentLoading}
                                  className="px-6 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm font-medium flex items-center gap-2 cursor-pointer"
                                >
                                  <FaMoneyBillWave />
                                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Installments Table */}
                        {installmentsData && installmentsData.fee_records && installmentsData.fee_records.length > 0 ? (
                          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-indigo-100">
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Select
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Fee Structure
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Fee Structure ID
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Academic Year
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Installment #
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Due Date
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Paid Amount
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Remaining
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Late Fee
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Payment Date
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {installmentsData.fee_records.map((record) => 
                                  record.installments && record.installments.length > 0 ? (
                                    record.installments.map((installment, instIndex) => {
                                      const isSelected = selectedInstallments.some(
                                        item => item.installment_id === installment.installment_id
                                      );
                                      const isPaid = installment.status?.toLowerCase() === 'paid';
                                      const isOverdue = installment.is_overdue;

                                      return (
                                        <tr 
                                          key={`${record.student_fee_id}-${instIndex}`}
                                          className={`hover:bg-gray-50 transition-colors ${
                                            isSelected ? 'bg-indigo-50' : ''
                                          } ${isOverdue && !isPaid ? 'border-l-4 border-l-red-500' : ''}`}
                                        >
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => handleInstallmentSelection(installment.installment_id, installment)}
                                              disabled={isPaid}
                                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                              {record.fee_structure_name || 'N/A'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                              {record.student_fee_id}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-700">
                                              {record.academic_year}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                                              {installment.installment_number}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900">
                                              {formatCurrency(installment.amount)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`text-sm flex items-center gap-1 ${
                                              isOverdue && !isPaid ? 'text-red-600 font-medium' : 'text-gray-600'
                                            }`}>
                                              <FaCalendarAlt className={isOverdue && !isPaid ? 'text-red-500' : 'text-indigo-500'} />
                                              {formatDate(installment.due_date)}
                                              {isOverdue && !isPaid && (
                                                <FaExclamationTriangle className="text-red-500 ml-1" title="Overdue" />
                                              )}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-green-600 font-semibold">
                                              {formatCurrency(installment.paid_amount)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-orange-600 font-bold">
                                              {formatCurrency(installment.remaining_amount)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                              parseFloat(installment.calculated_late_fee) > 0 ? 'text-red-600' : 'text-gray-400'
                                            }`}>
                                              {formatCurrency(installment.calculated_late_fee)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                              {installment.payment_date ? formatDate(installment.payment_date) : '-'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            {isOverdue && !isPaid ? (
                                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                                                <FaExclamationTriangle /> Overdue
                                              </span>
                                            ) : (
                                              getStatusBadge(installment.status)
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : null
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
                            <FaInfoCircle className="text-4xl mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No installment records found</p>
                            <p className="text-sm mt-2">There are no installments assigned to your account yet.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div className="space-y-6">
                        {/* Payment Summary Cards */}
                        {paymentHistory?.summary && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="text-xs text-blue-600 font-medium mb-1">Total Payments</p>
                              <p className="text-xl font-bold text-blue-700">{paymentHistory.summary.total_payments || 0}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="text-xs text-green-600 font-medium mb-1">Successful</p>
                              <p className="text-xl font-bold text-green-700">{paymentHistory.summary.successful_payments || 0}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                              <p className="text-xs text-yellow-600 font-medium mb-1">Pending</p>
                              <p className="text-xl font-bold text-yellow-700">{paymentHistory.summary.pending_payments || 0}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <p className="text-xs text-purple-600 font-medium mb-1">Refunds</p>
                              <p className="text-xl font-bold text-purple-700">{paymentHistory.summary.refund_payments || 0}</p>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <p className="text-xs text-indigo-600 font-medium mb-1">Total Amount</p>
                              <p className="text-xl font-bold text-indigo-700">{formatCurrency(paymentHistory.summary.total_amount_paid)}</p>
                            </div>
                          </div>
                        )}

                        {/* Payment History Table */}
                        {paymentHistory && paymentHistory.payments && paymentHistory.payments.length > 0 ? (
                          <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-indigo-100">
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Receipt No.</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Academic Year</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Payment Date</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Payment For</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Amount</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Late Fee</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Total Paid</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Method</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Status</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Remarks</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {paymentHistory.payments.map((payment, index) => (
                                  <tr key={payment.payment_id || index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm font-medium text-indigo-600">{payment.receipt_number}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm text-gray-700">{payment.academic_year}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaCalendarAlt className="text-indigo-500" />
                                        {formatDate(payment.payment_date)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">
                                      <span className="text-sm text-gray-700">{payment.payment_for || '-'}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount_paid)}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm text-red-600">
                                        {payment.late_fee_paid > 0 ? formatCurrency(payment.late_fee_paid) : '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-sm font-bold text-green-600">{formatCurrency(payment.total_paid)}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full uppercase font-medium">
                                        {payment.payment_method}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      {payment.is_refund ? (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Refund</span>
                                      ) : (
                                        getStatusBadge(payment.payment_status)
                                      )}
                                    </td>
                                    <td className="px-4 py-4">
                                      <span className="text-sm text-gray-600">{payment.remarks || '-'}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FaInfoCircle className="text-4xl mx-auto mb-4 text-gray-400" />
                            <p>No payment history found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentFees;

