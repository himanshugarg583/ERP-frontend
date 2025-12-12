import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import { toast, ToastContainer } from 'react-toastify';
import { BookOpen, GraduationCap, Users, FileText } from 'lucide-react';
import {
  getAllSubjectsClass,
  updateSubjectClass,
  deleteSubjectClass,
  addSubjects,
  fetchClassDropdown,
  fetchTeacherDropdown
} from '../../../helper/requests-method/apiMethods';
import 'react-toastify/dist/ReactToastify.css';

const AddSubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classOptions, setClassOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    uniqueSubjects: 0,
    assignedClasses: 0,
    assignedTeachers: 0,
  });

  useEffect(() => {
    fetchSubjects();
    loadDropdownData();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getAllSubjectsClass();
      const payload = Array.isArray(response?.subjects)
        ? response.subjects
        : Array.isArray(response?.data)
          ? response.data
          : [];
      
      const normalizedSubjects = payload.map((subject) => {
        const classSection = subject.class_section || subject.classSection || {};
        const teacher = subject.teacher || subject.teacherDetails || {};
        const classLabelParts = [];
        if (classSection.class_name) {
          classLabelParts.push(classSection.class_name);
        }
        if (classSection.section_name) {
          classLabelParts.push(classSection.section_name);
        }
        const classLabel = classLabelParts.join(' - ');

        const teacherName =
          teacher.name ||
          teacher.full_name ||
          teacher?.user?.name ||
          (teacher.user_id ? `Teacher #${teacher.user_id}` : '') ||
          (subject.teacher_id ? `Teacher #${subject.teacher_id}` : '');

        return {
          id: subject.id,
          subject_name: subject.subject_name || '',
          subject_code: subject.subject_code || '',
          class_section_id: subject.class_section_id ? subject.class_section_id.toString() : '',
          teacher_id: subject.teacher_id ? subject.teacher_id.toString() : '',
          class_name: classSection.class_name || '',
          section_name: classSection.section_name || '',
          class_section_label: classLabel || 'N/A',
          teacher_name: teacherName || 'N/A'
        };
      });

      setSubjects(normalizedSubjects);
      
      // Calculate stats
      const totalSubjects = normalizedSubjects.length;
      const uniqueSubjectNames = new Set(normalizedSubjects.map(s => s.subject_name)).size;
      const assignedClasses = new Set(normalizedSubjects.map(s => s.class_section_id).filter(Boolean)).size;
      const assignedTeachers = new Set(normalizedSubjects.map(s => s.teacher_id).filter(Boolean)).size;
      
      setStats({
        totalSubjects,
        uniqueSubjects: uniqueSubjectNames,
        assignedClasses,
        assignedTeachers,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load subjects');
      setSubjects([]);
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

  const classSelectOptions = useMemo(
    () =>
      classOptions
        .map((cls) => ({
          value: cls.id ? cls.id.toString() : '',
          label: [cls.class_name, cls.section_name].filter(Boolean).join(' - ') || `Class ${cls.id}`
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

  // Define columns for subject management
  const subjectColumns = useMemo(
    () => [
      {
        key: 'subject_name',
        header: 'Subject Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Mathematics',
        render: (value) => value || 'N/A'
      },
      {
        key: 'subject_code',
        header: 'Subject Code',
        type: 'text',
        required: true,
        placeholder: 'e.g. MATH101',
        render: (value) => value || 'N/A'
      },
      {
        key: 'class_section_id',
        header: 'Class & Section',
        type: 'select',
        required: true,
        options: classSelectOptions,
        render: (value, item) => {
          if (item.class_section_label) {
            return item.class_section_label;
          }
          const normalizedValue = value !== undefined && value !== null ? value.toString() : '';
          const match = classSelectOptions.find((option) => option.value === normalizedValue);
          return match ? match.label : 'N/A';
        }
      },
      {
        key: 'teacher_id',
        header: 'Teacher',
        type: 'select',
        required: true,
        options: teacherSelectOptions,
        render: (value, item) => {
          if (item.teacher_name) {
            return item.teacher_name;
          }
          const normalizedValue = value !== undefined && value !== null ? value.toString() : '';
          const match = teacherSelectOptions.find((option) => option.value === normalizedValue);
          return match ? match.label : 'N/A';
        }
      }
    ],
    [classSelectOptions, teacherSelectOptions]
  );

  // Filter columns for table display
  const displayColumns = subjectColumns.filter(col => !col.hideInTable);

  // Handle create subject
  const handleCreateSubject = async (subjectData) => {
    try {
      setLoading(true);
      const payload = {
        subject_name: subjectData.subject_name?.trim(),
        subject_code: subjectData.subject_code?.trim(),
        class_section_id: subjectData.class_section_id ? Number(subjectData.class_section_id) : null,
        teacher_id: subjectData.teacher_id ? Number(subjectData.teacher_id) : null
      };

      const response = await addSubjects(payload);
      
      if (response.success || response.message) {
        await fetchSubjects();
        return { 
          success: true, 
          message: response.message || 'Subject created successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to create subject' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create subject' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle update subject
  const handleUpdateSubject = async (id, subjectData) => {
    try {
      setLoading(true);
      const payload = {
        subject_name: subjectData.subject_name?.trim(),
        subject_code: subjectData.subject_code?.trim(),
        class_section_id: subjectData.class_section_id ? Number(subjectData.class_section_id) : null,
        teacher_id: subjectData.teacher_id ? Number(subjectData.teacher_id) : null
      };

      const response = await updateSubjectClass(id, payload);
      
      if (response.success || response.message) {
        await fetchSubjects();
        return { 
          success: true, 
          message: response.message || 'Subject updated successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to update subject' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update subject' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle delete subject
  const handleDeleteSubject = async (id) => {
    try {
      setLoading(true);
      const response = await deleteSubjectClass(id);
      
      if (response.success || response.message) {
        await fetchSubjects();
        return { 
          success: true, 
          message: response.message || 'Subject deleted successfully!' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to delete subject' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete subject' 
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
              name="Total Subjects" 
              icon={BookOpen} 
              value={stats.totalSubjects.toLocaleString()} 
              color="#7c3aed"
            />
            <StandardStatCard 
              name="Unique Subjects" 
              icon={FileText} 
              value={stats.uniqueSubjects.toLocaleString()} 
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
              icon={Users} 
              value={stats.assignedTeachers.toLocaleString()} 
              color="#f59e0b"
            />
          </div>

          <ReusableTable
            title="Subject Management"
            initialData={subjects}
            columns={subjectColumns}
            displayColumns={displayColumns}
            apiFunction={handleCreateSubject}
            updateApiFunction={handleUpdateSubject}
            deleteApiFunction={handleDeleteSubject}
            searchPlaceholder="Search by subject name, code, class, teacher"
            addButtonText="Add New Subject"
            exportFileName="subjects"
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

export default AddSubjectPage;
