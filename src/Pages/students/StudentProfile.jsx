import React, { useEffect, useMemo, useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import ProfileDetail from '../../components/profile/ProfileDetail';
import { getStudentProfile, changeStudentPassword } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';
import { getRandomUserImage } from '../../utils/assetUrls';

const valueOrNA = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return valueOrNA(value);
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatYesNo = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (String(value).toLowerCase() === 'true') return 'Yes';
  if (String(value).toLowerCase() === 'false') return 'No';
  return valueOrNA(value);
};

const StudentProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
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
        const payload = response.data || {};
        const studentData = {
          ...payload.personal_info,
          ...payload.academic_info,
          ...payload.address_info,
          ...payload.guardian_info,
          ...payload.misc_info,
          ...payload,
        };
        setProfile(studentData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
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
        [name]: '',
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.current_password.trim()) {
      errors.current_password = 'Current password is required';
    }

    if (!passwordForm.new_password.trim()) {
      errors.new_password = 'New password is required';
    } else if (passwordForm.new_password.length < 6) {
      errors.new_password = 'New password must be at least 6 characters';
    }

    if (!passwordForm.confirm_new_password.trim()) {
      errors.confirm_new_password = 'Please confirm your new password';
    } else if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      errors.confirm_new_password = 'Passwords do not match';
    }

    if (passwordForm.current_password === passwordForm.new_password) {
      errors.new_password = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form');
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
        toast.success(response.message || 'Password changed successfully');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_new_password: '',
        });
        setPasswordErrors({});
        setSearchParams({});
        setActiveTab('profile');
      } else {
        toast.error(response?.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password';

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

  const classLabel = useMemo(() => {
    if (!profile) return 'N/A';
    return [profile.class_name, profile.section_name].filter(Boolean).join(' - ') || 'N/A';
  }, [profile]);

  const summaryFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Admission No.', value: profile.admission_number || profile.admission_no },
      { label: 'Roll Number', value: profile.roll_number },
      { label: 'Class', value: classLabel },
      { label: 'Section', value: profile.section_name },
      { label: 'RTE', value: formatYesNo(profile.rte || profile.is_rte) },
      { label: 'Gender', value: profile.gender },
    ];
  }, [profile, classLabel]);

  const studentInfoFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Admission Date', value: formatDate(profile.admission_date || profile.admissionDate) },
      { label: 'Admitted in Class', value: classLabel },
      { label: 'Date of Birth', value: formatDate(profile.dob || profile.date_of_birth) },
      { label: 'Category', value: profile.category || profile.category_name },
      { label: 'Mobile Number', value: profile.phone_no || profile.mobile_no },
      { label: 'Caste', value: profile.caste || profile.caste_name },
      { label: 'Religion', value: profile.religion || profile.religion_name },
      { label: 'Email', value: profile.email },
    ];
  }, [profile, classLabel]);

  const addressFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Current Address', value: profile.current_address || profile.address },
      { label: 'Permanent Address', value: profile.permanent_address || profile.permanentAddress },
    ];
  }, [profile]);

  const guardianFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Father Name', value: profile.father_name || profile.fatherName },
      { label: 'Father Phone', value: profile.father_phone || profile.father_mobile },
      { label: 'Mother Name', value: profile.mother_name || profile.motherName },
      { label: 'Mother Phone', value: profile.mother_phone || profile.mother_mobile },
      { label: 'Guardian Name', value: profile.guardian_name || profile.guardianName },
      { label: 'Guardian Email', value: profile.guardian_email || profile.guardianEmail },
      { label: 'Guardian Relation', value: profile.guardian_relation || profile.guardianRelation },
      { label: 'Guardian Phone', value: profile.guardian_phone || profile.guardian_mobile },
      { label: 'Guardian Address', value: profile.guardian_address || profile.guardianAddress },
    ];
  }, [profile]);

  const miscFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: 'Blood Group', value: profile.blood_group || profile.bloodGroup },
      { label: 'House', value: profile.house || profile.house_name },
      { label: 'Height', value: profile.height },
      { label: 'Weight', value: profile.weight },
      { label: 'Previous School Details', value: profile.previous_school_details || profile.previous_school },
      { label: 'Bank Account Number', value: profile.bank_account_number || profile.bank_account_no },
      { label: 'Bank Name', value: profile.bank_name },
      { label: 'Branch Code', value: profile.branch_code || profile.ifsc_code },
    ];
  }, [profile]);

  const renderInfoSection = (title, items) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">{item.label}</span>
            <span className="text-sm text-slate-900 font-semibold">{valueOrNA(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmptyState = (message) => (
    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-sm">
      {message}
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
      return renderEmptyState('Failed to load profile.');
    }

    return (
      <div className="space-y-5">
        {renderInfoSection('Student Info', studentInfoFields)}
        {renderInfoSection('Address Details', addressFields)}
        {renderInfoSection('Parent / Guardian Details', guardianFields)}
        {renderInfoSection('Miscellaneous Details', miscFields)}
      </div>
    );
  };

  const renderPasswordTab = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-2xl">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <FaLock className="mr-2 text-indigo-600 text-xl" />
        Change Password
      </h3>
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
              passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
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
              passwordErrors.new_password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter new password"
          />
          {passwordErrors.new_password && (
            <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirm_new_password"
            name="confirm_new_password"
            value={passwordForm.confirm_new_password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              passwordErrors.confirm_new_password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm new password"
          />
          {passwordErrors.confirm_new_password && (
            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_new_password}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSearchParams({});
              setActiveTab('profile');
              setPasswordForm({
                current_password: '',
                new_password: '',
                confirm_new_password: '',
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
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'password', label: 'Change Password' },
  ];

  const handleTabChange = (next) => {
    setActiveTab(next);
    if (next === 'profile') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: next });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'password':
        return renderPasswordTab();
      default:
        return renderEmptyState('No data available.');
    }
  };

  return (
    <ProfileDetail
      breadcrumb="Student / My Profile"
      title="My Profile"
      name={profile?.name || 'Student'}
      subtitle={classLabel}
      imageUrl={
        profile?.image ||
        profile?.photo_url ||
        profile?.student_photo ||
        profile?.profile_photo ||
        getRandomUserImage('women/44.jpg')
      }
      summaryFields={summaryFields}
      contactFields={[
        { label: 'Email', value: profile?.email },
        { label: 'Phone', value: profile?.phone_no || profile?.mobile_no },
        { label: 'Address', value: profile?.current_address || profile?.address },
      ]}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      renderTabContent={renderTabContent}
      SidebarComponent={StudentSidebar}
    />
  );
};

export default StudentProfile;
