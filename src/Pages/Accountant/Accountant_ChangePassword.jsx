import React, { useState } from 'react';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { changeAccountantPassword } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const AccountantChangePassword = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await changeAccountantPassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            console.log('Change Password Response:', response);
            toast.success('Password changed successfully!');
            
            // Clear form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setErrors({});
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="p-4 md:p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                                <header className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                        <FaLock className="text-blue-600" />
                                        Change Password
                                    </h1>
                                    <p className="text-gray-600 mt-2">Update your account password</p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-10 py-3 border ${
                                                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showCurrentPassword ? (
                                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.currentPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-10 py-3 border ${
                                                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showNewPassword ? (
                                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                        )}
                                        <p className="text-gray-500 text-sm mt-1">Password must be at least 6 characters</p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-10 py-3 border ${
                                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showConfirmPassword ? (
                                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Changing Password...' : 'Change Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            disabled={isLoading}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>

                                {/* Security Tips */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Password Security Tips:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                        <li>Use a combination of letters, numbers, and special characters</li>
                                        <li>Avoid using personal information in your password</li>
                                        <li>Don't reuse passwords from other accounts</li>
                                        <li>Change your password regularly</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
    );
};

export default AccountantChangePassword;
