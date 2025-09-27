import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaUser, FaClock } from 'react-icons/fa';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminSidebar from './SuperAdminSidebar';

const InputField = ({ type, name, value, onChange, placeholder, showToggle, onToggle, icon }) => (
  <div className="relative">
    <input
      type={showToggle ? 'text' : type}
      name={name}
      value={value ?? ''} 
      onChange={onChange}
      placeholder={placeholder}
      className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    {icon && (
      <span
        onClick={onToggle}
        className="absolute right-3 top-3 text-gray-500 cursor-pointer">
        {showToggle ? <FaEye /> : <FaEyeSlash />}
      </span>
    )}
  </div>
);

const SuperAdminProfile = () => {
  const [formData, setFormData] = useState({
    firstName: 'David',
    lastName: 'Mitchell',
    email: 'david.mitchell@company.com',
    username: 'david_m',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({
    showFields: false,
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState(null); // State to capture and display errors

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleChange = (e) => {
    try {
      const { name, value } = e?.target ?? {};
      if (!name) throw new Error('Input name is missing');
      setFormData((prev) => ({ ...prev, [name]: value }));
    } catch (err) {
      console.error('Error in handleChange:', err);
      setError('An error occurred while updating the form.');
    }
  };

  const handleImageChange = (e) => {
    try {
      const file = e?.target?.files?.[0];
      if (!file) {
        console.warn('No file selected');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      console.log('Image selected:', file);
    } catch (err) {
      console.error('Error in handleImageChange:', err);
      setError('An error occurred while uploading the image.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', { ...formData, profileImage });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('An error occurred while submitting the form.');
    }
  };

  const togglePasswordFields = () => {
    setPasswordVisibility((prev) => ({ ...prev, showFields: !prev.showFields }));
  };

  const togglePassword = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const personalFields = [
    { name: 'firstName', placeholder: 'First Name' },
    { name: 'lastName', placeholder: 'Last Name' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'username', placeholder: 'Username' },
  ];

  const addressFields = [
    { name: 'phone', placeholder: 'Enter Phone' },
    { name: 'address', placeholder: 'Enter Address' },
    { name: 'country', placeholder: 'Enter Country' },
    { name: 'state', placeholder: 'Enter State' },
    { name: 'city', placeholder: 'Enter City' },
    { name: 'postalCode', placeholder: 'Enter Postal Code' },
  ];

  const passwordFields = [
    {
      name: 'currentPassword',
      placeholder: 'Current Password',
      showToggle: passwordVisibility.current,
      onToggle: () => togglePassword('current'),
    },
    {
      name: 'newPassword',
      placeholder: 'New Password',
      showToggle: passwordVisibility.new,
      onToggle: () => togglePassword('new'),
    },
    {
      name: 'confirmPassword',
      placeholder: 'Confirm Password',
      showToggle: passwordVisibility.confirm,
      onToggle: () => togglePassword('confirm'),
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <SuperAdminHeader />
        {error && <div className="p-4 text-red-600 bg-red-100 rounded-md m-6">{error}</div>}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="text-sm text-gray-500 mb-4"
                onChange={handleImageChange}/>
              <h2 className="text-xl font-semibold text-gray-800">
                {formData?.firstName ?? ''} {formData?.lastName ?? ''}
              </h2>
              <p className="text-sm text-blue-600">Super Admin</p>
              <div className="space-y-1 mt-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <FaEnvelope className="mr-2" /> {formData?.email ?? 'N/A'}
                </p>
                <p className="flex items-center">
                  <FaUser className="mr-2" /> {formData?.username ?? 'N/A'}
                </p>
                <p className="flex items-center">
                  <FaClock className="mr-2" /> Last Login: Today, 09:45 AM
                </p>
              </div>
              <button
                onClick={togglePasswordFields}
                className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Change Password
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!passwordVisibility.showFields ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  {personalFields?.map((field) => (
                    <InputField
                      key={field.name}
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData?.[field.name] ?? ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}/>
                  ))}
                  <h4 className="text-md font-semibold text-gray-800 mt-6 mb-2">Address Information</h4>
                  {addressFields?.map((field) => (
                    <InputField
                      key={field.name}
                      type="text"
                      name={field.name}
                      value={formData?.[field.name] ?? ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                  ))}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                  {passwordFields?.map((field) => (
                    <InputField
                      key={field.name}
                      type="password"
                      name={field.name}
                      value={formData?.[field.name] ?? ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      showToggle={field.showToggle}
                      onToggle={field.onToggle}
                      icon/>
                  ))}
                </>
              )}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminProfile;