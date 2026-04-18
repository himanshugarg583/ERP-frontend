import React, { useEffect, useMemo, useState } from 'react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import ReusableTable from '../../components/comman_components/ReusableTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentSubjects } from '../../helper/requests-method/apiMethods';

const StudentSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getStudentSubjects();

      if (response.success && response.data) {
        const payload = response.data || {};
        const subjectList = Array.isArray(payload.subjects) ? payload.subjects : [];

        setSubjects(
          subjectList.map((subject, index) => ({
            id: index + 1,
            sr_no: index + 1,
            subject_name: subject.subject_name || 'N/A',
            subject_code: subject.subject_code || 'N/A',
            subject_type: subject.subject_type || 'N/A',
            teacher_name: subject.teacher_name || 'N/A',
            teacher_phone_number: subject.teacher_phone_number || 'N/A',
          }))
        );
      } else {
        toast.error(response.message || 'Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const subjectColumns = useMemo(
    () => [
      { key: 'sr_no', header: 'Sr No' },
      { key: 'subject_name', header: 'Subject Name' },
      { key: 'subject_code', header: 'Subject Code' },
      {
        key: 'subject_type',
        header: 'Type',
        render: (value) => (
          <span className="inline-block px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 font-medium capitalize">
            {value || 'N/A'}
          </span>
        ),
      },
      { key: 'teacher_name', header: 'Teacher Name' },
      { key: 'teacher_phone_number', header: 'Teacher Phone' },
    ],
    []
  );

  const readOnlyApi = async () => ({ success: true });



  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6 py-4 space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <ReusableTable
              title="Student Subjects"
              initialData={subjects}
              columns={subjectColumns}
              displayColumns={subjectColumns}
              apiFunction={readOnlyApi}
              searchPlaceholder="Search by subject, code, teacher"
              addButtonText="Add Subject"
              exportFileName="student-subjects"
              showActions={{
                add: false,
                edit: false,
                delete: false,
                view: false,
              }}
            />
          )}

          <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </div>
    </div>
  );
};

export default StudentSubject;