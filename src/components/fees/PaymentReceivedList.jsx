import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, User, CreditCard, Eye, X, Download, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllPayments, getPaymentById } from '../../helper/requests-method/apiMethods';

const PaymentReceivedList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMode, setFilterPaymentMode] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await getAllPayments();
      if (response.success) {
        setPayments(Array.isArray(response.data?.payments) ? response.data.payments : 
                    Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const viewPaymentDetails = async (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      success: { color: 'bg-green-100 text-green-800', label: 'Success' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.success;
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.label}</span>;
  };

  const getPaymentModeBadge = (mode) => {
    const modeConfig = {
      cash: { color: 'bg-blue-100 text-blue-800', icon: '💵' },
      online: { color: 'bg-purple-100 text-purple-800', icon: '💳' },
      cheque: { color: 'bg-orange-100 text-orange-800', icon: '📝' },
      upi: { color: 'bg-indigo-100 text-indigo-800', icon: '📱' },
      card: { color: 'bg-pink-100 text-pink-800', icon: '💳' }
    };
    const config = modeConfig[mode?.toLowerCase()] || modeConfig.cash;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.icon} {mode}
      </span>
    );
  };

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    // Search filter
    const searchMatch = 
      payment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.roll_number?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = filterStatus === 'all' || payment.payment_status?.toLowerCase() === filterStatus;

    // Payment mode filter
    const modeMatch = filterPaymentMode === 'all' || payment.payment_mode?.toLowerCase() === filterPaymentMode;

    // Date range filter
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const paymentDate = new Date(payment.payment_date || payment.createdAt);
      if (dateFrom) {
        dateMatch = dateMatch && paymentDate >= new Date(dateFrom);
      }
      if (dateTo) {
        dateMatch = dateMatch && paymentDate <= new Date(dateTo);
      }
    }

    return searchMatch && statusMatch && modeMatch && dateMatch;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  const totalPayments = filteredPayments.length;

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPaymentMode('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Received</p>
                <p className="text-3xl font-bold mt-2">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold mt-2">{totalPayments}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <CreditCard className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Average Payment</p>
                <p className="text-3xl font-bold mt-2">
                  ₹{totalPayments > 0 ? Math.round(totalAmount / totalPayments).toLocaleString() : 0}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, receipt, transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Payment Mode Filter */}
            <div>
              <select
                value={filterPaymentMode}
                onChange={(e) => setFilterPaymentMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Modes</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-violet-600" />
                <h2 className="text-xl font-bold text-gray-800">Payment Records</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Receipt No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment, index) => (
                    <tr key={payment._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-violet-600">
                          {payment.receipt_number || `RCP${String(index + 1).padStart(4, '0')}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(payment.payment_date || payment.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="bg-violet-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-violet-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{payment.student_name}</div>
                            <div className="text-xs text-gray-500">Roll: {payment.roll_number || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.class_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentModeBadge(payment.payment_mode || 'Cash')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-green-600">
                          ₹{parseFloat(payment.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getPaymentStatusBadge(payment.payment_status || 'success')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => viewPaymentDetails(payment)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-right font-semibold text-gray-800">
                      Total:
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xl font-bold text-green-600">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-600">
                      {totalPayments} transactions
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No payments found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Payment Receipt</h3>
                  <p className="text-violet-100">
                    {selectedPayment.receipt_number || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {/* Payment Status */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Payment Status:</span>
                  {getPaymentStatusBadge(selectedPayment.payment_status || 'success')}
                </div>

                {/* Student Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-violet-600" />
                    Student Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-semibold">{selectedPayment.student_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Roll Number:</span>
                      <p className="font-semibold">{selectedPayment.roll_number || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Class:</span>
                      <p className="font-semibold">{selectedPayment.class_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Section:</span>
                      <p className="font-semibold">{selectedPayment.section_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-violet-600" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Payment Date:</span>
                      <p className="font-semibold">
                        {new Date(selectedPayment.payment_date || selectedPayment.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Mode:</span>
                      <p className="mt-1">{getPaymentModeBadge(selectedPayment.payment_mode || 'Cash')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Transaction ID:</span>
                      <p className="font-semibold">{selectedPayment.transaction_id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount Paid:</span>
                      <p className="text-xl font-bold text-green-600">₹{parseFloat(selectedPayment.amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                {selectedPayment.fee_details && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Fee Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      {selectedPayment.fee_details.map((fee, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{fee.name || fee.fee_head_name}:</span>
                          <span className="font-semibold">₹{fee.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {selectedPayment.remarks && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Remarks</h4>
                    <p className="text-sm text-gray-600">{selectedPayment.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer">
                <Download className="h-4 w-4" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReceivedList;
