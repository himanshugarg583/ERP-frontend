import React, { useEffect, useState } from 'react';
import { Minus, Plus, Save } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createExamEventV2Thunk,
  listExamTypesV2Thunk,
} from '../../store/slices/examSlice';

const DEFAULT_FORM = {
  exam_type_id: '',
  name: '',
  description: '',
  academic_year: '',
  start_date: '',
  end_date: '',
  status: 'scheduled',
  marks_entry_deadline: '',
  result_publish_at: '',
};

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const toIsoOrNull = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const ExamForm = ({ onExamAdded, inModal = false, onCancel }) => {
  const dispatch = useDispatch();
  const [showAddForm, setShowAddForm] = useState(true);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [examTypes, setExamTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExamTypes = async () => {
      setTypesLoading(true);
      try {
        const response = await dispatch(listExamTypesV2Thunk()).unwrap();
        const payload = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setExamTypes(payload);
      } catch (error) {
        console.error('Error fetching exam types:', error);
        toast.error('Failed to load exam types');
        setExamTypes([]);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchExamTypes();
  }, [dispatch]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.exam_type_id) {
      nextErrors.exam_type_id = 'Exam term is required';
    }

    if (!formData.name.trim()) {
      nextErrors.name = 'Event name is required';
    }

    if (!formData.academic_year.trim()) {
      nextErrors.academic_year = 'Academic year is required';
    }

    if (!formData.start_date) {
      nextErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      nextErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate > endDate) {
        nextErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      toast.error('Please fix the highlighted fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        exam_type_id: formData.exam_type_id,
        description: formData.description.trim() || undefined,
        academic_year: formData.academic_year.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        marks_entry_deadline: toIsoOrNull(formData.marks_entry_deadline),
        result_publish_at: toIsoOrNull(formData.result_publish_at),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
          delete payload[key];
        }
      });

      const response = await dispatch(createExamEventV2Thunk(payload)).unwrap();

      setFormData(DEFAULT_FORM);
      if (onExamAdded) {
        onExamAdded();
      }
      window.dispatchEvent(new Event('examAdded'));
      toast.success(response?.message || 'Exam event created successfully');
    } catch (error) {
      console.error('Error creating exam event:', error);
      const message =
        error?.message ||
        error?.error ||
        error?.response?.data?.message ||
        'Failed to create exam event';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="exam_type_id" className="block text-sm font-medium text-gray-700 mb-2">
            Exam Term <span className="text-red-500">*</span>
          </label>
          <select
            id="exam_type_id"
            name="exam_type_id"
            value={formData.exam_type_id}
            onChange={handleInputChange}
            disabled={typesLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${errors.exam_type_id ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">{typesLoading ? 'Loading exam terms...' : 'Select exam term'}</option>
            {examTypes.map((examType) => (
              <option key={examType.id || examType.uuid} value={examType.id || examType.uuid}>
                {examType.name}
              </option>
            ))}
          </select>
          {errors.exam_type_id && <p className="mt-1 text-sm text-red-600">{errors.exam_type_id}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Half Yearly 2026"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <input
            id="academic_year"
            name="academic_year"
            type="text"
            value={formData.academic_year}
            onChange={handleInputChange}
            placeholder="e.g. 2026-2027"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${errors.academic_year ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.academic_year && <p className="mt-1 text-sm text-red-600">{errors.academic_year}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
        </div>

        <div>
          <label htmlFor="marks_entry_deadline" className="block text-sm font-medium text-gray-700 mb-2">
            Marks Entry Deadline
          </label>
          <input
            id="marks_entry_deadline"
            name="marks_entry_deadline"
            type="datetime-local"
            value={formData.marks_entry_deadline}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>

        <div>
          <label htmlFor="result_publish_at" className="block text-sm font-medium text-gray-700 mb-2">
            Result Publish At
          </label>
          <input
            id="result_publish_at"
            name="result_publish_at"
            type="datetime-local"
            value={formData.result_publish_at}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
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
            rows={3}
            placeholder="Optional event description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        {inModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Adding...' : 'Add Exam Event'}</span>
        </button>
      </div>
    </>
  );

  if (inModal) {
    return <form onSubmit={handleSubmit} className="space-y-6">{formFields}</form>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Add New Exam Event</h2>
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showAddForm ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Hide Form' : 'Show Form'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6">
          {formFields}
        </form>
      )}
    </div>
  );
};

export default ExamForm;