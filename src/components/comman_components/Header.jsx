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
import { getAdminProfile, changePassword, getTeacherProfile, changeTeacherPassword, getStudentProfile, changeStudentPassword } from "../../helper/requests-method/apiMethods";
import Modal from "./Modal";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    confirm_new_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
    setProfileModalOpen(true);
    // Refresh profile data when opening modal
    fetchProfile();
  };

  const handleChangePasswordClick = () => {
    setIsDropdownOpen(false);
    setChangePasswordModalOpen(true);
    // Reset form
    setPasswordForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
      confirm_new_password: "",
    });
    setPasswordErrors({});
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Remove token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to login page
    navigate("/login");
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
        className="bg-slate-800 border-b border-slate-700 shadow-lg flex flex-wrap items-center justify-between px-4 py-1"
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

      {/* Profile Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="My Profile"
        size="md"
      >
        {profileLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <img
                  src={profile.image || "https://randomuser.me/api/portraits/women/44.jpg"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full mx-auto border-4 border-violet-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  {profile.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  {profile.email || "N/A"}
                </p>
              </div>
              {(isTeacher || isStudent) && profile.mobile_no && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {profile.mobile_no || "N/A"}
                  </p>
                </div>
              )}
              {(isTeacher || isStudent) && profile.gender && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {profile.gender || "N/A"}
                  </p>
                </div>
              )}
              {(isTeacher || isStudent) && profile.dob && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {new Date(profile.dob).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {isTeacher && profile.qualification && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {profile.qualification || "N/A"}
                  </p>
                </div>
              )}
              {isTeacher && profile.joining_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Date
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {new Date(profile.joining_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {isTeacher && profile.salary && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    ₹{parseFloat(profile.salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
              {isStudent && profile.roll_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {profile.roll_number || "N/A"}
                  </p>
                </div>
              )}
              {isStudent && profile.class_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {profile.class_name || "N/A"}
                  </p>
                </div>
              )}
              {(isTeacher || isStudent) && (profile.current_address || profile.permanent_address) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    <strong>Current:</strong> {profile.current_address || "N/A"}<br />
                    <strong>Permanent:</strong> {profile.permanent_address || "N/A"}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  <span className="px-2 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-medium">
                    {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (profile.status === "active" || profile.account_status === "active")
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {(profile.status || profile.account_status)
                      ? (profile.status || profile.account_status).charAt(0).toUpperCase() +
                        (profile.status || profile.account_status).slice(1)
                      : "N/A"}
                  </span>
                </p>
              </div>
              {!isTeacher && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                      {profile.updated_at
                        ? new Date(profile.updated_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">Failed to load profile</p>
            <button
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordModalOpen}
        onClose={() => {
          setChangePasswordModalOpen(false);
          setPasswordForm({
            current_password: "",
            new_password: "",
            confirm_password: "",
            confirm_new_password: "",
          });
          setPasswordErrors({});
        }}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="current_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  passwordErrors.current_password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter current password"
              />
              {passwordErrors.current_password && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.current_password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  passwordErrors.new_password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              {passwordErrors.new_password && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.new_password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id={(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"}
                name={(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"}
                value={(isTeacher || isStudent) ? passwordForm.confirm_new_password : passwordForm.confirm_password}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 ${
                  passwordErrors[(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              {passwordErrors[(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"] && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors[(isTeacher || isStudent) ? "confirm_new_password" : "confirm_password"]}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setChangePasswordModalOpen(false);
                setPasswordForm({
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                  confirm_new_password: "",
                });
                setPasswordErrors({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Header;
