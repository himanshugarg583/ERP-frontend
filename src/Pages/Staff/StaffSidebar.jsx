import React, { useState, useEffect } from 'react';
import { FaSchool, FaHome, FaPen, FaTshirt, FaLaptop, FaFutbol, FaFlask, FaSearch, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './StaffSidebar.css';

const StaffSidebar = () => {
    const location = useLocation(); 
    const [dropdowns, setDropdowns] = useState(() => {
        const savedState = localStorage.getItem('dropdowns');
        return savedState ? JSON.parse(savedState) : {};
    });

    useEffect(() => {
        localStorage.setItem('dropdowns', JSON.stringify(dropdowns));
    }, [dropdowns]);

    useEffect(() => {
        const path = location.pathname;
        const initialDropdowns = { ...dropdowns };

 
        const dropdownPaths = {
            inventory: [
                '/stationeryAssets',
                '/UniformDressCode',
                '/ITInventory',
                '/SportsEquipment',
                '/labScienceEquipment',
                '/LostAndFound',
            ],
            it: ['/itSupport', '/NetworkManagement'],
            hr: ['/payroll', '/attendance', '/StaffBenefit'],
            admin: ['/timetable', '/events', '/schoolMaintenance'],
            security: ['/busTracking', '/campusSecurity', '/emergencyAlert'],
            Staffcommunication: ['/staffNotice', '/meetingSchedule'],
        };


        Object.keys(dropdownPaths).forEach((key) => {
            if (dropdownPaths[key].includes(path)) {
                initialDropdowns[key] = true; 
            }
        });

        setDropdowns(initialDropdowns);
    }, [location.pathname]); 

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="sticky top-0 left-0 h-screen box-border">
            <aside className="w-64 bg-gray-800 text-white p-4 transition-all duration-300 transform hover:shadow-lg h-[100%] hidden md:block">
                <div className="flex items-center mb-8">
                    <FaSchool className="text-3xl" />
                    <h1 className="ml-2 text-xl font-bold">Staff Portal</h1>
                </div>
                <nav className="max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                    <ul>
                        <li className="mb-2">
                            <Link
                                to="/StaffDashboard"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaHome className="mr-3" />
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => toggleDropdown('inventory')}
                                className="flex items-center justify-between p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Inventory
                                {dropdowns['inventory'] ? <FaCaretUp /> : <FaCaretDown />}
                            </button>
                            {dropdowns['inventory'] && (
                                <ul className="pl-6">
                                    {[
                                        { path: "/stationeryAssets", label: "Stationery & Assets", icon: <FaPen className="ml-auto" /> },
                                        { path: "/UniformDressCode", label: "Uniforms & Dress Code", icon: <FaTshirt className="ml-auto" /> },
                                        { path: "/ITInventory", label: "IT & Electronic Equipment", icon: <FaLaptop className="ml-auto" /> },
                                        { path: "/SportsEquipment", label: "Sports Equipment", icon: <FaFutbol className="ml-auto" /> },
                                        { path: "/labScienceEquipment", label: "Lab & Science Equipment", icon: <FaFlask className="ml-auto" /> },
                                        { path: "/LostAndFound", label: "Lost & Found", icon: <FaSearch className="ml-auto" /> },
                                    ].map(({ path, label, icon }) => (
                                        <li key={path} className="mb-1">
                                            <Link
                                                to={path}
                                                className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-600 transition-colors ${location.pathname === path ? 'bg-gray-600' : ''}`}
                                            >
                                                {label}
                                                {icon}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {[
                            { key: 'it', label: 'IT & Technical Staff', links: [{ path: '/itSupport', label: 'IT Support' }, { path: '/NetworkManagement', label: 'Network' }] },
                            // { key: 'hr', label: 'HR & Payroll', links: [ { path: '/attendance', label: 'Attendance and Leaves' }, { path: '/StaffBenefit', label: 'Staff Benefit and Policy' }] },
                            { key: 'admin', label: 'Administrative Tasks', links: [{ path: '/events', label: 'Event Planning' }, { path: '/schoolMaintenance', label: 'School Maintenance' }] },
                            // { key: 'security', label: 'Transport & Security', links: [{ path: '/busTracking', label: 'Bus Tracking' }, { path: '/campusSecurity', label: 'Campus Security' }, { path: '/emergencyAlert', label: 'Emergency Alert' }] },
                            // { key: 'Staffcommunication', label: 'Staff Communication', links: [{ path: '/staffNotice', label: 'Announcement and Notice' }, { path: '/meetingSchedule', label: 'Meeting Schedule' }] },
                        ].map(({ key, label, links }) => (
                            <li key={key} className="mb-2">
                                <button
                                    onClick={() => toggleDropdown(key)}
                                    className="flex items-center justify-between p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    {label}
                                    {dropdowns[key] ? <FaCaretUp /> : <FaCaretDown />}
                                </button>
                                {dropdowns[key] && (
                                    <ul className="pl-6">
                                        {links.map(({ path, label }) => (
                                            <li key={path} className="mb-1">
                                                <Link
                                                    to={path}
                                                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-600 transition-colors ${location.pathname === path ? 'bg-gray-600' : ''}`}
                                                >
                                                    {label}
                                                    <FaCaretDown className="ml-auto" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        
                        <li className="mb-2">
                            <Link
                                to="/StaffSupport"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Support Staff
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/StaffAttendence"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Attendence & Leaves
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/StaffTransport"
                                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Transport & Security
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default StaffSidebar;