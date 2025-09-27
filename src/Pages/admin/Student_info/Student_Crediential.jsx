import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommonTable from '../../../components/tables/CommonTable';
import StudentSearchFilter from '../../../components/tables/StudentSearchFilter';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { studentData } from '../../../data.js';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import '../Admin.css';

const Student_Crediential = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock classes and sections data
  const classes = [
    { value: "8th", label: "8th" },
    { value: "9th", label: "9th" },
    { value: "10th", label: "10th" },
    { value: "11th", label: "11th" },
    { value: "12th", label: "12th" }
  ];

  const sections = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ];

  // Load students data from data.js
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(studentData);
      setFilteredStudents(studentData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...students];

    // Filter by class
    if (filters.selectedClass) {
      filtered = filtered.filter(student =>
        student.class.includes(filters.selectedClass)
      );
    }

    // Filter by section
    if (filters.selectedSection) {
      filtered = filtered.filter(student =>
        student.section === filters.selectedSection
      );
    }

    // Filter by status
    if (filters.selectedStatus) {
      filtered = filtered.filter(student =>
        student.status === filters.selectedStatus
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // Table columns configuration
  const studentColumns = [
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
      key: 'name',
      header: 'Student Name',
      type: 'text',
      required: true,
      placeholder: 'Enter student name'
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
      key: 'password',
      header: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password'
    },
    {
      key: 'class',
      header: 'Class',
      type: 'select',
      required: true,
      options: classes
    }
  ];

  return (
    <div className='bg-gray-100 flex AddStudent'>
      <Sidebar />

      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />

        <div className="bg-white shadow-md rounded-lg w-full max-w-7xl p-6 flex-1 overflow-auto relative z-1 m-auto text-black">
          <ToastContainer />
          
          {/* Page Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Credentials</h1>
            <p className="text-gray-600">Manage student credentials and information</p>
          </motion.div>

          {/* Search and Filter Component */}
          <StudentSearchFilter
            onFilterChange={handleFilterChange}
            classes={classes}
            sections={sections}
          />

          {/* Student Table */}
          <CommonTable
            title="Student Credentials"
            columns={studentColumns}
            data={filteredStudents}
            createApi={null}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search students..."
            addButtonText="Add Student"
            exportFileName="student_credentials"
            itemsPerPage={itemsPerPage}
            loading={loading}
            enableSearch={true} // Enable built-in search in table
            enablePagination={true} // Enable pagination
            enableAdd={false} // Disable add functionality
            enableEdit={false} // Disable edit functionality
            enableDelete={false} // Disable delete functionality
            enableView={false} // Disable delete functionality

            onPageChange={handlePageChange}
            statusConfig={{
              enable: false
            }}
          />

         
        </div>
      </div>
    </div>
  );
};

export default Student_Crediential;


