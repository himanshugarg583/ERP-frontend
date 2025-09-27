import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addSubject } from '../../helper/requests-method/apiMethods';

const AddSubject = () => {
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    class_section_id: '',
    teacher_id: ''
  });

  const [loading, setLoading] = useState(false);

  const teachers = [
    { id: 1, name: 'Mr. John Smith' },
    { id: 2, name: 'Ms. Sarah Johnson' },
    { id: 3, name: 'Dr. Robert Brown' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (!formData.subject_name || !formData.subject_code || !formData.class_section_id || !formData.teacher_id) {
      toast.error('Please fill all required fields', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      
      console.log("API Payload:", payload);
      
      const response = await addSubject(payload);
      
      if (response && response.success) {
        showToast(response, "Subject added successfully!");
        // Reset form after successful submission
        setFormData({
          subject_name: '',
          subject_code: '',
          class_section_id: '',
          teacher_id: ''
        });
      } else {
        showToast(response, "Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add New Subject
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="subject_name" 
            className="block text-sm font-medium text-gray-700"
          >
            Subject Name:
          </label>
          <input
            type="text"
            id="subject_name"
            name="subject_name"
            value={formData.subject_name}
            onChange={handleChange}
            placeholder="Enter subject name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="subject_code" 
            className="block text-sm font-medium text-gray-700"
          >
            Subject Code:
          </label>
          <input
            type="text"
            id="subject_code"
            name="subject_code"
            value={formData.subject_code}
            onChange={handleChange}
            placeholder="Enter subject code"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="class_section_id" 
            className="block text-sm font-medium text-gray-700"
          >
            Class Section ID:
          </label>
          <input
            type="text"
            id="class_section_id"
            name="class_section_id"
            value={formData.class_section_id}
            onChange={handleChange}
            placeholder="Enter class section ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="teacher_id" 
            className="block text-sm font-medium text-gray-700"
          >
            Teacher ID:
          </label>
          <input
            type="text"
            id="teacher_id"
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            placeholder="Enter teacher ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 px-4 rounded-md transition-colors duration-200 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Adding Subject...' : 'Add Subject'}
        </button>
      </form>
    </div>
    </>
  );

};

export default AddSubject;