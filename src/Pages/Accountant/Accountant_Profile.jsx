import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAccountantProfile, changeAccountantPassword } from "../../helper/requests-method/apiMethods";
import { getRandomUserImage } from "../../utils/assetUrls";
import ProfileDetail from "../../components/profile/ProfileDetail";
import AccountantSidebar from "./Accountant_Sidebar";

const AccountantProfile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const response = await getAccountantProfile();
                const data = response?.data || response;
                const mappedProfile = {
                    name: data.personal_info?.name || "",
                    email: data.personal_info?.email || "",
                    role: data.professional_info?.role || "accountant",
                    userId: data.personal_info?.user_id || "",
                    mobile_no: data.personal_info?.mobile_no || "",
                    gender: data.personal_info?.gender || "",
                    dob: data.personal_info?.dob || "",
                    account_status: data.personal_info?.account_status || "",
                    qualification: data.professional_info?.qualification || "",
                    joining_date: data.professional_info?.joining_date || "",
                    salary: data.professional_info?.salary || "",
                    current_address: data.address_info?.current_address || "",
                    permanent_address: data.address_info?.permanent_address || "",
                    image: data.personal_info?.image || "",
                };
                setProfile(mappedProfile);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) {
            setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordForm.currentPassword.trim()) {
            errors.currentPassword = "Current password is required";
        }
        if (!passwordForm.newPassword.trim()) {
            errors.newPassword = "New password is required";
        } else if (passwordForm.newPassword.length < 6) {
            errors.newPassword = "New password must be at least 6 characters";
        }
        if (!passwordForm.confirmPassword.trim()) {
            errors.confirmPassword = "Please confirm your new password";
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (passwordForm.currentPassword === passwordForm.newPassword) {
            errors.newPassword = "New password must be different from current password";
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
            const response = await changeAccountantPassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });
            if (response && (response.success === true || response.statusCode === 200)) {
                toast.success(response.message || "Password changed successfully");
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordErrors({});
                setSearchParams({ tab: "profile" });
                setActiveTab("profile");
            } else {
                toast.error(response?.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
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

    const accountantName = profile?.name || "Accountant";
    const accountantRole = profile?.role
        ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
        : "Accountant";
    const accountantStatus = profile?.account_status
        ? profile.account_status.charAt(0).toUpperCase() + profile.account_status.slice(1)
        : "N/A";

    const summaryFields = useMemo(
        () => [
            { label: "User ID", value: profile?.userId || "N/A" },
            { label: "Role", value: accountantRole },
            { label: "Status", value: accountantStatus },
            { label: "Joining Date", value: formatDate(profile?.joining_date) },
        ],
        [accountantRole, accountantStatus, profile]
    );

    const contactFields = [
        { label: "Email", value: profile?.email || "N/A" },
        { label: "Phone", value: profile?.mobile_no || "N/A" },
        { label: "Address", value: profile?.current_address || profile?.permanent_address || "N/A" },
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
        if (isLoading) {
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
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-5">
                {renderInfoSection("Personal Information", [
                    { label: "Full Name", value: profile?.name || "N/A" },
                    { label: "Email", value: profile?.email || "N/A" },
                    { label: "Phone", value: profile?.mobile_no || "N/A" },
                    { label: "DOB", value: formatDate(profile?.dob) },
                    { label: "Gender", value: profile?.gender || "N/A" },
                ])}
                {renderInfoSection("Professional Information", [
                    { label: "Role", value: accountantRole },
                    { label: "Qualification", value: profile?.qualification || "N/A" },
                    { label: "Salary", value: profile?.salary || "N/A" },
                    { label: "Status", value: accountantStatus },
                ])}
                {renderInfoSection("Address", [
                    { label: "Current Address", value: profile?.current_address || "N/A" },
                    { label: "Permanent Address", value: profile?.permanent_address || "N/A" },
                ])}
            </div>
        );
    };

    const renderPasswordTab = () => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter current password"
                    />
                    {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                    />
                    {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                    />
                    {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("profile");
                            setSearchParams({});
                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
            case "profile":
                return renderProfileTab();
            case "password":
                return renderPasswordTab();
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
                breadcrumb="Accountant / My Profile"
                title="Accountant Profile"
                name={accountantName}
                subtitle={accountantRole}
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
                SidebarComponent={AccountantSidebar}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default AccountantProfile;