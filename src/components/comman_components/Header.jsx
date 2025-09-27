import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faUser,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import {
  FaExpand,
  FaCompress,
  FaBars,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
// import { FaExpand, FaCompress } from "react-icons/fa";
import { useState } from "react";
const Header = ({ title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <header
      className="bg-white backdrop-blur-lg shadow-lg  flex justify-between"
      style={{ flexDirection: "row" }}
    >
      {/* w-screen */}
      <div className="max-w-7xl  px-4 py-4 sm:px-6 lg:px-8" style={{}}>
        <h1 className="text-xl font-semibold text-black">
          GurukulSarthi School Managment Software
        </h1>
      </div>

      <ul
        className="navbar-nav navbar-nav-right flex px-4 py-4 sm:px-6 lg:px-8"
        style={{ width: "32%", gap: "30px" }}
      >
        <li className="" style={{}}>
          <div className="text-dark">
            Session Year : <span id="sessionYearNameHeader">2025-26</span>
            <span id="semesterNameHeader"></span>
          </div>
        </li>

        <li className="d-none d-md-block d-sm-block nav-item" style={{}}>
          <a
            className="nav-link count-indicator dropdown-toggle"
            id="messageDropdown"
            href="#"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            {/* <h2>icons</h2>     */}
            <FontAwesomeIcon icon={faLanguage} />
          </a>
        </li>
      </ul>
      <button onClick={toggleFullScreen} className="text-black">
        {isFullScreen ? <FaExpand size={20} /> : <FaCompress size={18} />}
      </button>
      {/* Profile Dropdown */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer group px-4 py-4 sm:px-6 lg:px-8"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all"
          />
          <span className="ml-2 text-sm md:text-base group-hover:text-indigo-600 transition-colors">
            Mr. Himanshu{" "}
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 p-2 animate-dropdown opacity-100">
            <ul className="text-sm">
              <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <FaUser className="mr-2 text-gray-600" />
                My Profile
              </li>
              <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <FaCog className="mr-2 text-gray-600" />
                Settings
              </li>
              <li className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-red-600">
                <FaSignOutAlt className="mr-2 text-red-600" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
