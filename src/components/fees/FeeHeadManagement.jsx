import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { createFeeHead, getAllFeeHeads, updateFeeHead, deleteFeeHead } from '../../helper/requests-method/apiMethods';

const FeeHeadManagement = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingFeeHead, setEditingFeeHead] = useState(null);
  const [viewingFeeHead, setViewingFeeHead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch all fee heads on component mount
  useEffect(() => {
    fetchFeeHeads();
  }, []);

  const fetchFeeHeads = async () => {
    setLoading(true);
    try {
      const response = await getAllFeeHeads();
      if (response.success) {
        // API returns data.feeHeads not just data
        const feeHeadsData = response.data?.feeHeads || response.data || [];
        setFeeHeads(Array.isArray(feeHeadsData) ? feeHeadsData : []);
      } else {
        toast.error(response.message || 'Failed to fetch fee heads');
        setFeeHeads([]);
      }
    } catch (error) {
      console.error('Error fetching fee heads:', error);
      toast.error('Error fetching fee heads');
      setFeeHeads([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Fee head name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editingFeeHead) {
        response = await updateFeeHead(editingFeeHead.id, formData);
      } else {
        response = await createFeeHead(formData);
      }

      if (response.success) {
        toast.success(response.message || `Fee head ${editingFeeHead ? 'updated' : 'created'} successfully`);
        handleCloseModal();
        fetchFeeHeads();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving fee head:', error);
      toast.error(error.response?.data?.message || 'Error saving fee head');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feeHead) => {
    setEditingFeeHead(feeHead);
    setFormData({
      name: feeHead.name,
      description: feeHead.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee head?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteFeeHead(id);
      if (response.success) {
        toast.success('Fee head deleted successfully');
        fetchFeeHeads();
      } else {
        toast.error(response.message || 'Failed to delete fee head');
      }
    } catch (error) {
      console.error('Error deleting fee head:', error);
      toast.error('Error deleting fee head');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeeHead(null);
    setFormData({
      name: '',
      description: ''
    });
    setFormErrors({});
  };

  const filteredFeeHeads = Array.isArray(feeHeads) ? feeHeads.filter(feeHead =>
    feeHead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feeHead.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fee Head Management</h2>
          <p className="text-slate-600 mt-1">Manage all fee types and categories</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg hover:bg-violet-700 transition-colors shadow-md cursor-pointer"
        >
          <Plus size={20} />
          Add Fee Head
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search fee heads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Fee Heads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : filteredFeeHeads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No fee heads found</p>
            <p className="text-slate-400 text-sm mt-2">Create a new fee head to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fee Head Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Mandatory</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeeHeads.map((feeHead, index) => (
                  <tr key={feeHead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{feeHead.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{feeHead.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        feeHead.is_mandatory 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {feeHead.is_mandatory ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        feeHead.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {feeHead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setViewingFeeHead(feeHead);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(feeHead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(feeHead.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingFeeHead ? 'Edit Fee Head' : 'Add New Fee Head'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fee Head Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., School Fee, Transport Fee"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    formErrors.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description for this fee head"
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    formErrors.description ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-slate-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingFeeHead ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingFeeHead && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <h3 className="text-xl font-bold text-slate-800">Fee Head Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Fee Head Name</label>
                  <p className="text-lg font-medium text-slate-900 mt-1">{viewingFeeHead.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      viewingFeeHead.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {viewingFeeHead.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Mandatory</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      viewingFeeHead.is_mandatory 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {viewingFeeHead.is_mandatory ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Created At</label>
                  <p className="text-base text-slate-700 mt-1">{new Date(viewingFeeHead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <p className="text-base text-slate-700 mt-2 p-4 bg-slate-50 rounded-lg">{viewingFeeHead.description}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeHeadManagement;
