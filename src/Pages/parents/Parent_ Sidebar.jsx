import React from 'react';
import { FaSchool, FaBell, FaChartLine, FaCalendarAlt, FaMoneyBillWave, FaClipboardList, FaUsers, FaBus, FaHome, FaClipboardCheck } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import './Sidebar.css'; // Import the CSS file for the scrollbar styles

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4 transition-all duration-300 transform hover:shadow-lg h-screen hidden md:block">
            <div className="flex items-center mb-8">
                <FaSchool className="text-3xl" />
                <h1 className="ml-2 text-xl font-bold">SchoolParent</h1>
            </div>
            <nav className="max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                <ul>
                    {['Dashboard', 'Attendance', 'Progress', 'Timetable', 'Results', 'Fees', 'School Events', 'Meetings', 'Transport'].map((item, index) => (
                        <li className="mb-2" key={index}>
                            <a href={`#${item.toLowerCase()}`} className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                {item === 'Dashboard' && <FaHome className="mr-3" />} {/* Home Icon for Dashboard */}
                                {item === 'Attendance' && <FaClipboardCheck className="mr-3" />}
                                {item === 'Progress' && <FaChartLine className="mr-3" />}
                                {item === 'Timetable' && <FaCalendarAlt className="mr-3" />}
                                {item === 'Results' && <FaClipboardList className="mr-3" />}
                                {item === 'Fees' && <FaMoneyBillWave className="mr-3" />}
                                {item === 'School Events' && <MdEvent className="mr-3" />}
                                {item === 'Meetings' && <FaUsers className="mr-3" />}
                                {item === 'Transport' && <FaBus className="mr-3" />}
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;