import React, { useState } from 'react';
import OnlineLearningHeader from './OnlineLearningHeader';
import OnlineLearningSidebar from './OnlineLearningSidebar';
import { MdEdit, MdUpload, MdSchool, MdBook, MdStar } from 'react-icons/md';
import { getRandomUserImage } from '../../utils/assetUrls';

const OnlineLearningProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    profilePic: getRandomUserImage('women/25.jpg'),
    fullName: "Priya Sharma",studentId: "STU123456",school: "Delhi Public School",dob: "2005-05-15",
    email: "priya.sharma@example.com",phone: "+91 98765 43210",address: "123, MG Road, New Delhi",
  });
  const [courses] = useState([
    { name: "Hindi Grammar", progress: 75 },
    { name: "English Literature", progress: 60 },
    { name: "Calculus", progress: 90 },
  ]);
  const [certificates] = useState(["Basic Hindi Certificate", "Math Proficiency"]);
  const [assignments] = useState({ submitted: 5, pending: 2 });
  const [scores] = useState({ quizzes: 85, exams: 78 });
  const [activity] = useState({
    downloads: 12,
    notes: 8,
    forumPosts: 15,
    liveSessions: 10,
  });

  const handleProfilePicUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile(prev => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex">
      <div className={`fixed top-0 left-0 w-64 bg-[#EDF2F7] z-50 h-screen transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:static md:translate-x-0 md:flex md:flex-col md:w-64 md:min-h-0`}>
        <OnlineLearningSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-screen">
        <OnlineLearningHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">My Profile</h1>
          <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MdSchool className="mr-2 text-blue-600" size={24} /> Student Information
              </h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group">
                  <img 
                    src={profile?.profilePic ?? "https://via.placeholder.com/150"} alt="Profile" 
                    className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform group-hover:scale-105" />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                      <MdUpload size={20} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                    </label>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.fullName ?? ""} onChange={(e) => handleProfileChange('fullName', e.target.value)} placeholder="Full Name" />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.studentId ?? ""} onChange={(e) => handleProfileChange('studentId', e.target.value)} placeholder="Student ID" />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.school ?? ""} onChange={(e) => handleProfileChange('school', e.target.value)} placeholder="School" />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        type="date" value={profile?.dob ?? ""} onChange={(e) => handleProfileChange('dob', e.target.value)} />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.email ?? ""} onChange={(e) => handleProfileChange('email', e.target.value)} placeholder="Email" />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.phone ?? ""}  onChange={(e) => handleProfileChange('phone', e.target.value)} placeholder="Phone" />
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        value={profile?.address ?? ""} onChange={(e) => handleProfileChange('address', e.target.value)} placeholder="Address"  rows="2"></textarea>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <p><strong className="text-blue-600">Full Name:</strong> {profile?.fullName ?? "N/A"}</p>
                      <p><strong className="text-blue-600">Student ID:</strong> {profile?.studentId ?? "N/A"}</p>
                      <p><strong className="text-blue-600">School:</strong> {profile?.school ?? "N/A"}</p>
                      <p><strong className="text-blue-600">Date of Birth:</strong> {profile?.dob ?? "N/A"}</p>
                      <p><strong className="text-blue-600">Email:</strong> {profile?.email ?? "N/A"}</p>
                      <p><strong className="text-blue-600">Phone:</strong> {profile?.phone ?? "N/A"}</p>
                      <p className="col-span-2"><strong className="text-blue-600">Address:</strong> {profile?.address ?? "N/A"}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MdBook className="mr-2 text-green-600" size={24} /> Academic Progress
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Enrolled Courses</h3>
                  {courses?.length > 0 ? (
                    courses.map((course, index) => (
                      <div key={index} className="mt-3">
                        <p className="text-sm text-gray-600 font-medium">{course?.name ?? "Unknown Course"}</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-1 overflow-hidden">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${course?.progress ?? 0}%` }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No courses enrolled</p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Certificates Earned</h3>
                  {certificates?.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {certificates.map((cert, index) => <li key={index}>{cert ?? "Unnamed Certificate"}</li>)}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No certificates earned</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <p><strong className="text-green-600">Assignments:</strong> Submitted: {assignments?.submitted ?? 0}, Pending: {assignments?.pending ?? 0}</p>
                  <p><strong className="text-green-600">Scores:</strong> Quizzes: {scores?.quizzes ?? 0}%, Exams: {scores?.exams ?? 0}%</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MdStar className="mr-2 text-purple-600" size={24} /> Activity & Engagement
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
                <p><strong className="text-purple-600">Downloads:</strong> {activity?.downloads ?? 0}</p>
                <p><strong className="text-purple-600">Notes:</strong> {activity?.notes ?? 0}</p>
                <p><strong className="text-purple-600">Forum Posts:</strong> {activity?.forumPosts ?? 0}</p>
                <p><strong className="text-purple-600">Live Sessions:</strong> {activity?.liveSessions ?? 0}</p>
              </div>
            </section>

            <section className="flex justify-center">
              <button onClick={() => setIsEditing(!isEditing)} 
                className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition-colors flex items-center shadow-md hover:shadow-lg">
                <MdEdit className="mr-2" size={20} /> {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnlineLearningProfile;