import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CommonTable from '../../../components/tables/CommonTable';
import CommonFilter from '../../../components/tables/CommonFilter';
import AddSubjectForm from '../../../components/academics/AddSubjectForm';
import { addSubject } from '../../../helper/requests-method/apiMethods';
import { subjectData } from '../../../data.js';

const AddSubjectPage = () => {
  const [subjects, setSubjects] = useState(subjectData);
  const [filteredSubjects, setFilteredSubjects] = useState(subjectData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Define columns for subject management
  const subjectColumns = [
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
    { key: 'subject_name', header: 'Subject Name', type: 'text', required: true, placeholder: 'e.g. Mathematics' },
    { key: 'subject_code', header: 'Subject Code', type: 'text', required: true, placeholder: 'e.g. MATH101' },
    { key: 'class_name', header: 'Class', type: 'text', required: true, placeholder: 'e.g. Class 7' },
    { key: 'section_name', header: 'Section', type: 'text', required: true, placeholder: 'e.g. A' },
    { key: 'teacher_name', header: 'Teacher Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' }
  ];

  // Filter fields for subject
  const filterFields = [
    { key: 'subject_name', label: 'Subject Name', type: 'text', placeholder: 'Search by subject name' },
    { key: 'class_name', label: 'Class', type: 'select', options: [
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
    ]}
  ];

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...subjects];

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'subject_name') {
            return item.subject_name && item.subject_name.toLowerCase().includes(filters[key].toLowerCase());
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredSubjects(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredSubjects(subjects);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle subject addition from form component
  const handleSubjectAdded = (newSubject) => {
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    setFilteredSubjects(updatedSubjects);
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
          {/* Add Subject Form Component */}
          <AddSubjectForm onSubjectAdded={handleSubjectAdded} />

          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Subject Filters"
          />

          {/* Table Component */}
          <CommonTable
            title="Subject Management"
            columns={subjectColumns}
            data={filteredSubjects}
            createApi={addSubject}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search subjects..."
            addButtonText="Add Subject"
            exportFileName="subjects"
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
};

export default AddSubjectPage;