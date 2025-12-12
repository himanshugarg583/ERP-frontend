import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { fetchAllClassesForAttendance, fetchStudentsByClass, generateIdCard, generateMultipleIdCards } from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import { IdCard, GraduationCap } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const StudentIdPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass(selectedClass.id);
    } else {
      setStudents([]);
      setSelectedStudents([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetchAllClassesForAttendance();
      if (response.success && response.data && response.data.classes) {
        const mappedClasses = response.data.classes.map((classItem) => ({
          id: classItem.id,
          class_name: classItem.class_name,
          section_name: classItem.section_name || '',
          display_name: `${classItem.class_name}${classItem.section_name ? ` - ${classItem.section_name}` : ''}`,
        }));
        setClasses(mappedClasses);
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

  const fetchStudentsForClass = async (classId) => {
    try {
      setLoadingStudents(true);
      const response = await fetchStudentsByClass(classId);
      if (response.success && response.data && response.data.students) {
        const mappedStudents = response.data.students.map((student) => ({
          id: student.id,
          user_id: student.user_id || student.User?.id || student.id,
          name: student.User?.name || student.student_name || 'Unknown',
          email: student.User?.email || '',
          roll_number: student.roll_number || '',
          class_name: student.ClassSection?.class_name || '',
          section_name: student.ClassSection?.section_name || '',
        }));
        setStudents(mappedStudents);
        setSelectedStudents([]);
      } else {
        toast.error('Failed to fetch students');
        setStudents([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching students');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length && students.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.user_id));
    }
  };

  const handleGenerateSingle = async (user_id) => {
    try {
      setIsGenerating(true);
      const response = await generateIdCard(user_id);
      if (response.success) {
        toast.success(response.message || 'ID card generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate ID card');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating ID card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBulk = async () => {
    if (selectedStudents.length === 0) {
      toast.warning('Please select at least one student');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateMultipleIdCards(selectedStudents);
      if (response.success && response.data) {
        if (response.data.missing_user_ids && response.data.missing_user_ids.length > 0) {
          toast.warning(
            `Generated ${response.data.total_found} cards. ${response.data.missing_user_ids.length} student(s) not found.`
          );
        } else {
          toast.success(response.message || 'ID cards generated successfully!');
        }
        setSelectedStudents([]);
      } else {
        toast.error(response.message || 'Failed to generate ID cards');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating ID cards');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {/* Class Cards */}
            {!selectedClass ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Select a Class</h2>
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading classes...</div>
                ) : classes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No classes found</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClass(cls)}
                        className="p-4 bg-slate-50 hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-400 rounded-lg transition-all cursor-pointer text-center group"
                      >
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-600 group-hover:text-violet-600" />
                        <div className="text-sm font-medium text-slate-800 group-hover:text-violet-700">
                          {cls.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Back Button and Class Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClass(null)}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        ← Back to Classes
                      </button>
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-slate-800">{selectedClass.display_name}</h2>
                        <p className="text-sm text-slate-600">Select students to generate ID cards</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Students</h3>
                    {students.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSelectAll}
                          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          {selectedStudents.length === students.length && students.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedStudents.length > 0 && (
                          <button
                            onClick={handleGenerateBulk}
                            disabled={isGenerating}
                            className="px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isGenerating ? 'Generating...' : 'Generate Selected'}
                            <IdCard className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {loadingStudents ? (
                    <div className="text-center py-8 text-slate-500">Loading students...</div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No students found for this class</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700 w-12">
                              <input
                                type="checkbox"
                                checked={selectedStudents.length === students.length && students.length > 0}
                                onChange={handleSelectAll}
                                className="cursor-pointer"
                              />
                            </th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Name</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Roll Number</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Email</th>
                            <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(student.user_id)}
                                  onChange={() => handleStudentSelect(student.user_id)}
                                  className="cursor-pointer"
                                />
                              </td>
                              <td className="px-3 py-2 text-sm text-slate-800">{student.name}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{student.roll_number}</td>
                              <td className="px-3 py-2 text-sm text-slate-600">{student.email}</td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() => handleGenerateSingle(student.user_id)}
                                  disabled={isGenerating}
                                  className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Generate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StudentIdPage;
