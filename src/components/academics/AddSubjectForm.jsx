import React, { useState, useEffect } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { addSubject, fetchTeacherDropdown, fetchClassDropdown } from '../../helper/requests-method/apiMethods';

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    class_section_id: '', // Changed to store ID instead of name
    teacher_id: '' // Changed to store ID instead of name
  });
  
  // Dropdown states
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch teachers
      setTeacherLoading(true);
      try {
        const teacherResponse = await fetchTeacherDropdown();
        if (teacherResponse && teacherResponse.success && teacherResponse.data) {
          // Filter teachers that have valid teacherDetails with ID
          const validTeachers = teacherResponse.data.filter(teacher => 
            teacher.teacherDetails && teacher.teacherDetails.id
          );
          setTeacherOptions(validTeachers);
        } else {
          console.error('Failed to fetch teachers:', teacherResponse?.message);
          setTeacherOptions([]);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast.error('Failed to load teachers');
        setTeacherOptions([]);
      } finally {
        setTeacherLoading(false);
      }

      // Fetch classes
      setClassLoading(true);
      try {
        const classResponse = await fetchClassDropdown();
        if (classResponse && classResponse.success && classResponse.data) {
          setClassOptions(classResponse.data);
        } else {
          console.error('Failed to fetch classes:', classResponse?.message);
          setClassOptions([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
        setClassOptions([]);
      } finally {
        setClassLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject_name.trim()) {
      newErrors.subject_name = 'Subject name is required';
    }
    
    if (!formData.subject_code.trim()) {
      newErrors.subject_code = 'Subject code is required';
    }
    
    if (!formData.class_section_id) {
      newErrors.class_section_id = 'Class & Section is required';
    }
    
    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Teacher is required';
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
        subject_name: formData.subject_name,
        subject_code: formData.subject_code,
        class_section_id: formData.class_section_id,
        teacher_id: formData.teacher_id
      };
      
      console.log("API Payload:", payload);
      
      const response = await addSubject(payload);
      
      if (response && response.success) {
        // Create display object for parent component (if needed)
        const selectedClass = classOptions.find(cls => cls.id.toString() === formData.class_section_id);
        const selectedTeacher = teacherOptions.find(teacher => teacher.teacherDetails.id.toString() === formData.teacher_id);
        
        const newSubject = {
          id: Date.now(),
          subject_name: formData.subject_name,
          subject_code: formData.subject_code,
          class_name: selectedClass ? selectedClass.class_name : '',
          section_name: selectedClass ? selectedClass.section_name : '',
          teacher_name: selectedTeacher ? selectedTeacher.name : ''
        };
        
        // Call parent callback to update subjects list
        if (onSubjectAdded) {
          onSubjectAdded(newSubject);
        }
        
        // Reset form
        setFormData({
          subject_name: '',
          subject_code: '',
          class_section_id: '',
          teacher_id: ''
        });
        
        toast.success(response.message || 'Subject added successfully!');
      } else {
        toast.error(response?.message || 'Failed to add subject');
      }
      
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error(error?.response?.data?.message || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Add New Subject</h2>
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
            {/* Subject Name */}
            <div>
              <label htmlFor="subject_name" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject_name"
                name="subject_name"
                value={formData.subject_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.subject_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Mathematics"
              />
              {errors.subject_name && <p className="mt-1 text-sm text-red-600">{errors.subject_name}</p>}
            </div>

            {/* Subject Code */}
            <div>
              <label htmlFor="subject_code" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject_code"
                name="subject_code"
                value={formData.subject_code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.subject_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. MATH101"
              />
              {errors.subject_code && <p className="mt-1 text-sm text-red-600">{errors.subject_code}</p>}
            </div>

            {/* Class & Section */}
            <div>
              <label htmlFor="class_section_id" className="block text-sm font-medium text-gray-700 mb-2">
                Class & Section <span className="text-red-500">*</span>
              </label>
              <select
                id="class_section_id"
                name="class_section_id"
                value={formData.class_section_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.class_section_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={classLoading}
              >
                <option value="">
                  {classLoading ? "Loading classes..." : "Select Class & Section"}
                </option>
                {classOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.class_name} - {option.section_name}
                  </option>
                ))}
              </select>
              {errors.class_section_id && <p className="mt-1 text-sm text-red-600">{errors.class_section_id}</p>}
            </div>

            {/* Teacher */}
            <div>
              <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-2">
                Teacher <span className="text-red-500">*</span>
              </label>
              <select
                id="teacher_id"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  errors.teacher_id ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.teacher_id && <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>}
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
              <span>{isSubmitting ? 'Adding...' : 'Add Subject'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddSubjectForm;
