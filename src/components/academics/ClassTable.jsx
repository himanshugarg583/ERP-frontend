import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../comman_components/DataTable';
import { createClass } from '../../helper/requests-method/apiMethods';

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define columns for the table
  const columns = [
    { key: 'class_name', header: 'Class Name' },
    { key: 'section_name', header: 'Section' },
    { key: 'room_No', header: 'Room No' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'teacher_id', header: 'Teacher ID' }
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    setClasses([
      { id: 1, class_name: 'Class 7', section_name: 'A', room_No: '101', capacity: '30', teacher_id: '1' },
      { id: 2, class_name: 'Class 8', section_name: 'B', room_No: '102', capacity: '35', teacher_id: '2' },
      { id: 3, class_name: 'Class 9', section_name: 'C', room_No: '103', capacity: '40', teacher_id: '3' }
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

  // Handle add class
  const handleAddClass = ({ onClose }) => {
    const [formData, setFormData] = useState({
      class_name: '',
      section_name: '',
      room_No: '',
      capacity: '',
      teacher_id: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: name === 'capacity' ? parseInt(value) || '' : value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Validation
      if (!formData.class_name || !formData.section_name || !formData.room_No || !formData.capacity || !formData.teacher_id) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      try {
        const payload = {
          class_name: formData.class_name,
          section_name: formData.section_name,
          room_No: formData.room_No,
          capacity: formData.capacity.toString(),
          teacher_id: formData.teacher_id
        };
        
        const response = await createClass(payload);
        
        if (response && response.success) {
          showToast(response, "Class created successfully!");
          // Add to local state
          const newClass = { id: Date.now(), ...formData };
          setClasses(prev => [...prev, newClass]);
          onClose();
        } else {
          showToast(response, "Failed to create class");
        }
      } catch (error) {
        console.error("Error creating class:", error);
        toast.error("Failed to create class. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Class Name *</label>
          <input
            type="text"
            name="class_name"
            value={formData.class_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. Class 7"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Section *</label>
          <input
            type="text"
            name="section_name"
            value={formData.section_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. D"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Room No *</label>
          <input
            type="text"
            name="room_No"
            value={formData.room_No}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. 34"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Capacity *</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. 65"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Teacher ID *</label>
          <input
            type="text"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. 3"
            required
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
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Class'}
          </button>
        </div>
      </form>
    );
  };

  // Handle edit class
  const handleEditClass = ({ item, onClose }) => {
    const [formData, setFormData] = useState(item);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: name === 'capacity' ? parseInt(value) || '' : value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        // Update local state
        setClasses(prev => prev.map(cls => cls.id === item.id ? { ...cls, ...formData } : cls));
        toast.success("Class updated successfully!");
        onClose();
      } catch (error) {
        console.error("Error updating class:", error);
        toast.error("Failed to update class. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Class Name *</label>
          <input
            type="text"
            name="class_name"
            value={formData.class_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Section *</label>
          <input
            type="text"
            name="section_name"
            value={formData.section_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Room No *</label>
          <input
            type="text"
            name="room_No"
            value={formData.room_No}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Capacity *</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Teacher ID *</label>
          <input
            type="text"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
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
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Class'}
          </button>
        </div>
      </form>
    );
  };

  // Handle delete class
  const handleDeleteClass = async (item) => {
    try {
      // Remove from local state
      setClasses(prev => prev.filter(cls => cls.id !== item.id));
      toast.success("Class deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete class");
    }
  };

  return (
    <DataTable
      title="Class Management"
      data={classes}
      columns={columns}
      onAdd={handleAddClass}
      onEdit={handleEditClass}
      onDelete={handleDeleteClass}
      onView={null}
      loading={loading}
      searchPlaceholder="Search classes..."
      addButtonText="Add Class"
      exportFileName="classes"
    />
  );
};

export default ClassTable; 