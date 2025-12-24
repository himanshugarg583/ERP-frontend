import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Maximize2,
  Minimize2,
  User,
  LogOut,
  Lock,
  ChevronDown,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getAdminProfile, getTeacherProfile, getStudentProfile } from "../../helper/requests-method/apiMethods";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Fetch profile based on user role
  useEffect(() => {
    fetchProfile();
  }, [isTeacher, isStudent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      let response;
      if (isTeacher) {
        response = await getTeacherProfile();
      } else if (isStudent) {
        response = await getStudentProfile();
      } else {
        response = await getAdminProfile();
      }

      if (response && response.success && response.data) {
        if (isTeacher && response.data) {
          const teacherData = {
            name: response.data.personal_info?.name || '',
            email: response.data.personal_info?.email || '',
            role: response.data.professional_info?.role || 'teacher',
            ...response.data.personal_info,
            ...response.data.professional_info,
            ...response.data.address_info,
          };
          setProfile(teacherData);
        } else if (isStudent && response.data) {
          const studentData = {
            name: response.data.personal_info?.name || '',
            email: response.data.personal_info?.email || '',
            role: 'student',
            ...response.data.personal_info,
            ...response.data.academic_info,
            ...response.data.address_info,
          };
          setProfile(studentData);
        } else {
          setProfile(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    if (isStudent) {
      navigate("/student/profile");
    } else if (isTeacher) {
      navigate("/teacher/profile");
    } else {
      navigate("/admin/profile");
    }
  };

  const handleChangePasswordClick = () => {
    setIsDropdownOpen(false);
    if (isStudent) {
      navigate("/student/profile?tab=password");
    } else if (isTeacher) {
      navigate("/teacher/profile?tab=password");
    } else {
      navigate("/admin/profile?tab=password");
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberEmail");
    localStorage.removeItem("studentSidebar:openDropdown");
    localStorage.removeItem("teacherSidebar:openDropdown");
    localStorage.removeItem("sidebar:openDropdown");
    localStorage.removeItem("studentSidebar:isOpen");
    localStorage.removeItem("teacherSidebar:isOpen");
    localStorage.removeItem("sidebar:isOpen");
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

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
    <header className="relative bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Title */}
          <div className="flex items-center gap-4 flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block"
            >
              GurukulSarthi School
            </motion.h1>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Session Year */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <span className="text-xs font-medium text-indigo-700">
                Session: <span className="font-bold">2025-26</span>
              </span>
            </div>

            {/* Language Selector */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-all"
            >
              <Globe className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </motion.button>

            {/* Fullscreen Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullScreen}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-all"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Profile"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {profileLoading ? "Loading..." : profile?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {profile?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {profile?.email || user?.email || "user@example.com"}
                      </p>
                    </div>

                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleProfileClick}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">My Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleChangePasswordClick}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Lock className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium">Change Password</span>
                      </motion.button>

                      <div className="my-2 border-t border-gray-100"></div>

                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
