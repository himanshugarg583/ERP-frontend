import React, { useState } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';

const AssignClassTeacherForm = ({ onClassTeacherAssigned }) => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [formData, setFormData] = useState({
    class_name: '',
    section_name: '',
    teacher_name: '',
    phone: '',
    email: '',
    assigned_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.class_name.trim()) {
      newErrors.class_name = 'Class name is required';
    }
    
    if (!formData.section_name.trim()) {
      newErrors.section_name = 'Section name is required';
    }
    
    if (!formData.teacher_name.trim()) {
      newErrors.teacher_name = 'Teacher name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.assigned_date) {
      newErrors.assigned_date = 'Assignment date is required';
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
      // Create new class teacher assignment object
      const newAssignment = {
        id: Date.now(), // Generate unique ID
        ...formData
      };
      
      // Call parent callback to update class teachers list
      if (onClassTeacherAssigned) {
        onClassTeacherAssigned(newAssignment);
      }
      
      // Reset form
      setFormData({
        class_name: '',
        section_name: '',
        teacher_name: '',
        phone: '',
        email: '',
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'active'
      });
      
      toast.success('Class teacher assigned successfully!');
      
    } catch (error) {
      console.error('Error assigning class teacher:', error);
      toast.error('Failed to assign class teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Assign Class Teacher</h2>
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
            {/* Class Name */}
            <div>
              <label htmlFor="class_name" className="block text-sm font-medium text-gray-700 mb-2">
                Class Name <span className="text-red-500">*</span>
              </label>
              <select
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.class_name ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Class</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
              {errors.class_name && <p className="mt-1 text-sm text-red-600">{errors.class_name}</p>}
            </div>

            {/* Section Name */}
            <div>
              <label htmlFor="section_name" className="block text-sm font-medium text-gray-700 mb-2">
                Section Name <span className="text-red-500">*</span>
              </label>
              <select
                id="section_name"
                name="section_name"
                value={formData.section_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.section_name ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              {errors.section_name && <p className="mt-1 text-sm text-red-600">{errors.section_name}</p>}
            </div>

            {/* Teacher Name */}
            <div>
              <label htmlFor="teacher_name" className="block text-sm font-medium text-gray-700 mb-2">
                Teacher Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="teacher_name"
                name="teacher_name"
                value={formData.teacher_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.teacher_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Rahul Sharma"
              />
              {errors.teacher_name && <p className="mt-1 text-sm text-red-600">{errors.teacher_name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. 9876543210"
                maxLength="10"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. teacher@school.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Assigned Date */}
            <div>
              <label htmlFor="assigned_date" className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="assigned_date"
                name="assigned_date"
                value={formData.assigned_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assigned_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.assigned_date && <p className="mt-1 text-sm text-red-600">{errors.assigned_date}</p>}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Assigning...' : 'Assign Class Teacher'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssignClassTeacherForm;
