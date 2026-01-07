import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaUser, FaIdCard, FaPhone, FaBuilding, FaCheckCircle, FaSave, FaTimes, FaLock, FaFileAlt } from 'react-icons/fa';
import Accountant_EditableInput from './Accountant_EditableInput';
import Accountant_EditButtons from './Accountant_EditButtons';
import Accountant_ProfileImage from './Accountant_ProfileImage';
import Accountant_Navigation from './Accountant_Navigation';
import Accountant_DocumentCard from './Accountant_DocumentCard';
import { getAccountantProfile } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const AccountantProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        personal: {
            fullName: '',
            userId: '',
            email: '',
            phone: '',
            gender: '',
            dob: '',
            profileImage: '',
            accountStatus: '',
        },
        professional: {
            role: '',
            qualification: '',
            joiningDate: '',
            salary: '',
        },
        address: {
            currentAddress: '',
            permanentAddress: '',
        },
    });
    const [tempData, setTempData] = useState(profileData);
    const [isEditing, setIsEditing] = useState({
        personal: false,
        professional: false,
        address: false,
        profileImage: false,
    });

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const response = await getAccountantProfile();
                console.log('Profile API Response:', response);

                const data = response?.data || response;

                // Map API response to profile state
                const mappedData = {
                    personal: {
                        fullName: data.personal_info?.name || '',
                        userId: data.personal_info?.user_id || '',
                        email: data.personal_info?.email || '',
                        phone: data.personal_info?.mobile_no || '',
                        gender: data.personal_info?.gender || '',
                        dob: data.personal_info?.dob || '',
                        profileImage: data.personal_info?.image || '',
                        accountStatus: data.personal_info?.account_status || '',
                    },
                    professional: {
                        role: data.professional_info?.role || '',
                        qualification: data.professional_info?.qualification || '',
                        joiningDate: data.professional_info?.joining_date || '',
                        salary: data.professional_info?.salary || '',
                    },
                    address: {
                        currentAddress: data.address_info?.current_address || '',
                        permanentAddress: data.address_info?.permanent_address || '',
                    },
                };
                
                console.log('Mapped Data:', mappedData);
                setProfileData(mappedData);
                setTempData(mappedData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleNavigationClick = (section) => {
        setActiveSection(section ?? 'personal');
        setIsEditing({ personal: false, professional: false, address: false, profileImage: false });
    };

    const handleEdit = (section) => {
        setIsEditing((prev) => ({ ...prev, [section]: true }));
        setTempData(profileData);
    };

    const handleSave = (section) => {
        setProfileData(tempData);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        console.log(`${section ?? 'unknown'} Updated:`, tempData[section] ?? {});
    };

    const handleCancel = (section) => {
        setTempData(profileData);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        if (section === 'profileImage' && (tempData.personal?.profileImage ?? '') !== (profileData.personal?.profileImage ?? '') && (tempData.personal?.profileImage ?? '').startsWith('blob:')) {
            URL.revokeObjectURL(tempData.personal?.profileImage ?? '');
        }
    };

    const handleInputChange = (section, e) => {
        const { name, value } = e.target ?? {};
        setTempData((prev) => ({
            ...prev,
            [section]: { ...prev[section] ?? {}, [name ?? '']: value ?? '' },
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setTempData((prev) => ({
                ...prev,
                personal: { ...prev.personal ?? {}, profileImage: imageUrl ?? '' },
            }));
            handleEdit('profileImage');
        }
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files?.[0];
        if (file) {
            setTempData((prev) => ({
                ...prev,
                documents: { ...prev.documents ?? {}, [docType]: file, [`${docType}Name`]: file.name ?? '' },
            }));
        }
    };

    const handleRemoveFile = (docType, fileName) => {
        setTempData((prev) => ({
            ...prev,
            documents: { ...prev.documents ?? {}, [docType]: null, [`${fileName}`]: null },
        }));
    };

    const personalFields = useMemo(() => [
        { label: 'Full Name', name: 'fullName', type: 'text', icon: <FaUser /> },
        { label: 'User ID', name: 'userId', type: 'text', disabled: true, icon: <FaIdCard /> },
        { label: 'Email', name: 'email', type: 'email', icon: <FaPhone /> },
        { label: 'Phone', name: 'phone', type: 'tel', icon: <FaPhone /> },
        { label: 'Gender', name: 'gender', type: 'text', icon: <FaUser /> },
        { label: 'Date of Birth', name: 'dob', type: 'date', icon: <FaIdCard /> },
        { label: 'Account Status', name: 'accountStatus', type: 'text', disabled: true, icon: <FaCheckCircle /> },
    ], []);

    const professionalFields = useMemo(() => [
        { label: 'Role', name: 'role', type: 'text', disabled: true, icon: <FaUser /> },
        { label: 'Qualification', name: 'qualification', type: 'text', icon: <FaIdCard /> },
        { label: 'Joining Date', name: 'joiningDate', type: 'date', icon: <FaBuilding /> },
        { label: 'Salary', name: 'salary', type: 'text', icon: <FaBuilding /> },
    ], []);

    const addressFields = useMemo(() => [
        { label: 'Current Address', name: 'currentAddress', type: 'text', icon: <FaBuilding /> },
        { label: 'Permanent Address', name: 'permanentAddress', type: 'text', icon: <FaBuilding /> },
    ], []);

    const navigationItems = [
        { section: 'personal', icon: <FaUser />, label: 'Personal Information' },
        { section: 'professional', icon: <FaLock />, label: 'Professional Details' },
        { section: 'address', icon: <FaFileAlt />, label: 'Address Information' },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex w-full">
                    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    <main className="flex-1 overflow-y-auto lg:ml-64">
                        <Header setIsSidebarOpen={setIsSidebarOpen} />
                        <div className="flex items-center justify-center h-screen">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading profile...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto lg:ml-64">
                    <Header setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4 md:p-6">
                        <div className="bg-white p-8 rounded-xl shadow-md mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                                <p className="text-gray-600">Manage your financial profile and privileges</p>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <Accountant_ProfileImage
                                            imageUrl={isEditing.profileImage ? (tempData.personal?.profileImage ?? '') : (profileData.personal?.profileImage ?? '')}
                                            isEditing={isEditing.profileImage}
                                            onChange={handleProfileImageChange}
                                            onSave={() => handleSave('profileImage')}
                                            onCancel={() => handleCancel('profileImage')}
                                        />
                                        <h2 className="text-xl font-semibold mt-4">{profileData.personal?.fullName ?? 'N/A'}</h2>
                                        <p className="text-gray-500 text-sm">{profileData.personal?.role ?? 'N/A'}</p>
                                        <Accountant_Navigation
                                            activeSection={activeSection}
                                            onClick={handleNavigationClick}
                                            items={navigationItems}
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    {activeSection === 'personal' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                                                <Accountant_EditButtons
                                                    isEditing={isEditing.personal ?? false}
                                                    onEdit={() => handleEdit('personal')}
                                                    onSave={() => handleSave('personal')}
                                                    onCancel={() => handleCancel('personal')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {(personalFields ?? []).map((field) => (
                                                    <Accountant_EditableInput
                                                        key={field.name ?? ''}
                                                        {...field}
                                                        value={isEditing.personal ? (tempData.personal?.[field.name] ?? '') : (profileData.personal?.[field.name] ?? '')}
                                                        onChange={(e) => handleInputChange('personal', e)}
                                                        isEditing={isEditing.personal && !field.disabled}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'professional' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Professional Details</h2>
                                                <Accountant_EditButtons
                                                    isEditing={isEditing.professional ?? false}
                                                    onEdit={() => handleEdit('professional')}
                                                    onSave={() => handleSave('professional')}
                                                    onCancel={() => handleCancel('professional')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {(professionalFields ?? []).map((field) => (
                                                    <Accountant_EditableInput
                                                        key={field.name ?? ''}
                                                        {...field}
                                                        value={isEditing.professional ? (tempData.professional?.[field.name] ?? '') : (profileData.professional?.[field.name] ?? '')}
                                                        onChange={(e) => handleInputChange('professional', e)}
                                                        isEditing={isEditing.professional && !field.disabled}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'address' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Address Information</h2>
                                                <Accountant_EditButtons
                                                    isEditing={isEditing.address ?? false}
                                                    onEdit={() => handleEdit('address')}
                                                    onSave={() => handleSave('address')}
                                                    onCancel={() => handleCancel('address')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {(addressFields ?? []).map((field) => (
                                                    <Accountant_EditableInput
                                                        key={field.name ?? ''}
                                                        {...field}
                                                        value={isEditing.address ? (tempData.address?.[field.name] ?? '') : (profileData.address?.[field.name] ?? '')}
                                                        onChange={(e) => handleInputChange('address', e)}
                                                        isEditing={isEditing.address && !field.disabled}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountantProfile;