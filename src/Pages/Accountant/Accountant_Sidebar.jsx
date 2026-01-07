import React from 'react';
import { FaHome, FaClipboardCheck, FaChartLine, FaCalendarAlt, FaClipboardList, FaMoneyBillWave, FaSchool, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import './Sidebar.css'; // Import the CSS file for the scrollbar styles
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../helper/requests-method/apiMethods';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            console.log('Logout Response:', response);
            
            // Clear token from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            
            // Navigate to login page
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        }
    };

    // Array of sidebar items with corresponding icons
    const sidebarItems = [
        { path: "/AccountantDashboard", label: "Dashboard", icon: <FaHome /> },
        { path: "/AccountantFeeManagement", label: "Fee Management", icon: <FaClipboardCheck /> },
        { path: "/AccountantStudentAccounts", label: "Student Accounts", icon: <FaChartLine /> },
        { path: "/AccountantExpenseManagement", label: "Income & Expense Management", icon: <FaCalendarAlt /> },
        { path: "/AccountantPayments", label: "Online Payments", icon: <FaMoneyBillWave /> },
        { path: "/AccountantChangePassword", label: "Change Password", icon: <FaLock /> },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 w-64 h-screen bg-gray-800 text-white p-5 flex flex-col shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                    <FaSchool className="text-3xl" />
                    <h1 className="ml-3 text-xl font-bold">Financial Portal</h1>
                </div>
                {/* Close button - only visible on mobile */}
                <button
                    className="lg:hidden text-white focus:outline-none"
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
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-red-600 transition-all duration-200 text-white cursor-pointer"
                >
                    <FaSignOutAlt className="mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;