import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import ReportHeading from "../../../components/comman_components/ReportHeading";
import {
  fetchAllClassesForAttendance,
  getStudentReport,
  getParentReport,
  getStudentCredentials,
  getClassWiseStudentStats
} from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import { Users, GraduationCap, ArrowLeft, UserCheck, UserX, BarChart3 } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import 'react-toastify/dist/ReactToastify.css';

const StudentReports = () => {
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [classStats, setClassStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const reportTypeCards = [
    {
      id: "student-report",
      title: "STUDENT REPORT",
      subtitle: "Student Report",
    },
    {
      id: "parent-report",
      title: "PARENT REPORT",
      subtitle: "Parent Report",
    },
    {
      id: "student-credentials",
      title: "STUDENT CREDENTIALS",
      subtitle: "Student Credentials",
    },
  ];

  useEffect(() => {
    if (selectedReportType) {
      fetchClasses();
      if (selectedReportType === 'student-credentials') {
        fetchClassStats();
      }
    }
  }, [selectedReportType]);

  useEffect(() => {
    if (selectedClass && selectedReportType) {
      fetchReportData();
    }
  }, [selectedClass, selectedReportType]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
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
      setLoadingClasses(false);
    }
  };

  const fetchClassStats = async () => {
    try {
      const response = await getClassWiseStudentStats();
      if (response.success && response.data) {
        setClassStats(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching class stats:', error);
    }
  };

  const fetchReportData = async () => {
    if (!selectedClass) return;

    try {
      setLoadingReport(true);
      let response;

      switch (selectedReportType) {
        case 'student-report':
          response = await getStudentReport(selectedClass.id);
          break;
        case 'parent-report':
          response = await getParentReport(selectedClass.id);
          break;
        case 'student-credentials':
          response = await getStudentCredentials(selectedClass.id);
          break;
        default:
          return;
      }

      if (response.success && response.data) {
        setReportData(response.data);
        toast.success(response.message || 'Report fetched successfully');
      } else {
        toast.error(response.message || 'Failed to fetch report');
        setReportData(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching report');
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleReportTypeClick = (reportType) => {
    setSelectedReportType(reportType);
    setSelectedClass(null);
    setReportData(null);
  };

  const handleBackToReports = () => {
    setSelectedReportType(null);
    setSelectedClass(null);
    setReportData(null);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setReportData(null);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '0000-00-00') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const renderStudentReport = () => {
    if (!reportData || !reportData.students) return null;

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Class Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Class</span>
              <span className="font-semibold text-indigo-700">
                {reportData.class_info?.class_name || 'N/A'}
              </span>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Section</span>
              <span className="font-semibold text-purple-700">
                {reportData.class_info?.section_name || 'N/A'}
              </span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Room No</span>
              <span className="font-semibold text-blue-700">
                {reportData.class_info?.room_no || 'N/A'}
              </span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Total Students</span>
              <span className="font-semibold text-green-700">
                {reportData.total_students || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Roll Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date of Birth</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Admission Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reportData.students.map((student, index) => (
                <tr key={student.student_id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{student.name || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.roll_number || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatDate(student.date_of_birth)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 capitalize">{student.gender || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.phone_no || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{student.address || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatDate(student.admission_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderParentReport = () => {
    if (!reportData || !reportData.students) return null;

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Class Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Class</span>
              <span className="font-semibold text-indigo-700">
                {reportData.class_info?.class_name || 'N/A'}
              </span>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Section</span>
              <span className="font-semibold text-purple-700">
                {reportData.class_info?.section_name || 'N/A'}
              </span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Room No</span>
              <span className="font-semibold text-blue-700">
                {reportData.class_info?.room_no || 'N/A'}
              </span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-slate-600 block mb-1">Total Students</span>
              <span className="font-semibold text-green-700">
                {reportData.total_students || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Roll Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Father Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Father Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Father Occupation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Mother Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Mother Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reportData.students.map((student, index) => (
                <tr key={student.student_id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{student.student_name || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.roll_number || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.father_name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.father_phone || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.father_occupation || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.mother_name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.mother_phone || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                    {student.parent_info?.email || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStudentCredentials = () => {
    if (!reportData || !reportData.students) return null;

    const selectedClassStat = classStats.find(
      (stat) => stat.class_name === reportData.class_info?.class_name &&
        stat.section_name === reportData.class_info?.section_name
    );

    return (
      <div className="space-y-6">
        {selectedClassStat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <StandardStatCard
              name="Total Students"
              icon={Users}
              value={selectedClassStat.total || 0}
              color="#6366f1"
            />
            <StandardStatCard
              name="Male Students"
              icon={UserCheck}
              value={selectedClassStat.male || 0}
              color="#3b82f6"
            />
            <StandardStatCard
              name="Female Students"
              icon={UserX}
              value={selectedClassStat.female || 0}
              color="#ec4899"
            />
          </motion.div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="mb-6 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Class Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <span className="text-slate-600 block mb-1">Class</span>
                <span className="font-semibold text-indigo-700">
                  {reportData.class_info?.class_name || 'N/A'}
                </span>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <span className="text-slate-600 block mb-1">Section</span>
                <span className="font-semibold text-purple-700">
                  {reportData.class_info?.section_name || 'N/A'}
                </span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="text-slate-600 block mb-1">Total Students</span>
                <span className="font-semibold text-green-700">
                  {reportData.total_students || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Roll Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {reportData.students.map((student, index) => (
                  <tr key={student.user_id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{student.name || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.roll_number || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.email || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 font-mono bg-slate-50 rounded px-2">{student.password || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex flex-col' style={{ height: '100vh', width: '100vw', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="flex-1 overflow-auto w-full py-6 px-4 md:px-6">
          <ToastContainer />

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Reports
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Generate and view various student reports
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Report Type Cards */}
            {!selectedReportType ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {reportTypeCards.map((card) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReportTypeClick(card.id)}
                    className="text-left"
                  >
                    <ReportHeading mainheading={card.title} subhading={card.subtitle} />
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Class Selection */}
                {!selectedClass ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                      <motion.button
                        whileHover={{ x: -4 }}
                        onClick={handleBackToReports}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reports
                      </motion.button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                      <h2 className="text-xl font-bold text-slate-800 mb-6">Select a Class</h2>
                      {loadingClasses ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-slate-600 font-medium">Loading classes...</p>
                        </div>
                      ) : classes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No classes found</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {classes.map((cls, index) => (
                            <motion.button
                              key={cls.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -4, scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedClass(cls)}
                              className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 hover:border-indigo-400 rounded-xl transition-all cursor-pointer text-center group"
                            >
                              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-indigo-600 group-hover:text-indigo-700" />
                              <div className="text-sm font-semibold text-slate-800">
                                {cls.display_name}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <motion.button
                          whileHover={{ x: -4 }}
                          onClick={handleBackToClasses}
                          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer font-medium"
                        >
                          ← Back to Classes
                        </motion.button>
                        <div className="text-right">
                          <h2 className="text-xl font-bold text-slate-800">{selectedClass.display_name}</h2>
                          <p className="text-sm text-slate-600 mt-1">
                            {selectedReportType === 'student-report' && 'Student Report'}
                            {selectedReportType === 'parent-report' && 'Parent Report'}
                            {selectedReportType === 'student-credentials' && 'Student Credentials'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {loadingReport ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
                      >
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-slate-600 font-medium">Loading report...</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {selectedReportType === 'student-report' && renderStudentReport()}
                        {selectedReportType === 'parent-report' && renderParentReport()}
                        {selectedReportType === 'student-credentials' && renderStudentCredentials()}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default StudentReports;
