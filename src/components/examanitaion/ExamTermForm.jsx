import React, { useState } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { createExamTerm } from '../../helper/requests-method/apiMethods';

const ExamTermForm = ({ onTermAdded }) => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [formData, setFormData] = useState({
    term_name: '',
    academic_year: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.term_name.trim()) {
      newErrors.term_name = 'Term name is required';
    }
    
    if (!formData.academic_year.trim()) {
      newErrors.academic_year = 'Academic year is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create API payload
      const payload = {
        term_name: formData.term_name.trim(),
        academic_year: formData.academic_year.trim(),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status
      };
      
      console.log("API Payload:", payload);
      
      const response = await createExamTerm(payload);
      
      // Check for success response (statusCode 201 or success: true)
      if (response && (response.success === true || response.statusCode === 201)) {
        // Reset form
        setFormData({
          term_name: '',
          academic_year: '',
          start_date: '',
          end_date: '',
          status: 'active'
        });
        
        // Call parent callback to refresh terms list
        if (onTermAdded) {
          onTermAdded();
        }
        
        // Dispatch custom event for table refresh
        window.dispatchEvent(new Event('examTermAdded'));
        
        // Show success toast with backend message
        const successMessage = response.message || 'Exam term created successfully';
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Handle non-success response
        const errorMessage = response?.message || response?.error || 'Failed to create exam term';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
        });
      }
      
    } catch (error) {
      console.error('Error adding exam term:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to create exam term';
      
      if (error?.response) {
        // Backend returned an error response
        errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || error.response?.data?.errorMessage
          || `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error?.message) {
        // Network or other error
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Add New Exam Term</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showAddForm ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Hide Form' : 'Show Form'}
        </button>
      </div>
      
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Term Name */}
            <div>
              <label htmlFor="term_name" className="block text-sm font-medium text-gray-700 mb-2">
                Term Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="term_name"
                name="term_name"
                value={formData.term_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.term_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. First Term, Mid-Term, Final Term"
              />
              {errors.term_name && <p className="mt-1 text-sm text-red-600">{errors.term_name}</p>}
            </div>

            {/* Academic Year */}
            <div>
              <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="academic_year"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.academic_year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. 2024-2025"
              />
              {errors.academic_year && <p className="mt-1 text-sm text-red-600">{errors.academic_year}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.end_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Exam Term'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExamTermForm;

