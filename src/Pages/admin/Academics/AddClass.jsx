import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CreateClass from '../../../components/academics/CreateClass';
import CommonTable from '../../../components/tables/CommonTable';
import CommonFilter from '../../../components/tables/CommonFilter';
import ClassDetailView from '../../../components/academics/ClassDetailView';
import { createClass } from '../../../helper/requests-method/apiMethods';
import { classData } from '../../../data.js';

const AddClass = () => {
  const [classes] = useState(classData);
  const [filteredClasses, setFilteredClasses] = useState(classData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const itemsPerPage = 10;

  // Define columns for class management
  const classColumns = [
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
    { key: 'room_No', header: 'Room No', type: 'text', required: true, placeholder: 'e.g. 101' },
    { key: 'capacity', header: 'Capacity', type: 'number', required: true, placeholder: 'e.g. 30', min: 1 },
    { key: 'teacher_name', header: 'Teacher Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
    // { key: 'status', header: 'Status', type: 'select', required: true, options: [
    //   { value: 'active', label: 'Active' },
    //   { value: 'inactive', label: 'Inactive' }
    // ]}
  ];

  // Filter fields for class
  const filterFields = [
    { key: 'class_name', label: 'Class Name', type: 'text', placeholder: 'Search by class name' },
    { key: 'section_name', label: 'Section', type: 'select', options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' }
    ]},
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]}
  ];

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...classes];

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'class_name') {
            return item.class_name && item.class_name.toLowerCase().includes(filters[key].toLowerCase());
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredClasses(classes);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle view class details
  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
    setIsViewModalOpen(true);
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedClass(null);
  };

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
        
        <div className="flex-1 p-4 md:p-6">
          <CreateClass />
          
          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Class Filters"
          />

          {/* Table Component */}
          <CommonTable
            title="Class Management"
            columns={classColumns}
            data={filteredClasses}
            createApi={createClass}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search classes..."
            addButtonText="Add Class"
            exportFileName="classes"
            itemsPerPage={itemsPerPage}
            enableSearch={true}
            enablePagination={true}
            enableAdd={false}
            enableEdit={true}
            enableDelete={true}
            enableView={true}
            onView={handleViewClass}
            onPageChange={handlePageChange}
            statusConfig={{
              enable: true,
              field: 'status',
              activeValue: 'active',
              inactiveValue: 'inactive',
              activeColor: 'green',
              inactiveColor: 'red'
            }}
          />
        </div>

        {/* Class Detail View Modal */}
        <ClassDetailView
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          classData={selectedClass}
        />
      </div>
    </div>
  );
};

export default AddClass;