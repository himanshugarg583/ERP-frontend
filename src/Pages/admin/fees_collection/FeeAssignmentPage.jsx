import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import { Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import {
  assignFeeWithInstallments,
  getAllFeeStructures,
  getAllClassesDropdown,
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
    academic_year: "",
    discount_amount: "",
    discount_reason: "",
    due_date: "",
    installments: [],
  });

  useEffect(() => {
    fetchFeeStructures();
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
      academic_year: form.academic_year,
      discount_amount: Number(form.discount_amount) || 0,
      discount_reason: form.discount_reason || "",
      due_date: form.due_date,
      installments: form.installments,
    };

    try {
      const response = await assignFeeWithInstallments(payload);
      const successMessage = response?.message || "Fee assigned successfully with installments!";
      setSuccess(successMessage);
      toast.success(successMessage);
      setForm({
        class_section_id: "",
        fee_structure_id: "",
        academic_year: "",
        discount_amount: "",
        discount_reason: "",
        due_date: "",
        installments: [],
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to assign fee";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
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
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Assign Fee to Class</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Assign fee structures with installment plans to class sections
                </p>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="academic_year"
                        value={form.academic_year}
                        onChange={handleChange}
                        placeholder="e.g., 2024-2025"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="due_date"
                        value={form.due_date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                        placeholder="e.g., Class scholarship"
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
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
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
                              className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Assigning...
                      </span>
                    ) : (
                      "Assign Fee"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const FeeAssignmentPage = memo(FeeAssignment);

export default FeeAssignmentPage;