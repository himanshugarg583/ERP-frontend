import React, { memo, useState, useEffect, useCallback } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import ReusableTable from "../../../components/comman_components/ReusableTable";
import { 
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
  getStudentUnpaidInvoices
} from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const PaymentReceived = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    class_id: "",
    student_id: "",
    invoice_id: "",
    amount_paid: "",
    payment_mode: "cash",
    transaction_ref: "",
    notes: "",
    cheque_date: "",
    cheque_bank: "",
  });

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFineType = (value) => {
    if (!value) return "N/A";
    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildReceiptHtml = (payment) => {
    const student = payment?.student || {};
    const user = student.User || {};
    const classSection = student.ClassSection || {};
    const receipt = payment?.receipt || {};
    const receiptNumber =
      receipt.receipt_number ||
      receipt.receipt_no ||
      payment?.receipt_number ||
      payment?.id ||
      "";
    const invoiceNumber = receipt.invoice_number || receipt.invoice_no || "";
    const classLabel = [classSection.class_name, classSection.section_name]
      .filter(Boolean)
      .join(" - ") || "N/A";
    const studentName = user.name || student.name || payment?.student_name || "N/A";

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Receipt ${escapeHtml(receiptNumber)}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
      h1 { font-size: 20px; margin-bottom: 4px; }
      h2 { font-size: 16px; margin: 24px 0 8px; }
      .muted { color: #6b7280; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 13px; }
      th { background: #f9fafb; }
      .row { display: flex; gap: 16px; flex-wrap: wrap; }
      .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; flex: 1 1 260px; }
    </style>
  </head>
  <body>
    <h1>Payment Receipt</h1>
    <div class="muted">Generated on ${escapeHtml(formatDateTime(payment?.payment_date))}</div>

    <div class="row">
      <div class="card">
        <h2>Student Details</h2>
        <div><strong>Name:</strong> ${escapeHtml(studentName)}</div>
        <div><strong>Class:</strong> ${escapeHtml(classLabel)}</div>
        <div><strong>Email:</strong> ${escapeHtml(user.email || "")}</div>
        <div><strong>Phone:</strong> ${escapeHtml(user.phone_number || user.phone || "")}</div>
      </div>
      <div class="card">
        <h2>Receipt Details</h2>
        <div><strong>Receipt No:</strong> ${escapeHtml(receiptNumber)}</div>
        <div><strong>Invoice No:</strong> ${escapeHtml(invoiceNumber || "N/A")}</div>
        <div><strong>Payment Date:</strong> ${escapeHtml(formatDate(payment?.payment_date))}</div>
        <div><strong>Method:</strong> ${escapeHtml(String(payment?.payment_method || "").toUpperCase())}</div>
        <div><strong>Status:</strong> ${escapeHtml(String(payment?.payment_status || "").toUpperCase())}</div>
      </div>
    </div>

    <h2>Amounts</h2>
    <table>
      <tbody>
        <tr>
          <th>Amount Paid</th>
          <td>₹${escapeHtml(formatCurrency(payment?.amount_paid))}</td>
        </tr>
        <tr>
          <th>Late Fee</th>
          <td>₹${escapeHtml(formatCurrency(payment?.late_fee_paid))}</td>
        </tr>
        <tr>
          <th>Total Paid</th>
          <td>₹${escapeHtml(formatCurrency(payment?.total_paid))}</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
  };

  const normalizeList = (response, keys = []) => {
    const candidates = [
      response?.data?.data,
      ...keys.map((key) => response?.data?.[key]),
      response?.data,
      response,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate;
    }

    return [];
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllPayments();
      
      if (response?.data) {
        setPayments(response.data.payments || []);
        setSummary(response.data.summary || null);
      } else if (response?.payments) {
        setPayments(response.payments || []);
        setSummary(response.summary || null);
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
  }, []);

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

  const handleDownloadReceipt = () => {
    if (!selectedPayment) return;
    const html = buildReceiptHtml(selectedPayment);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileKey = selectedPayment.receipt_number || selectedPayment.id || "payment";
    link.href = url;
    link.download = `receipt-${String(fileKey)}`.toLowerCase().replace(/\s+/g, "-") + ".html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const fetchClassSections = useCallback(async () => {
    try {
      const response = await getAllClassesDropdown();
      const sections = normalizeList(response, ["classSections", "class_sections", "classes", "items"]);
      setClassSections(sections);
    } catch (err) {
      console.error("Failed to fetch class sections:", err);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchClassSections();
  }, [fetchPayments, fetchClassSections]);

  const resetInvoiceState = () => {
    setInvoices([]);
    setSelectedInvoice(null);
    setPaymentForm((prev) => ({
      ...prev,
      class_id: "",
      student_id: "",
      invoice_id: "",
      amount_paid: "",
      payment_mode: "cash",
      transaction_ref: "",
      notes: "",
      cheque_date: "",
      cheque_bank: "",
    }));
  };

  const handleClassChange = async (classId) => {
    if (!classId) {
      setStudents([]);
      setSelectedClassId("");
      resetInvoiceState();
      return;
    }

    setSelectedClassId(classId);
    setPaymentForm((prev) => ({
      ...prev,
      class_id: classId,
      student_id: "",
      invoice_id: "",
      amount_paid: "",
    }));
    setStudents([]);
    setInvoices([]);
    setSelectedInvoice(null);
    setInvoiceLoading(false);

    try {
      const response = await getAllStudentsByClass(classId);
      const studentsList = normalizeList(response, ["students", "items", "records"]);
      setStudents(studentsList);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      toast.error("Failed to fetch students");
    }
  };

  const handleStudentChange = async (studentId) => {
    if (!studentId) {
      setInvoices([]);
      setSelectedInvoice(null);
      setInvoiceLoading(false);
      setPaymentForm((prev) => ({
        ...prev,
        student_id: "",
        invoice_id: "",
        amount_paid: "",
      }));
      return;
    }

    setPaymentForm((prev) => ({
      ...prev,
      student_id: studentId,
      invoice_id: "",
      amount_paid: "",
    }));
    
    try {
      setInvoiceLoading(true);
      const response = await getStudentUnpaidInvoices(studentId);
      const invoiceList = normalizeList(response, ["invoices", "items", "records"]);
      setInvoices(invoiceList);
    } catch (err) {
      console.error("Failed to fetch unpaid invoices:", err);
      toast.error("Failed to fetch unpaid invoices");
      setInvoices([]);
      setSelectedInvoice(null);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleInvoiceChange = (invoiceId) => {
    const invoice = invoices.find((item) => String(item.id) === String(invoiceId));
    setSelectedInvoice(invoice || null);
    setPaymentForm((prev) => ({
      ...prev,
      invoice_id: invoiceId,
      amount_paid: invoice ? String(invoice.payable_amount ?? invoice.balance_amount ?? invoice.net_amount ?? "") : "",
    }));
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    if (!paymentForm.invoice_id) {
      toast.error("Please select an invoice");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        invoice_id: paymentForm.invoice_id,
        amount_paid: Number(paymentForm.amount_paid),
        payment_mode: paymentForm.payment_mode,
        transaction_ref: paymentForm.transaction_ref || null,
        notes: paymentForm.notes || "",
        cheque_date: paymentForm.payment_mode === "cheque" ? paymentForm.cheque_date || null : null,
        cheque_bank: paymentForm.payment_mode === "cheque" ? paymentForm.cheque_bank || null : null,
      };

      const response = await createPayment(payload);
      const successMessage = response?.message || "Payment created successfully!";
      setSuccess(successMessage);
      toast.success(successMessage);
      
      // Reset form
      setPaymentForm({
        class_id: "",
        student_id: "",
        invoice_id: "",
        amount_paid: "",
        payment_mode: "cash",
        transaction_ref: "",
        notes: "",
        cheque_date: "",
        cheque_bank: "",
      });
      setStudents([]);
      setInvoices([]);
      setSelectedInvoice(null);
      setSelectedClassId("");
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

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setStudents([]);
    setInvoices([]);
    setSelectedInvoice(null);
    setSelectedClassId("");
    setPaymentForm({
      class_id: "",
      student_id: "",
      invoice_id: "",
      amount_paid: "",
      payment_mode: "cash",
      transaction_ref: "",
      notes: "",
      cheque_date: "",
      cheque_bank: "",
    });
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

  const paymentRows = payments.map((payment) => {
    const student = payment.student || {};
    const user = student.User || {};
    const classSection = student.ClassSection || {};
    const classLabel = [classSection.class_name, classSection.section_name].filter(Boolean).join(" - ");

    return {
      id: payment.id,
      payment_id: payment.id,
      receipt_number: payment.receipt_number || "N/A",
      student_name: user.name || student.name || payment.student_name || "N/A",
      class_name: classLabel || "N/A",
      payment_date: payment.payment_date || "",
      amount_paid: payment.amount_paid || 0,
      payment_method: payment.payment_method || "cash",
      payment_status: payment.payment_status || "success",
    };
  });

  const paymentColumns = [
    { header: "Payment ID", key: "payment_id" },
    { header: "Receipt No.", key: "receipt_number" },
    { header: "Student Name", key: "student_name" },
    { header: "Class", key: "class_name" },
    {
      header: "Payment Date",
      key: "payment_date",
      type: "date",
      render: (value) => formatDate(value),
    },
    {
      header: "Amount",
      key: "amount_paid",
      render: (value) => <span className="font-medium text-gray-900">₹{formatCurrency(value)}</span>,
    },
    {
      header: "Method",
      key: "payment_method",
      render: (value) => getPaymentMethodBadge(value),
    },
    {
      header: "Status",
      key: "payment_status",
      render: (value) => getStatusBadge(value),
    },
    {
      header: "View",
      key: "view",
      render: (_, item) => (
        <button
          onClick={() => handleViewDetails({ id: item.id })}
          className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

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

            {/* Create Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex justify-end">
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
            <ReusableTable
              title="Payments"
              columns={paymentColumns}
              displayColumns={paymentColumns}
              initialData={paymentRows}
              searchPlaceholder="Search payments..."
              exportFileName="payments"
              showActions={{ view: false, edit: false, delete: false, add: false }}
              loading={loading}
            />
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
                  <div className="flex justify-end">
                    <button
                      onClick={handleDownloadReceipt}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      Download Receipt
                    </button>
                  </div>
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
                      {(selectedPayment.receipt?.invoice_number || selectedPayment.receipt?.invoice_no) && (
                        <div>
                          <p className="text-gray-500">Invoice Number</p>
                          <p className="font-medium text-gray-900">
                            {selectedPayment.receipt?.invoice_number || selectedPayment.receipt?.invoice_no}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Academic Year</p>
                        <p className="font-medium text-gray-900">{selectedPayment.academic_year}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Date</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(selectedPayment.payment_date)}
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
        onClose={handleCloseCreateModal}
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
                    name="class_id"
                    value={paymentForm.class_id}
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
                    disabled={!selectedClassId || students.length === 0}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.roll_number ? `${student.roll_number} - ${student.name}` : student.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Invoice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Invoice <span className="text-red-500">*</span>
                  </label>

                  {!paymentForm.student_id ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      First select a student to load unpaid invoices.
                    </div>
                  ) : invoiceLoading ? (
                    <div className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
                      Loading unpaid invoices...
                    </div>
                  ) : invoices.length > 0 ? (
                    <>
                      <select
                        name="invoice_id"
                        value={paymentForm.invoice_id}
                        onChange={(e) => handleInvoiceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      >
                        <option value="">Select Invoice</option>
                        {invoices.map((invoice) => (
                          <option key={invoice.id} value={invoice.id}>
                            {invoice.invoice_number} - Balance ₹{Number(invoice.balance_amount || 0).toFixed(2)}
                          </option>
                        ))}
                      </select>
                      {selectedInvoice && (
                        <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{selectedInvoice.invoice_number}</p>
                              <p className="text-xs text-violet-700 mt-1">
                                Status: {selectedInvoice.status || "N/A"}
                              </p>
                            </div>
                            <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
                              {formatDate(selectedInvoice.due_date)}
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-md bg-white/70 p-3 border border-violet-100">
                              <p className="text-xs text-violet-700">Balance Amount</p>
                              <p className="font-semibold text-violet-950">₹{formatCurrency(selectedInvoice.balance_amount)}</p>
                            </div>
                            <div className="rounded-md bg-white/70 p-3 border border-violet-100">
                              <p className="text-xs text-violet-700">Fine Type</p>
                              <p className="font-semibold text-violet-950">{formatFineType(selectedInvoice.fine_type)}</p>
                            </div>
                            <div className="rounded-md bg-white/70 p-3 border border-violet-100">
                              <p className="text-xs text-violet-700">Calculated Fine</p>
                              <p className="font-semibold text-violet-950">₹{formatCurrency(selectedInvoice.calculated_fine)}</p>
                            </div>
                            <div className="rounded-md bg-white/70 p-3 border border-violet-100">
                              <p className="text-xs text-violet-700">Payable Amount</p>
                              <p className="font-semibold text-violet-950">₹{formatCurrency(selectedInvoice.payable_amount)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      No unpaid invoices found for this student.
                    </div>
                  )}
                </div>

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
                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_mode"
                    value={paymentForm.payment_mode}
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

                {/* Transaction Reference */}
                {(paymentForm.payment_mode === 'online' || paymentForm.payment_mode === 'upi' || paymentForm.payment_mode === 'card' || paymentForm.payment_mode === 'bank_transfer') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Reference
                    </label>
                    <input
                      type="text"
                      name="transaction_ref"
                      value={paymentForm.transaction_ref}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter transaction reference"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                )}

                {paymentForm.payment_mode === 'cheque' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cheque Date
                      </label>
                      <input
                        type="date"
                        name="cheque_date"
                        value={paymentForm.cheque_date}
                        onChange={handlePaymentFormChange}
                        placeholder="Select cheque date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cheque Bank
                      </label>
                      <input
                        type="text"
                        name="cheque_bank"
                        value={paymentForm.cheque_bank}
                        onChange={handlePaymentFormChange}
                        placeholder="Enter cheque bank"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={paymentForm.notes}
                    onChange={handlePaymentFormChange}
                    placeholder="Collected at school counter"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
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
