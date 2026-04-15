import React, { useState } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createExamTypeV2Thunk } from '../../store/slices/examSlice';

const DEFAULT_FORM = {
  term_name: '',
  description: '',
  grading_config_text: '{"A+":90,"A":80,"B":70,"C":60}',
  is_active: true,
};

const ExamTermForm = ({ onTermAdded, inModal = false, onCancel }) => {
  const dispatch = useDispatch();
  const [showAddForm, setShowAddForm] = useState(true);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.term_name.trim()) {
      newErrors.term_name = 'Term name is required';
    }

    if (!formData.grading_config_text.trim()) {
      newErrors.grading_config_text = 'Grading config is required';
    } else {
      try {
        JSON.parse(formData.grading_config_text);
      } catch {
        newErrors.grading_config_text = 'Grading config must be valid JSON';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.term_name.trim(),
        description: formData.description.trim() || '',
        grading_config: JSON.parse(formData.grading_config_text),
        is_active: Boolean(formData.is_active),
      };

      const response = await dispatch(createExamTypeV2Thunk(payload)).unwrap();

      setFormData(DEFAULT_FORM);

      if (onTermAdded) {
        onTermAdded();
      }

      window.dispatchEvent(new Event('examTermAdded'));

      const successMessage = response?.message || 'Exam term created successfully';
      toast.success(successMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding exam term:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create exam term';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formLayout = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            placeholder="e.g. Mid Term"
          />
          {errors.term_name && <p className="mt-1 text-sm text-red-600">{errors.term_name}</p>}
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            Active
          </label>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Optional term description"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="grading_config_text" className="block text-sm font-medium text-gray-700 mb-2">
            Grading Config JSON <span className="text-red-500">*</span>
          </label>
          <textarea
            id="grading_config_text"
            name="grading_config_text"
            value={formData.grading_config_text}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 font-mono text-xs ${
              errors.grading_config_text ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='{"A+":90,"A":80,"B":70,"C":60}'
          />
          {errors.grading_config_text && (
            <p className="mt-1 text-sm text-red-600">{errors.grading_config_text}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        {inModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
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
  );

  if (inModal) {
    return formLayout;
  }

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

      {showAddForm && <div className="p-6">{formLayout}</div>}
    </div>
  );
};

export default ExamTermForm;
