import React, { useState } from "react";
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import AssignClassTeacherForm from "../../../components/academics/AssignClassTeacherForm";
import CommonTable from "../../../components/tables/CommonTable";
import CommonFilter from "../../../components/tables/CommonFilter";
import { classTeacherData } from '../../../data.js';
const AssignClass = () => {
  const [classTeachers, setClassTeachers] = useState(classTeacherData);
  const [filteredClassTeachers, setFilteredClassTeachers] = useState(classTeacherData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Define columns for class teacher management
  const classTeacherColumns = [
    {
      key: 'count',
      header: 'S.No',
      type: 'text',
      render: (value, item, index) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return startIndex + index + 1;
      },
      required: false
    },
    { key: 'class_name', header: 'Class Name', type: 'text', required: true, placeholder: 'e.g. Class 7' },
    { key: 'section_name', header: 'Section', type: 'text', required: true, placeholder: 'e.g. A' },
    { key: 'teacher_name', header: 'Teacher Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
    { key: 'phone', header: 'Phone', type: 'text', required: true, placeholder: 'e.g. 9876543210' },
    { key: 'email', header: 'Email', type: 'email', required: true, placeholder: 'e.g. rahul@example.com' },
    { key: 'assigned_date', header: 'Assigned Date', type: 'date', required: true }
  ];

  // Filter fields for class teacher
  const filterFields = [
    { key: 'class_name', label: 'Class Name', type: 'select', options: [
      { value: 'Class 7', label: 'Class 7' },
      { value: 'Class 8', label: 'Class 8' },
      { value: 'Class 9', label: 'Class 9' },
      { value: 'Class 10', label: 'Class 10' },
      { value: 'Class 11', label: 'Class 11' },
      { value: 'Class 12', label: 'Class 12' }
    ]},
    { key: 'section_name', label: 'Section', type: 'select', options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' }
    ]},
    { key: 'teacher_name', label: 'Teacher Name', type: 'text', placeholder: 'Search by teacher name' }
  ];

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...classTeachers];

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'teacher_name') {
            return item.teacher_name && item.teacher_name.toLowerCase().includes(filters[key].toLowerCase());
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredClassTeachers(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredClassTeachers(classTeachers);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle class teacher assignment from form component
  const handleClassTeacherAssigned = (newAssignment) => {
    const updatedClassTeachers = [...classTeachers, newAssignment];
    setClassTeachers(updatedClassTeachers);
    setFilteredClassTeachers(updatedClassTeachers);
  };

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
        
        <div className="flex-1 p-6">
          {/* Assign Class Teacher Form Component */}
          <AssignClassTeacherForm onClassTeacherAssigned={handleClassTeacherAssigned} />
          
          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Class Teacher Filters"
          />

          {/* Table Component */}
          <CommonTable
            title="Class Teacher Management"
            columns={classTeacherColumns}
            data={filteredClassTeachers}
            createApi={null}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search class teachers..."
            addButtonText="Assign Class Teacher"
            exportFileName="class_teachers"
            itemsPerPage={itemsPerPage}
            enableSearch={true}
            enablePagination={true}
            enableAdd={false}
            enableEdit={true}
            enableDelete={true}
            enableView={true}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AssignClass;