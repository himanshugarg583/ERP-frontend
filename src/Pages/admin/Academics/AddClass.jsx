import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import { getAllClassSections, updateClassSection, deleteClassSection, createClass, fetchTeacherDropdown } from '../../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import { Users, Building2, UserCheck, GraduationCap } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const AddClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalCapacity: 0,
    assignedTeachers: 0,
    totalSections: 0,
  });

  // Fetch classes and teachers on mount
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getAllClassSections();
      if (response.success && response.data) {
        const mappedClasses = response.data.map(cls => ({
          id: cls.id,
          class_name: cls.class_name || '-',
          section_name: cls.section_name || '-',
          room_No: cls.room_No || '-',
          capacity: cls.capacity || '-',
          teacher_id: (cls.teacher_id || cls.classTeacher?.id) ? (cls.teacher_id || cls.classTeacher?.id).toString() : '',
          teacher_name: cls.classTeacher?.User?.name || cls.teacher_name || '-',
        }));
        setClasses(mappedClasses);
        
        // Calculate stats
        const totalClasses = mappedClasses.length;
        const totalCapacity = mappedClasses.reduce((sum, cls) => sum + (parseInt(cls.capacity) || 0), 0);
        const assignedTeachers = mappedClasses.filter(cls => cls.teacher_id).length;
        const uniqueSections = new Set(mappedClasses.map(cls => cls.section_name)).size;
        
        setStats({
          totalClasses,
          totalCapacity,
          assignedTeachers,
          totalSections: uniqueSections,
        });
      } else {
        toast.error('Failed to fetch classes');
        setClasses([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching classes');
      setClasses([]);
    } finally {
      setLoading(false);
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
      toast.error('Error fetching teachers');
    }
  };

  // Define columns for class management with dynamic teacher options
  const classColumns = [
    { 
      key: 'class_name', 
      header: 'Class Name', 
      required: true,
      type: 'text',
      placeholder: 'e.g. Class 7',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'section_name', 
      header: 'Section', 
      required: true,
      type: 'select',
      placeholder: 'Select Section',
      options: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
        { value: 'G', label: 'G' },
      ],
      render: (value) => value || 'N/A'
    },
    { 
      key: 'room_No', 
      header: 'Room No', 
      required: false,
      type: 'text',
      placeholder: 'e.g. 101',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'capacity', 
      header: 'Capacity', 
      required: false,
      type: 'number',
      placeholder: 'e.g. 30',
      min: 1,
      render: (value) => value ? `${value} students` : 'N/A'
    },
    { 
      key: 'teacher_id', 
      header: 'Teacher', 
      required: false,
      type: 'select',
      placeholder: 'Select Teacher',
      options: teacherOptions.map(teacher => ({
        value: teacher.teacherDetails.id.toString(),
        label: teacher.name
      })),
      hideInTable: true
    },
    { 
      key: 'teacher_name', 
      header: 'Teacher Name', 
      required: false,
      type: 'text',
      placeholder: 'Teacher Name',
      render: (value) => value || 'Not Assigned'
    },
  ];

  // Filter columns for table display
  const displayColumns = classColumns.filter(col => !col.hideInTable);

  // Handle create class
  const handleCreateClass = async (classData) => {
    try {
      setLoading(true);
      const payload = {
        class_name: classData.class_name,
        section_name: classData.section_name,
        room_no: classData.room_No || '',
        capacity: classData.capacity ? classData.capacity.toString() : '',
        teacher_id: classData.teacher_id || null,
      };

      const response = await createClass(payload);
      
      if (response.success || response.message) {
        await fetchClasses();
        return { 
          success: true, 
          message: response.message || 'Class created successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to create class' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create class' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle update class
  const handleUpdateClass = async (id, classData) => {
    try {
      setLoading(true);
      const payload = {};
      if (classData.class_name) payload.class_name = classData.class_name;
      if (classData.section_name) payload.section_name = classData.section_name;
      if (classData.room_No) payload.room_no = classData.room_No;
      if (classData.capacity) payload.capacity = classData.capacity.toString();
      if (classData.teacher_id) payload.teacher_id = parseInt(classData.teacher_id);

      const response = await updateClassSection(id, payload);
      
      if (response.success || response.message) {
        await fetchClasses();
        return { 
          success: true, 
          message: response.message || 'Class updated successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to update class' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update class' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle delete class
  const handleDeleteClass = async (id) => {
    try {
      setLoading(true);
      const response = await deleteClassSection(id);
      
      if (response.success || response.message) {
        await fetchClasses();
        return { 
          success: true, 
          message: response.message || 'Class deleted successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to delete class' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete class' 
      };
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-slate-200 flex h-screen overflow-hidden">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="max-w-full py-4 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StandardStatCard 
              name="Total Classes" 
              icon={GraduationCap} 
              value={stats.totalClasses.toLocaleString()} 
              color="#7c3aed"
            />
            <StandardStatCard 
              name="Total Capacity" 
              icon={Users} 
              value={stats.totalCapacity.toLocaleString()} 
              color="#10b981"
            />
            <StandardStatCard 
              name="Assigned Teachers" 
              icon={UserCheck} 
              value={stats.assignedTeachers.toLocaleString()} 
              color="#3b82f6"
            />
            <StandardStatCard 
              name="Total Sections" 
              icon={Building2} 
              value={stats.totalSections.toLocaleString()} 
              color="#f59e0b"
            />
          </div>

          <ReusableTable
            title="Class Management"
            initialData={classes}
            columns={classColumns}
            displayColumns={displayColumns}
            apiFunction={handleCreateClass}
            updateApiFunction={handleUpdateClass}
            deleteApiFunction={handleDeleteClass}
            searchPlaceholder="Search by class name, section, room number"
            addButtonText="Add New Class"
            exportFileName="classes"
            loading={loading}
            showActions={{
              add: true,
              edit: true,
              delete: true,
              view: true
            }}
          />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AddClass;
