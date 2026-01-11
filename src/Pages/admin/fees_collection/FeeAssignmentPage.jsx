import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import { Plus, X, AlertCircle, CheckCircle, Eye, Edit2, Trash2, IndianRupee, Users } from "lucide-react";
import {
  assignFeeWithInstallments,
  getAllFeeStructures,
  getAllClassesDropdown,
  getClassFeeAssignment,
  editClassFeeAssignment,
  viewClassFeeAssignmentStudents,
  deleteClassFeeAssignment,
} from "../../../helper/requests-method/apiMethods";
import { toast } from "react-toastify";

const FeeAssignment = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    class_section_id: "",
    fee_structure_id: "",
    discount_amount: "",
    discount_reason: "",
    installments: [],
  });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewStudentsData, setViewStudentsData] = useState(null);
  const [loadingViewData, setLoadingViewData] = useState(false);

  useEffect(() => {
    fetchFeeStructures();
    fetchClassSections();
    fetchAssignments();
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

  const fetchFeeStructures = async () => {
    try {
      const response = await getAllFeeStructures();
      let structures = [];

      if (response?.data?.feeStructures && Array.isArray(response.data.feeStructures)) {
        structures = response.data.feeStructures;
      } else if (Array.isArray(response?.feeStructures)) {
        structures = response.feeStructures;
      } else if (Array.isArray(response)) {
        structures = response;
      }

      setFeeStructures(structures);
    } catch (err) {
      const errorMessage = "Failed to fetch fee structures";
      console.error(errorMessage, err);
      toast.error(errorMessage);
    }
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
      const errorMessage = "Failed to fetch class sections";
      console.error(errorMessage, err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddInstallment = () => {
    setForm({
      ...form,
      installments: [
        ...form.installments,
        { amount: "", due_date: "" },
      ],
    });
  };

  const handleRemoveInstallment = (index) => {
    const newInstallments = form.installments.filter((_, i) => i !== index);
    setForm({ ...form, installments: newInstallments });
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = [...form.installments];
    newInstallments[index][field] = field === "amount" ? Number(value) : value;
    setForm({ ...form, installments: newInstallments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate installments
    if (form.installments.length === 0) {
      const errorMessage = "Please add at least one installment";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    const payload = {
      class_section_id: Number(form.class_section_id),
      fee_structure_id: Number(form.fee_structure_id),
      discount_amount: Number(form.discount_amount) || 0,
      discount_reason: form.discount_reason || "",
      installments: form.installments.map(inst => ({
        amount: Number(inst.amount),
        due_date: inst.due_date
      }))
    };

    try {
      let response;
      if (isEditMode) {
        response = await editClassFeeAssignment(payload);
        const successMessage = response?.message || "Fee assignment updated successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
      } else {
        response = await assignFeeWithInstallments(payload);
        const successMessage = response?.message || "Fee assigned successfully with installments!";
        setSuccess(successMessage);
        toast.success(successMessage);
      }
      
      setForm({
        class_section_id: "",
        fee_structure_id: "",
        discount_amount: "",
        discount_reason: "",
        installments: [],
      });
      
      setIsEditMode(false);
      setEditingAssignment(null);
      
      // Refresh assignments list
      fetchAssignments();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'assign'} fee`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const response = await getClassFeeAssignment();
      if (response?.data?.assignments) {
        setAssignments(response.data.assignments);
      } else if (response?.assignments) {
        setAssignments(response.assignments);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      toast.error("Failed to fetch assignments");
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleViewAssignment = async (assignment) => {
    setViewAssignment(assignment);
    setIsViewModalOpen(true);
    setLoadingViewData(true);
    
    try {
      const response = await viewClassFeeAssignmentStudents(
        assignment.class_section.id,
        assignment.fee_structure.id
      );
      
      if (response?.data) {
        setViewStudentsData(response.data);
      } else {
        setViewStudentsData(response);
      }
    } catch (err) {
      console.error("Failed to fetch students data", err);
      toast.error("Failed to fetch students data");
      setViewStudentsData(null);
    } finally {
      setLoadingViewData(false);
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete the fee assignment for ${assignment.class_section.class_name} - ${assignment.class_section.section_name}?`)) {
      return;
    }

    try {
      await deleteClassFeeAssignment(assignment.class_section.id, assignment.fee_structure.id);
      toast.success("Fee assignment deleted successfully");
      fetchAssignments();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to delete assignment";
      toast.error(errorMessage);
    }
  };

  const handleEditAssignment = (assignment) => {
    setIsEditMode(true);
    setEditingAssignment(assignment);
    
    // Populate form with assignment data
    setForm({
      class_section_id: assignment.class_section.id,
      fee_structure_id: assignment.fee_structure.id,
      discount_amount: assignment.statistics.discount_amount_per_student || "",
      discount_reason: "",
      installments: assignment.installment_structure.map(inst => ({
        amount: inst.amount,
        due_date: inst.due_date
      }))
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingAssignment(null);
    setForm({
      class_section_id: "",
      fee_structure_id: "",
      discount_amount: "",
      discount_reason: "",
      installments: [],
    });
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
              <PageHeader pageheading="Fee Management" Subheading="Fee Assignment" />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Assign Fee Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditMode ? 'Edit Fee Assignment' : 'Assign Fee to Class'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isEditMode 
                      ? `Editing assignment for ${editingAssignment?.class_section.class_name} - ${editingAssignment?.class_section.section_name}`
                      : 'Assign fee structures with installment plans to class sections'
                    }
                  </p>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class/Section <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="class_section_id"
                        value={form.class_section_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        <option value="">Select Class/Section</option>
                        {classSections.map((cs) => (
                          <option key={cs.id || cs._id} value={cs.id || cs._id}>
                            {cs.class_name} - {cs.section_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fee Structure <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="fee_structure_id"
                        value={form.fee_structure_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        <option value="">Select Fee Structure</option>
                        {feeStructures.map((fs) => (
                          <option key={fs.id || fs._id} value={fs.id || fs._id}>
                            {fs.name} - ₹{fs.total_amount || fs.amount || 0}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Discount Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Amount
                      </label>
                      <input
                        type="number"
                        name="discount_amount"
                        value={form.discount_amount}
                        onChange={handleChange}
                        placeholder="500"
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Reason
                      </label>
                      <input
                        type="text"
                        name="discount_reason"
                        value={form.discount_reason}
                        onChange={handleChange}
                        placeholder="Early Bird Discount"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Installments */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Installments</h3>
                    <button
                      type="button"
                      onClick={handleAddInstallment}
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Installment
                    </button>
                  </div>

                  {form.installments.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 mb-3">No installments added yet</p>
                      <button
                        type="button"
                        onClick={handleAddInstallment}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Installment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.installments.map((installment, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Installment #{index + 1} Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  value={installment.amount}
                                  onChange={(e) => handleInstallmentChange(index, "amount", e.target.value)}
                                  placeholder="5000"
                                  required
                                  min="0"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  value={installment.due_date}
                                  onChange={(e) => handleInstallmentChange(index, "due_date", e.target.value)}
                                  required
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveInstallment(index)}
                              className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <strong>Total Installments:</strong> {form.installments.length} | 
                        <strong className="ml-2">Total Amount:</strong> ₹{form.installments.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEditMode ? 'Updating...' : 'Assigning...'}
                      </span>
                    ) : (
                      isEditMode ? 'Update Fee Assignment' : 'Assign Fee'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Assigned Fees Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Assigned Fees</h2>
                <p className="text-sm text-gray-600 mt-1">
                  View all fee assignments by class
                </p>
              </div>

              {loadingAssignments ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                  <p className="text-gray-500">
                    Assign fees to classes using the form above
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Class/Section
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fee Structure
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Academic Year
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Students
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Installments
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assignments.map((assignment, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {assignment.class_section.class_name} - {assignment.class_section.section_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {assignment.fee_structure.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {assignment.fee_structure.academic_year}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            ₹{formatCurrency(assignment.fee_structure.total_amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {assignment.statistics.total_students}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {assignment.statistics.installments_per_student} per student
                          </td>
                          <td className="px-6 py-4 text-sm text-purple-600 font-semibold">
                            ₹{formatCurrency(assignment.statistics.discount_amount_per_student)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewAssignment(assignment)}
                                className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditAssignment(assignment)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Assignment"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAssignment(assignment)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Assignment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* API Response Modal */}
        <Modal
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setApiResponse(null);
          }}
          size="lg"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Fee Assignment Successful</h2>
                <p className="text-sm text-gray-600 mt-1">{apiResponse?.message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setApiResponse(null);
                }}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* View Assignment Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewAssignment(null);
          }}
          size="xl"
        >
          {viewAssignment && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Fee Assignment - Student Details
                </h2>
                <p className="text-gray-600">
                  {viewAssignment.class_section.class_name} - {viewAssignment.class_section.section_name}
                </p>
              </div>

              {loadingViewData ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : viewStudentsData ? (
                <div className="space-y-6">
                  {/* Summary */}
                  {viewStudentsData.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-blue-600 text-sm mb-1">Total Students</p>
                        <p className="text-2xl font-bold text-blue-900">{viewStudentsData.summary.total_students}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <p className="text-indigo-600 text-sm mb-1">Original Amount</p>
                        <p className="text-2xl font-bold text-indigo-900">₹{formatCurrency(viewStudentsData.summary.total_original_amount)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-purple-600 text-sm mb-1">Total Discount</p>
                        <p className="text-2xl font-bold text-purple-900">₹{formatCurrency(viewStudentsData.summary.total_discount)}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-cyan-600 text-sm mb-1">Final Amount</p>
                        <p className="text-2xl font-bold text-cyan-900">₹{formatCurrency(viewStudentsData.summary.total_final_amount)}</p>
                      </div>
                    </div>
                  )}

                  {/* Students Table */}
                  {viewStudentsData.students && viewStudentsData.students.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Students List</h3>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Roll No.</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Original Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Discount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Final Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Discount Reason</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {viewStudentsData.students.map((student, idx) => (
                              <tr key={student.student_fee_id || idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-900 font-medium">{student.roll_number || '-'}</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{student.student_name}</td>
                                <td className="px-4 py-3 text-gray-600">{student.email}</td>
                                <td className="px-4 py-3 text-gray-600">{student.phone}</td>
                                <td className="px-4 py-3 text-gray-900">₹{formatCurrency(student.original_amount)}</td>
                                <td className="px-4 py-3 text-purple-600 font-medium">₹{formatCurrency(student.discount_amount)}</td>
                                <td className="px-4 py-3 text-blue-600 font-semibold">₹{formatCurrency(student.final_amount)}</td>
                                <td className="px-4 py-3 text-gray-600 text-xs">{student.discount_reason || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No students found
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Failed to load student data
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewAssignment(null);
                    setViewStudentsData(null);
                  }}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Footer />
      </div>
    </div>
  );
};

const FeeAssignmentPage = memo(FeeAssignment);

export default FeeAssignmentPage;