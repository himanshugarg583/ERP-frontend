import React from 'react';
import { FaHome, FaClipboardCheck, FaChartLine, FaCalendarAlt, FaClipboardList, FaMoneyBillWave, FaSchool } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import './Sidebar.css'; // Import the CSS file for the scrollbar styles
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    // Array of sidebar items with corresponding icons
    const sidebarItems = [
        { path: "/AccountantDashboard", label: "Dashboard", icon: <FaHome /> },
        { path: "/AccountantFeeManagement", label: "Fee Management", icon: <FaClipboardCheck /> },
        { path: "/AccountantStudentAccounts", label: "Student Accounts", icon: <FaChartLine /> },
        { path: "/AccountantExpenseManagement", label: "Expense Management", icon: <FaCalendarAlt /> },
        { path: "/AccountantSalary", label: "Salary & Payroll", icon: <FaClipboardList /> },
        { path: "/AccountantPayments", label: "Online Payments", icon: <FaMoneyBillWave /> },
        { path: "/AccountantReports", label: "Reports & Analytics", icon: <MdEvent /> },
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
        </div>
    );
};

export default Sidebar;