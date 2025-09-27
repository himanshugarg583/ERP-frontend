import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaUser, FaCog, FaSignOutAlt, FaSearch, FaBook, FaCalendarAlt, FaBullhorn, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({ setIsSidebarOpen }) => {
    const [notificationCount, setNotificationCount] = useState(3);
    const [mailCount, setMailCount] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleNotificationClick = () => {
        setNotificationCount(0);
        setIsNotificationOpen((prev) => !prev);
    };

    const handleMailClick = () => {
        setMailCount(0);
        alert('Mail clicked!');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Sample notifications from StudentNavbar
    const notifications = [
        { id: 1, type: 'assignment', icon: <FaBook />, message: 'New Science assignment due on March 20', time: '2 hours ago' },
        { id: 2, type: 'event', icon: <FaCalendarAlt />, message: 'Sports Day scheduled for March 25', time: '1 day ago' },
        { id: 3, type: 'announcement', icon: <FaBullhorn />, message: 'School closed on March 22 for holiday', time: '3 days ago' },
    ];

    return (
        <header className="bg-white p-4 md:p-6 shadow-sm flex justify-between items-center sticky top-0 z-10 w-full">
            <div className="flex items-center">
                {/* Hamburger menu icon - Only shows on mobile/tablet */}
                <FaBars
                    className="text-2xl cursor-pointer hover:text-indigo-600 transition-colors block lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
                <h2 className="text-xl md:text-2xl font-bold ml-4 md:ml-8">Parent Dashboard</h2>
            </div>
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

                {/* Notification Icon with Popup */}
                <div className="relative">
                    <FaBell
                        className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                        size={40}
                        onClick={handleNotificationClick}
                    />
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                    {isNotificationOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 md:absolute md:inset-auto md:top-12 md:right-0 md:w-96 md:mt-2">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 md:max-w-none overflow-hidden">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                    <button
                                        onClick={() => setIsNotificationOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <li key={notification.id} className="p-4 flex items-start space-x-3 hover:bg-gray-50">
                                            <div className="text-xl text-indigo-600">{notification.icon}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mail Icon */}
                <div className="relative">
                    <FaEnvelope
                        className="text-gray-800 p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                        size={40}
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
                        <Link to="/ParentProfile" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaUser className="mr-2" /> My Profile
                        </Link>
                        <Link to="/ParentSetting" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaCog className="mr-2" /> Settings
                        </Link>
                        <a href="#logout" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </a>
                    </div>
                </details>
            </div>
        </header>
    );
};

export default Header;