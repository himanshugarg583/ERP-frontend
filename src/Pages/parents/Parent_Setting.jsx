import React, { useState, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import Parent_EditableInput from './Parent_EditableInput';
import Parent_EditButtons from './Parent_EditButtons';
import { FaLock, FaEnvelope, FaBell, FaBus, FaCalendar, FaMoneyBillWave, FaExclamationCircle, FaPhone, FaComment } from 'react-icons/fa';

const ParentSettings = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('security');
    const [settingsData, setSettingsData] = useState({
        security: { password: '', email: 'rajesh.kumar@example.com' },
        notifications: { attendance: true, examResults: true, feeReminders: true, transport: true, meetings: true },
        support: { contactNumber: '+91 9876543210', feedback: '' }
    });
    const [tempData, setTempData] = useState(settingsData);
    const [isEditing, setIsEditing] = useState({ security: false, notifications: false });
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNavigationClick = (section) => setActiveSection(section) || setIsEditing({ security: false, notifications: false });
    const handleEdit = (section) => setIsEditing((p) => ({ ...p, [section]: true })) || setTempData(settingsData);
    const handleSave = (section) => {
        if (section === 'security') {
            if (tempData.security.password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            // Here you can add logic to update the password in your backend
            console.log("Password updated:", tempData.security.password);
        }
        setSettingsData(tempData);
        setIsEditing((p) => ({ ...p, [section]: false }));
    };
    const handleCancel = (section) => {
        setTempData(settingsData);
        setConfirmPassword('');
        setIsEditing((p) => ({ ...p, [section]: false }));
    };
    const handleInputChange = (section, e) => setTempData((p) => ({ ...p, [section]: { ...p[section], [e.target.name]: e.target.value } }));
    const handleToggleChange = (name) => setTempData((p) => ({ ...p, notifications: { ...p.notifications, [name]: !p.notifications[name] } }));
    const handleFeedbackChange = (e) => setSettingsData((p) => ({ ...p, support: { ...p.support, feedback: e.target.value } }));

    const securityFields = useMemo(() => [
        { label: 'Change Password', name: 'password', type: 'password', icon: <FaLock /> },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', icon: <FaLock /> },
        { label: 'Change Email Address', name: 'email', type: 'email', icon: <FaEnvelope /> }
    ], []);

    const notificationOptions = useMemo(() => [
        { label: 'Attendance Alerts', name: 'attendance', icon: <FaBell /> },
        { label: 'Exam Results', name: 'examResults', icon: <FaBell /> },
        { label: 'Fee Reminders', name: 'feeReminders', icon: <FaMoneyBillWave /> },
        { label: 'Transport Updates', name: 'transport', icon: <FaBus /> },
        { label: 'Parent-Teacher Meetings', name: 'meetings', icon: <FaCalendar /> }
    ], []);

    const supportFields = useMemo(() => [
        { label: 'Contact School Administration', name: 'contactNumber', type: 'tel', icon: <FaPhone /> }
    ], []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="bg-white p-8 rounded-xl shadow-md max-w-[1200px] mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                        <p className="text-gray-600">Customize your preferences and manage account settings</p>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Navigation Sidebar */}
                        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg border-b border-gray-200 pb-2">Navigation</h3>
                                <ul className="space-y-2">
                                    {[
                                        { section: 'security', icon: <FaLock />, label: 'Security & Privacy' },
                                        { section: 'notifications', icon: <FaBell />, label: 'Notifications' },
                                        { section: 'support', icon: <FaExclamationCircle />, label: 'Support & Help' }
                                    ].map(({ section, icon, label }) => (
                                        <li
                                            key={section}
                                            className={`p-2 rounded-lg font-medium flex items-center cursor-pointer transition-colors ${activeSection === section ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => handleNavigationClick(section)}
                                        >
                                            <span className="mr-3">{icon}</span>{label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-2">
                            {activeSection === 'security' && (
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Security & Privacy</h2>
                                        <Parent_EditButtons isEditing={isEditing.security} onEdit={() => handleEdit('security')} onSave={() => handleSave('security')} onCancel={() => handleCancel('security')} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {securityFields.map((f) => (
                                            <Parent_EditableInput
                                                key={f.name}
                                                {...f}
                                                value={isEditing.security ? (f.name === 'confirmPassword' ? confirmPassword : tempData.security[f.name]) : settingsData.security[f.name]}
                                                onChange={(e) => {
                                                    if (f.name === 'confirmPassword') {
                                                        setConfirmPassword(e.target.value);
                                                    } else {
                                                        handleInputChange('security', e);
                                                    }
                                                }}
                                                isEditing={isEditing.security}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
                                        <Parent_EditButtons isEditing={isEditing.notifications} onEdit={() => handleEdit('notifications')} onSave={() => handleSave('notifications')} onCancel={() => handleCancel('notifications')} />
                                    </div>
                                    <div className="space-y-4">
                                        {notificationOptions.map(({ label, name, icon }) => (
                                            <div key={name} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-500">{icon}</span>
                                                    <span className="font-medium">{label}</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isEditing.notifications ? tempData.notifications[name] : settingsData.notifications[name]}
                                                        onChange={() => isEditing.notifications && handleToggleChange(name)}
                                                        className="sr-only peer"
                                                        disabled={!isEditing.notifications}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'support' && (
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Support & Help</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {supportFields.map((f) => (
                                            <Parent_EditableInput
                                                key={f.name}
                                                {...f}
                                                value={settingsData.support[f.name]} // Always use settingsData, no tempData
                                                isEditing={false} // Always readonly
                                            />
                                        ))}
                                        {/* Detached Feedback Textarea */}
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Report an Issue or Feedback</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500"><FaComment /></span>
                                                <textarea
                                                    name="feedback"
                                                    value={settingsData.support.feedback}
                                                    onChange={handleFeedbackChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-28 bg-white"
                                                    placeholder="Type your feedback or issue here..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ParentSettings;