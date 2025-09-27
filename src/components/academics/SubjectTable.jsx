import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../comman_components/DataTable';
import { addSubject } from '../../helper/requests-method/apiMethods';

const SubjectTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define columns for the table
  const columns = [
    { key: 'subject_name', header: 'Subject Name' },
    { key: 'subject_code', header: 'Subject Code' },
    { key: 'class_section_id', header: 'Class Section ID' },
    { key: 'teacher_id', header: 'Teacher ID' }
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    setSubjects([
      { id: 1, subject_name: 'Mathematics', subject_code: 'MATH101', class_section_id: '1', teacher_id: '1' },
      { id: 2, subject_name: 'English', subject_code: 'ENG101', class_section_id: '2', teacher_id: '2' },
      { id: 3, subject_name: 'Science', subject_code: 'SCI101', class_section_id: '3', teacher_id: '3' }
    ]);
  }, []);

  // Helper function to show toast notifications
  const showToast = (response, defaultMessage) => {
    if (response && response.success) {
      toast.success(response.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(response?.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle add subject
  const handleAddSubject = ({ onClose }) => {
    const [formData, setFormData] = useState({
      subject_name: '',
      subject_code: '',
      class_section_id: '',
      teacher_id: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Validation
      if (!formData.subject_name || !formData.subject_code || !formData.class_section_id || !formData.teacher_id) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      try {
        const payload = {
          subject_name: formData.subject_name,
          subject_code: formData.subject_code,
          class_section_id: formData.class_section_id,
          teacher_id: formData.teacher_id
        };
        
        const response = await addSubject(payload);
        
        if (response && response.success) {
          showToast(response, "Subject added successfully!");
          // Add to local state
          const newSubject = { id: Date.now(), ...formData };
          setSubjects(prev => [...prev, newSubject]);
          onClose();
        } else {
          showToast(response, "Failed to add subject");
        }
      } catch (error) {
        console.error("Error adding subject:", error);
        toast.error("Failed to add subject. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subject Name:
          </label>
          <input
            type="text"
            name="subject_name"
            value={formData.subject_name}
            onChange={handleChange}
            placeholder="Enter subject name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subject Code:
          </label>
          <input
            type="text"
            name="subject_code"
            value={formData.subject_code}
            onChange={handleChange}
            placeholder="Enter subject code"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Class Section ID:
          </label>
          <input
            type="text"
            name="class_section_id"
            value={formData.class_section_id}
            onChange={handleChange}
            placeholder="Enter class section ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Teacher ID:
          </label>
          <input
            type="text"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            placeholder="Enter teacher ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
        </div>
      </form>
    );
  };

  // Handle edit subject
  const handleEditSubject = ({ item, onClose }) => {
    const [formData, setFormData] = useState(item);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        // Update local state
        setSubjects(prev => prev.map(subject => subject.id === item.id ? { ...subject, ...formData } : subject));
        toast.success("Subject updated successfully!");
        onClose();
      } catch (error) {
        console.error("Error updating subject:", error);
        toast.error("Failed to update subject. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subject Name:
          </label>
          <input
            type="text"
            name="subject_name"
            value={formData.subject_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subject Code:
          </label>
          <input
            type="text"
            name="subject_code"
            value={formData.subject_code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Class Section ID:
          </label>
          <input
            type="text"
            name="class_section_id"
            value={formData.class_section_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Teacher ID:
          </label>
          <input
            type="text"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Updating...' : 'Update Subject'}
          </button>
        </div>
      </form>
    );
  };

  // Handle delete subject
  const handleDeleteSubject = async (item) => {
    try {
      // Remove from local state
      setSubjects(prev => prev.filter(subject => subject.id !== item.id));
      toast.success("Subject deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  return (
    <DataTable
      title="Subject Management"
      data={subjects}
      columns={columns}
      onAdd={handleAddSubject}
      onEdit={handleEditSubject}
      onDelete={handleDeleteSubject}
      onView={null}
      loading={loading}
      searchPlaceholder="Search subjects..."
      addButtonText="Add Subject"
      exportFileName="subjects"
    />
  );
};

export default SubjectTable;
