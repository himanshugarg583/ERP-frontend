import React, { memo, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import { FileText, Search, Users, AlertCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  getAllClassesDropdown,
  getStudentsByClass,
  getStudentCompleteFeeDetails,
} from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const StudentFeeReport = () => {
  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeDetails, setFeeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const formatCurrency = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const getInstallmentAmount = (installment, totalAmount) => {
    if (installment?.fixed_amount !== null && installment?.fixed_amount !== undefined) {
      return Number(installment.fixed_amount) || 0;
    }
    if (installment?.invoice?.net_amount) {
      return Number(installment.invoice.net_amount) || 0;
    }
    const base = Number(totalAmount) || 0;
    const pct = Number(installment?.percentage) || 0;
    return base && pct ? (base * pct) / 100 : 0;
  };

  const buildInvoiceHtml = ({ student, feeStructure, installment, invoice, totalAmount }) => {
    const invoiceNumber =
      invoice?.invoice_number ||
      invoice?.invoice_no ||
      installment?.invoice_number ||
      installment?.invoice_no ||
      `INV-${installment?.installment_number || ""}`;
    const statusLabel = String(installment?.status || "").toLowerCase() === "paid" ? "Paid" : "Unpaid";
    const installmentAmount = getInstallmentAmount(installment, totalAmount);

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice ${escapeHtml(invoiceNumber)}</title>
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
    <h1>Fee Invoice</h1>
    <div class="muted">Generated on ${escapeHtml(formatDate(invoice?.generated_at))}</div>

    <div class="row">
      <div class="card">
        <h2>Student Details</h2>
        <div><strong>Name:</strong> ${escapeHtml(student?.name || "")}</div>
        <div><strong>Class:</strong> ${escapeHtml(student?.class || "")}</div>
        <div><strong>Email:</strong> ${escapeHtml(student?.email || "")}</div>
        <div><strong>Phone:</strong> ${escapeHtml(student?.phone || "")}</div>
      </div>
      <div class="card">
        <h2>Invoice Details</h2>
        <div><strong>Invoice No:</strong> ${escapeHtml(invoiceNumber)}</div>
        <div><strong>Status:</strong> ${escapeHtml(statusLabel)}</div>
        <div><strong>Due Date:</strong> ${escapeHtml(formatDate(installment?.due_date || invoice?.due_date))}</div>
        <div><strong>Structure:</strong> ${escapeHtml(feeStructure?.name || "")}</div>
      </div>
    </div>

    <h2>Installment</h2>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Start Date</th>
          <th>Percentage</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(installment?.installment_number || "-")}</td>
          <td>${escapeHtml(installment?.name || "-")}</td>
          <td>${escapeHtml(formatDate(installment?.start_date || "-"))}</td>
          <td>${escapeHtml(String(installment?.percentage ?? 0))}%</td>
          <td>₹${escapeHtml(formatCurrency(installmentAmount))}</td>
        </tr>
      </tbody>
    </table>

    <h2>Amounts</h2>
    <table>
      <tbody>
        <tr>
          <th>Gross Amount</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.gross_amount ?? installmentAmount))}</td>
        </tr>
        <tr>
          <th>Concession</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.concession_amount ?? 0))}</td>
        </tr>
        <tr>
          <th>Net Amount</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.net_amount ?? installmentAmount))}</td>
        </tr>
        <tr>
          <th>Fine Amount</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.fine_amount ?? 0))}</td>
        </tr>
        <tr>
          <th>Paid Amount</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.paid_amount ?? 0))}</td>
        </tr>
        <tr>
          <th>Balance Amount</th>
          <td>₹${escapeHtml(formatCurrency(invoice?.balance_amount ?? 0))}</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
  };

  const handleDownloadInvoice = (installment) => {
    if (!feeDetails) return;
    const student = feeDetails.student_info || {};
    const feeStructure = feeDetails.feeStructure || {};
    const totalAmount = feeStructure.total_amount || 0;
    const invoice = installment?.invoice || {};
    const html = buildInvoiceHtml({ student, feeStructure, installment, invoice, totalAmount });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${student.name || "student"}-${installment?.installment_number || ""}.html`
      .toLowerCase()
      .replace(/\s+/g, "-");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchClassSections();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      const errorMessage = "Failed to load class sections";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    
    if (!classId) {
      setStudents([]);
      setClassInfo(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getStudentsByClass(classId);
      
      // Handle new API response structure
      if (response?.data && Array.isArray(response.data)) {
        setStudents(response.data);
        // Set class info from the selected class section
        const selectedClassSection = classSections.find(cs => cs.id === Number(classId));
        setClassInfo(selectedClassSection || null);
      } else if (Array.isArray(response)) {
        setStudents(response);
        const selectedClassSection = classSections.find(cs => cs.id === Number(classId));
        setClassInfo(selectedClassSection || null);
      } else {
        setStudents([]);
        setClassInfo(null);
      }
    } catch (err) {
      const errorMessage = "Failed to load students";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
      setStudents([]);
      setClassInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const name = student.name?.toLowerCase() || "";
    const rollNumber = student.roll_number?.toLowerCase() || "";
    const fatherName = student.father_name?.toLowerCase() || "";
    return name.includes(searchLower) || rollNumber.includes(searchLower) || fatherName.includes(searchLower);
  });

  const handleViewReport = async (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setLoadingDetails(true);
    setError("");

    try {
      const response = await getStudentCompleteFeeDetails(student.id, student);
      
      if (response?.data) {
        setFeeDetails(response.data);
      } else {
        setFeeDetails(response);
      }
    } catch (err) {
      const errorMessage = "Failed to load fee details";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
      setFeeDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFeeDetails(null);
  };

  const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase() === "paid" ? "paid" : "unpaid";
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Paid" },
      unpaid: { color: "bg-yellow-100 text-yellow-800", icon: XCircle, label: "Unpaid" },
    };

    const config = statusConfig[normalized];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

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
              <PageHeader pageheading="Fee Management" Subheading="Student Fee Reports" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class/Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">-- Select Class --</option>
                    {classSections.map((cs) => (
                      <option key={cs.id} value={cs.id}>
                        {cs.class_name} - {cs.section_name}
                      </option>
                    ))}
                  </select>
                </div>

                {students.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Student
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or roll number..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Students List */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p className="text-gray-600">Loading students...</p>
                </div>
              </div>
            ) : !selectedClass ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Fee Reports</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Please select a class to view student fee reports.
                  </p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No students are enrolled in this class.
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
                          S.No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Father Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.roll_number || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.father_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {student.gender || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.phone_no || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button
                              onClick={() => handleViewReport(student)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              View Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-gray-500">
                    No students found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Fee Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Student Fee Details"
        subtitle={selectedStudent ? `${selectedStudent.name} - Roll No: ${selectedStudent.roll_number || "N/A"}` : ""}
        size="xl"
      >
          <div className="space-y-6">
              {loadingDetails ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p className="text-gray-600">Loading fee details...</p>
                </div>
              ) : !feeDetails ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No fee details available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Info */}
                  {feeDetails.student_info && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.name || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.email || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.phone || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Class</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.class || "-"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fee Structure Details */}
                  {feeDetails.feeStructure && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Fee Structure Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{feeDetails.feeStructure.name || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Structure Type</p>
                          <p className="font-medium text-gray-900 capitalize">{feeDetails.feeStructure.structure_type || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Amount</p>
                          <p className="font-medium text-gray-900">₹{formatCurrency(feeDetails.feeStructure.total_amount)}</p>
                        </div>
                      </div>
                      {feeDetails.feeStructure.description && (
                        <p className="text-sm text-gray-600 mt-3">{feeDetails.feeStructure.description}</p>
                      )}
                    </div>
                  )}

                  {/* Installment Schedule */}
                  {feeDetails.installments && feeDetails.installments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Installment Schedule</h3>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {feeDetails.installments.map((installment) => (
                              <tr key={installment.id || installment.installment_number} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-900">{installment.installment_number || "-"}</td>
                                <td className="px-4 py-3 text-gray-900">{installment.name || `Installment ${installment.installment_number || ""}`}</td>
                                <td className="px-4 py-3 text-gray-700">{formatDate(installment.start_date)}</td>
                                <td className="px-4 py-3 text-gray-700">{formatDate(installment.due_date)}</td>
                                <td className="px-4 py-3 text-gray-700">{installment.percentage ?? 0}%</td>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  ₹{formatCurrency(
                                    getInstallmentAmount(installment, feeDetails.feeStructure?.total_amount)
                                  )}
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(installment.status)}</td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadInvoice(installment)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Download
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
        </Modal>
    </div>
  );
};

const StudentFeeReportPage = memo(StudentFeeReport);

export default StudentFeeReportPage;
