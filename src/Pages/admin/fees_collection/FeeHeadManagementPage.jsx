import React, { useEffect, useState, memo } from "react";
import { getAllFeeHeads, createFeeHead, updateFeeHead, deleteFeeHead } from "../../../helper/requests-method/apiMethods";
import Modal from "../../../components/comman_components/Modal";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";

const FeeHeadManagement = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFeeHead, setCurrentFeeHead] = useState(null);
  const [viewFeeHead, setViewFeeHead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ 
    name: "", 
    description: "" 
  });

  const fetchFeeHeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllFeeHeads();
      let heads = [];
      
      // Handle different response structures
      if (response?.data?.feeHeads && Array.isArray(response.data.feeHeads)) {
        heads = response.data.feeHeads;
      } else if (Array.isArray(response?.feeHeads)) {
        heads = response.feeHeads;
      } else if (Array.isArray(response?.data)) {
        heads = response.data;
      } else if (Array.isArray(response)) {
        heads = response;
      }
      
      setFeeHeads(heads);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch fee heads";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeHeads();
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editMode && currentFeeHead) {
        // Use id instead of _id for update
        const feeHeadId = currentFeeHead.id || currentFeeHead._id;
        const response = await updateFeeHead(feeHeadId, form);
        const successMessage = response?.message || "Fee head updated successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
      } else {
        const response = await createFeeHead(form);
        const successMessage = response?.message || "Fee head created successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
      }
      setForm({ name: "", description: "" });
      setIsModalOpen(false);
      setEditMode(false);
      setCurrentFeeHead(null);
      fetchFeeHeads();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} fee head`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleView = (feeHead) => {
    setViewFeeHead(feeHead);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feeHead) => {
    setCurrentFeeHead(feeHead);
    setForm({
      name: feeHead.name || "",
      description: feeHead.description || ""
    });
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee head?")) return;
    
    setError("");
    setSuccess("");
    try {
      const response = await deleteFeeHead(id);
      const successMessage = response?.message || "Fee head deleted successfully!";
      setSuccess(successMessage);
      toast.success(successMessage);
      fetchFeeHeads();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to delete fee head";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const openAddModal = () => {
    setForm({ name: "", description: "" });
    setEditMode(false);
    setCurrentFeeHead(null);
    setIsModalOpen(true);
  };

  const filteredFeeHeads = feeHeads.filter(fh => 
    (fh.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fh.description || "").toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Page Header */}
            <div className="mb-6">
              <PageHeader pageheading="Fee Management" Subheading="Fee Head Management" />
            </div>

        {/* Alert Messages */}
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

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search fee heads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm font-medium cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Fee Head
            </button>
          </div>
        </div>

        {/* Fee Heads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : filteredFeeHeads.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fee heads found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? "Try adjusting your search" : "Get started by creating your first fee head"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    Add Fee Head
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
                      Fee Head Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mandatory
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFeeHeads.map((fh, idx) => (
                    <tr key={fh.id || fh._id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {fh.name || fh.feeHeadName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {fh.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          fh.is_mandatory ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {fh.is_mandatory ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          fh.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {fh.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(fh)}
                            className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(fh)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fh.id || fh._id)}
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

          {/* Table Footer */}
          {filteredFeeHeads.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredFeeHeads.length}</span> of{" "}
                <span className="font-medium">{feeHeads.length}</span> fee heads
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
                setCurrentFeeHead(null);
                setForm({ name: "", description: "" });
              }}
              title={editMode ? "Edit Fee Head" : "Add New Fee Head"}
              subtitle={editMode ? "Update the fee head information" : "Create a new fee head for your institution"}
              size="md"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Head Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Tuition Fee, Library Fee"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the fee head"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditMode(false);
                      setCurrentFeeHead(null);
                      setForm({ name: "", description: "" });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editMode ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      editMode ? "Update Fee Head" : "Create Fee Head"
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
                setViewFeeHead(null);
              }}
              title="Fee Head Details"
              subtitle="View complete information about this fee head"
              size="md"
            >
              {viewFeeHead && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Fee Head ID
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        #{viewFeeHead.id || viewFeeHead._id}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        viewFeeHead.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {viewFeeHead.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Fee Head Name
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {viewFeeHead.name || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <p className="text-base text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {viewFeeHead.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Mandatory
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      viewFeeHead.is_mandatory ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {viewFeeHead.is_mandatory ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {viewFeeHead.createdAt && (
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Created At
                        </label>
                        <p className="text-sm text-gray-700">
                          {new Date(viewFeeHead.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>

                      {viewFeeHead.updatedAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Last Updated
                          </label>
                          <p className="text-sm text-gray-700">
                            {new Date(viewFeeHead.updatedAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleEdit(viewFeeHead);
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      Edit Fee Head
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewFeeHead(null);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
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

const FeeHeadManagementPage = memo(FeeHeadManagement);

export default FeeHeadManagementPage;