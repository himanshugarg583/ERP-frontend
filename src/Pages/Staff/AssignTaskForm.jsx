import React, { useState } from 'react';

const AssignTaskForm = ({ tasks, setTasks, editTaskId, setEditTaskId }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({});

  const departments = [
    { value: 'it', label: 'IT Department', color: 'bg-blue-100 text-blue-800' },
    { value: 'janitorial', label: 'Janitorial Staff', color: 'bg-purple-100 text-purple-800' },
    { value: 'cafeteria', label: 'Cafeteria Staff', color: 'bg-green-100 text-green-800' },
    { value: 'library', label: 'Library Staff', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'administrative', label: 'Administrative Staff', color: 'bg-orange-100 text-orange-800' },
    { value: 'security', label: 'Security Staff', color: 'bg-red-100 text-red-800' },
  ];

  const employeesByDepartment = {
    it: [
      { name: 'John Doe', email: 'john.doe@school.edu' },
      { name: 'Alice Brown', email: 'alice.b@school.edu' },
    ],
    janitorial: [
      { name: 'Robert Johnson', email: 'r.johnson@school.edu' },
      { name: 'Mike Wilson', email: 'mike.w@school.edu' },
    ],
    cafeteria: [
      { name: 'Maria Smith', email: 'maria.s@school.edu' },
      { name: 'Sarah Lee', email: 'sarah.l@school.edu' },
    ],
    library: [
      { name: 'Emma Davis', email: 'emma.d@school.edu' },
      { name: 'Tom Clark', email: 'tom.c@school.edu' },
    ],
    administrative: [
      { name: 'Lisa White', email: 'lisa.w@school.edu' },
      { name: 'James Green', email: 'james.g@school.edu' },
    ],
    security: [
      { name: 'David Black', email: 'david.b@school.edu' },
      { name: 'Paul Grey', email: 'paul.g@school.edu' },
    ],
  };

  const DepartmentFields = {
    it: [
      { id: 'task-type', label: 'Task Type', options: ['Hardware Maintenance', 'Software Installation', 'Network Troubleshooting', 'Staff Training', 'Data Management'] },
      { id: 'priority', label: 'Priority Level', options: ['Low', 'Medium', 'High', 'Urgent'] },
      { id: 'location', label: 'Location', placeholder: 'e.g., Computer Lab 2' },
      { id: 'equipment', label: 'Equipment Details', placeholder: 'e.g., Dell XPS 15' },
    ],
    janitorial: [
      { id: 'task-type', label: 'Cleaning Area', options: ['Classrooms', 'Corridors', 'Washrooms', 'Playground', 'Staff Room', 'Cafeteria Area'] },
      { id: 'schedule', label: 'Cleaning Schedule', options: ['Morning', 'Afternoon', 'Evening', 'Weekly Deep Clean'] },
      { id: 'supplies', label: 'Supplies Required', placeholder: 'e.g., Floor Cleaner, Mops' },
      { id: 'special', label: 'Special Instructions', placeholder: 'e.g., Use eco-friendly products only' },
    ],
    cafeteria: [
      { id: 'task-type', label: 'Task Type', options: ['Cooking', 'Serving', 'Cleaning', 'Inventory Management', 'Menu Planning'] },
      { id: 'meal', label: 'Meal Period', options: ['Breakfast', 'Lunch', 'Snacks', 'Special Event'] },
      { id: 'menu', label: 'Menu Items', placeholder: 'e.g., Sandwiches, Pasta' },
      { id: 'dietary', label: 'Dietary Considerations', placeholder: 'e.g., Vegetarian, Gluten-free' },
    ],
    library: [
      { id: 'task-type', label: 'Task Type', options: ['Book Cataloging', 'Book Shelving', 'Student Assistance', 'Resource Management', 'Library Events'] },
      { id: 'section', label: 'Library Section', options: ['Fiction', 'Non-Fiction', 'Reference', 'Periodicals', 'Digital Resources'] },
      { id: 'resources', label: 'Resources Needed', placeholder: 'e.g., Library cart, Software' },
      { id: 'notes', label: 'Additional Notes', placeholder: 'e.g., Focus on new arrivals' },
    ],
    administrative: [
      { id: 'task-type', label: 'Task Type', options: ['Documentation', 'Scheduling', 'Correspondence', 'Budget Tracking', 'Meeting Prep'] },
      { id: 'priority', label: 'Priority Level', options: ['Low', 'Medium', 'High', 'Urgent'] },
      { id: 'location', label: 'Location', placeholder: 'e.g., Admin Office' },
      { id: 'details', label: 'Task Details', placeholder: 'e.g., Prepare monthly report' },
    ],
    security: [
      { id: 'task-type', label: 'Task Type', options: ['Patrol', 'Monitoring', 'Incident Response', 'Equipment Check', 'Training'] },
      { id: 'shift', label: 'Shift', options: ['Morning', 'Afternoon', 'Evening', 'Night'] },
      { id: 'location', label: 'Location', placeholder: 'e.g., Main Gate' },
      { id: 'notes', label: 'Special Notes', placeholder: 'e.g., Check CCTV at 2 PM' },
    ],
  };

  const inputClass = "w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-sm sm:text-base";
  const labelClass = "block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = employeesByDepartment[selectedDepartment]?.find(emp => emp.name === formData['employee-name']);
    if (!employee || !selectedDepartment) return;

    const newTask = {
      id: editTaskId ? editTaskId : Date.now(),
      name: employee.name,
      email: employee.email,
      dept: departments.find(d => d.value === selectedDepartment)?.label,
      task: formData['task-description'] ? formData['task-description'] : 'No description provided',
      details: DepartmentFields[selectedDepartment]?.map(field => 
        field.options ? `${field.label}: ${formData[`${selectedDepartment}-${field.id}`] ? formData[`${selectedDepartment}-${field.id}`] : 'Not specified'}` : ''
      ).filter(Boolean).join(', '),
      deadline: formData['deadline'] ? formData['deadline'] : 'Not set',
      status: 'In Progress',
      days: 'Just assigned',
      color: 'bg-yellow-100 text-yellow-800'
    };

    if (editTaskId) {
      setTasks(tasks.map(task => task.id === editTaskId ? newTask : task));
      setEditTaskId(null);
    } else {
      setTasks([newTask, ...tasks]);
    }
    setFormData({});
    setSelectedDepartment('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 max-w-full mx-auto transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">{editTaskId ? 'Edit Task' : 'Assign New Task'}</h2>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelClass} htmlFor="department">Department</label>
              <select 
                id="department" 
                className={inputClass} 
                value={selectedDepartment} 
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setFormData({ ...formData, 'employee-name': '' });
                }} 
                required
              >
                <option value="">Select Department</option>
                {departments?.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="employee-name">Employee Name</label>
              <select 
                id="employee-name" 
                className={inputClass} 
                value={formData['employee-name'] ? formData['employee-name'] : ''} 
                onChange={handleInputChange}
                disabled={!selectedDepartment}
                required
              >
                <option value="">Select Employee</option>
                {selectedDepartment && employeesByDepartment[selectedDepartment]?.map(emp => (
                  <option key={emp.email} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedDepartment && DepartmentFields[selectedDepartment] && (
            <div className="animate-fade-in bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-700">{departments.find(d => d.value === selectedDepartment)?.label} Task Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {DepartmentFields[selectedDepartment]?.map(field => (
                  <div key={field.id}>
                    <label className={labelClass} htmlFor={`${selectedDepartment}-${field.id}`}>{field.label}</label>
                    {field.options ? (
                      <select 
                        id={`${selectedDepartment}-${field.id}`} 
                        className={inputClass}
                        value={formData[`${selectedDepartment}-${field.id}`] ? formData[`${selectedDepartment}-${field.id}`] : ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        id={`${selectedDepartment}-${field.id}`} 
                        className={inputClass} 
                        placeholder={field.placeholder}
                        value={formData[`${selectedDepartment}-${field.id}`] ? formData[`${selectedDepartment}-${field.id}`] : ''}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="task-description">Task Description</label>
            <textarea 
              id="task-description" 
              rows="3 sm:rows-4" 
              className={inputClass} 
              placeholder="Provide detailed description of the task..."
              value={formData['task-description'] ? formData['task-description'] : ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className={labelClass} htmlFor="start-date">Start Date</label>
              <input 
                type="date" 
                id="start-date" 
                className={inputClass}
                value={formData['start-date'] ? formData['start-date'] : ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="deadline">Deadline</label>
              <input 
                type="date" 
                id="deadline" 
                className={inputClass}
                value={formData['deadline'] ? formData['deadline'] : ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button 
              type="button" 
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
              onClick={() => {
                setFormData({});
                setSelectedDepartment('');
                setEditTaskId(null);
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {editTaskId ? 'Update Task' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskForm;