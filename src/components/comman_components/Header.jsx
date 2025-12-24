import React, { useState, useEffect, useRef } from "react";
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
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        // For teacher, the data structure is different
        if (isTeacher && response.data) {
          // Map teacher profile data to a consistent structure
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
          // Map student profile data to a consistent structure
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
      // Don't show error toast on initial load to avoid annoying users
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Redirect to profile page based on user role
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
    // Redirect to profile page with password change option based on user role
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
    // Clear all authentication-related localStorage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberEmail");
    // Clear sidebar state
    localStorage.removeItem("studentSidebar:openDropdown");
    localStorage.removeItem("teacherSidebar:openDropdown");
    localStorage.removeItem("sidebar:openDropdown");
    localStorage.removeItem("studentSidebar:isOpen");
    localStorage.removeItem("teacherSidebar:isOpen");
    localStorage.removeItem("sidebar:isOpen");
    // Redirect to login page
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.current_password.trim()) {
      errors.current_password = "Current password is required";
    }

    if (!passwordForm.new_password.trim()) {
      errors.new_password = "New password is required";
    } else if (passwordForm.new_password.length < 6) {
      errors.new_password = "New password must be at least 6 characters";
    }

    // For teacher and student, use confirm_new_password; for admin, use confirm_password
    const confirmField = (isTeacher || isStudent) ? 'confirm_new_password' : 'confirm_password';
    const confirmValue = (isTeacher || isStudent) ? passwordForm.confirm_new_password : passwordForm.confirm_password;

    if (!confirmValue.trim()) {
      errors[confirmField] = "Please confirm your new password";
    } else if (passwordForm.new_password !== confirmValue) {
      errors[confirmField] = "Passwords do not match";
    }

    if (passwordForm.current_password === passwordForm.new_password) {
      errors.new_password = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Different payload structure for teacher/student vs admin
      const payload = (isTeacher || isStudent)
        ? {
            current_password: passwordForm.current_password,
            new_password: passwordForm.new_password,
            confirm_new_password: passwordForm.confirm_new_password,
          }
        : {
            current_password: passwordForm.current_password,
            new_password: passwordForm.new_password,
            confirm_password: passwordForm.confirm_password,
          };

      let response;
      if (isTeacher) {
        response = await changeTeacherPassword(payload);
      } else if (isStudent) {
        response = await changeStudentPassword(payload);
      } else {
        response = await changePassword(payload);
      }

      if (response && (response.success === true || response.statusCode === 200)) {
        toast.success(response.message || "Password changed successfully");
        setChangePasswordModalOpen(false);
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
          confirm_new_password: "",
        });
        setPasswordErrors({});
      } else {
        toast.error(response?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password";

      if (error?.response) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.errorMessage ||
          `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
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
    <>
    <header
      className="bg-slate-800 border-b border-slate-700 shadow-lg flex flex-wrap items-center justify-between px-4 py-1 z-0"
      style={{ flexDirection: "row" }}
    >
      {/* w-screen */}
      <div className="max-w-7xl px-4 py-2" style={{}}>
        <h1 className="text-xl font-semibold text-white">
          GurukulSarthi School Management Software
        </h1>
      </div>

      <ul
        className="navbar-nav navbar-nav-right flex flex-wrap items-center gap-4 px-2 py-2 sm:px-4 lg:px-6"
        style={{ width: "auto" }}
      >
        <li className="" style={{}}>
          <div className="text-slate-200 hover:text-violet-300 transition-colors">
            Session Year : <span id="sessionYearNameHeader">2025-26</span>
            <span id="semesterNameHeader"></span>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link count-indicator dropdown-toggle text-slate-200 hover:text-violet-300 transition-colors"
            id="messageDropdown"
            href="#"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faLanguage} />
          </a>
        </li>
      </ul>
      {/* Profile and FullScreen section */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center cursor-pointer group px-4 py-4 sm:px-6 lg:px-8"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-transparent group-hover:border-violet-500 transition-all"
            />
            <span className="ml-2 text-sm md:text-base text-slate-200 group-hover:text-violet-300 transition-colors">
                {profileLoading
                  ? "Loading..."
                  : profile?.name
                  ? profile.name
                  : "Admin"}
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 p-2 animate-dropdown opacity-100">
              <ul className="text-sm">
                  <li
                    className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={handleProfileClick}
                  >
                  <FaUser className="mr-2 text-gray-600" />
                  My Profile
                </li>
                  <li
                    className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={handleChangePasswordClick}
                  >
                    <FaLock className="mr-2 text-gray-600" />
                    Change Password
                </li>
                  <li
                    className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-red-600"
                    onClick={handleLogout}
                  >
                  <FaSignOutAlt className="mr-2 text-red-600" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Fullscreen Icon to the right of Profile */}
        <button
          onClick={toggleFullScreen}
          className="text-slate-200 hover:text-violet-300 transition-colors cursor-pointer"
        >
          {isFullScreen ? <FaExpand size={20} /> : <FaCompress size={18} />}
        </button>
      </div>
    </header>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Header;
