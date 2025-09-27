import React, { useState } from 'react';
import StudentNavbar from './StudentNavbar';
import StudentSidebar from './StudentSidebar';
import { FaChevronDown, FaExclamationTriangle, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUpload, FaEye, FaTachometerAlt, FaTasks, FaCalendar, FaUser } from 'react-icons/fa';

const StudentAssignment = () => {
  const [filter, setFilter] = useState('All');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showTeacherInfo, setShowTeacherInfo] = useState(null);
  const [showMarks, setShowMarks] = useState({});

  const assignments = [
    { id: 1, title: 'Calculus Problems', subject: 'Mathematics', status: 'Overdue', dueDate: 'May 10, 2023', description: 'Complete problems 1-20 from Chapter 5', color: 'red-500', teacher: { name: 'Mr. Smith', email: 'smith@school.com' } },
    { id: 2, title: 'Lab Report', subject: 'Science', status: 'Due Soon', dueDate: 'May 15, 2023', description: 'Write up the lab experiment findings', color: 'yellow-500', teacher: { name: 'Ms. Johnson', email: 'johnson@school.com' } },
    { id: 3, title: 'Programming Project', subject: 'Computer Science', status: 'Due Soon', dueDate: 'May 16, 2023', description: 'Create a simple web application', color: 'yellow-500', teacher: { name: 'Mr. Davis', email: 'davis@school.com' } },
    { id: 4, title: 'Essay Analysis', subject: 'English', status: 'Submitted', dueDate: 'May 5, 2023', description: 'Literary analysis of "To Kill a Mockingbird"', color: 'green-500', grade: '92/100', feedback: 'Excellent analysis, good use of examples', teacher: { name: 'Mrs. Wilson', email: 'wilson@school.com' } },
    { id: 5, title: 'History Research', subject: 'History', status: 'Submitted', dueDate: 'May 1, 2023', description: 'Research on World War II events', color: 'green-500', grade: '88/100', feedback: 'Good research, needs more primary sources', teacher: { name: 'Mr. Brown', email: 'brown@school.com' } },
    { id: 6, title: 'Portfolio Project', subject: 'Art', status: 'Upcoming', dueDate: 'May 25, 2023', description: 'Create a portfolio of 5 original artworks', color: 'blue-500', teacher: { name: 'Ms. Taylor', email: 'taylor@school.com' } }
  ];

  const handleFileUpload = (assignmentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [assignmentId]: file.name }));
      alert(`File "${file.name}" uploaded successfully for assignment ${assignmentId}`);
    }
  };

  const handleOverdueClick = (assignment) => {
    setShowTeacherInfo(assignment.id);
    alert(`Assignment Overdue!\n\nThe assignment "${assignment.title}" is overdue. Please contact your teacher, ${assignment.teacher.name} (${assignment.teacher.email}), to discuss submission options.`);
  };

  const toggleMarks = (id) => setShowMarks(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredAssignments = assignments.filter(assignment => filter === 'All' || assignment.status === filter);

  const buttonClasses = "w-full flex justify-center items-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow-md";

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md md:left-64">
        <StudentNavbar />
      </div>

      <div className="flex flex-1">
        <div className="fixed top-0 bottom-0 w-64 hidden md:block z-30 bg-white shadow-lg">
          <StudentSidebar />
        </div>

        <main className="flex-1 md:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
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
                  key={assignment.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`p-1 bg-${assignment.color}`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{assignment.subject}</p>
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
                      {assignment.status === 'Overdue' && !uploadedFiles[assignment.id] ? (
                        <button 
                          onClick={() => handleOverdueClick(assignment)}
                          className={`${buttonClasses} bg-red-400 text-white hover:from-red-700 hover:to-red-800`}
                        >
                          <FaExclamationTriangle className="mr-2" />
                          Contact Teacher
                        </button>
                      ) : assignment.status !== 'Submitted' && !uploadedFiles[assignment.id] ? (
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

                      {showTeacherInfo === assignment.id && assignment.status === 'Overdue' && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
                          <p className="text-sm font-medium">Teacher: {assignment.teacher.name}</p>
                          <p className="text-sm">Email: {assignment.teacher.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-50 shadow-lg">
        <div className="flex justify-around">
          {[
            { icon: FaTachometerAlt, label: 'Dashboard' },
            { icon: FaTasks, label: 'Assignments', active: true },
            { icon: FaCalendar, label: 'Calendar' },
            { icon: FaUser, label: 'Profile' }
          ].map(({ icon: Icon, label, active }) => (
            <a 
              key={label}
              href="#" 
              className={`flex flex-col items-center p-2 ${active ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
            >
              <Icon />
              <span className="text-xs mt-1">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignment;