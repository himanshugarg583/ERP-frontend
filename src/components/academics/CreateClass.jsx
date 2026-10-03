
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClass, fetchTeacherDropdown } from '../../helper/requests-method/apiMethods';

const CreateClass = ({ onClassAdded }) => {
  const [newClass, setNewClass] = useState({
    class_name: '',
    section_name: '',
    room_No: '',
    capacity: '',
    teacher_id: ''
  });
  
  // Teacher dropdown state
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  // Fetch teacher dropdown data on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      setTeacherLoading(true);
      try {
        const response = await fetchTeacherDropdown();
        if (response && response.success && response.data) {
          // Filter teachers that have valid teacherDetails with ID
          const validTeachers = response.data.filter(teacher => 
            teacher.teacherDetails && teacher.teacherDetails.id
          );
          setTeacherOptions(validTeachers);
        } else {
          console.error('Failed to fetch teacher dropdown:', response?.message);
          setTeacherOptions([]);
        }
      } catch (error) {
        console.error('Error fetching teacher dropdown:', error);
        toast.error('Failed to load teacher options');
        setTeacherOptions([]);
      } finally {
        setTeacherLoading(false);
      }
    };

    fetchTeachers();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: name === 'capacity' ? parseInt(value) || '' : value });
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
    if (!newClass.class_name || !newClass.section_name || !newClass.room_No || !newClass.capacity || !newClass.teacher_id) {
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
        class_name: newClass.class_name,
        section_name: newClass.section_name,
        room_no: newClass.room_No,
        capacity: newClass.capacity.toString(),
        teacher_id: newClass.teacher_id
      };
      
      console.log("API Payload:", payload);
      
      const response = await createClass(payload);
      
      if (response && response.success) {
        showToast(response, "Class created successfully!");
        // Reset form after successful submission
        setNewClass({
          class_name: '',
          section_name: '',
          room_No: '',
          capacity: '',
          teacher_id: ''
        });
        // Trigger refresh in parent component
        if (onClassAdded) {
          onClassAdded();
        }
      } else {
        showToast(response, "Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class. Please try again.", {
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
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="bg-violet-600 text-white text-lg font-semibold p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold">Add New Class</span>
              <p className="text-violet-100 text-sm">Create a new class section for your school</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="class_name"
                value={newClass.class_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
                placeholder="e.g. Class 7"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                name="section_name"
                value={newClass.section_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
                placeholder="e.g. A"
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Room No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="room_No"
                value={newClass.room_No}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
                placeholder="e.g. 101"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={newClass.capacity}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
                placeholder="e.g. 30"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Teacher <span className="text-red-500">*</span>
              </label>
              <select
                name="teacher_id"
                value={newClass.teacher_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={teacherLoading}
              >
                <option value="">
                  {teacherLoading ? "Loading teachers..." : "Select Teacher"}
                </option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher.teacherDetails.id} value={teacher.teacherDetails.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-md ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-violet-600 hover:bg-violet-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Class...
                </div>
              ) : (
                'Add Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateClass;