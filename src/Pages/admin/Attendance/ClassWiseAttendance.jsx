import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import StandardStatCard from "../../../components/comman_components/StandardStatCard";
import { Users, Calendar, Clock, ChevronLeft, Check, X, UserCheck } from "lucide-react";
import { fetchAllClassesForAttendance, fetchStudentsByClass, markAttendance, getHolidayByDate, getAdminClassAttendanceByDate } from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClassWiseAttendance = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [holidayInfo, setHolidayInfo] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const checkHoliday = async () => {
      try {
        const response = await getHolidayByDate(selectedDate);
        if (response?.success && response?.data) {
          setHolidayInfo(response.data.holiday || response.data);
        } else {
          setHolidayInfo(null);
        }
      } catch (_error) {
        setHolidayInfo(null);
      }
    };
    checkHoliday();
    
    if (activeClass) {
      loadAttendanceForClassAndDate(activeClass, selectedDate);
    }
  }, [activeClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllClassesForAttendance();
      if (response.success && response.data && response.data.classes) {
        const mappedClasses = response.data.classes.map((classItem) => ({
          id: classItem.id,
          name: `${classItem.class_name}${classItem.section_name ? ` - ${classItem.section_name}` : ''}`,
          class_name: classItem.class_name,
          section_name: classItem.section_name || '',
          subject: classItem.classTeacher?.User?.name || 'No Teacher Assigned',
          teacherName: classItem.classTeacher?.User?.name || null,
          roomNo: classItem.room_No || null,
          totalStudents: classItem.total_students ?? 0,
          students: [],
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
      setIsLoading(false);
    }
  };

  const fetchStudentsForClass = async (classId) => {
    try {
      setIsLoadingStudents(true);
      const response = await fetchStudentsByClass(classId);
      if (response.success && response.data && response.data.students) {
        const mappedStudents = response.data.students.map((student) => ({
          id: student.id,
          student_id: student.id,
          name: student.User?.name || 'Unknown',
          rollNo: student.roll_number || '',
          present: false,
        }));
        setStudents(mappedStudents);
        
        setAttendanceData((prevData) => ({
          ...prevData,
          [classId]: mappedStudents.map((student) => ({
            ...student,
            present: false,
          })),
        }));
        setIsEditingExisting(false);
      } else {
        toast.error('Failed to fetch students');
        setStudents([]);
        setIsEditingExisting(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching students');
      setStudents([]);
      setIsEditingExisting(false);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const loadAttendanceForClassAndDate = async (classId, date) => {
    try {
      setIsLoadingStudents(true);
      const response = await getAdminClassAttendanceByDate(classId, date);

      if (response.success && response.data?.attendance && response.data.attendance.length > 0) {
        const mappedStudents = response.data.attendance.map((student) => ({
          id: student.student_id,
          student_id: student.student_id,
          name: student.student_name || 'Unknown',
          rollNo: student.roll_number || '',
          present: student.status === 'present',
        }));

        setStudents(mappedStudents);
        setAttendanceData((prevData) => ({
          ...prevData,
          [classId]: mappedStudents,
        }));
        setIsEditingExisting(true);
      } else {
        await fetchStudentsForClass(classId);
      }
    } catch (_error) {
      await fetchStudentsForClass(classId);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleClassClick = (classId) => {
    setActiveClass(classId);
  };

  const handleAttendanceChange = (classId, studentId, isPresent) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[classId]) {
        updatedData[classId] = updatedData[classId].map((student) =>
          student.id === studentId
            ? { ...student, present: isPresent }
            : student
        );
      }
      return updatedData;
    });
  };

  const handleAllPresent = (classId) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[classId]) {
        updatedData[classId] = updatedData[classId].map((student) => ({
          ...student,
          present: true,
        }));
      }
      return updatedData;
    });
  };

  const calculateAttendanceStats = (classId) => {
    if (!attendanceData[classId])
      return { total: 0, present: 0, absent: 0, percentage: 0 };

    const total = attendanceData[classId].length;
    const present = attendanceData[classId].filter(
      (student) => student.present
    ).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  const handleSaveAttendance = async () => {
    if (!activeClass || !attendanceData[activeClass]) {
      toast.error('No attendance data to save');
      return;
    }

    try {
      const holidayResponse = await getHolidayByDate(selectedDate);
      if (holidayResponse?.success && holidayResponse?.data) {
        const holidayInfo = holidayResponse.data.holiday || holidayResponse.data;
        toast.error(`Attendance blocked: ${selectedDate} is a holiday (${holidayInfo.reason || 'Holiday'})`);
        return;
      }
    } catch (_error) {
      // Continue when date is not a holiday or API returns not-found.
    }

    try {
      setIsSaving(true);
      const attendancePayload = {
        class_section_id: activeClass,
        date: selectedDate,
        attendances: attendanceData[activeClass].map((student) => ({
          student_id: student.student_id || student.id,
          status: student.present ? 'present' : 'absent',
        })),
      };

      const response = await markAttendance(attendancePayload);
      
      if (response.success || response.message) {
        toast.success(response.message || (isEditingExisting ? 'Attendance updated successfully' : 'Attendance marked successfully'));
        await loadAttendanceForClassAndDate(activeClass, selectedDate);
      } else {
        toast.error('Failed to mark attendance');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === activeClass);
  const stats = activeClass ? calculateAttendanceStats(activeClass) : null;

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
          {activeClass ? (
            // Student Attendance View
            <div className="space-y-6">
              {/* Stats Cards - At the Top */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StandardStatCard 
                    name="Total Students" 
                    icon={Users} 
                    value={stats.total.toString()} 
                    color="#7c3aed"
                  />
                  <StandardStatCard 
                    name="Present" 
                    icon={UserCheck} 
                    value={stats.present.toString()} 
                    color="#10b981"
                  />
                  <StandardStatCard 
                    name="Absent" 
                    icon={X} 
                    value={stats.absent.toString()} 
                    color="#ef4444"
                  />
                  <StandardStatCard 
                    name="Attendance Rate" 
                    icon={Check} 
                    value={`${stats.percentage}%`} 
                    color="#f59e0b"
                  />
                </div>
              )}

              {/* Combined Card: Header, Date/Time, Buttons, and Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveClass(null)}
                        className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                          {selectedClass?.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Teacher: {selectedClass?.subject}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} />
                        <span>
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                  {holidayInfo ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Calendar className="text-amber-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-amber-800 font-bold text-sm sm:text-base">
                          Today is a Holiday!
                        </p>
                        <p className="text-amber-700 text-xs sm:text-sm">
                          Reason: {holidayInfo.reason || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <button
                        onClick={() => handleAllPresent(activeClass)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base"
                      >
                        <Check size={18} />
                        Mark All Present
                      </button>
                      <button 
                        onClick={handleSaveAttendance}
                        disabled={isSaving}
                        className={`px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base ${
                          isSaving 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {isSaving ? 'Saving...' : isEditingExisting ? 'Update Attendance' : 'Save Attendance'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Students Table Section */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          No.
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Roll No
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoadingStudents ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            Loading students...
                          </td>
                        </tr>
                      ) : attendanceData[activeClass]?.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No students found in this class
                          </td>
                        </tr>
                      ) : (
                        attendanceData[activeClass]?.map((student, index) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.rollNo || '-'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(
                                      activeClass,
                                      student.id,
                                      true
                                    )
                                  }
                                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    student.present
                                      ? "bg-green-500 text-white ring-2 ring-green-300"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                  title="Mark Present"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(
                                      activeClass,
                                      student.id,
                                      false
                                    )
                                  }
                                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    !student.present
                                      ? "bg-red-500 text-white ring-2 ring-red-300"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                  title="Mark Absent"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // Class Selection View
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Attendance Management
                </h2>
                <p className="text-sm text-gray-600">
                  Select a class to mark attendance
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-600">Loading classes...</div>
                </div>
              ) : classes.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-600">No classes found</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                      onClick={() => handleClassClick(classItem.id)}
                    >
                      <div className="bg-linear-to-r from-violet-600 to-violet-700 p-4">
                        <h3 className="text-white text-base sm:text-lg font-semibold">
                          {classItem.name}
                        </h3>
                        <p className="text-violet-100 text-xs sm:text-sm mt-1">
                          Teacher: {classItem.subject}
                        </p>
                        {classItem.roomNo && (
                          <p className="text-violet-100 text-xs mt-1">
                            Room: {classItem.roomNo}
                          </p>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Users size={16} className="text-violet-600" />
                          <span className="text-sm text-gray-700">
                            {`${classItem.totalStudents} students`}
                          </span>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">
                            Click to mark attendance
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ClassWiseAttendance;

