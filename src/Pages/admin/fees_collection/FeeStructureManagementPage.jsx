import React, { useEffect, useState, memo } from "react";
import { 
  getAllFeeStructures, 
  createFeeStructure, 
  updateFeeStructure, 
  deleteFeeStructure,
  getFeeStructureById,
  getAllFeeHeads,
  getAllClassesDropdown
} from "../../../helper/requests-method/apiMethods";
import Modal from "../../../components/comman_components/Modal";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, Eye, X } from "lucide-react";
import { toast } from "react-toastify";

const FeeStructureManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFeeStructure, setCurrentFeeStructure] = useState(null);
  const [viewFeeStructure, setViewFeeStructure] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    class_section_id: "",
    academic_start_year: "",
    academic_end_year: "",
    due_date: "",
    late_fee_amount: "",
    late_fee_type: "flat",
    fee_details: []
  });

  const fetchFeeStructures = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllFeeStructures();
      let structures = [];
      
      if (response?.data?.feeStructures && Array.isArray(response.data.feeStructures)) {
        structures = response.data.feeStructures;
      } else if (Array.isArray(response?.feeStructures)) {
        structures = response.feeStructures;
      } else if (Array.isArray(response?.data)) {
        structures = response.data;
      } else if (Array.isArray(response)) {
        structures = response;
      }
      
      setFeeStructures(structures);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch fee structures";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const fetchFeeHeads = async () => {
    try {
      const response = await getAllFeeHeads();
      let heads = [];
      
      if (response?.data?.feeHeads && Array.isArray(response.data.feeHeads)) {
        heads = response.data.feeHeads;
      } else if (Array.isArray(response?.feeHeads)) {
        heads = response.feeHeads;
      } else if (Array.isArray(response)) {
        heads = response;
      }
      
      setFeeHeads(heads);
    } catch (err) {
      const errorMessage = "Failed to fetch fee heads";
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

  useEffect(() => {
    fetchFeeStructures();
    fetchFeeHeads();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAddFeeDetail = () => {
    setForm({
      ...form,
      fee_details: [
        ...form.fee_details,
        { fee_head_id: "", amount: "", is_mandatory: true, sequence_order: form.fee_details.length + 1 }
      ]
    });
  };

  const handleRemoveFeeDetail = (index) => {
    const newFeeDetails = form.fee_details.filter((_, i) => i !== index);
    setForm({ ...form, fee_details: newFeeDetails });
  };

  const handleFeeDetailChange = (index, field, value) => {
    const newFeeDetails = [...form.fee_details];
    newFeeDetails[index][field] = field === 'is_mandatory' ? value : 
                                   (field === 'amount' || field === 'fee_head_id' || field === 'sequence_order') ? 
                                   Number(value) : value;
    setForm({ ...form, fee_details: newFeeDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate fee details
    if (form.fee_details.length === 0) {
      const errorMessage = "Please add at least one fee detail";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      class_section_id: Number(form.class_section_id),
      academic_start_year: Number(form.academic_start_year),
      academic_end_year: Number(form.academic_end_year),
      due_date: form.due_date,
      late_fee_amount: Number(form.late_fee_amount),
      late_fee_type: form.late_fee_type,
      fee_details: form.fee_details.map(detail => ({
        fee_head_id: Number(detail.fee_head_id),
        amount: Number(detail.amount),
        is_mandatory: detail.is_mandatory,
        sequence_order: Number(detail.sequence_order)
      }))
    };

    try {
      if (editMode && currentFeeStructure) {
        const structureId = currentFeeStructure.id || currentFeeStructure._id;
        const response = await updateFeeStructure(structureId, payload);
        const successMessage = response?.message || "Fee structure updated successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
      } else {
        const response = await createFeeStructure(payload);
        const successMessage = response?.message || "Fee structure created successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
      }
      setForm({
        name: "",
        class_section_id: "",
        academic_start_year: "",
        academic_end_year: "",
        due_date: "",
        late_fee_amount: "",
        late_fee_type: "flat",
        fee_details: []
      });
      setIsModalOpen(false);
      setEditMode(false);
      setCurrentFeeStructure(null);
      fetchFeeStructures();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} fee structure`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleView = async (feeStructure) => {
    setLoading(true);
    setError("");
    try {
      const feeStructureId = feeStructure.id || feeStructure._id;
      const response = await getFeeStructureById(feeStructureId);
      
      // Handle different response structures
      let structureData = null;
      let usageStats = null;
      
      if (response?.data?.feeStructure) {
        structureData = response.data.feeStructure;
        usageStats = response.data.usage_statistics;
      } else if (response?.feeStructure) {
        structureData = response.feeStructure;
        usageStats = response.usage_statistics;
      } else if (response?.data) {
        structureData = response.data;
      } else {
        structureData = response;
      }
      
      // Attach usage statistics to the structure data
      if (usageStats) {
        structureData.usage_statistics = usageStats;
      }
      
      setViewFeeStructure(structureData);
      setIsViewModalOpen(true);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch fee structure details";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleEdit = (feeStructure) => {
    setCurrentFeeStructure(feeStructure);
    
    // Handle fee details - check both feeDetails and fee_details
    const feeDetails = feeStructure.feeDetails || feeStructure.fee_details || [];
    const mappedFeeDetails = feeDetails.map(detail => ({
      fee_head_id: detail.fee_head_id || "",
      amount: detail.amount || "",
      is_mandatory: detail.is_mandatory !== undefined ? detail.is_mandatory : true,
      sequence_order: detail.sequence_order || 1
    }));
    
    setForm({
      name: feeStructure.name || "",
      class_section_id: feeStructure.class_section_id || "",
      academic_start_year: feeStructure.academic_start_year || "",
      academic_end_year: feeStructure.academic_end_year || "",
      due_date: feeStructure.due_date ? feeStructure.due_date.split('T')[0] : "",
      late_fee_amount: feeStructure.late_fee_amount || "",
      late_fee_type: feeStructure.late_fee_type || "flat",
      fee_details: mappedFeeDetails
    });
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee structure?")) return;
    
    setError("");
    setSuccess("");
    try {
      const response = await deleteFeeStructure(id);
      const successMessage = response?.message || "Fee structure deleted successfully!";
      setSuccess(successMessage);
      toast.success(successMessage);
      fetchFeeStructures();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to delete fee structure";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const openAddModal = () => {
    setForm({
      name: "",
      class_section_id: "",
      academic_start_year: "",
      academic_end_year: "",
      due_date: "",
      late_fee_amount: "",
      late_fee_type: "flat",
      fee_details: []
    });
    setEditMode(false);
    setCurrentFeeStructure(null);
    setIsModalOpen(true);
  };

  const filteredFeeStructures = feeStructures.filter(fs => 
    (fs.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <PageHeader pageheading="Fee Management" Subheading="Fee Structure Management" />
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fee structures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Fee Structure
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                  </div>
                ) : filteredFeeStructures.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fee structures found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm ? "Try adjusting your search" : "Get started by creating your first fee structure"}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Fee Structure
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Structure Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Academic Year
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Late Fee
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFeeStructures.map((fs, idx) => (
                        <tr key={fs.id || fs._id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {fs.name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {fs.classSection ? 
                              `${fs.classSection.class_name} - ${fs.classSection.section_name}` : 
                              "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {fs.academic_start_year && fs.academic_end_year ? 
                              `${fs.academic_start_year} - ${fs.academic_end_year}` : 
                              "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {fs.due_date ? new Date(fs.due_date).toLocaleDateString('en-IN') : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            ₹{fs.total_amount || "0.00"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ₹{fs.late_fee_amount || "0.00"} ({fs.late_fee_type || "flat"})
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(fs)}
                                className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(fs)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(fs.id || fs._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {filteredFeeStructures.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredFeeStructures.length}</span> of{" "}
                    <span className="font-medium">{feeStructures.length}</span> fee structures
                  </p>
                </div>
              )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setCurrentFeeStructure(null);
              }}
              title={editMode ? "Edit Fee Structure" : "Add New Fee Structure"}
              subtitle={editMode ? "Update the fee structure information" : "Create a new fee structure"}
              size="xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Structure Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g., Annual Fee 2025"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

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
                  </div>
                </div>

                {/* Academic Year */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Year</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="academic_start_year"
                        value={form.academic_start_year}
                        onChange={handleChange}
                        placeholder="2025"
                        required
                        min="2000"
                        max="2100"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="academic_end_year"
                        value={form.academic_end_year}
                        onChange={handleChange}
                        placeholder="2026"
                        required
                        min="2000"
                        max="2100"
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

                {/* Late Fee Configuration */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Late Fee Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Late Fee Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="late_fee_amount"
                        value={form.late_fee_amount}
                        onChange={handleChange}
                        placeholder="100"
                        required
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Late Fee Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="late_fee_type"
                        value={form.late_fee_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Fee Details</h3>
                    <button
                      type="button"
                      onClick={handleAddFeeDetail}
                      className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Fee
                    </button>
                  </div>

                  {form.fee_details.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 mb-3">No fee details added yet</p>
                      <button
                        type="button"
                        onClick={handleAddFeeDetail}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Fee Detail
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.fee_details.map((detail, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Fee Head <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={detail.fee_head_id}
                                  onChange={(e) => handleFeeDetailChange(index, 'fee_head_id', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                  <option value="">Select</option>
                                  {feeHeads.map((fh) => (
                                    <option key={fh.id || fh._id} value={fh.id || fh._id}>
                                      {fh.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  value={detail.amount}
                                  onChange={(e) => handleFeeDetailChange(index, 'amount', e.target.value)}
                                  placeholder="5000"
                                  required
                                  min="0"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Order <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  value={detail.sequence_order}
                                  onChange={(e) => handleFeeDetailChange(index, 'sequence_order', e.target.value)}
                                  placeholder="1"
                                  required
                                  min="1"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                              </div>

                              <div className="flex items-end">
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={detail.is_mandatory}
                                    onChange={(e) => handleFeeDetailChange(index, 'is_mandatory', e.target.checked)}
                                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                                  />
                                  <span className="text-gray-700">Mandatory</span>
                                </label>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFeeDetail(index)}
                              className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditMode(false);
                      setCurrentFeeStructure(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editMode ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      editMode ? "Update Fee Structure" : "Create Fee Structure"
                    )}
                  </button>
                </div>
              </form>
            </Modal>

            {/* View Modal */}
            <Modal
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false);
                setViewFeeStructure(null);
              }}
              title="Fee Structure Details"
              subtitle="View complete information about this fee structure"
              size="lg"
            >
              {viewFeeStructure && (
                <div className="space-y-6">
                  {/* Structure Name and Class Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Structure Name</label>
                      <p className="text-base font-semibold text-gray-900">{viewFeeStructure.name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Class & Section</label>
                      <p className="text-base font-semibold text-gray-900">
                        {viewFeeStructure.classSection ? 
                          `${viewFeeStructure.classSection.class_name} - ${viewFeeStructure.classSection.section_name}` : 
                          '-'}
                      </p>
                    </div>
                  </div>

                  {/* Academic Year, Due Date, Total Amount */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Academic Year</label>
                      <p className="text-sm text-gray-700">
                        {viewFeeStructure.academic_start_year && viewFeeStructure.academic_end_year ? 
                          `${viewFeeStructure.academic_start_year} - ${viewFeeStructure.academic_end_year}` : 
                          '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Due Date</label>
                      <p className="text-sm text-gray-700">
                        {viewFeeStructure.due_date ? new Date(viewFeeStructure.due_date).toLocaleDateString('en-IN') : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
                      <p className="text-sm font-bold text-gray-900">
                        ₹{viewFeeStructure.total_amount || '0.00'}
                      </p>
                    </div>
                  </div>

                  {/* Late Fee Information */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Late Fee Amount</label>
                      <p className="text-sm text-gray-700">
                        ₹{viewFeeStructure.late_fee_amount || '0.00'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Late Fee Type</label>
                      <p className="text-sm text-gray-700 capitalize">
                        {viewFeeStructure.late_fee_type || 'flat'}
                      </p>
                    </div>
                  </div>

                  {/* Fee Details */}
                  {viewFeeStructure.feeDetails && viewFeeStructure.feeDetails.length > 0 && (
                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Fee Details</label>
                      <div className="space-y-2">
                        {viewFeeStructure.feeDetails.map((detail, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                              <p className="font-medium text-gray-900">
                                {detail.feeHead?.name || `Fee Head #${detail.fee_head_id}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Order: {detail.sequence_order} {detail.is_mandatory && ' • Mandatory'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg text-gray-900">₹{detail.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-indigo-900">Total Fee Structure Amount</p>
                          <p className="font-bold text-xl text-indigo-900">₹{viewFeeStructure.total_amount || '0.00'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                      <p className="text-xs text-gray-600">
                        {viewFeeStructure.created_at ? new Date(viewFeeStructure.created_at).toLocaleString('en-IN') : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                      <p className="text-xs text-gray-600">
                        {viewFeeStructure.updated_at ? new Date(viewFeeStructure.updated_at).toLocaleString('en-IN') : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleEdit(viewFeeStructure);
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Edit Structure
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewFeeStructure(null);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const FeeStructureManagementPage = memo(FeeStructureManagement);

export default FeeStructureManagementPage;
