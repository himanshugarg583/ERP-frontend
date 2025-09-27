import React, { useState, useEffect } from 'react';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';
import AssignTaskForm from './AssignTaskForm';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const StaffSupport = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('staffTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, name: 'John Doe', email: 'john.doe@school.edu', dept: 'IT Department', task: 'Network maintenance in Computer Lab 3', details: 'Hardware, High Priority', deadline: 'Aug 25, 2023', status: 'In Progress', days: '2 days left', color: 'bg-yellow-100 text-yellow-800' },
      { id: 2, name: 'Maria Smith', email: 'maria.s@school.edu', dept: 'Cafeteria Staff', task: 'Prepare lunch menu for next week', details: 'Menu Planning, Lunch', deadline: 'Aug 22, 2023', status: 'Delayed', days: 'Overdue by 1 day', color: 'bg-red-100 text-red-800' },
      { id: 3, name: 'Robert Johnson', email: 'r.johnson@school.edu', dept: 'Janitorial Staff', task: 'Clean all washrooms on 2nd floor', details: 'Washrooms, Morning', deadline: 'Aug 20, 2023', status: 'Completed', days: 'Completed on time', color: 'bg-green-100 text-green-800' },
    ];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editTaskId, setEditTaskId] = useState(null);
  const tasksPerPage = 3;

  const departments = [
    { value: 'it', label: 'IT Department', color: 'bg-blue-100 text-blue-800' },
    { value: 'janitorial', label: 'Janitorial Staff', color: 'bg-purple-100 text-purple-800' },
    { value: 'cafeteria', label: 'Cafeteria Staff', color: 'bg-green-100 text-green-800' },
    { value: 'library', label: 'Library Staff', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'administrative', label: 'Administrative Staff', color: 'bg-orange-100 text-orange-800' },
    { value: 'security', label: 'Security Staff', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    localStorage.setItem('staffTasks', JSON.stringify(tasks));
  }, [tasks]);

  const inputClass = "w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm";

  const handleEdit = (task) => {
    setEditTaskId(task.id); // Set the task ID to edit
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks
    .filter(task => filterDept === 'all' || task.dept === departments.find(d => d.value === filterDept)?.label)
    .filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex overflow-x-hidden font-sans">
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <StaffSidebar />
      </div>

      <div className="flex-1 pt-16 md:pl-64">
        <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-lg z-20">
          <StaffHeader />
        </div>

        <div className="p-8 w-full max-w-[1280px] mx-auto space-y-8">
          <AssignTaskForm
            tasks={tasks}
            setTasks={setTasks}
            editTaskId={editTaskId}
            setEditTaskId={setEditTaskId}
            departments={departments} // Pass departments for the form
          />

          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Current Task Assignments</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select 
                  className={`${inputClass} w-full sm:w-48`}
                  value={filterDept}
                  onChange={(e) => {
                    setFilterDept(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Employee', 'Department', 'Task', 'Deadline', 'Status', 'Actions'].map(head => (
                      <th key={head} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTasks.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">{row.name.split(' ').map(n => n[0]).join('')}</div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{row.name}</div>
                            <div className="text-xs text-gray-500">{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${departments.find(d => d.label === row.dept)?.color || 'bg-gray-100 text-gray-800'}`}>{row.dept}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{row.task}</div>
                        <div className="text-xs text-gray-500 mt-1">{row.details}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-900">{row.deadline}</div>
                        <div className={row.status === 'Completed' ? 'text-green-600' : row.status === 'Delayed' ? 'text-red-600' : 'text-gray-500'}>{row.days}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.color}`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                          onClick={() => handleEdit(row)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          onClick={() => handleDelete(row.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {paginatedTasks.length} of {filteredTasks.length} task assignments
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 border border-gray-200 rounded-lg transition-all duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${page === currentPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className={`px-4 py-2 border border-gray-200 rounded-lg transition-all duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StaffSupport;