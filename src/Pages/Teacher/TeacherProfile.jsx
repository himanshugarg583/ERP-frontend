import React, { useState, useCallback } from 'react';
import { FaEdit, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [profileData, setProfileData] = useState({
    teacherId: 'T12345', firstName: 'Jane', lastName: 'Johnson',
    class: 'Grade 5', subjects: 'Math, Science', gender: 'Female',
    primaryContact: '123-456-7890', email: 'jane.johnson@example.com',
    bloodGroup: 'A+', dateOfJoining: '2020-08-15', dob: '1985-03-10',
    maritalStatus: 'Married', qualification: 'M.Ed', workExperience: '10 years',
    previousSchool: 'ABC School', previousSchoolAddress: '123 Main St, City',
    previousSchoolContact: '987-654-3210', permanentAddress: '456 Elm St, Town',
    phoneNumber: '123-456-7890', panNumber: 'ABCDE1234F', status: 'Active',
    epfNo: 'EPF123456', basicSalary: '50000', contractType: 'Permanent',
    workShift: 'Morning', medicalLeave: '2/10', casualLeave: '5/15',
    sickLeave: '3/10', accountName: 'Jane Johnson', accountNumber: '123456789012',
    bankName: 'XYZ Bank', ifscCode: 'XYZA0001234', branchName: 'Main Branch',
    resume: 'resume.pdf', otherDocuments: 'certificate.pdf',
  });

  const navigate = useNavigate();
  const inputStyles = 'w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-800';
  const sectionStyles = 'mb-10 bg-white rounded-xl shadow-sm p-6 border border-gray-100';

  const handleInputChange = useCallback((e) => {
    const { name, value } = e?.target ?? {};
    if (name) {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleFileChange = useCallback((e, field) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (field === 'profileImage') {
        const imageUrl = URL.createObjectURL(file);
        setTempImage(imageUrl);
      } else {
        setProfileData((prev) => ({ ...prev, [field]: file.name }));
      }
    }
  }, []);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const handleSave = useCallback(() => {
    if (tempImage) {
      setProfileImage(tempImage);
    }
    setTempImage(null);
    setIsEditing(false);
    alert('Profile updated successfully!');
  }, [tempImage]);

  const handleBack = useCallback(() => navigate?.(-1), [navigate]);

  const renderField = useCallback((label, name, type = 'text') => (
    <div key={name} className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-600 mb-1">{label}</label>
      {isEditing ? (
        <input
          id={name} type={type} name={name} value={profileData?.[name] ?? ''}
          onChange={handleInputChange} className={inputStyles}/>
      ) : (
        <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg">{profileData?.[name] ?? 'N/A'}</p>
      )}
    </div>
  ), [isEditing, profileData, handleInputChange, inputStyles]);

  const renderFileField = useCallback((label, name) => (
    <div key={name} className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-600 mb-1">{label}</label>
      {isEditing ? (
        <input
          id={name} type="file" name={name}
          onChange={(e) => handleFileChange(e, name)}
          className={`${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200`}/>
      ) : (
        <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg">{profileData?.[name] ?? 'No file'}</p>
      )}
    </div>
  ), [isEditing, profileData, handleFileChange, inputStyles]);

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

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
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white">
            <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-md">
              <FaArrowLeft />
            </button>
            <button onClick={isEditing ? handleSave : toggleEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-700 hover:bg-indigo-800 transition-all duration-200 shadow-md">
              {isEditing ? (<><FaSave /> Save Changes</>) : (<><FaEdit /> Edit Profile</>)}
            </button>
          </div>

          <div className="p-8">
            <section className={sectionStyles}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <div className="mb-4">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-48 h-48 rounded-full object-cover shadow-md" />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profileImage')} className={`${inputStyles} text-sm w-48`}/>
                      {tempImage && (
                        <div className="mt-2">
                          <img 
                            src={tempImage} alt="Preview" className="w-48 h-48 rounded-full object-cover shadow-md"/>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Teacher ID:teacherId', 'First Name:firstName', 'Last Name:lastName', 'Class:class', 'Subjects:subjects', 'Gender:gender', 'Primary Contact:primaryContact', 'Email Address:email', 'Blood Group:bloodGroup', 'Date of Joining:dateOfJoining:date', 'Date of Birth:dob:date', 'Marital Status:maritalStatus', 'Qualification:qualification', 'Work Experience:workExperience', 'Previous School:previousSchool', 'Previous School Address:previousSchoolAddress', 'Previous School Contact:previousSchoolContact', 'Permanent Address:permanentAddress', 'Phone Number:phoneNumber', 'PAN Number:panNumber', 'Status:status'].map(field => {
                    const [label, name, type] = field.split(':');
                    return renderField(label, name, type);
                  })}
                </div>
              </div>
            </section>

            <section className={sectionStyles}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['EPF No:epfNo', 'Basic Salary:basicSalary', 'Contract Type:contractType', 'Work Shift:workShift'].map(field => renderField(...field.split(':')))}
              </div>
            </section>

            <section className={sectionStyles}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Leave Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Medical Leave:medicalLeave', 'Casual Leave:casualLeave', 'Sick Leave:sickLeave'].map(field => renderField(...field.split(':')))}
              </div>
            </section>

            <section className={sectionStyles}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Account Name:accountName', 'Account Number:accountNumber', 'Bank Name:bankName', 'IFSC Code:ifscCode', 'Branch Name:branchName'].map(field => renderField(...field.split(':')))}
              </div>
            </section>

            <section className={sectionStyles}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileField('Resume', 'resume')}
                {renderFileField('Other Documents', 'otherDocuments')}
              </div>
            </section>
          </div>
        </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherProfile;