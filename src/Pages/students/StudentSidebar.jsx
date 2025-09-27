import React from 'react';
import { FaTachometerAlt, FaCheckCircle, FaBook, FaClipboardList, FaArrowUp, FaClipboardCheck, FaBell, FaBullhorn, FaBus, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './StudentSidebar.css'; // Import the CSS file

const StudentSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
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
          <h1 className="ml-3 text-xl font-bold">Student Portal</h1>
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
      { name: 'Dashboard', path: '/StudentDashboard', icon: <FaTachometerAlt /> },
      { name: 'Attendance', path: '/studentattendance', icon: <FaCheckCircle /> },
      { name: 'Subjects', path: '/studentsubjects', icon: <FaBook /> },
      { name: 'Assignments', path: '/studentassignments', icon: <FaClipboardList /> },
      { name: 'Results', path: '/studentresults', icon: <FaClipboardCheck /> },
      { name: 'Progress', path: '/studentprogress', icon: <FaBell /> },
      { name: 'Transport', path: '/studenttransport', icon: <FaBus /> },
    ].map((item, index) => (
      <li key={index}>
        <a
          href={item.path}
          className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.name}</span>
        </a>
      </li>
    ))}
  </ul>
</nav>


        {/* Footer */}
        <div className="mt-auto pt-5">
          <div className="border-t border-gray-700">
            <a 
              href="#settings" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <span className="mr-3"><FaCog /></span>
              <span>Settings</span>
            </a>
            <a 
              href="#logout" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;