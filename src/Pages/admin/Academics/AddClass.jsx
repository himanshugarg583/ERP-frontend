import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CreateClass from '../../../components/academics/CreateClass';
import CommonTable from '../../../components/tables/CommonTable';
import CommonFilter from '../../../components/tables/CommonFilter';
import ClassDetailView from '../../../components/academics/ClassDetailView';
import { getAllClassSections, updateClassSection, deleteClassSection, fetchTeacherDropdown } from '../../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddClass = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClass, setEditClass] = useState(null);
  const [deleteClass, setDeleteClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const itemsPerPage = 10;

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await getAllClassSections();
      if (response.success && response.data) {
        // Map the response data
        const mappedClasses = response.data.map(cls => ({
          id: cls.id,
          class_name: cls.class_name || '-',
          section_name: cls.section_name || '-',
          room_No: cls.room_No || '-',
          capacity: cls.capacity || '-',
          teacher_id: cls.teacher_id || null,
          teacher_name: cls.teacher_name || '-',
        }));
        setClasses(mappedClasses);
        setFilteredClasses(mappedClasses);
      } else {
        toast.error('Failed to fetch classes');
        setClasses([]);
        setFilteredClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error(error.response?.data?.message || 'Error fetching classes');
      setClasses([]);
      setFilteredClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teachers for dropdown
  const fetchTeachers = async () => {
    try {
      const response = await fetchTeacherDropdown();
      if (response && response.success && response.data) {
        const validTeachers = response.data.filter(teacher => 
          teacher.teacherDetails && teacher.teacherDetails.id
        );
        setTeacherOptions(validTeachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

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
    { key: 'room_No', header: 'Room No', type: 'text', required: false, placeholder: 'e.g. 101' },
    { key: 'capacity', header: 'Capacity', type: 'number', required: false, placeholder: 'e.g. 30', min: 1 },
    { key: 'teacher_name', header: 'Teacher Name', type: 'text', required: false, placeholder: 'e.g. Rahul Sharma' },
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

  // Handle edit class
  const handleEditClass = (classItem) => {
    setEditClass({ ...classItem });
    setIsEditModalOpen(true);
  };

  // Handle update class
  const handleUpdateClass = async () => {
    if (!editClass) return;

    try {
      // Prepare payload - only include fields that are being updated
      const payload = {};
      if (editClass.class_name) payload.class_name = editClass.class_name;
      if (editClass.section_name) payload.section_name = editClass.section_name;
      if (editClass.teacher_id) payload.teacher_id = parseInt(editClass.teacher_id);

      if (Object.keys(payload).length === 0) {
        toast.error('Please update at least one field');
        return;
      }

      const response = await updateClassSection(editClass.id, payload);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Class updated successfully');
        setIsEditModalOpen(false);
        setEditClass(null);
        fetchClasses(); // Refresh classes list
      } else {
        toast.error('Failed to update class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error(error.response?.data?.message || 'Error updating class');
    }
  };

  // Handle delete class
  const handleDeleteClass = (classItem) => {
    setDeleteClass(classItem);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteClass) return;

    try {
      const response = await deleteClassSection(deleteClass.id);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Class deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteClass(null);
        fetchClasses(); // Refresh classes list
      } else {
        toast.error('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error(error.response?.data?.message || 'Error deleting class');
    }
  };

  // Handle class added (refresh list)
  const handleClassAdded = () => {
    fetchClasses();
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
          <ToastContainer position="top-right" autoClose={3000} />
          <CreateClass onClassAdded={handleClassAdded} />
          
          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Class Filters"
          />

          {/* Table Component */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Loading classes...</p>
            </div>
          ) : (
            <CommonTable
              title="Class Management"
              columns={classColumns}
              data={filteredClasses}
              createApi={null}
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
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onView={handleViewClass}
              onPageChange={handlePageChange}
              loading={isLoading}
            />
          )}
        </div>

        {/* Class Detail View Modal */}
        <ClassDetailView
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          classData={selectedClass}
        />

        {/* Edit Class Modal */}
        {isEditModalOpen && editClass && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-semibold mb-4">Edit Class</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    value={editClass.class_name || ''}
                    onChange={(e) => setEditClass({ ...editClass, class_name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g. Class 6"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Section Name</label>
                  <input
                    type="text"
                    value={editClass.section_name || ''}
                    onChange={(e) => setEditClass({ ...editClass, section_name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g. A"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Teacher</label>
                  <select
                    value={editClass.teacher_id || ''}
                    onChange={(e) => setEditClass({ ...editClass, teacher_id: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Teacher (Optional)</option>
                    {teacherOptions.map((teacher) => (
                      <option key={teacher.teacherDetails.id} value={teacher.teacherDetails.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditClass(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClass}
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && deleteClass && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">Delete Class</h2>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this class?
              </p>
              
              <div className="bg-gray-50 p-3 rounded mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class:</span> {deleteClass.class_name} - {deleteClass.section_name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Room:</span> {deleteClass.room_No || '-'}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteClass(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClass;