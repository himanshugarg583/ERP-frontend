import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaUser, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const StaffHeader = () => {
    const [notificationCount, setNotificationCount] = useState(3);
    const [mailCount, setMailCount] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    const handleNotificationClick = () => {
        setNotificationCount(0);
        alert('Notifications clicked!');
    };

    const handleMailClick = () => {
        setMailCount(0);
        alert('Mail clicked!');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header className="bg-white p-4 md:p-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl md:text-2xl font-bold">School Management </h2>
            <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search Bar */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Notification Icon */}
                <div className="relative">
                    <FaBell
                        className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                        size={40} // Set size in pixels
                        onClick={handleNotificationClick}
                    />
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </div>

                {/* Mail Icon */}
                <div className="relative">
                    <FaEnvelope
                        className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                        size={40} // Set size in pixels
                        onClick={handleMailClick}
                    />
                    {mailCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {mailCount}
                        </span>
                    )}
                </div>

                {/* Profile Dropdown */}
                <details className="relative">
                    <summary className="flex items-center space-x-2 cursor-pointer list-none outline-none">
                        <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">Parent</p>
                        </div>
                    </summary>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <a href="#profile" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaUser className="mr-2" /> My Profile
                        </a>
                        <a href="#settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaCog className="mr-2" /> Settings
                        </a>
                        <a href="#logout" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </a>
                    </div>
                </details>
            </div>
        </header>
    );
};

export default StaffHeader;