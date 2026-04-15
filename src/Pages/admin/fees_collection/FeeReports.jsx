import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import { BarChart3, AlertCircle, User, Calendar, DollarSign, Clock, FileText } from "lucide-react";
import { getOverdueInstallments } from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const FeeReportsComponent = () => {
  const [overdueData, setOverdueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOverdueInstallments();
  }, []);

  const fetchOverdueInstallments = async () => {
    setLoading(true);
    try {
      const response = await getOverdueInstallments();
      if (response.success && response.data) {
        setOverdueData(response.data);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || 'Failed to fetch overdue installments');
      }
    } catch (error) {
      console.error('Failed to fetch overdue installments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch overdue installments');
    } finally {
      setLoading(false);
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

  const calculateDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!overdueData?.overdue_installments) return { total: 0, totalAmount: 0, totalLateFee: 0 };
    
    const total = overdueData.overdue_installments.length;
    const totalAmount = overdueData.overdue_installments.reduce((sum, item) => {
      return sum + parseFloat(item.amount || 0) - parseFloat(item.paid_amount || 0);
    }, 0);
    const totalLateFee = overdueData.overdue_installments.reduce((sum, item) => {
      return sum + parseFloat(item.late_fee_applied || 0);
    }, 0);

    return { total, totalAmount, totalLateFee };
  };

  const summary = calculateSummary();

  return (
    <div className="bg-gray-100 flex">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <PageHeader pageheading="Fee Management" Subheading="Fee Reports" />
            </div>

            {/* Summary Cards */}
            {overdueData && overdueData.overdue_installments && overdueData.overdue_installments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Overdue</p>
                      <p className="text-3xl font-bold text-red-600">{summary.total}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Overdue Amount</p>
                      <p className="text-3xl font-bold text-orange-600">{formatCurrency(summary.totalAmount)}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <DollarSign className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Late Fee</p>
                      <p className="text-3xl font-bold text-yellow-600">{formatCurrency(summary.totalLateFee)}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overdue Installments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Overdue Installments
                </h3>
                <p className="text-red-50 mt-1">List of all pending installments that have crossed their due date</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                    <p className="text-gray-600">Loading overdue installments...</p>
                  </div>
                ) : overdueData && overdueData.overdue_installments && overdueData.overdue_installments.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Student Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Academic Year
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Installment
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Amount Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Days Overdue
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Late Fee
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {overdueData.overdue_installments.map((item, index) => {
                            const student = item.studentFee?.student;
                            const user = student?.User;
                            const classSection = student?.ClassSection;
                            const daysOverdue = calculateDaysOverdue(item.due_date);
                            const remainingAmount = parseFloat(item.amount || 0) - parseFloat(item.paid_amount || 0);

                            return (
                              <tr key={item.id || index} className="hover:bg-gray-50 transition-colors border-l-4 border-l-red-500">
                                <td className="px-4 py-4">
                                  <div className="flex items-start gap-2">
                                    <div className="bg-indigo-100 p-2 rounded-full">
                                      <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'N/A'}</p>
                                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                      <p className="text-xs text-indigo-600 font-medium">
                                        {classSection?.class_name} - {classSection?.section_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-700">{item.studentFee?.academic_year || 'N/A'}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                                    #{item.installment_number}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">Total:</span>
                                      <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">Paid:</span>
                                      <span className="font-medium text-green-600">{formatCurrency(item.paid_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-500">Remaining:</span>
                                      <span className="font-bold text-red-600">{formatCurrency(remainingAmount)}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(item.due_date)}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                                    {daysOverdue} days
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                  <span className="text-sm font-bold text-red-600">{formatCurrency(item.late_fee_applied)}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Info */}
                    {pagination && (
                      <div className="mt-6 bg-gray-50 px-6 py-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <p>
                            Showing page {pagination.current_page} of {pagination.total_pages} 
                            ({pagination.total_records} total records)
                          </p>
                          <p>
                            {pagination.per_page} records per page
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Overdue Installments</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Great! There are no overdue installments at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const FeeReports = memo(FeeReportsComponent);

export default FeeReports;
