import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';
import { AnimatePresence,motion } from 'framer-motion';

const EnquiryEditForm = ({ enquiry, onClose, onSuccess, updateApiFunction }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    parentName: '',
    className: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form with enquiry data
  useEffect(() => {
    if (enquiry) {
      setFormData({
        name: enquiry.name || '',
        phone: enquiry.phone || '',
        parentName: enquiry.parentName || '',
        className: enquiry.className || '',
        status: enquiry.status || 'active'
      });
    }
  }, [enquiry]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    }

    if (!formData.className.trim()) {
      newErrors.className = 'Class is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again');
      return;
    }

    setLoading(true);
    
    try {
      const response = updateApiFunction 
        ? await updateApiFunction(enquiry.id, formData)
        : { success: true, message: 'Enquiry updated successfully!' };
      
      if (response && response.success) {
        toast.success(response.message || 'Enquiry updated successfully!');
        onSuccess && onSuccess({ ...enquiry, ...formData });
        onClose();
      } else {
        toast.error(response?.message || 'Failed to update enquiry');
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-yellow-600';
      case 'admitted': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enquiry ID Display */}
      {enquiry?.id && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-600">Enquiry ID: </span>
          <span className="font-semibold text-gray-800">#{enquiry.id}</span>
        </div>
      )}

      {/* Student Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter student's full name"
        />
        {errors.name && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter 10-digit phone number"
          maxLength="10"
        />
        {errors.phone && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      {/* Parent Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="parentName"
          value={formData.parentName}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.parentName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter parent's full name"
        />
        {errors.parentName && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.parentName}
          </motion.p>
        )}
      </div>

      {/* Class */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.className ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 10th A, 9th B"
        />
        {errors.className && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.className}
          </motion.p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
            errors.status ? 'border-red-500' : 'border-gray-300'
          } ${getStatusColor(formData.status)}`}
        >
          <option value="active">🟢 Active</option>
          <option value="inactive">🟡 Inactive</option>
          <option value="admitted">🔵 Admitted</option>
        </select>
        {errors.status && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.status}
          </motion.p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border border-violet-300 rounded-lg text-violet-700 hover:bg-violet-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{loading ? 'Updating...' : 'Update Enquiry'}</span>
        </button>
      </div>
    </motion.form>
  );
};

export default EnquiryEditForm;
