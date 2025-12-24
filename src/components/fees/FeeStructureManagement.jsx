import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  createFeeStructure, 
  getAllFeeStructures, 
  updateFeeStructure, 
  deleteFeeStructure,
  getAllFeeHeads,
  getAllClassSections
} from '../../helper/requests-method/apiMethods';

const FeeStructureManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [viewingStructure, setViewingStructure] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    class_section_id: '',
    academic_start_year: '',
    academic_end_year: '',
    due_date: '',
    late_fee_amount: '',
    late_fee_type: 'fixed',
    installment_allowed: false,
    max_installments: 1,
    status: 'active',
    fee_details: []
  });
  const [feeDetailRow, setFeeDetailRow] = useState({
    fee_head_id: '',
    amount: '',
    is_mandatory: true,
    sequence_order: 1
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchFeeStructures();
    fetchFeeHeads();
    fetchClasses();
  }, []);

  const fetchFeeStructures = async () => {
    setLoading(true);
    try {
      const response = await getAllFeeStructures();
      if (response.success) {
        const structuresData = response.data?.feeStructures || response.data || [];
        setFeeStructures(Array.isArray(structuresData) ? structuresData : []);
      } else {
        toast.error(response.message || 'Failed to fetch fee structures');
        setFeeStructures([]);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      toast.error('Error fetching fee structures');
      setFeeStructures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeHeads = async () => {
    try {
      const response = await getAllFeeHeads();
      if (response.success) {
        const feeHeadsData = response.data?.feeHeads || response.data || [];
        setFeeHeads(Array.isArray(feeHeadsData) ? feeHeadsData : []);
      }
    } catch (error) {
      console.error('Error fetching fee heads:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClassSections();
      if (response.success) {
        setClasses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Structure name is required';
    if (!formData.class_section_id) errors.class_section_id = 'Class is required';
    if (!formData.academic_start_year) errors.academic_start_year = 'Start year is required';
    if (!formData.academic_end_year) errors.academic_end_year = 'End year is required';
    if (!formData.due_date) errors.due_date = 'Due date is required';
    if (formData.fee_details.length === 0) errors.fee_details = 'Add at least one fee detail';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeeDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeeDetailRow(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addFeeDetail = () => {
    if (!feeDetailRow.fee_head_id || !feeDetailRow.amount) {
      toast.error('Please select fee head and enter amount');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      fee_details: [...prev.fee_details, { ...feeDetailRow }]
    }));
    
    setFeeDetailRow({
      fee_head_id: '',
      amount: '',
      is_mandatory: true,
      sequence_order: formData.fee_details.length + 2
    });
    
    if (formErrors.fee_details) {
      setFormErrors(prev => ({ ...prev, fee_details: '' }));
    }
  };

  const removeFeeDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      fee_details: prev.fee_details.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        late_fee_amount: parseFloat(formData.late_fee_amount) || 0,
        max_installments: parseInt(formData.max_installments) || 1,
        fee_details: formData.fee_details.map(detail => ({
          ...detail,
          fee_head_id: parseInt(detail.fee_head_id),
          amount: parseFloat(detail.amount),
          sequence_order: parseInt(detail.sequence_order)
        }))
      };

      let response;
      if (editingStructure) {
        response = await updateFeeStructure(editingStructure.id, submitData);
      } else {
        response = await createFeeStructure(submitData);
      }

      if (response.success) {
        toast.success(response.message || `Fee structure ${editingStructure ? 'updated' : 'created'} successfully`);
        handleCloseModal();
        fetchFeeStructures();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving fee structure:', error);
      toast.error(error.response?.data?.message || 'Error saving fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setFormData({
      name: structure.name,
      class_section_id: structure.class_section_id,
      academic_start_year: structure.academic_start_year,
      academic_end_year: structure.academic_end_year,
      due_date: structure.due_date,
      late_fee_amount: structure.late_fee_amount,
      late_fee_type: structure.late_fee_type,
      installment_allowed: structure.installment_allowed,
      max_installments: structure.max_installments,
      status: structure.status,
      fee_details: structure.fee_details || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteFeeStructure(id);
      if (response.success) {
        toast.success('Fee structure deleted successfully');
        fetchFeeStructures();
      } else {
        toast.error(response.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      toast.error('Error deleting fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStructure(null);
    setFormData({
      name: '',
      class_section_id: '',
      academic_start_year: '',
      academic_end_year: '',
      due_date: '',
      late_fee_amount: '',
      late_fee_type: 'fixed',
      installment_allowed: false,
      max_installments: 1,
      status: 'active',
      fee_details: []
    });
    setFeeDetailRow({
      fee_head_id: '',
      amount: '',
      is_mandatory: true,
      sequence_order: 1
    });
    setFormErrors({});
  };

  const filteredStructures = Array.isArray(feeStructures) ? feeStructures.filter(structure =>
    structure.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getFeeHeadName = (id) => {
    const feeHead = feeHeads.find(fh => fh.id === parseInt(id));
    return feeHead?.name || 'Unknown';
  };

  const getClassName = (id) => {
    const classSection = classes.find(cls => cls.id === parseInt(id));
    return classSection ? `${classSection.class_name} - ${classSection.section_name}` : 'Unknown';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fee Structure Management</h2>
          <p className="text-slate-600 mt-1">Create and manage fee structures for different classes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg hover:bg-violet-700 transition-colors shadow-md cursor-pointer"
        >
          <Plus size={20} />
          Add Fee Structure
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search fee structures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Fee Structures Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : filteredStructures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No fee structures found</p>
            <p className="text-slate-400 text-sm mt-2">Create a new fee structure to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Structure Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Academic Year</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStructures.map((structure, index) => (
                  <tr key={structure.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{structure.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {structure.academic_start_year} - {structure.academic_end_year}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{structure.due_date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        structure.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {structure.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setViewingStructure(structure);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(structure)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(structure.id)}
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingStructure ? 'Edit Fee Structure' : 'Add New Fee Structure'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Structure Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Fee 2025"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class_section_id"
                    value={formData.class_section_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.class_section_id ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} - {cls.section_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.class_section_id && <p className="text-red-500 text-sm mt-1">{formErrors.class_section_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Academic Start Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="academic_start_year"
                    value={formData.academic_start_year}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.academic_start_year ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.academic_start_year && <p className="text-red-500 text-sm mt-1">{formErrors.academic_start_year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Academic End Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="academic_end_year"
                    value={formData.academic_end_year}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.academic_end_year ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.academic_end_year && <p className="text-red-500 text-sm mt-1">{formErrors.academic_end_year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.due_date ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.due_date && <p className="text-red-500 text-sm mt-1">{formErrors.due_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Late Fee Amount
                  </label>
                  <input
                    type="number"
                    name="late_fee_amount"
                    value={formData.late_fee_amount}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Late Fee Type
                  </label>
                  <select
                    name="late_fee_type"
                    value={formData.late_fee_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Installments
                  </label>
                  <input
                    type="number"
                    name="max_installments"
                    value={formData.max_installments}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="installment_allowed"
                    checked={formData.installment_allowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Allow Installments</span>
                </label>
              </div>

              {/* Fee Details Section */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Fee Details</h4>
                
                {/* Add Fee Detail Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <select
                    name="fee_head_id"
                    value={feeDetailRow.fee_head_id}
                    onChange={handleFeeDetailChange}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Select Fee Head</option>
                    {feeHeads.map(fh => (
                      <option key={fh.id} value={fh.id}>{fh.name}</option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    name="amount"
                    value={feeDetailRow.amount}
                    onChange={handleFeeDetailChange}
                    placeholder="Amount"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  
                  <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_mandatory"
                      checked={feeDetailRow.is_mandatory}
                      onChange={handleFeeDetailChange}
                      className="w-4 h-4 text-violet-600"
                    />
                    <span className="text-sm">Mandatory</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={addFeeDetail}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formErrors.fee_details && <p className="text-red-500 text-sm mb-2">{formErrors.fee_details}</p>}

                {/* Fee Details List */}
                {formData.fee_details.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Fee Head</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Amount</th>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-slate-700">Mandatory</th>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-slate-700">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {formData.fee_details.map((detail, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{getFeeHeadName(detail.fee_head_id)}</td>
                            <td className="px-4 py-2 text-sm">₹{detail.amount}</td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                detail.is_mandatory ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {detail.is_mandatory ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeFeeDetail(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
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
                  {loading ? 'Saving...' : editingStructure ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingStructure && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Fee Structure Details</h3>
                <p className="text-sm text-slate-600 mt-1">{viewingStructure.name}</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Structure Name</label>
                    <p className="text-base font-medium text-slate-900 mt-1">{viewingStructure.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Class</label>
                    <p className="text-base font-medium text-slate-900 mt-1">{getClassName(viewingStructure.class_section_id)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        viewingStructure.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {viewingStructure.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Academic Start Year</label>
                    <p className="text-base text-slate-700 mt-1">{viewingStructure.academic_start_year}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Academic End Year</label>
                    <p className="text-base text-slate-700 mt-1">{viewingStructure.academic_end_year}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Due Date</label>
                    <p className="text-base text-slate-700 mt-1">{viewingStructure.due_date}</p>
                  </div>
                </div>
              </div>

              {/* Fee Settings */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Fee Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Late Fee Amount</label>
                    <p className="text-base text-slate-700 mt-1">₹{viewingStructure.late_fee_amount || 0}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Late Fee Type</label>
                    <p className="text-base text-slate-700 mt-1 capitalize">{viewingStructure.late_fee_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Installment Allowed</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        viewingStructure.installment_allowed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {viewingStructure.installment_allowed ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Max Installments</label>
                    <p className="text-base text-slate-700 mt-1">{viewingStructure.max_installments}</p>
                  </div>
                </div>
              </div>

              {/* Fee Details */}
              {viewingStructure.fee_details && viewingStructure.fee_details.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Fee Breakdown</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">S.No</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fee Head</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Amount</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Mandatory</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {viewingStructure.fee_details.map((detail, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{getFeeHeadName(detail.fee_head_id)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-right font-semibold">₹{detail.amount}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                detail.is_mandatory ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {detail.is_mandatory ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-violet-50 font-bold">
                          <td colSpan="2" className="px-4 py-3 text-sm text-slate-900">Total Amount</td>
                          <td className="px-4 py-3 text-sm text-violet-700 text-right">₹{viewingStructure.fee_details.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0)}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

export default FeeStructureManagement;
