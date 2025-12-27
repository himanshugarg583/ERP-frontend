import React, { useState, useEffect } from 'react';
import { fetchStudentAssignments } from '../../helper/requests-method/apiMethods';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { FaChevronDown, FaExclamationTriangle, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUpload, FaEye, FaTachometerAlt, FaTasks, FaCalendar, FaUser } from 'react-icons/fa';

const StudentAssignment = () => {
  const [filter, setFilter] = useState('All');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showTeacherInfo, setShowTeacherInfo] = useState(null);
  const [showMarks, setShowMarks] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchStudentAssignments();
        // API returns assignments in res.data.assignments (pending, overdue)
        let allAssignments = [];
        if (res?.data?.assignments) {
          if (Array.isArray(res.data.assignments.pending)) {
            allAssignments = allAssignments.concat(res.data.assignments.pending.map(a => ({ ...a, status: 'Pending', color: 'yellow-500' })));
          }
          if (Array.isArray(res.data.assignments.overdue)) {
            allAssignments = allAssignments.concat(res.data.assignments.overdue.map(a => ({ ...a, status: 'Overdue', color: 'red-500' })));
          }
        }
        setAssignments(allAssignments);
      } catch (err) {
        setError('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleFileUpload = (assignmentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [assignmentId]: file.name }));
      alert(`File "${file.name}" uploaded successfully for assignment ${assignmentId}`);
    }
  };



  const toggleMarks = (id) => setShowMarks(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredAssignments = assignments.filter(assignment => filter === 'All' || assignment.status === filter);

  const buttonClasses = "w-full flex justify-center items-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow-md";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold">Loading assignments...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold text-red-600">{error}</span>
      </div>
    );
  }
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

        <main className="w-full px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-end items-center mb-8">
              <div className="relative">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Graded">Graded</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {filteredAssignments.some(a => a.status === 'Overdue') && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-200 border-l-4 border-red-500 p-4 rounded-lg shadow-md flex items-start animate-pulse">
                <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
                <div>
                  <h3 className="font-bold text-red-800">Overdue Assignments</h3>
                  <p className="text-red-700">You have pending assignments that need attention!</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-4">
              {filteredAssignments.map(assignment => (
                <div 
                  key={assignment.assignment_id || assignment.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`p-1 bg-${assignment.color}`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{assignment.subject_name || assignment.subject}</p>
                      </div>
                      <span className={`bg-${assignment.color.split('-')[0]}-100 text-${assignment.color.split('-')[0]}-800 text-xs font-medium px-3 py-1 rounded-full`}>
                        {assignment.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <p className={`font-medium ${assignment.status === 'Overdue' ? 'text-red-600' : assignment.status === 'Due Soon' ? 'text-yellow-600' : ''}`}>
                          Due: {assignment.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaFileAlt className="text-gray-400 mr-2" />
                        <p>{assignment.description}</p>
                      </div>
                      {assignment.grade && showMarks[assignment.id] && (
                        <div className="flex items-center text-sm">
                          <FaFileAlt className="text-gray-400 mr-2" />
                          <p className="font-medium text-green-600">Grade: {assignment.grade}</p>
                        </div>
                      )}
                      {uploadedFiles[assignment.id] && (
                        <div className="flex items-center text-sm text-green-600">
                          <FaFileAlt className="text-gray-400 mr-2" />
                          <span>Uploaded: {uploadedFiles[assignment.id]}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 space-y-3">
                      {assignment.status !== 'Submitted' && !uploadedFiles[assignment.id] ? (
                        <label className={`${buttonClasses} bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700`}>
                          <FaUpload className="mr-2" />
                          Upload Assignment
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(assignment.id, e)}
                          />
                        </label>
                      ) : assignment.status === 'Submitted' ? (
                        <button 
                          onClick={() => toggleMarks(assignment.id)}
                          className={`${buttonClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300`}
                        >
                          <FaEye className="mr-2" />
                          {showMarks[assignment.id] ? 'Hide Marks' : 'View Marks'}
                        </button>
                      ) : null}


                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentAssignment;