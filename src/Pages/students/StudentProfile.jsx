import React, { useState, useEffect } from 'react';
import { 
  FaCamera, FaAddressCard, FaHeartbeat, FaTrophy,
  FaAward, FaBasketballBall, FaMusic, FaEdit,
  FaUser, FaGraduationCap, FaCalendarAlt, FaIdBadge, FaLock
} from 'react-icons/fa';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { getStudentProfile, changeStudentPassword } from '../../helper/requests-method/apiMethods';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';

const StudentProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getStudentProfile();
      if (response && response.success && response.data) {
        const studentData = {
          name: response.data.personal_info?.name || '',
          email: response.data.personal_info?.email || '',
          role: 'student',
          ...response.data.personal_info,
          ...response.data.academic_info,
          ...response.data.address_info,
        };
        setProfile(studentData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

    if (!passwordForm.confirm_new_password.trim()) {
      errors.confirm_new_password = "Please confirm your new password";
    } else if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      errors.confirm_new_password = "Passwords do not match";
    }

    if (passwordForm.current_password === passwordForm.new_password) {
      errors.new_password = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsChangingPassword(true);

    try {
      const payload = {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        confirm_new_password: passwordForm.confirm_new_password,
      };

      const response = await changeStudentPassword(payload);

      if (response && (response.success === true || response.statusCode === 200)) {
        toast.success(response.message || "Password changed successfully");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_new_password: "",
        });
        setPasswordErrors({});
        setSearchParams({ tab: 'profile' });
        setActiveTab('profile');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setSearchParams({});
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('password');
                    setSearchParams({ tab: 'password' });
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'password'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Change Password
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'profile' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : profile ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-blue-100">
                          <img
                            src={profile.image || "https://randomuser.me/api/portraits/women/44.jpg"}
                            alt="Student Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold mt-4">{profile.name || 'N/A'}</h2>
                      <p className="text-gray-500 mb-2">Roll Number: {profile.roll_number || 'N/A'}</p>
                      <div className="flex space-x-2 mt-2">
                        {profile.class_name && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {profile.class_name} {profile.section_name ? `- ${profile.section_name}` : ''}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {profile.account_status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <FaIdBadge className="text-gray-500 mr-3 text-xl" />
                          <div>
                            <p className="text-xs text-gray-500">Roll Number</p>
                            <p className="font-medium">{profile.roll_number || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg h-full">
                          <FaCalendarAlt className="text-gray-500 mr-3 text-xl" />
                          <div>
                            <p className="text-xs text-gray-500">DOB</p>
                            <p className="font-medium">{formatDate(profile.dob)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg h-full">
                          <FaUser className="text-gray-500 mr-3 text-xl" />
                          <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="font-medium">{profile.gender || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FaAddressCard className="mr-2 text-blue-600 text-xl" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="bg-gray-50 p-3 rounded-lg">{profile.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="bg-gray-50 p-3 rounded-lg">{profile.email || 'N/A'}</p>
                      </div>
                      {profile.mobile_no && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                          <p className="bg-gray-50 p-3 rounded-lg">{profile.mobile_no}</p>
                        </div>
                      )}
                      {(profile.current_address || profile.permanent_address) && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                          <p className="bg-gray-50 p-3 rounded-lg">
                            <strong>Current:</strong> {profile.current_address || 'N/A'}<br />
                            <strong>Permanent:</strong> {profile.permanent_address || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Information */}
                  {profile.class_name && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-3 hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaGraduationCap className="mr-2 text-blue-600 text-xl" />
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Class & Section</label>
                          <p className="bg-gray-50 p-3 rounded-lg">
                            {profile.class_name} {profile.section_name ? `- ${profile.section_name}` : ''}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Roll Number</label>
                          <p className="bg-gray-50 p-3 rounded-lg">{profile.roll_number || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                          <p className="bg-gray-50 p-3 rounded-lg">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              profile.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {profile.account_status ? profile.account_status.charAt(0).toUpperCase() + profile.account_status.slice(1) : 'N/A'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Failed to load profile</p>
                  <button
                    onClick={fetchProfile}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'password' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <FaLock className="mr-2 text-indigo-600 text-xl" />
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
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
                    htmlFor="confirm_new_password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_new_password"
                    name="confirm_new_password"
                    value={passwordForm.confirm_new_password}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      passwordErrors.confirm_new_password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirm_new_password && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.confirm_new_password}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('profile');
                      setSearchParams({});
                      setPasswordForm({
                        current_password: "",
                        new_password: "",
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentProfile;
