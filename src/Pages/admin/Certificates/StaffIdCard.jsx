import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { getAllTeachers, generateStaffIdCard, generateMultipleStaffIdCards } from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import { IdCard, User } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const StaffIdCard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getAllTeachers();
      if (response.success && response.data) {
        const mappedTeachers = response.data.map((teacher) => ({
          id: teacher.id,
          user_id: teacher.id, // teacher_id is the user_id for staff
          name: teacher.name || 'Unknown',
          email: teacher.email || '',
          role: teacher.role || 'teacher',
          qualification: teacher.teacherDetails?.qualification || '',
          dob: teacher.teacherDetails?.dob || '',
          gender: teacher.teacherDetails?.gender || '',
          mobile_no: teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || '',
          current_address: teacher.teacherDetails?.currentaddress || '',
          permanent_address: teacher.teacherDetails?.permanentaddress || teacher.teacherDetails?.permenantaddress || '',
          joining_date: teacher.teacherDetails?.joining_date || '',
          image: teacher.teacherDetails?.image || null,
        }));
        setTeachers(mappedTeachers);
      } else {
        toast.error('Failed to fetch teachers');
        setTeachers([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers((prev) => {
      if (prev.includes(teacherId)) {
        return prev.filter((id) => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === teachers.length && teachers.length > 0) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(teachers.map((t) => t.user_id));
    }
  };

  const handleGenerateSingle = async (user_id) => {
    try {
      setIsGenerating(true);
      const response = await generateStaffIdCard(user_id);
      if (response.success) {
        toast.success(response.message || 'Staff ID card generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate staff ID card');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating staff ID card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBulk = async () => {
    if (selectedTeachers.length === 0) {
      toast.warning('Please select at least one teacher');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateMultipleStaffIdCards(selectedTeachers);
      if (response.success && response.data) {
        if (response.data.missing_user_ids && response.data.missing_user_ids.length > 0) {
          toast.warning(
            `Generated ${response.data.total_found} cards. ${response.data.missing_user_ids.length} teacher(s) not found.`
          );
        } else {
          toast.success(response.message || 'Staff ID cards generated successfully!');
        }
        setSelectedTeachers([]);
      } else {
        toast.error(response.message || 'Failed to generate staff ID cards');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating staff ID cards');
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
            {/* Teacher List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-800">Staff ID Card Generation</h2>
                  <p className="text-sm text-slate-600 mt-1">Select teachers to generate ID cards</p>
                </div>
                {teachers.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {selectedTeachers.length === teachers.length && teachers.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedTeachers.length > 0 && (
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

              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading teachers...</div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No teachers found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700 w-12">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.length === teachers.length && teachers.length > 0}
                            onChange={handleSelectAll}
                            className="cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Email</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Role</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Qualification</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Mobile</th>
                        <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedTeachers.includes(teacher.user_id)}
                              onChange={() => handleTeacherSelect(teacher.user_id)}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-800">
                            <div className="flex items-center gap-2">
                              {teacher.image ? (
                                <img
                                  src={teacher.image}
                                  alt={teacher.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                  <User className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <span>{teacher.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.email}</td>
                          <td className="px-3 py-2 text-sm text-slate-600 capitalize">{teacher.role}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.qualification || 'N/A'}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">{teacher.mobile_no || 'N/A'}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleGenerateSingle(teacher.user_id)}
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
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StaffIdCard;
