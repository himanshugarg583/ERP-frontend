import React, { useState, useEffect } from 'react';
import { FaWallet, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentFeesDetails, getStudentInstallments } from '../../helper/requests-method/apiMethods';

const StudentFees = () => {
  const [feesData, setFeesData] = useState(null);
  const [installmentsData, setInstallmentsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'installments'

  useEffect(() => {
    fetchFeesData();
    fetchInstallmentsData();
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

  // Calculate totals
  const calculateTotals = () => {
    if (!feesData || !feesData.fees) return { totalAmount: 0, paidAmount: 0, dueAmount: 0 };
    
    const totals = feesData.fees.reduce((acc, fee) => {
      const details = fee.fee_details;
      acc.totalAmount += parseFloat(details.original_amount || 0);
      acc.paidAmount += parseFloat(details.paid_amount || 0);
      acc.dueAmount += parseFloat(details.due_amount || 0);
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
                        <p className="text-sm text-gray-600 mb-1">Total Fee</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totals.totalAmount)}</p>
                      </div>
                      <FaMoneyBillWave className="text-3xl text-indigo-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.paidAmount)}</p>
                      </div>
                      <FaCheckCircle className="text-3xl text-green-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Due Amount</p>
                        <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totals.dueAmount)}</p>
                      </div>
                      <FaClock className="text-3xl text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Fees</p>
                        <p className="text-2xl font-bold text-purple-600">{feesData?.total_fees || 0}</p>
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
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'overview'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Fee Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('installments')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'installments'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Installments
                      </button>
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {feesData && feesData.fees && feesData.fees.length > 0 ? (
                          feesData.fees.map((fee, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {fee.fee_structure?.name || 'Fee Structure'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Academic Year: <span className="font-medium">{fee.fee_details?.academic_year || 'N/A'}</span>
                                  </p>
                                </div>
                                {getStatusBadge(fee.fee_details?.status)}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Original Amount</p>
                                  <p className="text-lg font-semibold text-gray-800">{formatCurrency(fee.fee_details?.original_amount)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Discount</p>
                                  <p className="text-lg font-semibold text-green-600">-{formatCurrency(fee.fee_details?.discount_amount)}</p>
                                  {fee.fee_details?.discount_reason && (
                                    <p className="text-xs text-gray-500 mt-1">{fee.fee_details.discount_reason}</p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Final Amount</p>
                                  <p className="text-lg font-semibold text-indigo-600">{formatCurrency(fee.fee_details?.final_amount)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FaCalendarAlt className="text-indigo-500" />
                                    {formatDate(fee.fee_details?.due_date)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">Paid Amount</p>
                                  <p className="text-xl font-bold text-indigo-600">{formatCurrency(fee.fee_details?.paid_amount)}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">Due Amount</p>
                                  <p className="text-xl font-bold text-yellow-600">{formatCurrency(fee.fee_details?.due_amount)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">Payment Progress</p>
                                  <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{
                                          width: `${((parseFloat(fee.fee_details?.paid_amount || 0) / parseFloat(fee.fee_details?.final_amount || 1)) * 100).toFixed(0)}%`
                                        }}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {((parseFloat(fee.fee_details?.paid_amount || 0) / parseFloat(fee.fee_details?.final_amount || 1)) * 100).toFixed(0)}% Paid
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {fee.fee_structure && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Installment Allowed:</span>{' '}
                                    {fee.fee_structure.installment_allowed ? 'Yes' : 'No'}
                                    {fee.fee_structure.installment_allowed && fee.fee_structure.max_installments && (
                                      <span className="ml-2">(Max: {fee.fee_structure.max_installments})</span>
                                    )}
                                  </p>
                                  {fee.fee_structure.late_fee_amount && parseFloat(fee.fee_structure.late_fee_amount) > 0 && (
                                    <p className="text-sm text-red-600">
                                      <FaExclamationTriangle className="inline mr-1" />
                                      Late Fee: {formatCurrency(fee.fee_structure.late_fee_amount)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FaInfoCircle className="text-4xl mx-auto mb-4 text-gray-400" />
                            <p>No fee records found</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'installments' && (
                      <div className="space-y-6">
                        {installmentsData && installmentsData.fee_records && installmentsData.fee_records.length > 0 ? (
                          installmentsData.fee_records.map((record, recordIndex) => (
                            <div key={recordIndex} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                              <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                  {record.fee_structure_name || 'Fee Structure'}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span>
                                    <span className="font-medium">Academic Year:</span> {record.academic_year || 'N/A'}
                                  </span>
                                  <span>
                                    <span className="font-medium">Total Amount:</span> {formatCurrency(record.total_amount)}
                                  </span>
                                  <span>
                                    <span className="font-medium">Total Installments:</span> {record.total_installments || 0}
                                  </span>
                                </div>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Installment</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Amount</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Due Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Paid Amount</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Payment Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Late Fee</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Remaining</th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {record.installments && record.installments.length > 0 ? (
                                      record.installments.map((installment, instIndex) => (
                                        <tr key={instIndex} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                              {installment.installment_number || instIndex + 1}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{formatCurrency(installment.amount)}</span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                              <FaCalendarAlt className="text-indigo-500" />
                                              {formatDate(installment.due_date)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-green-600 font-medium">
                                              {formatCurrency(installment.paid_amount)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                              {installment.payment_date ? formatDate(installment.payment_date) : '-'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-red-600">
                                              {formatCurrency(installment.late_fee_applied || installment.late_fee)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 font-medium">
                                              {formatCurrency(installment.remaining_amount)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            {getStatusBadge(installment.status)}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                          No installments found
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FaInfoCircle className="text-4xl mx-auto mb-4 text-gray-400" />
                            <p>No installment records found</p>
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

