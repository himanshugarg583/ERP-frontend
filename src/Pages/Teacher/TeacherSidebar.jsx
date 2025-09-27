import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaTachometerAlt, FaCheckCircle, FaBook, FaClipboardList, FaTable, FaClipboardCheck, FaBell, FaBullhorn, FaBus, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './TeacherSidebar.css'; // Import the CSS file

const TeacherSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 h-screen bg-gray-800 text-white p-5 flex flex-col shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <FaTachometerAlt className="text-3xl" />
          <h1 className="ml-3 text-xl font-bold">Teacher Portal</h1>
        </div>
        {/* Close button - only visible on mobile */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation with Scrollbar */}
      <div className="flex-1 overflow-y-auto sidebar-inner">
        <nav>
          <ul className="space-y-2">
            {[
              { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/teacherPortal' },
              { name: 'Attendance', icon: <FaCheckCircle />, path: '/teacherAttendance' },
              { name: 'Subjects', icon: <FaBook />, path: '/teacherSubjects' },
              { name: 'Assignment', icon: <FaClipboardList />, path: '/teacherAssignment' },
              { name: 'Timetable', icon: <FaTable />, path: '/teacherTimetable' },
              { name: 'Results', icon: <FaClipboardCheck />, path: '/teacherResult' },
              { name: 'Notice', icon: <FaBell />, path: '/teacherNotice' },
              { name: 'Communications', icon: <FaBullhorn />, path: '/communications' },
              { name: 'Transport', icon: <FaBus />, path: '/teacherTransportation' },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path} // Use Link to navigate
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                  onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-5">
          <div className="border-t border-gray-700">
            <Link 
              to="/settings" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <span className="mr-3"><FaCog /></span>
              <span>Settings</span>
            </Link>
            <Link 
              to="/logout" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;