import React, { useState } from 'react';
import { 
    FaSchool, 
    FaHome, 
    FaCaretDown, 
    FaBook,          
    FaList,          
    FaLaptop,        
    FaBookReader,    
    FaPlus,          
    FaExchangeAlt,   
    FaChartBar       
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LibrarySidebar.css';

const LibrarySidebar = () => {
    const [dropdowns, setDropdowns] = useState({});

    const toggleDropdown = (key) => {
        setDropdowns(prev => ({ ...prev, [key]: !prev?.[key] }));
    };

    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white transition-all duration-300 z-[1000] md:block hidden">
            <aside className="h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                <div className="flex items-center mb-8">
                    <FaSchool className="text-3xl" />
                    <h1 className="ml-2 text-xl font-bold hidden md:block">Library Portal</h1>
                </div>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <Link 
                                to="/LibraryDashboard" 
                                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaHome className="mr-3" />
                                <span className="hidden md:inline">Dashboard</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <button 
                                onClick={() => toggleDropdown('Book Management')} 
                                className="flex items-center p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaBook className="mr-3" />
                                <span className="hidden md:inline flex-grow">Book Management</span>
                                <FaCaretDown className="ml-auto hidden md:inline" />
                            </button>
                            {dropdowns?.['Book Management'] && (
                                <ul className="pl-6 md:pl-8">
                                    <li className="mb-1">
                                        <Link 
                                            to="/libraryaddbook" 
                                            className="p-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            <span className="hidden md:inline">Add New Book</span>
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link 
                                            to="/libraryviewall" 
                                            className="p-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                                        >
                                            <FaList className="mr-2" />
                                            <span className="hidden md:inline">View All</span>
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link 
                                            to="/elibrary" 
                                            className="flex items-center p-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            <FaLaptop className="mr-2" />
                                            <span className="hidden md:inline">E-Library</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-2">
                            <Link 
                                to="/librarystationary" 
                                className="flex items-center p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaList className="mr-3" />
                                <span className="hidden md:inline flex-grow">Stationery Management</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link 
                                to="/libraryissueandreturn" 
                                className="flex items-center p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaExchangeAlt className="mr-3" />
                                <span className="hidden md:inline flex-grow">Issue & Return System</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link 
                                to="/libraryreports" 
                                className="flex items-center p-3 w-full text-left rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaChartBar className="mr-3" />
                                <span className="hidden md:inline">Reports & Analytics</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default LibrarySidebar;