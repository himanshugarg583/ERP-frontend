import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import { 
  DollarSign, 
  Search, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  X,
  Calendar,
  CreditCard,
  User,
  FileText,
  IndianRupee,
  Plus
} from "lucide-react";
import {
  getAllPayments,
  getPaymentDetails,
  createPayment,
  getAllClassesDropdown,
  getAllStudentsByClass,
  getStudentInstallments
} from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const PaymentReceived = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    student_id: "",
    amount_paid: "",
    payment_method: "cash",
    installment_ids: [],
    late_fee_paid: "",
    transaction_id: "",
    payment_for: "",
    remarks: "",
    cheque_number: "",
    bank_name: "",
  });
  const [installments, setInstallments] = useState([]);
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  useEffect(() => {
    fetchPayments();
    fetchClassSections();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllPayments();
      
      if (response?.data) {
        setPayments(response.data.payments || []);
        setSummary(response.data.summary || null);
        setPagination(response.data.pagination || null);
      } else if (response?.payments) {
        setPayments(response.payments || []);
        setSummary(response.summary || null);
        setPagination(response.pagination || null);
      } else if (Array.isArray(response)) {
        setPayments(response);
      }
    } catch (err) {
      const errorMessage = "Failed to load payments";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (payment) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    setError("");

    try {
      const response = await getPaymentDetails(payment.id);
      
      if (response?.data) {
        setSelectedPayment(response.data);
      } else {
        setSelectedPayment(response);
      }
    } catch (err) {
      const errorMessage = "Failed to load payment details";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
      setSelectedPayment(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const fetchClassSections = async () => {
    try {
      const response = await getAllClassesDropdown();
      let sections = [];
      if (response?.data && Array.isArray(response.data)) {
        sections = response.data;
      } else if (Array.isArray(response)) {
        sections = response;
      }
      setClassSections(sections);
    } catch (err) {
      console.error("Failed to fetch class sections:", err);
    }
  };

  const handleClassChange = async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }
    try {
      const response = await getAllStudentsByClass(classId);
      let studentsList = [];
      if (response?.data && Array.isArray(response.data)) {
        studentsList = response.data;
      } else if (Array.isArray(response)) {
        studentsList = response;
      }
      setStudents(studentsList);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      toast.error("Failed to fetch students");
    }
  };

  const handleStudentChange = async (studentId) => {
    if (!studentId) {
      setInstallments([]);
      setSelectedInstallments([]);
      setStudentInfo(null);
      return;
    }
    
    try {
      const response = await getStudentInstallments(studentId);
      if (response?.data) {
        setInstallments(response.data.installments || []);
        setStudentInfo(response.data.student_info || null);
      } else {
        setInstallments([]);
        setStudentInfo(null);
      }
    } catch (err) {
      console.error("Failed to fetch installments:", err);
      toast.error("Failed to fetch student installments");
      setInstallments([]);
      setStudentInfo(null);
    }
  };

  const handleInstallmentToggle = (installmentId) => {
    setSelectedInstallments(prev => {
      let updatedSelection;
      if (prev.includes(installmentId)) {
        updatedSelection = prev.filter(id => id !== installmentId);
      } else {
        updatedSelection = [...prev, installmentId];
      }
      
      // Calculate total amount and late fee for selected installments
      const selectedInstallmentsData = installments.filter(inst => 
        updatedSelection.includes(inst.installment_id)
      );
      
      const totalDue = selectedInstallmentsData.reduce((sum, inst) => 
        sum + (parseFloat(inst.due_amount) || 0), 0
      );
      
      const totalLateFee = selectedInstallmentsData.reduce((sum, inst) => 
        sum + (parseFloat(inst.late_fee) || 0), 0
      );
      
      // Auto-fill the amount and late fee
      setPaymentForm(prevForm => ({
        ...prevForm,
        amount_paid: totalDue.toString(),
        late_fee_paid: totalLateFee.toString()
      }));
      
      return updatedSelection;
    });
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    if (selectedInstallments.length === 0) {
      toast.error("Please select at least one installment");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        student_id: Number(paymentForm.student_id),
        amount_paid: Number(paymentForm.amount_paid),
        payment_method: paymentForm.payment_method,
        installment_ids: selectedInstallments,
        late_fee_paid: Number(paymentForm.late_fee_paid) || 0,
        transaction_id: paymentForm.transaction_id || null,
        cheque_number: paymentForm.cheque_number || null,
        bank_name: paymentForm.bank_name || null,
        payment_for: paymentForm.payment_for,
        remarks: paymentForm.remarks || "",
      };

      const response = await createPayment(payload);
      const successMessage = response?.message || "Payment created successfully!";
      setSuccess(successMessage);
      toast.success(successMessage);
      
      // Reset form
      setPaymentForm({
        student_id: "",
        amount_paid: "",
        payment_method: "cash",
        installment_ids: [],
        late_fee_paid: "",
        transaction_id: "",
        payment_for: "",
        remarks: "",
        cheque_number: "",
        bank_name: "",
      });
      setStudents([]);
      setInstallments([]);
      setSelectedInstallments([]);
      setStudentInfo(null);
      setIsCreateModalOpen(false);
      fetchPayments();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to create payment";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodBadge = (method) => {
    const config = {
      cash: { color: "bg-green-100 text-green-800", label: "Cash" },
      cheque: { color: "bg-blue-100 text-blue-800", label: "Cheque" },
      card: { color: "bg-purple-100 text-purple-800", label: "Card" },
      online: { color: "bg-indigo-100 text-indigo-800", label: "Online" },
      upi: { color: "bg-pink-100 text-pink-800", label: "UPI" },
    };
    
    const methodConfig = config[method?.toLowerCase()] || config.cash;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodConfig.color}`}>
        {methodConfig.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      success: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      failed: { color: "bg-red-100 text-red-800", icon: X },
    };
    
    const statusConfig = config[status?.toLowerCase()] || config.success;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = payment.Student?.User?.name?.toLowerCase() || "";
    const receiptNumber = payment.receipt_number?.toLowerCase() || "";
    const admissionNumber = payment.Student?.admission_number?.toLowerCase() || "";
    return studentName.includes(searchLower) || receiptNumber.includes(searchLower) || admissionNumber.includes(searchLower);
  });

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
              <PageHeader pageheading="Fee Management" Subheading="Payment Received" />
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.total_payments}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(summary.total_amount)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
                  <p className="text-2xl font-bold text-green-600">{summary.successful_payments}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-1">Successful Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{formatCurrency(summary.total_successful_amount)}</p>
                </div>
              </div>
            )}

            {/* Search and Create Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student name, receipt number, or admission number..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Create Payment
                </button>
              </div>
            </div>

            {/* Payments Table */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p className="text-gray-600">Loading payments...</p>
                </div>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm ? `No payments found matching "${searchTerm}"` : "No payment records available"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt No.
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Late Fee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.receipt_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{payment.student?.User?.name}</p>
                              <p className="text-gray-500 text-xs">Roll: {payment.student?.roll_number}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.student?.ClassSection?.class_name} - {payment.student?.ClassSection?.section_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{formatCurrency(payment.amount_paid)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {payment.late_fee_paid > 0 ? `₹${formatCurrency(payment.late_fee_paid)}` : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                            ₹{formatCurrency(payment.total_paid)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getPaymentMethodBadge(payment.payment_method)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(payment.payment_status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Info */}
                {pagination && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
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
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Payment Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Payment Details"
        subtitle={selectedPayment ? `Receipt: ${selectedPayment.receipt_number}` : ""}
        size="xl"
      >
          <div className="space-y-6">
              {loadingDetails ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p className="text-gray-600">Loading payment details...</p>
                </div>
              ) : !selectedPayment ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payment details available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Info */}
                  {selectedPayment.student && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Student Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{selectedPayment.student.User?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Roll Number</p>
                          <p className="font-medium text-gray-900">{selectedPayment.student.roll_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Class</p>
                          <p className="font-medium text-gray-900">
                            {selectedPayment.student.ClassSection?.class_name} - {selectedPayment.student.ClassSection?.section_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedPayment.student.User?.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{selectedPayment.student.User?.phone_number || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date of Birth</p>
                          <p className="font-medium text-gray-900">
                            {selectedPayment.student.date_of_birth ? new Date(selectedPayment.student.date_of_birth).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <IndianRupee className="w-5 h-5" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Receipt Number</p>
                        <p className="font-medium text-gray-900">{selectedPayment.receipt_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Academic Year</p>
                        <p className="font-medium text-gray-900">{selectedPayment.academic_year}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Date</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedPayment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount Paid</p>
                        <p className="font-medium text-blue-600 text-lg">₹{formatCurrency(selectedPayment.amount_paid)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Late Fee</p>
                        <p className="font-medium text-red-600">
                          {selectedPayment.late_fee_paid > 0 ? `₹${formatCurrency(selectedPayment.late_fee_paid)}` : "₹0.00"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Paid</p>
                        <p className="font-bold text-green-600 text-lg">₹{formatCurrency(selectedPayment.total_paid)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Method</p>
                        <div className="mt-1">
                          {getPaymentMethodBadge(selectedPayment.payment_method)}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Status</p>
                        <div className="mt-1">
                          {getStatusBadge(selectedPayment.payment_status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Type</p>
                        <p className="font-medium text-gray-900">{selectedPayment.payment_type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Transaction Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Payment For</p>
                        <p className="font-medium text-gray-900">{selectedPayment.payment_for || "N/A"}</p>
                      </div>
                      {selectedPayment.transaction_id && (
                        <div>
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-medium text-gray-900">{selectedPayment.transaction_id}</p>
                        </div>
                      )}
                      {selectedPayment.cheque_number && (
                        <div>
                          <p className="text-gray-500">Cheque Number</p>
                          <p className="font-medium text-gray-900">{selectedPayment.cheque_number}</p>
                        </div>
                      )}
                      {selectedPayment.bank_name && (
                        <div>
                          <p className="text-gray-500">Bank Name</p>
                          <p className="font-medium text-gray-900">{selectedPayment.bank_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Is Refund</p>
                        <p className="font-medium text-gray-900">{selectedPayment.is_refund ? "Yes" : "No"}</p>
                      </div>
                      {selectedPayment.refund_reason && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Refund Reason</p>
                          <p className="font-medium text-gray-900">{selectedPayment.refund_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remarks */}
                  {selectedPayment.remarks && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Remarks
                      </h3>
                      <p className="text-sm text-gray-700">{selectedPayment.remarks}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Created At</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedPayment.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Updated At</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedPayment.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </Modal>

      {/* Create Payment Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Payment"
        size="xl"
      >
            <form onSubmit={handleCreatePayment} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classSections.map((classSection) => (
                      <option key={classSection.id} value={classSection.id}>
                        {classSection.class_name} - {classSection.section_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="student_id"
                    value={paymentForm.student_id}
                    onChange={(e) => {
                      handlePaymentFormChange(e);
                      handleStudentChange(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                    disabled={students.length === 0}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.roll_number ? `${student.roll_number} - ${student.name}` : student.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Info */}
                {studentInfo && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">{studentInfo.name}</p>
                    <p className="text-xs text-blue-700">{studentInfo.email}</p>
                  </div>
                )}

                {/* Installment Selection */}
                {installments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Installments <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                      {installments.map((installment) => (
                        <div 
                          key={installment.installment_id}
                          className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                            selectedInstallments.includes(installment.installment_id) ? 'bg-violet-50' : ''
                          }`}
                          onClick={() => handleInstallmentToggle(installment.installment_id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedInstallments.includes(installment.installment_id)}
                              onChange={() => handleInstallmentToggle(installment.installment_id)}
                              className="mt-1 h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {installment.installment_name}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  installment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {installment.status}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-gray-600">
                                <span>{installment.fee_structure_name}</span>
                                <span className="mx-2">•</span>
                                <span>Due: {new Date(installment.due_date).toLocaleDateString()}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-3 text-xs">
                                <span className="text-gray-700">Amount: ₹{installment.amount}</span>
                                <span className="text-green-600">Paid: ₹{installment.paid_amount}</span>
                                <span className="text-red-600">Due: ₹{installment.due_amount}</span>
                                {installment.late_fee && installment.late_fee !== '0.00' && (
                                  <span className="text-orange-600">Late Fee: ₹{installment.late_fee}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedInstallments.length > 0 && (
                      <p className="mt-2 text-sm text-violet-600">
                        {selectedInstallments.length} installment(s) selected
                      </p>
                    )}
                  </div>
                )}

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount_paid"
                    value={paymentForm.amount_paid}
                    onChange={handlePaymentFormChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                {/* Late Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Fee (Optional)
                  </label>
                  <input
                    type="number"
                    name="late_fee_paid"
                    value={paymentForm.late_fee_paid}
                    onChange={handlePaymentFormChange}
                    placeholder="Enter late fee"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_method"
                    value={paymentForm.payment_method}
                    onChange={handlePaymentFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                {/* Transaction ID */}
                {(paymentForm.payment_method === 'online' || paymentForm.payment_method === 'upi' || paymentForm.payment_method === 'card') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transaction_id"
                      value={paymentForm.transaction_id}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter transaction ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                )}

                {paymentForm.payment_method === 'cheque' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cheque Number
                      </label>
                      <input
                        type="text"
                        name="cheque_number"
                        value={paymentForm.cheque_number}
                        onChange={handlePaymentFormChange}
                        placeholder="Enter cheque number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bank_name"
                        value={paymentForm.bank_name}
                        onChange={handlePaymentFormChange}
                        placeholder="Enter bank name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                )}

                {paymentForm.payment_method === 'bank_transfer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={paymentForm.bank_name}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter bank name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                )}

                {/* Payment For */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment For <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="payment_for"
                    value={paymentForm.payment_for}
                    onChange={handlePaymentFormChange}
                    placeholder="e.g., Tuition Fee Q1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    name="remarks"
                    value={paymentForm.remarks}
                    onChange={handlePaymentFormChange}
                    placeholder="Enter any remarks"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Payment"}
                </button>
              </div>
            </form>
        </Modal>
    </div>
  );
};

const PaymentReceivedPage = memo(PaymentReceived);

export default PaymentReceivedPage;
