import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import { getAllClassSections, updateClassSection, fetchClassDropdown, fetchTeacherDropdown } from '../../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import { Users, GraduationCap, UserCheck, Calendar } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const AssignClass = () => {
  const [classTeachers, setClassTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classOptions, setClassOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    assignedClasses: 0,
    assignedTeachers: 0,
  });

  useEffect(() => {
    fetchClassTeachers();
    loadDropdownData();
  }, []);

  // Fetch class teacher assignments from API
  const fetchClassTeachers = async () => {
    try {
      setLoading(true);
      const response = await getAllClassSections();
      if (response.success && response.data) {
        // Map class sections to class teacher assignments
        const mappedAssignments = response.data.map(cls => ({
          id: cls.id,
          class_section: `${cls.class_name}-${cls.section_name}`,
          class_name: cls.class_name || '-',
          section_name: cls.section_name || '-',
          teacher_id: (cls.teacher_id || (cls.classTeacher && cls.classTeacher.id))
            ? (cls.teacher_id || (cls.classTeacher && cls.classTeacher.id)).toString()
            : '',
          teacher_name: cls.classTeacher?.User?.name || cls.teacher_name || 'Not Assigned',
          phone: cls.classTeacher?.mobile_no || cls.teacher_phone || cls.phone || '',
          email: cls.classTeacher?.User?.email || cls.teacher_email || cls.email || '',
          assigned_date: cls.created_at || cls.updated_at || new Date().toISOString().split('T')[0],
          status: (cls.teacher_id || (cls.classTeacher && cls.classTeacher.id)) ? 'active' : 'inactive',
          room_No: cls.room_No || '',
          capacity: cls.capacity || '',
        }));
        setClassTeachers(mappedAssignments);
        calculateStats(mappedAssignments);
      } else {
        toast.error('Failed to fetch class teacher assignments');
        setClassTeachers([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching class teacher assignments');
      setClassTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const classResponse = await fetchClassDropdown();
      if (classResponse?.success && Array.isArray(classResponse.data)) {
        setClassOptions(classResponse.data);
      } else {
        setClassOptions([]);
      }
    } catch (error) {
      toast.error('Failed to load classes');
      setClassOptions([]);
    }

    try {
      const teacherResponse = await fetchTeacherDropdown();
      if (teacherResponse?.success && Array.isArray(teacherResponse.data)) {
        const validTeachers = teacherResponse.data.filter(
          (teacher) => teacher.teacherDetails && teacher.teacherDetails.id
        );
        setTeacherOptions(validTeachers);
      } else {
        setTeacherOptions([]);
      }
    } catch (error) {
      toast.error('Failed to load teachers');
      setTeacherOptions([]);
    }
  };

  const calculateStats = (data) => {
    const totalAssignments = data.length;
    const activeAssignments = data.filter(item => item.status === 'active').length;
    const assignedClasses = new Set(data.map(item => `${item.class_name}-${item.section_name}`)).size;
    const assignedTeachers = new Set(data.map(item => item.teacher_id).filter(Boolean)).size;
    
    setStats({
      totalAssignments,
      activeAssignments,
      assignedClasses,
      assignedTeachers,
    });
  };

  const classSelectOptions = useMemo(
    () =>
      classOptions
        .map((cls) => ({
          value: `${cls.class_name}-${cls.section_name}`,
          label: `${cls.class_name} - ${cls.section_name}`
        }))
        .filter((option) => option.value),
    [classOptions]
  );

  const teacherSelectOptions = useMemo(
    () =>
      teacherOptions
        .map((teacher) => ({
          value: teacher.teacherDetails?.id ? teacher.teacherDetails.id.toString() : '',
          label: teacher.name || teacher.teacherDetails?.name || `Teacher ${teacher.teacherDetails?.id}`
        }))
        .filter((option) => option.value),
    [teacherOptions]
  );

  // Define columns for class teacher management
  const classTeacherColumns = useMemo(() => [
    { 
      key: 'class_section', 
      header: 'Class & Section', 
      required: true,
      type: 'select',
      readOnlyOnEdit: true,
      options: classSelectOptions,
      placeholder: 'Select Class & Section',
      render: (value, item) => {
        if (item.class_name && item.section_name) {
          return `${item.class_name} - ${item.section_name}`;
        }
        return value || 'N/A';
      }
    },
    { 
      key: 'class_name', 
      header: 'Class Name', 
      required: false,
      type: 'text',
      readOnlyOnEdit: true,
      hideInTable: true
    },
    { 
      key: 'section_name', 
      header: 'Section', 
      required: false,
      type: 'text',
      readOnlyOnEdit: true,
      hideInTable: true
    },
    { 
      key: 'teacher_id', 
      header: 'Teacher', 
      required: true,
      type: 'select',
      options: teacherSelectOptions,
      placeholder: 'Select Teacher',
      render: (value, item) => {
        if (item.teacher_name) {
          return item.teacher_name;
        }
        const match = teacherSelectOptions.find(opt => opt.value === value?.toString());
        return match ? match.label : 'N/A';
      }
    },
    { 
      key: 'teacher_name', 
      header: 'Teacher Name', 
      required: false,
      type: 'text',
      hideInEdit: true,
      hideInTable: true
    },
    { 
      key: 'phone', 
      header: 'Phone', 
      required: false,
      type: 'text',
      hideInEdit: true,
      placeholder: 'e.g. 9876543210',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'email', 
      header: 'Email', 
      required: false,
      type: 'email',
      hideInEdit: true,
      placeholder: 'e.g. teacher@school.com',
      render: (value) => value || 'N/A'
    },
  ], [classSelectOptions, teacherSelectOptions]);

  // Filter columns for table display
  const displayColumns = classTeacherColumns.filter(col => !col.hideInTable);

  // Handle create class teacher assignment
  const handleCreateClassTeacher = async (data) => {
    try {
      setLoading(true);
      
      // Parse class_section to get class_name and section_name
      const [class_name, section_name] = data.class_section ? data.class_section.split('-') : ['', ''];
      
      // Find the class section ID from classOptions
      const selectedClass = classOptions.find(
        cls => cls.class_name === class_name.trim() && cls.section_name === section_name.trim()
      );
      
      if (!selectedClass || !selectedClass.id) {
        return { 
          success: false, 
          message: 'Class section not found' 
        };
      }
      
      // Update the class section with teacher assignment
      const payload = {
        teacher_id: parseInt(data.teacher_id)
      };
      
      const response = await updateClassSection(selectedClass.id, payload);
      
      if (response.success || response.message) {
        await fetchClassTeachers(); // Refresh data from API
        return { 
          success: true, 
          message: response.message || 'Class teacher assigned successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to assign class teacher' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to assign class teacher' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle update class teacher assignment
  const handleUpdateClassTeacher = async (id, data) => {
    try {
      setLoading(true);
      
      // Prepare payload for updating class section
      const payload = {};
      
      // If teacher_id is provided, update it
      if (data.teacher_id) {
        payload.teacher_id = parseInt(data.teacher_id);
      }
      
      // If class_section is changed, we need to find the new class section
      // But typically we only update the teacher assignment, not the class itself
      // So we'll just update the teacher_id for the existing class section
      
      const response = await updateClassSection(id, payload);
      
      if (response.success || response.message) {
        await fetchClassTeachers(); // Refresh data from API
        return { 
          success: true, 
          message: response.message || 'Class teacher assignment updated successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to update class teacher assignment' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update class teacher assignment' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle delete class teacher assignment (remove teacher from class)
  const handleDeleteClassTeacher = async (id) => {
    try {
      setLoading(true);
      
      // Remove teacher assignment by setting teacher_id to null
      const payload = {
        teacher_id: null
      };
      
      const response = await updateClassSection(id, payload);
      
      if (response.success || response.message) {
        await fetchClassTeachers(); // Refresh data from API
        return { 
          success: true, 
          message: response.message || 'Class teacher assignment removed successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to remove class teacher assignment' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove class teacher assignment' 
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
              name="Total Assignments" 
              icon={Users} 
              value={stats.totalAssignments.toLocaleString()} 
              color="#7c3aed"
            />
            <StandardStatCard 
              name="Active Assignments" 
              icon={UserCheck} 
              value={stats.activeAssignments.toLocaleString()} 
              color="#10b981"
            />
            <StandardStatCard 
              name="Assigned Classes" 
              icon={GraduationCap} 
              value={stats.assignedClasses.toLocaleString()} 
              color="#3b82f6"
            />
            <StandardStatCard 
              name="Assigned Teachers" 
              icon={Calendar} 
              value={stats.assignedTeachers.toLocaleString()} 
              color="#f59e0b"
            />
          </div>

          <ReusableTable
            title="Class Teacher Management"
            initialData={classTeachers}
            columns={classTeacherColumns}
            displayColumns={displayColumns}
            apiFunction={handleCreateClassTeacher}
            updateApiFunction={handleUpdateClassTeacher}
            deleteApiFunction={handleDeleteClassTeacher}
            searchPlaceholder="Search by class, section, teacher name"
            addButtonText="Assign Class Teacher"
            exportFileName="class_teachers"
            loading={loading}
            showActions={{
              add: true,
              edit: true,
              delete: false,
              view: true
            }}
          />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AssignClass;
