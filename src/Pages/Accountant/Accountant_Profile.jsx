import React, { useState, useMemo } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaUser, FaIdCard, FaPhone, FaBuilding, FaCheckCircle, FaSave, FaTimes, FaLock, FaFileAlt } from 'react-icons/fa';
import Accountant_EditableInput from './Accountant_EditableInput';
import Accountant_EditButtons from './Accountant_EditButtons';
import Accountant_ProfileImage from './Accountant_ProfileImage';
import Accountant_Navigation from './Accountant_Navigation';
import Accountant_DocumentCard from './Accountant_DocumentCard';

const AccountantProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [profileData, setProfileData] = useState({
        personal: {
            fullName: 'Priya Sharma',
            employeeId: 'FIN-EMP-1234',
            role: 'Accountant',
            department: 'Finance',
            email: 'priya.sharma@financeportal.com',
            phone: '+91 9876543210',
            address: '456 Corporate Towers, Sector 21, Mumbai - 400021',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
        },
        privileges: {
            accessLevel: 'Edit',
            assignedDepartments: ['Fee Management', 'Payroll'],
            transactionApproval: 'Yes',
        },
        documents: {
            idProofFile: null,
            idProofFileName: 'Aadhaar Card - Uploaded',
            salarySlipFile: null,
            salarySlipFileName: 'Salary Slip - March 2025',
            taxDocFile: null,
            taxDocFileName: 'Tax Document - FY 2024-25',
        },
    });
    const [tempData, setTempData] = useState(profileData);
    const [isEditing, setIsEditing] = useState({
        personal: false,
        privileges: false,
        documents: false,
        profileImage: false,
    });

    const handleNavigationClick = (section) => {
        setActiveSection(section ?? 'personal');
        setIsEditing({ personal: false, privileges: false, documents: false, profileImage: false });
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
        { label: 'Employee ID', name: 'employeeId', type: 'text', disabled: true, icon: <FaIdCard /> },
        { label: 'Role', name: 'role', type: 'text', disabled: true, icon: <FaUser /> },
        { label: 'Department', name: 'department', type: 'text', disabled: true, icon: <FaBuilding /> },
        { label: 'Email', name: 'email', type: 'email', icon: <FaPhone /> },
        { label: 'Phone', name: 'phone', type: 'tel', icon: <FaPhone /> },
        { label: 'Address', name: 'address', isTextarea: true, icon: <FaBuilding /> },
    ], []);

    const privilegeFields = useMemo(() => [
        { label: 'Access Level', name: 'accessLevel', type: 'text', disabled: true, icon: <FaLock /> },
        {
            label: 'Assigned Departments',
            name: 'assignedDepartments',
            type: 'text',
            disabled: true,
            value: (profileData.privileges?.assignedDepartments ?? []).join(', '),
            icon: <FaBuilding />
        },
        { label: 'Transaction Approval', name: 'transactionApproval', type: 'text', disabled: true, icon: <FaCheckCircle /> },
    ], [profileData.privileges]);

    const navigationItems = [
        { section: 'personal', icon: <FaUser />, label: 'Personal Information' },
        { section: 'privileges', icon: <FaLock />, label: 'Financial Privileges & Roles' },
        { section: 'documents', icon: <FaFileAlt />, label: 'Document & ID Management' },
    ];

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

                                    {activeSection === 'privileges' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Privileges & Roles</h2>
                                            <div className="grid grid-cols-1 gap-6">
                                                {(privilegeFields ?? []).map((field) => (
                                                    <Accountant_EditableInput
                                                        key={field.name ?? ''}
                                                        {...field}
                                                        value={field.value ?? (profileData.privileges?.[field.name] ?? '')}
                                                        isEditing={false}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'documents' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Document & ID Management</h2>
                                                <Accountant_EditButtons
                                                    isEditing={isEditing.documents ?? false}
                                                    onEdit={() => handleEdit('documents')}
                                                    onSave={() => handleSave('documents')}
                                                    onCancel={() => handleCancel('documents')}
                                                />
                                            </div>
                                            <div className="space-y-6">
                                                {[
                                                    { label: 'ID Proof', docType: 'idProofFile', fileName: 'idProofFileName' },
                                                    { label: 'Salary Slip', docType: 'salarySlipFile', fileName: 'salarySlipFileName' },
                                                    { label: 'Tax Document', docType: 'taxDocFile', fileName: 'taxDocFileName' },
                                                ].map(({ label, docType, fileName }) => (
                                                    <Accountant_DocumentCard
                                                        key={docType ?? ''}
                                                        label={label}
                                                        docType={docType}
                                                        fileName={fileName}
                                                        fileDisplayName={
                                                            isEditing.documents
                                                                ? tempData.documents?.[fileName] ?? ''
                                                                : profileData.documents?.[fileName] ?? 'No file uploaded'
                                                        }
                                                        isEditing={isEditing.documents}
                                                        onFileChange={handleFileChange}
                                                        onRemove={handleRemoveFile}
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