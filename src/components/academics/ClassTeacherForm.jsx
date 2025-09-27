import React, { useState, useEffect } from 'react';

const ClassTeacher = () => {
  // Sample data - would be fetched from API in real application
  const [classes, setClasses] = useState([
    { id: 1, name: '9-A', section: 'A', grade: '9', academicYear: '2025-2026' },
    { id: 2, name: '9-B', section: 'B', grade: '9', academicYear: '2025-2026' },
    { id: 3, name: '10-A', section: 'A', grade: '10', academicYear: '2025-2026' },
    { id: 4, name: '10-B', section: 'B', grade: '10', academicYear: '2025-2026' },
    { id: 5, name: '11-Science', section: 'Science', grade: '11', academicYear: '2025-2026' },
    { id: 6, name: '11-Commerce', section: 'Commerce', grade: '11', academicYear: '2025-2026' }
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', department: 'Science', experience: '12 years', expertise: 'Physics' },
    { id: 2, name: 'Prof. Michael Chen', department: 'Mathematics', experience: '8 years', expertise: 'Calculus' },
    { id: 3, name: 'Ms. Emily Rodriguez', department: 'Languages', experience: '6 years', expertise: 'English Literature' },
    { id: 4, name: 'Mr. Robert Smith', department: 'Social Studies', experience: '10 years', expertise: 'History' },
    { id: 5, name: 'Mrs. Priya Patel', department: 'Science', experience: '9 years', expertise: 'Biology' },
    { id: 6, name: 'Mr. David Wilson', department: 'Mathematics', experience: '5 years', expertise: 'Statistics' }
  ]);

  // State for form
  const [formData, setFormData] = useState({
    classId: '',
    teacherId: '',
    startDate: '',
    endDate: '',
    responsibilities: [],
    additionalNotes: ''
  });

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [currentAssignments, setCurrentAssignments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Sample responsibilities
  const responsibilityOptions = [
    { id: 'attendance', label: 'Daily Attendance Management' },
    { id: 'discipline', label: 'Discipline Management' },
    { id: 'parents', label: 'Parent Communication' },
    { id: 'events', label: 'Class Events Organization' },
    { id: 'reports', label: 'Academic Progress Reports' },
    { id: 'counseling', label: 'Student Counseling' }
  ];

  // Sample existing assignments
  useEffect(() => {
    // In a real app, this would be fetched from an API
    setCurrentAssignments([
      { id: 1, className: '9-A', teacherName: 'Mrs. Priya Patel', academicYear: '2025-2026' },
      { id: 2, className: '10-B', teacherName: 'Mr. David Wilson', academicYear: '2025-2026' }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If class is selected, you might want to filter teachers based on some criteria
    if (name === 'classId') {
      // Example: Filter teachers who aren't already assigned to other classes
      const assignedTeacherIds = currentAssignments.map(assignment => {
        const teacher = teachers.find(t => t.name === assignment.teacherName);
        return teacher ? teacher.id : null;
      }).filter(id => id !== null);
      
      setFilteredTeachers(teachers.filter(teacher => !assignedTeacherIds.includes(teacher.id)));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ 
        ...formData, 
        responsibilities: [...formData.responsibilities, value] 
      });
    } else {
      setFormData({
        ...formData,
        responsibilities: formData.responsibilities.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.classId || !formData.teacherId) {
      setMessage({ type: 'error', text: 'Please select both class and teacher' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // Get class and teacher details for the confirmation message
        const selectedClass = classes.find(c => c.id === parseInt(formData.classId));
        const selectedTeacher = teachers.find(t => t.id === parseInt(formData.teacherId));
        
        // In a real app, you would send this data to your backend
        console.log('Submitting assignment:', {
          ...formData,
          className: selectedClass.name,
          teacherName: selectedTeacher.name
        });
        
        // Success message
        setMessage({ 
          type: 'success', 
          text: `Successfully assigned ${selectedTeacher.name} as class teacher for ${selectedClass.name}` 
        });
        
        // Update current assignments list (in real app, this would happen after API confirmation)
        setCurrentAssignments([
          ...currentAssignments,
          { 
            id: currentAssignments.length + 1, 
            className: selectedClass.name, 
            teacherName: selectedTeacher.name, 
            academicYear: selectedClass.academicYear 
          }
        ]);
        
        // Reset form
        setFormData({
          classId: '',
          teacherId: '',
          startDate: '',
          endDate: '',
          responsibilities: [],
          additionalNotes: ''
        });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to assign class teacher. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Assign Class Teacher</h1>
            <p className="text-gray-600">Assign teachers to classes for the academic year</p>
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <span>View All Assignments</span>
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 ${message.type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}`}>
            <p>{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Assignment Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Selection */}
                <div>
                  <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Class*
                  </label>
                  <select
                    id="classId"
                    name="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.academicYear})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher Selection */}
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Teacher*
                  </label>
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Select Teacher --</option>
                    {(filteredTeachers.length > 0 ? filteredTeachers : teachers).map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment Period */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {responsibilityOptions.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.id}
                        name="responsibilities"
                        value={option.id}
                        checked={formData.responsibilities.includes(option.id)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mt-6">
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows="3"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional information or special instructions"
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Current Assignments Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Current Class Teacher Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAssignments.length > 0 ? (
                  currentAssignments.map(assignment => (
                    <tr key={assignment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {assignment.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.teacherName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.academicYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No class teacher assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassTeacher;