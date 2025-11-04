import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommonTable from '../../../components/tables/CommonTable';
import TeacherCredentialsFilter from '../../../components/tables/TeacherCredentialsFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { teacherData } from '../../../data.js';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import '../Admin.css';

const TeacherCredentials = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock subjects and departments data for filtering
  const subjects = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "English", label: "English" },
    { value: "Science", label: "Science" },
    { value: "Hindi", label: "Hindi" },
    { value: "Social Studies", label: "Social Studies" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Physical Education", label: "Physical Education" }
  ];

  const departments = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
    { value: "Senior Secondary", label: "Senior Secondary" },
    { value: "Administration", label: "Administration" }
  ];

  // Load teachers data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTeachers(teacherData);
      setFilteredTeachers(teacherData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...teachers];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.phone.includes(searchLower) ||
        teacher.teacher_id.toLowerCase().includes(searchLower)
      );
    }

    // Filter by subject
    if (filters.selectedSubject) {
      filtered = filtered.filter(teacher =>
        teacher.subject === filters.selectedSubject
      );
    }

    // Filter by department
    if (filters.selectedDepartment) {
      filtered = filtered.filter(teacher =>
        teacher.department === filters.selectedDepartment
      );
    }

    // Filter by status
    if (filters.selectedStatus) {
      filtered = filtered.filter(teacher =>
        teacher.status === filters.selectedStatus
      );
    }

    setFilteredTeachers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle password reset
  const handlePasswordReset = (teacher) => {
    const newPassword = generatePassword();
    // In a real app, this would call an API
    toast.success(`Password reset for ${teacher.name}. New password: ${newPassword}`, {
      position: "top-right",
      autoClose: 5000,
    });
  };

  // Table columns configuration
  const teacherColumns = [
    {
      key: 'count',
      header: 'S.No',
      type: 'text',
      render: (value, item, index) => {
        // Calculate the correct S.No based on current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        return startIndex + index + 1;
      },
      required: false
    },
    {
      key: 'teacher_id',
      header: 'Teacher ID',
      type: 'text',
      required: true,
      placeholder: 'Enter teacher ID'
    },
    {
      key: 'name',
      header: 'Teacher Name',
      type: 'text',
      required: true,
      placeholder: 'Enter teacher name'
    },
    {
      key: 'email',
      header: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      key: 'phone',
      header: 'Phone',
      type: 'text',
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      key: 'subject',
      header: 'Subject',
      type: 'select',
      required: true,
      options: subjects,
      placeholder: 'Select subject'
    },
    {
      key: 'password',
      header: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      render: () => '••••••••' // Hide actual password in display
    },
    {
      key: 'actions',
      header: 'Actions',
      type: 'custom',
      render: (value, teacher) => (
        <button
          onClick={() => handlePasswordReset(teacher)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          Reset Password
        </button>
      )
    }
  ];

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />

      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />

        <main className="w-full py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full p-6 text-black">
          <ToastContainer />
          
          {/* Page Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Credentials</h1>
            <p className="text-gray-600">Manage teacher credentials and login information</p>
          </motion.div>

          {/* Filter Component */}
          <TeacherCredentialsFilter
            onFilterChange={handleFilterChange}
            subjects={subjects}
            departments={departments}
          />

          {/* Teacher Credentials Table */}
          <CommonTable
            title="Teacher Credentials"
            columns={teacherColumns}
            data={filteredTeachers}
            createApi={null}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search teachers..."
            addButtonText="Add Teacher"
            exportFileName="teacher_credentials"
            itemsPerPage={itemsPerPage}
            loading={loading}
            enableSearch={false} // Disable built-in search since we have custom filter
            enablePagination={true} // Enable pagination
            enableAdd={false} // Disable add functionality for credentials page
            enableEdit={true} // Enable edit for password updates
            enableDelete={false} // Disable delete functionality
            enableView={true} // Enable view functionality
            onPageChange={handlePageChange}
            statusConfig={{
              enable: false // No status column needed for credentials
            }}
          />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherCredentials;
