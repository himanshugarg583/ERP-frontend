import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CommonTable from '../../../components/tables/CommonTable';
import CommonFilter from '../../../components/tables/CommonFilter';
import AddSubjectForm from '../../../components/academics/AddSubjectForm';
import { toast } from 'react-toastify';
import {
  getAllSubjectsClass,
  updateSubjectClass,
  deleteSubjectClass,
  fetchClassDropdown,
  fetchTeacherDropdown
} from '../../../helper/requests-method/apiMethods';

const AddSubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const itemsPerPage = 10;

  const fetchSubjects = useCallback(async () => {
    setTableLoading(true);
    try {
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
      setFilteredSubjects(normalizedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error(error?.response?.data?.message || 'Failed to load subjects');
    } finally {
      setTableLoading(false);
    }
  }, []);

  const loadDropdownData = useCallback(async () => {
    try {
      const classResponse = await fetchClassDropdown();
      if (classResponse?.success && Array.isArray(classResponse.data)) {
        setClassOptions(classResponse.data);
      } else {
        setClassOptions([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
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
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
      setTeacherOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    loadDropdownData();
  }, [fetchSubjects, loadDropdownData]);

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

  const subjectColumns = useMemo(
    () => [
      {
        key: 'subject_name',
        header: 'Subject Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Mathematics'
      },
      {
        key: 'subject_code',
        header: 'Subject Code',
        type: 'text',
        required: true,
        placeholder: 'e.g. MATH101'
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

  const filterFields = useMemo(
    () => [
      { key: 'subject_name', label: 'Subject Name', type: 'text', placeholder: 'Search by subject name' },
      { key: 'class_section_id', label: 'Class & Section', type: 'select', options: classSelectOptions },
      { key: 'teacher_id', label: 'Teacher', type: 'select', options: teacherSelectOptions }
    ],
    [classSelectOptions, teacherSelectOptions]
  );

  const handleUpdateSubject = useCallback(
    async (id, data) => {
      const payload = {
        subject_name: data.subject_name?.trim(),
        subject_code: data.subject_code?.trim(),
        class_section_id: data.class_section_id ? Number(data.class_section_id) : null,
        teacher_id: data.teacher_id ? Number(data.teacher_id) : null
      };

      try {
        const response = await updateSubjectClass(id, payload);
        if (response?.success) {
          await fetchSubjects();
        }
        return response;
      } catch (error) {
        console.error('Error updating subject:', error);
        throw error;
      }
    },
    [fetchSubjects]
  );

  const handleDeleteSubject = useCallback(async (id) => {
    try {
      const response = await deleteSubjectClass(id);
      if (response?.success) {
        setSubjects((prev) => prev.filter((subject) => subject.id !== id));
        setFilteredSubjects((prev) => prev.filter((subject) => subject.id !== id));
      }
      return response;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...subjects];

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'subject_name') {
            return item.subject_name && item.subject_name.toLowerCase().includes(filters[key].toLowerCase());
          }
          if (key === 'class_section_id' || key === 'teacher_id') {
            return item[key]?.toString() === filters[key]?.toString();
          }
          return false;
        });
      }
    });

    setFilteredSubjects(filtered);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredSubjects(subjects);
  };

  // Handle subject addition from form component
  const handleSubjectAdded = () => {
    fetchSubjects();
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
            createApi={null}
            updateApi={handleUpdateSubject}
            deleteApi={handleDeleteSubject}
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
            loading={tableLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddSubjectPage;
