import React, { useState } from 'react';
import { FaBars, FaSearch, FaBell, FaEnvelope, FaUser , FaCog, FaSignOutAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const OnlineLearningHeader = ({ setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailCount, setMailCount] = useState(5);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setIsNotificationOpen((prev) => !prev);
  };

  const handleMailClick = () => {
    setMailCount(0);
    setIsMailOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate('/OnlineLearningProfile'); 
    setIsDropdownOpen(false); 
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <FaBars
          className="text-2xl cursor-pointer hover:text-indigo-600 transition-colors block md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
        <h2 className="ml-4 text-lg font-semibold">Learning Portal</h2>
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative w-48">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <button
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors relative"
            onClick={handleNotificationClick}
          >
            <FaBell size={24} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-40">
              <div className="p-2">No new notifications</div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors relative"
            onClick={handleMailClick}
          >
            <FaEnvelope size={24} />
            {mailCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {mailCount}
              </span>
            )}
          </button>
          {isMailOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-40">
              <div className="p-2">No new messages</div>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            <img
              src="https://randomuser.me/api/portraits/men/44.jpg"
              alt="Profile"
              className="h-8 w-8 rounded-full border-2 border-transparent"
            />
            <span className="ml-2 text-sm">User  Name</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-40 p-2">
              <ul className="text-sm">
                <li 
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                  onClick={handleProfileClick}>
                  <FaUser  className="mr-2 text-gray-600" />
                  My Profile
                </li>
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaCog className="mr-2 text-gray-600" />
                  Settings
                </li>
                <li className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                  <FaSignOutAlt className="mr-2 text-red-600" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default OnlineLearningHeader;