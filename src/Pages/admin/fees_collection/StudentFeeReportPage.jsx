import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import { FileText, Search, Users, AlertCircle, X, Eye, IndianRupee, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
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

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
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
      const response = await getStudentCompleteFeeDetails(student.id);
      
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
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      overdue: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
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

              {classInfo && (
                <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                  <div className="flex items-center gap-2 text-violet-700">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">
                      {classInfo.class_name} - {classInfo.section_name}
                    </span>
                    <span className="ml-auto text-sm">
                      Total Students: {students.length}
                    </span>
                  </div>
                </div>
              )}
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Admission Number</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.admission_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Class</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.class}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{feeDetails.student_info.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {feeDetails.summary && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Fee Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-600 text-sm mb-1">Total Assigned</p>
                          <p className="text-2xl font-bold text-blue-900">₹{feeDetails.summary.total_assigned_fee?.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-green-600 text-sm mb-1">Total Paid</p>
                          <p className="text-2xl font-bold text-green-900">₹{feeDetails.summary.total_paid_fee?.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <p className="text-red-600 text-sm mb-1">Total Due</p>
                          <p className="text-2xl font-bold text-red-900">₹{feeDetails.summary.total_due_fee?.toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-purple-600 text-sm mb-1">Total Discount</p>
                          <p className="text-2xl font-bold text-purple-900">₹{feeDetails.summary.total_discount?.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Installments Summary */}
                      {feeDetails.summary.installments_summary && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <p className="font-medium text-gray-700 mb-2">Installments Status</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-semibold text-gray-900">{feeDetails.summary.installments_summary.total_installments}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Paid</p>
                              <p className="font-semibold text-green-600">{feeDetails.summary.installments_summary.paid_installments}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Pending</p>
                              <p className="font-semibold text-yellow-600">{feeDetails.summary.installments_summary.pending_installments}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Overdue</p>
                              <p className="font-semibold text-red-600">{feeDetails.summary.installments_summary.overdue_installments}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fees by Academic Year */}
                  {feeDetails.fees_by_academic_year && feeDetails.fees_by_academic_year.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Year Wise Details</h3>
                      {feeDetails.fees_by_academic_year.map((yearData, yearIndex) => (
                        <div key={yearIndex} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-linear-to-r from-violet-50 to-purple-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{yearData.academic_year}</h4>
                              <div className="flex gap-4 text-sm">
                                <span className="text-gray-600">Assigned: <span className="font-semibold">₹{formatCurrency(yearData.total_assigned)}</span></span>
                                <span className="text-green-600">Paid: <span className="font-semibold">₹{formatCurrency(yearData.total_paid)}</span></span>
                                <span className="text-red-600">Due: <span className="font-semibold">₹{formatCurrency(yearData.total_due)}</span></span>
                              </div>
                            </div>
                          </div>

                          {/* Fee Structures */}
                          {yearData.fee_structures && yearData.fee_structures.map((feeStructure, fsIndex) => (
                            <div key={fsIndex} className="p-4 border-b border-gray-100 last:border-b-0">
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-gray-800">{feeStructure.fee_structure?.name}</h5>
                                  {getStatusBadge(feeStructure.status)}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500">Original Amount</p>
                                    <p className="font-medium text-gray-900">₹{formatCurrency(feeStructure.original_amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Discount</p>
                                    <p className="font-medium text-purple-600">₹{formatCurrency(feeStructure.discount_amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Final Amount</p>
                                    <p className="font-medium text-blue-600">₹{formatCurrency(feeStructure.final_amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Due Date</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {feeStructure.fee_structure?.due_date 
                                        ? new Date(feeStructure.fee_structure.due_date).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })
                                        : 'N/A'
                                      }
                                    </p>
                                  </div>
                                </div>
                                {feeStructure.discount_reason && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">Discount Reason:</span> {feeStructure.discount_reason}
                                  </p>
                                )}
                              </div>

                              {/* Installments */}
                              {feeStructure.installments && feeStructure.installments.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Installments</p>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">No.</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Due Date</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Paid Amount</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Payment Date</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Late Fee</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-100">
                                        {feeStructure.installments.map((installment, instIndex) => (
                                          <tr key={instIndex} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 text-gray-900">{installment.installment_number}</td>
                                            <td className="px-3 py-2 text-gray-900">₹{formatCurrency(installment.amount)}</td>
                                            <td className="px-3 py-2 text-gray-700">
                                              {installment.due_date 
                                                ? new Date(installment.due_date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                  })
                                                : 'N/A'
                                              }
                                            </td>
                                            <td className="px-3 py-2 font-medium text-green-600">
                                              ₹{formatCurrency(installment.paid_amount)}
                                            </td>
                                            <td className="px-3 py-2 text-gray-700">
                                              {installment.payment_date 
                                                ? new Date(installment.payment_date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                  })
                                                : '-'
                                              }
                                            </td>
                                            <td className="px-3 py-2 text-red-600">
                                              {installment.late_fee_applied > 0 ? `₹${formatCurrency(installment.late_fee_applied)}` : "-"}
                                            </td>
                                            <td className="px-3 py-2">
                                              {getStatusBadge(installment.status)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
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
