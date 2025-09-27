// SuperAdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaSchool, FaClipboardList, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';

const SuperAdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/superAdminDash' },
    { name: 'Schools', icon: <FaSchool />, path: '/superAdminSchool' },
    { name: 'School List', icon: <FaUsers />, path: '/superAdminSchoolList' },
    { name: 'Admins', icon: <FaUsers />, path: '/superAdminDetails' },
    { name: 'Reports', icon: <FaClipboardList />, path: '/superAdminReports' },
    { name: 'Analytics', icon: <FaChartLine />, path: '/superAdminAnalytics' },
  ];

  return (
    <div
      className={`sticky top-0 left-0 w-64 h-screen bg-gray-800 text-white p-5 flex flex-col shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <FaTachometerAlt className="text-3xl" />
          <h1 className="ml-3 text-xl font-bold">Super Admin Portal</h1>
        </div>
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-inner">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label={item.name}
                >
 <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-5">
          <div className="border-t border-gray-700">
            <Link 
              to="/settings" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
              aria-label="Settings"
            >
              <span className="mr-3"><FaCog /></span>
              <span>Settings</span>
            </Link>
            <Link 
              to="/logout" 
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
              aria-label="Logout"
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

export default SuperAdminSidebar;