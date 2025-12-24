import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { 
  fetchAllClassesForAttendance,
  getStudentReport,
  getParentReport,
  getStudentCredentials,
  getClassWiseStudentStats
} from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import { FileText, Users, Key, GraduationCap, ArrowLeft, UserCheck, UserX } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import 'react-toastify/dist/ReactToastify.css';

const StudentReports = () => {
  const [selectedReportType, setSelectedReportType] = useState(null); // 'student-report', 'parent-report', 'student-credentials'
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [classStats, setClassStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="mb-4 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Class Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Class:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.class_name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Section:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.section_name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Room No:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.room_no || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Total Students:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.total_students || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
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
                <tr key={student.student_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.name || 'N/A'}</td>
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="mb-4 pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Class Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Class:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.class_name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Section:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.section_name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Room No:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.class_info?.room_no || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Total Students:</span>
              <span className="ml-2 font-medium text-slate-800">
                {reportData.total_students || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
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
                <tr key={student.student_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.student_name || 'N/A'}</td>
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

    // Find the stats for the selected class
    const selectedClassStat = classStats.find(
      (stat) => stat.class_name === reportData.class_info?.class_name && 
                 stat.section_name === reportData.class_info?.section_name
    );

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Class Stats - Show stats for selected class only */}
        {selectedClassStat && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>
        )}

        {/* Credentials Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Class Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Class:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {reportData.class_info?.class_name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Section:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {reportData.class_info?.section_name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Total Students:</span>
                <span className="ml-2 font-medium text-slate-800">
                  {reportData.total_students || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
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
                  <tr key={student.user_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.name || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.roll_number || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{student.email || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 font-mono">{student.password || 'N/A'}</td>
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
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <ToastContainer />
          <div className="space-y-4 md:space-y-6">
            {/* Report Type Cards */}
            {!selectedReportType ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <button
                  onClick={() => handleReportTypeClick('student-report')}
                  className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:border-violet-400 p-6 md:p-8 transition-all cursor-pointer text-center group"
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-600 group-hover:text-violet-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-violet-700 mb-2">
                    Student Report
                  </h3>
                  <p className="text-sm text-slate-600">View detailed student information</p>
                </button>

                <button
                  onClick={() => handleReportTypeClick('parent-report')}
                  className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:border-violet-400 p-6 md:p-8 transition-all cursor-pointer text-center group"
                >
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-600 group-hover:text-violet-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-violet-700 mb-2">
                    Parent Report
                  </h3>
                  <p className="text-sm text-slate-600">View parent information by class</p>
                </button>

                <button
                  onClick={() => handleReportTypeClick('student-credentials')}
                  className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:border-violet-400 p-6 md:p-8 transition-all cursor-pointer text-center group"
                >
                  <Key className="w-12 h-12 mx-auto mb-4 text-slate-600 group-hover:text-violet-600" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-violet-700 mb-2">
                    Student Credentials
                  </h3>
                  <p className="text-sm text-slate-600">View student login credentials</p>
                </button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Class Selection */}
                {!selectedClass ? (
                  <>
                    {/* Back Button - Only show when selecting classes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                      <button
                        onClick={handleBackToReports}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reports
                      </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                      <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Select a Class</h2>
                      {loadingClasses ? (
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
                  </>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {/* Back to Classes Button and Class Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleBackToClasses}
                          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          ← Back to Classes
                        </button>
                        <div>
                          <h2 className="text-lg md:text-xl font-semibold text-slate-800">{selectedClass.display_name}</h2>
                          <p className="text-sm text-slate-600">
                            {selectedReportType === 'student-report' && 'Student Report'}
                            {selectedReportType === 'parent-report' && 'Parent Report'}
                            {selectedReportType === 'student-credentials' && 'Student Credentials'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Report Content */}
                    {loadingReport ? (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <div className="text-center py-8 text-slate-500">Loading report...</div>
                      </div>
                    ) : (
                      <>
                        {selectedReportType === 'student-report' && renderStudentReport()}
                        {selectedReportType === 'parent-report' && renderParentReport()}
                        {selectedReportType === 'student-credentials' && renderStudentCredentials()}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentReports;
