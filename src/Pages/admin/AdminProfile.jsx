import React, { useState, useEffect, useMemo } from "react";
import { getAdminProfile, changePassword } from "../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import { getRandomUserImage } from "../../utils/assetUrls";
import ProfileDetail from "../../components/profile/ProfileDetail";

const AdminProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfile();
      if (response && response.success && response.data) {
        setProfile(response.data);
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

    if (!passwordForm.confirm_password.trim()) {
      errors.confirm_password = "Please confirm your new password";
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = "Passwords do not match";
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
        confirm_password: passwordForm.confirm_password,
      };

      const response = await changePassword(payload);

      if (response && (response.success === true || response.statusCode === 200)) {
        toast.success(response.message || "Password changed successfully");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const adminName = profile?.name || "Admin";
  const adminRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Admin";
  const adminStatus = profile?.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : "N/A";

  const summaryFields = useMemo(
    () => [
      { label: "Admin ID", value: profile?.id || "N/A" },
      { label: "Role", value: adminRole },
      { label: "Status", value: adminStatus },
      { label: "Created At", value: formatDate(profile?.created_at) },
    ],
    [adminRole, adminStatus, profile]
  );

  const contactFields = [
    { label: "Email", value: profile?.email || "N/A" },
    { label: "Updated At", value: formatDate(profile?.updated_at) },
  ];

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "payroll", label: "Payroll" },
    { key: "leaves", label: "Leaves" },
    { key: "attendance", label: "Attendance" },
    { key: "library", label: "Library" },
    { key: "documents", label: "Documents" },
    { key: "issued", label: "Issued Item" },
    { key: "timeline", label: "Timeline" },
    { key: "lesson", label: "Lesson Planner" },
    { key: "password", label: "Change Password" },
  ];

  const renderInfoSection = (title, items) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">{item.label}</span>
            <span className="text-sm text-slate-900 font-semibold">{item.value || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmptyState = (label) => (
    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-sm">
      {label} data not available yet.
    </div>
  );

  const renderProfileTab = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 text-sm text-slate-600">
          Loading profile...
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-600">
          <p>Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {renderInfoSection("Admin Information", [
          { label: "Full Name", value: profile?.name || "N/A" },
          { label: "Email", value: profile?.email || "N/A" },
          { label: "Role", value: adminRole },
          { label: "Status", value: adminStatus },
        ])}
        {renderInfoSection("Account Information", [
          { label: "Created At", value: formatDate(profile?.created_at) },
          { label: "Last Updated", value: formatDate(profile?.updated_at) },
        ])}
      </div>
    );
  };

  const renderPasswordTab = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl">
      <h3 className="text-lg font-semibold mb-6">Change Password</h3>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={passwordForm.current_password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              passwordErrors.current_password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter current password"
          />
          {passwordErrors.current_password && (
            <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
          )}
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            value={passwordForm.new_password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              passwordErrors.new_password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter new password"
          />
          {passwordErrors.new_password && (
            <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={passwordForm.confirm_password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              passwordErrors.confirm_password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirm new password"
          />
          {passwordErrors.confirm_password && (
            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setSearchParams({});
              setPasswordForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
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
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "password":
        return renderPasswordTab();
      case "profile":
        return renderProfileTab();
      case "payroll":
        return renderEmptyState("Payroll");
      case "leaves":
        return renderEmptyState("Leaves");
      case "attendance":
        return renderEmptyState("Attendance");
      case "library":
        return renderEmptyState("Library");
      case "documents":
        return renderEmptyState("Documents");
      case "issued":
        return renderEmptyState("Issued Item");
      case "timeline":
        return renderEmptyState("Timeline");
      case "lesson":
        return renderEmptyState("Lesson Planner");
      default:
        return renderProfileTab();
    }
  };

  return (
    <>
      <ProfileDetail
        breadcrumb="Admin / My Profile"
        title="Admin Profile"
        name={adminName}
        subtitle={adminRole}
        imageUrl={profile?.image || getRandomUserImage("women/44.jpg")}
        summaryFields={summaryFields}
        contactFields={contactFields}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(tabKey) => {
          setActiveTab(tabKey);
          if (tabKey === "password") {
            setSearchParams({ tab: "password" });
          } else {
            setSearchParams({});
          }
        }}
        renderTabContent={renderTabContent}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminProfile;
