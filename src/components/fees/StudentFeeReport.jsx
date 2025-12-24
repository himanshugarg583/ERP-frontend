import React, { useState, useEffect } from 'react';
import { Search, FileText, DollarSign, Calendar, CheckCircle, XCircle, Clock, Eye, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllClassSections,
  getStudentsByClassSection,
  getStudentFeeReport
} from '../../helper/requests-method/apiMethods';

const StudentFeeReport = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeReport, setFeeReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getAllClassSections();
      if (response.success) {
        setClasses(Array.isArray(response.data?.classes) ? response.data.classes : 
                   Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchStudents = async (classId, sectionId) => {
    if (!classId || !sectionId) return;
    
    setLoading(true);
    try {
      const response = await getStudentsByClassSection(classId, sectionId);
      if (response.success) {
        setStudents(Array.isArray(response.data?.students) ? response.data.students : 
                   Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    setStudents([]);
    setSearchTerm('');
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    fetchStudents(selectedClass, sectionId);
  };

  const viewStudentFeeReport = async (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setLoadingReport(true);
    setFeeReport(null);

    try {
      const response = await getStudentFeeReport(student._id || student.id);
      if (response.success) {
        setFeeReport(response.data);
      } else {
        toast.error('Failed to fetch fee report');
      }
    } catch (error) {
      console.error('Error fetching fee report:', error);
      toast.error('Failed to fetch fee report');
    } finally {
      setLoadingReport(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFeeReport(null);
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      partial: { color: 'bg-yellow-100 text-yellow-800', label: 'Partial' },
      pending: { color: 'bg-red-100 text-red-800', label: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.label}</span>;
  };

  const calculateTotals = () => {
    if (!feeReport?.fee_details) return { total: 0, paid: 0, pending: 0 };
    
    const total = feeReport.total_amount || 0;
    const paid = feeReport.paid_amount || 0;
    const pending = total - paid;
    
    return { total, paid, pending };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-violet-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student Fee Reports</h2>
              <p className="text-gray-600 text-sm">View detailed fee reports for individual students</p>
            </div>
          </div>

          {/* Class and Section Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className || cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSection}
                onChange={handleSectionChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                disabled={!selectedClass}
              >
                <option value="">Select Section</option>
                {selectedClass && classes
                  .find(c => c._id === selectedClass)?.sections?.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.sectionName || section.section_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Student List */}
          {students.length > 0 && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Students ({filteredStudents.length})
                </h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Admission No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr key={student._id || student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.roll_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.admission_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => viewStudentFeeReport(student)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              View Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          )}

          {!loading && students.length === 0 && selectedClass && selectedSection && (
            <div className="text-center py-12 text-gray-500">
              No students found in this class/section
            </div>
          )}

          {!selectedClass && (
            <div className="text-center py-12 text-gray-500">
              Please select a class and section to view students
            </div>
          )}
        </div>
      </div>

      {/* Fee Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Fee Report</h3>
                  <p className="text-violet-100">
                    {selectedStudent?.name} | Roll: {selectedStudent?.roll_number || 'N/A'}
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
              {loadingReport ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : feeReport ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-3 rounded-lg">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Fee</p>
                          <p className="text-2xl font-bold text-blue-700">₹{calculateTotals().total}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-3 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Paid Amount</p>
                          <p className="text-2xl font-bold text-green-700">₹{calculateTotals().paid}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500 p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pending Amount</p>
                          <p className="text-2xl font-bold text-red-700">₹{calculateTotals().pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Structure Details */}
                  {feeReport.fee_structure && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Fee Structure Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Structure Name:</span>
                          <p className="font-semibold">{feeReport.fee_structure.structure_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Academic Year:</span>
                          <p className="font-semibold">{feeReport.fee_structure.academic_year}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <p className="font-semibold">
                            {new Date(feeReport.fee_structure.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p>{getPaymentStatusBadge(feeReport.payment_status)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fee Breakdown */}
                  {feeReport.fee_details && feeReport.fee_details.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Fee Breakdown</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                Fee Head
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {feeReport.fee_details.map((detail, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {detail.fee_head_name || detail.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                  ₹{detail.amount}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50 font-semibold">
                              <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                ₹{calculateTotals().total}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Installments */}
                  {feeReport.installments && feeReport.installments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Installments</h4>
                      <div className="space-y-3">
                        {feeReport.installments.map((installment, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  Installment {installment.installment_number}
                                </p>
                                {installment.description && (
                                  <p className="text-sm text-gray-600 mt-1">{installment.description}</p>
                                )}
                              </div>
                              {getPaymentStatusBadge(installment.payment_status)}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                              <div>
                                <span className="text-gray-600">Due Date:</span>
                                <p className="font-semibold">
                                  {new Date(installment.due_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Amount:</span>
                                <p className="font-semibold text-blue-600">₹{installment.amount}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Paid:</span>
                                <p className="font-semibold text-green-600">
                                  ₹{installment.paid_amount || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment History */}
                  {feeReport.payment_history && feeReport.payment_history.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Payment History</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                Transaction ID
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                Payment Mode
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {feeReport.payment_history.map((payment, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {new Date(payment.payment_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {payment.transaction_id || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {payment.payment_mode || 'Cash'}
                                </td>
                                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                                  ₹{payment.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No fee report available for this student
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {feeReport && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeeReport;
