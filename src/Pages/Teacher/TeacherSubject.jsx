import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaQuestionCircle, FaComments, FaBook, FaEdit, FaSave, FaPlus, FaCheck, FaChevronLeft, FaUsers } from 'react-icons/fa';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherSubjectAllocation } from '../../helper/requests-method/apiMethods';

const ClassCard = ({ cls, onClick }) => {
  // Group subjects by class
  const subjectsByClass = cls.subjects.reduce((acc, subject) => {
    const key = `${subject.class_name}_${subject.section_name}`;
    if (!acc[key]) {
      acc[key] = {
        class_display: subject.class_display,
        class_name: subject.class_name,
        section_name: subject.section_name,
        subjects: [],
        total_students: subject.student_strength,
      };
    }
    acc[key].subjects.push(subject);
    return acc;
  }, {});

  const classGroups = Object.values(subjectsByClass);

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{cls.name}</h2>
          <p className="text-sm text-gray-600 mt-1">Total Subjects: {cls.subjects.length}</p>
        </div>
        <FaBook className="text-3xl text-indigo-600 opacity-75" />
      </div>
      
      {classGroups.map((group, idx) => (
        <div key={idx} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">{group.class_display}</p>
            <div className="flex items-center text-xs text-gray-500">
              <FaUsers className="mr-1" />
              <span>{group.total_students} students</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.subjects.map((subject, subIdx) => (
              <span 
                key={subIdx} 
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium"
              >
                {subject.subject_name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SubjectDetailCard = ({ subject }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{subject.subject_name}</h3>
      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
        {subject.subject_code}
      </span>
    </div>
    <div className="space-y-1 text-sm text-gray-600">
      <p><span className="font-medium">Class:</span> {subject.class_display}</p>
      <p><span className="font-medium">Students:</span> {subject.student_strength}</p>
    </div>
  </div>
);

const TeacherSubject = () => {
  const [loading, setLoading] = useState(false);
  const [subjectData, setSubjectData] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [groupedClasses, setGroupedClasses] = useState([]);

  // Fetch teacher subject allocation on mount
  useEffect(() => {
    fetchSubjectAllocation();
  }, []);

  const fetchSubjectAllocation = async () => {
    try {
      setLoading(true);
      const response = await getTeacherSubjectAllocation();
      if (response.success && response.data) {
        setSubjectData(response.data);
        // Group subjects by class
        groupSubjectsByClass(response.data.subjects);
      } else {
        toast.error(response.message || 'Failed to fetch subject allocation');
      }
    } catch (error) {
      console.error('Failed to fetch subject allocation:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subject allocation');
    } finally {
      setLoading(false);
    }
  };

  const groupSubjectsByClass = (subjects) => {
    // Group by class_section_id
    const grouped = subjects.reduce((acc, subject) => {
      const key = subject.class_section_id;
      if (!acc[key]) {
        acc[key] = {
          id: subject.class_section_id,
          name: subject.class_display,
          class_name: subject.class_name,
          section_name: subject.section_name,
          subjects: [],
          total_students: subject.student_strength,
        };
      }
      acc[key].subjects.push(subject);
      return acc;
    }, {});

    setGroupedClasses(Object.values(grouped));
  };

  const getSelectedClassData = () => {
    if (!selectedClass || !subjectData) return null;
    return groupedClasses.find(cls => cls.id === selectedClass.id);
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

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

        <main className="w-full px-4 md:px-6 py-6">
          <ToastContainer position="top-right" autoClose={3000} />
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading subject allocation...</p>
              </div>
            </div>
          ) : !selectedClass ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Subjects</h1>
                {subjectData && (
                  <p className="text-gray-600">
                    Total Subjects: <span className="font-semibold">{subjectData.total_subjects}</span>
                  </p>
                )}
              </div>
              
              {groupedClasses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {groupedClasses.map((cls) => (
                    <ClassCard 
                      key={cls.id} 
                      cls={{
                        ...cls,
                        name: cls.name,
                        section: cls.section_name,
                        strength: cls.total_students,
                        subjects: cls.subjects,
                      }} 
                      onClick={() => setSelectedClass(cls)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No subjects allocated yet</p>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium"
                onClick={() => setSelectedClass(null)}
              >
                <FaChevronLeft /> Back to Classes
              </button>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedClass.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaUsers className="mr-1" />
                      {selectedClass.total_students} Students
                    </span>
                    <span className="flex items-center">
                      <FaBook className="mr-1" />
                      {selectedClass.subjects.length} Subjects
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Subject Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClass.subjects.map((subject, idx) => (
                      <SubjectDetailCard key={idx} subject={subject} />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Subject Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                          <th className="p-4 font-semibold">Subject Name</th>
                          <th className="p-4 font-semibold">Subject Code</th>
                          <th className="p-4 font-semibold">Class</th>
                          <th className="p-4 font-semibold">Student Strength</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClass.subjects.map((subject, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-800 font-medium">{subject.subject_name}</td>
                            <td className="p-4 text-gray-600">{subject.subject_code}</td>
                            <td className="p-4 text-gray-600">{subject.class_display}</td>
                            <td className="p-4 text-gray-600">{subject.student_strength}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherSubject;
