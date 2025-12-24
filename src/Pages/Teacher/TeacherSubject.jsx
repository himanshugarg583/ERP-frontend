import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherSubjectAllocation } from '../../helper/requests-method/apiMethods';

const SubjectCard = ({ subject }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{subject.subject_name}</h3>
            <p className="text-indigo-200 text-sm font-medium">{subject.subject_code}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <FaBook className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Class Information */}
        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <FaGraduationCap className="text-indigo-600 flex-shrink-0" size={18} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 mb-1">Class</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{subject.class_display}</p>
          </div>
        </div>

        {/* Student Strength */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <FaUsers className="text-gray-600 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">Student Strength</p>
            <p className="text-sm font-semibold text-gray-800">{subject.student_strength || 0} Students</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">Subject ID: {subject.subject_id}</span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

const TeacherSubject = () => {
  const [loading, setLoading] = useState(false);
  const [subjectData, setSubjectData] = useState(null);
  const [subjects, setSubjects] = useState([]);

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
        // Set all subjects directly without grouping
        setSubjects(response.data.subjects || []);
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

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
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
                <p className="mt-4 text-gray-600">Loading subjects...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                      <FaChalkboardTeacher className="text-indigo-600" />
                      My Subjects
                    </h1>
                    {subjectData && (
                      <p className="text-gray-600">
                        Total Subjects: <span className="font-semibold text-indigo-600">{subjectData.total_subjects || subjects.length}</span>
                      </p>
                    )}
                  </div>
                  
                  {/* Summary Cards */}
                  {subjectData && (
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-xs text-gray-600">Total Subjects</p>
                        <p className="text-lg font-bold text-indigo-600">{subjectData.total_subjects || 0}</p>
                      </div>
                      {subjects.length > 0 && (
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-xs text-gray-600">Total Classes</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {new Set(subjects.map(s => s.class_section_id)).size}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects Grid */}
              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {subjects.map((subject, index) => (
                    <SubjectCard key={subject.subject_id || index} subject={subject} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Subjects Allocated</h3>
                  <p className="text-gray-500">You don't have any subjects assigned yet.</p>
                </div>
              )}

              {/* Summary Table (Optional - can be hidden or shown based on preference) */}
              {subjects.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaBook className="text-indigo-600" />
                      Subject Summary
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject Code</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Class</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Strength</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subjects.map((subject, idx) => (
                          <tr key={subject.subject_id || idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FaBook className="text-indigo-500 mr-2" size={16} />
                                <span className="text-sm font-medium text-gray-900">{subject.subject_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{subject.subject_code}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{subject.class_display}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-600">
                                <FaUsers className="mr-2 text-gray-400" size={14} />
                                {subject.student_strength || 0}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherSubject;
