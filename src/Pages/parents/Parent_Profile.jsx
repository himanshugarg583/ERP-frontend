import React, { useState, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import { FaUser, FaSchool, FaExclamationTriangle, FaFileAlt, FaCamera, FaPhone, FaIdCard, FaCheckCircle, FaSave, FaTimes } from 'react-icons/fa';
import Parent_EditableInput from './Parent_EditableInput';
import Parent_StudentCard from './Parent_StudentCard';
import Parent_EditButtons from './Parent_EditButtons';

const ParentProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added sidebar state
    const [activeSection, setActiveSection] = useState('personal');
    const [profileData, setProfileData] = useState({
        personal: {
            fullName: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            mobileNumber: '+91 9876543210',
            alternateContactNumber: '+91 9876543211',
            homeAddress: '123 Residential Colony, Sector 15, New Delhi - 110001',
            officeAddress: 'ABC Corporation, Tech Park, Block B, Gurgaon - 122001',
        },
        students: [
            { name: 'Aditya Kumar', classInfo: 'Class X-A | Roll No: 15', relation: 'Son', color: 'bg-blue-100' },
            { name: 'Anusha Kumar', classInfo: 'Class VII-B | Roll No: 22', relation: 'Daughter', color: 'bg-purple-100' },
        ],
        emergency: {
            alternateContactPerson: 'Priya Sharma',
            emergencyPhoneNumber: '+91 8765432109',
        },
        documents: {
            idProofFile: null,
            idProofFileName: 'No file uploaded',
            verifiedStatus: 'Aadhaar Card - Verified',
        },
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    });
    const [tempData, setTempData] = useState(profileData);
    const [isEditing, setIsEditing] = useState({
        personal: false,
        emergency: false,
        documents: false,
        profileImage: false,
    });

    const handleNavigationClick = (section) => {
        setActiveSection(section);
        setIsEditing({ personal: false, emergency: false, documents: false, profileImage: false });
    };

    // Generic Handlers
    const handleEdit = (section) => {
        setIsEditing((prev) => ({ ...prev, [section]: true }));
        setTempData(profileData);
    };

    const handleSave = (section) => {
        setProfileData(tempData);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        console.log(`${section} Updated:`, tempData[section]);
    };

    const handleCancel = (section) => {
        setTempData(profileData);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        if (section === 'profileImage' && tempData.profileImage !== profileData.profileImage && tempData.profileImage.startsWith('blob:')) {
            URL.revokeObjectURL(tempData.profileImage);
        }
    };

    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [name]: value },
        }));
    };

    // Profile Image Handlers
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setTempData((prev) => ({ ...prev, profileImage: imageUrl }));
        }
    };

    // Document Handlers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempData((prev) => ({
                ...prev,
                documents: { ...prev.documents, idProofFile: file, idProofFileName: file.name },
            }));
        }
    };

    const personalFields = useMemo(() => [
        { label: 'Full Name', name: 'fullName', type: 'text' },
        { label: 'Email ID', name: 'email', type: 'email' },
        { label: 'Mobile Number', name: 'mobileNumber', type: 'tel' },
        { label: 'Alternate Contact Number', name: 'alternateContactNumber', type: 'tel' },
        { label: 'Home Address', name: 'homeAddress', isTextarea: true },
        { label: 'Office Address', name: 'officeAddress', isTextarea: true },
    ], []);

    const emergencyFields = useMemo(() => [
        { label: 'Alternate Contact Person', name: 'alternateContactPerson', type: 'text', icon: <FaUser /> },
        { label: 'Emergency Phone Number', name: 'emergencyPhoneNumber', type: 'tel', icon: <FaPhone /> },
    ], []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Updated wrapper */}
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Sidebar with props */}
                <main className="flex-1 overflow-y-auto lg:ml-64"> {/* Updated to lg:ml-64 */}
                    <Header setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Header with prop */}
                    <div className="p-4 md:p-6">
                        <div className="bg-white p-8 rounded-xl shadow-md max-w-[1200px] mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                                <p className="text-gray-600">Manage your personal information and preferences</p>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                                                    <img
                                                        src={isEditing.profileImage ? tempData.profileImage : profileData.profileImage}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <label className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                        <FaCamera />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleProfileImageChange}
                                                            onClick={() => handleEdit('profileImage')}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            {isEditing.profileImage && (
                                                <div className="flex gap-4 mt-2">
                                                    <button
                                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                                                        onClick={() => handleSave('profileImage')}
                                                    >
                                                        <FaSave />
                                                        Save
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                                                        onClick={() => handleCancel('profileImage')}
                                                    >
                                                        <FaTimes />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            <h2 className="text-xl font-semibold mt-4">{profileData.personal.fullName}</h2>
                                            <p className="text-gray-500 text-sm">Parent</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-medium text-lg border-b border-gray-200 pb-2">Navigation</h3>
                                            <ul className="space-y-2">
                                                {[
                                                    { section: 'personal', icon: <FaUser />, label: 'Personal Information' },
                                                    { section: 'students', icon: <FaSchool />, label: 'Student Details' },
                                                    { section: 'emergency', icon: <FaExclamationTriangle />, label: 'Emergency Contacts' },
                                                    { section: 'documents', icon: <FaFileAlt />, label: 'Documents' },
                                                ].map(({ section, icon, label }) => (
                                                    <li
                                                        key={section}
                                                        className={`p-2 rounded-lg font-medium flex items-center cursor-pointer transition-colors duration-200 ${activeSection === section ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                                        onClick={() => handleNavigationClick(section)}
                                                    >
                                                        <span className="mr-3">{icon}</span>
                                                        {label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    {activeSection === 'personal' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Parent Information</h2>
                                                <Parent_EditButtons
                                                    isEditing={isEditing.personal}
                                                    onEdit={() => handleEdit('personal')}
                                                    onSave={() => handleSave('personal')}
                                                    onCancel={() => handleCancel('personal')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    {personalFields.slice(0, 4).map((field) => (
                                                        <Parent_EditableInput
                                                            key={field.name}
                                                            {...field}
                                                            value={isEditing.personal ? tempData.personal[field.name] : profileData.personal[field.name]}
                                                            onChange={(e) => handleInputChange('personal', e)}
                                                            isEditing={isEditing.personal}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="space-y-4">
                                                    {personalFields.slice(4).map((field) => (
                                                        <Parent_EditableInput
                                                            key={field.name}
                                                            {...field}
                                                            value={isEditing.personal ? tempData.personal[field.name] : profileData.personal[field.name]}
                                                            onChange={(e) => handleInputChange('personal', e)}
                                                            isEditing={isEditing.personal}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'students' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Details</h2>
                                            <div className="space-y-6">
                                                {profileData.students.map((student, index) => (
                                                    <Parent_StudentCard key={index} {...student} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'emergency' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Emergency Contact Information</h2>
                                                <Parent_EditButtons
                                                    isEditing={isEditing.emergency}
                                                    onEdit={() => handleEdit('emergency')}
                                                    onSave={() => handleSave('emergency')}
                                                    onCancel={() => handleCancel('emergency')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {emergencyFields.map((field) => (
                                                    <Parent_EditableInput
                                                        key={field.name}
                                                        {...field}
                                                        value={isEditing.emergency ? tempData.emergency[field.name] : profileData.emergency[field.name]}
                                                        onChange={(e) => handleInputChange('emergency', e)}
                                                        isEditing={isEditing.emergency}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'documents' && (
                                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="flex justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-gray-800">Document Upload & Verification</h2>
                                                <Parent_EditButtons
                                                    isEditing={isEditing.documents}
                                                    onEdit={() => handleEdit('documents')}
                                                    onSave={() => handleSave('documents')}
                                                    onCancel={() => handleCancel('documents')}
                                                />
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                                <FaIdCard />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold">Upload ID Proof</h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {isEditing.documents ? (
                                                                        <label className="cursor-pointer text-blue-600 hover:underline">
                                                                            <input
                                                                                type="file"
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                            Choose File
                                                                        </label>
                                                                    ) : (
                                                                        profileData.documents.idProofFileName
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {!isEditing.documents && (
                                                            <span className="text-sm text-gray-600">{profileData.documents.idProofFileName}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                                <FaCheckCircle />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold">Verified Status by School</h3>
                                                                {isEditing.documents ? (
                                                                    <input
                                                                        type="text"
                                                                        name="verifiedStatus"
                                                                        value={tempData.documents.verifiedStatus}
                                                                        onChange={(e) => handleInputChange('documents', e)}
                                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                                    />
                                                                ) : (
                                                                    <p className="text-sm text-gray-600">{profileData.documents.verifiedStatus}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {!isEditing.documents && (
                                                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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

export default ParentProfile;