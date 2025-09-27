import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaSchool, FaVideo, FaClipboardList, FaBook, FaBullhorn, FaComments, FaUser  } from 'react-icons/fa';

const OnlineLearningSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/onlineLearningDash' },
    { name: 'My Classes', icon: <FaSchool />, path: '/onlineLearningClass' },
    { name: 'Live Classes', icon: <FaVideo />, path: '/onlineLearningLive', badge: '2', badgeColor: 'bg-red-500' },
    { name: 'Assignments', icon: <FaClipboardList />, path: '/onlineLearningAssignment', badge: '5', badgeColor: 'bg-amber-500' },
    { name: 'Profile & Settings', icon: <FaUser  />, path: '/profile' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-5 flex flex-col shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <FaTachometerAlt className="text-3xl" />
          <h1 className="ml-3 text-xl font-bold">Learning Portal</h1>
        </div>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar">
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
                  aria-label={item.name}>
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`${item.badgeColor} text-white text-xs px-2 py-1 rounded-full ml-auto`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default OnlineLearningSidebar;