// StudentProfile.js
import React, { useState } from 'react';
import { 
  FaCamera, FaAddressCard, FaHeartbeat, FaTrophy,
  FaAward, FaBasketballBall, FaMusic, FaEdit,
  FaUser, FaGraduationCap, FaCalendarAlt, FaIdBadge
} from 'react-icons/fa';
import StudentNavbar from './StudentNavbar';
import StudentSidebar from './StudentSidebar'; // Adjust the path if necessary

const StudentProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md md:left-64">
        <StudentNavbar />
      </div>

      <div className="fixed top-0 bottom-0 w-64 hidden md:block z-30 bg-white shadow-lg">
        <StudentSidebar />
      </div>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-blue-100">
                    <img
                      src="images/stu1.jpeg"
                      alt="Student Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <FaCamera className="text-white text-2xl" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mt-4">Riya Sharma</h2>
                <p className="text-gray-500 mb-2">Student ID: STU2023001</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Class XI-A</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">2023-24</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <FaIdBadge className="text-gray-500 mr-3 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Enrollment No.</p>
                      <p className="font-medium">ENRL10987</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg h-full">
                    <FaCalendarAlt className="text-gray-500 mr-3 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">DOB</p>
                      <p className="font-medium">10-May-2005</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg h-full">
                    <FaUser className="text-gray-500 mr-3 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium">Female</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaAddressCard className="mr-2 text-blue-600 text-xl" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Riya Sharma</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
                  <p className="bg-gray-50 p-3 rounded-lg">STU2023001</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="bg-gray-50 p-3 rounded-lg">riyasharma@school.edu</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="bg-gray-50 p-3 rounded-lg">+91 9874563210</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="bg-gray-50 p-3 rounded-lg">
                    123 Education Street, Learning Heights, Knowledge City - 54321
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Parents/Guardian Name</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Priya Sharma</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Parent's Contact</label>
                  <p className="bg-gray-50 p-3 rounded-lg">+91 9123456789</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-3 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-blue-600 text-xl" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Class & Section</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Class XI - Section A</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Academic Year</label>
                  <p className="bg-gray-50 p-3 rounded-lg">2023-2024</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Roll Number</label>
                  <p className="bg-gray-50 p-3 rounded-lg">27</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Class Teacher</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Ms. Shreya Mehta</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Medium of Instruction</label>
                  <p className="bg-gray-50 p-3 rounded-lg">English</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Stream/Specialization</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Science</p>
                </div>
              </div>

              <h4 className="text-md font-semibold mt-6 mb-3">Current Performance Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border-l-4 border-blue-600">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <span className="text-lg font-bold text-blue-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border-l-4 border-green-600">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Average Grade</p>
                    <span className="text-lg font-bold text-green-600">A</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border-l-4 border-purple-600">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Assignments</p>
                    <span className="text-lg font-bold text-purple-600">26/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border-l-4 border-amber-600">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Participation</p>
                    <span className="text-lg font-bold text-amber-600">Good</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaHeartbeat className="mr-2 text-blue-600 text-xl" />
                Health Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                  <p className="bg-gray-50 p-3 rounded-lg">O+</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Known Allergies</label>
                  <p className="bg-gray-50 p-3 rounded-lg">None</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                  <p className="bg-gray-50 p-3 rounded-lg">Priya Sharma (Mother)  +91 9123456789</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaTrophy className="mr-2 text-blue-600 text-xl" />
                Achievements & Activities
              </h3>
              <div className="space-y-3">
                <div className="flex items-start bg-gray-50 p-3 rounded-lg">
                  <FaAward className="text-yellow-500 mr-3 mt-1 text-xl" />
                  <div>
                    <p className="font-medium">First Prize in Science Exhibition</p>
                    <p className="text-sm text-gray-500">Regional Level, October 2022</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 p-3 rounded-lg">
                  <FaBasketballBall className="text-blue-500 mr-3 mt-1 text-xl" />
                  <div>
                    <p className="font-medium">School Basketball Team</p>
                    <p className="text-sm text-gray-500">Team Captain, 2022-23</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 p-3 rounded-lg">
                  <FaMusic className="text-purple-500 mr-3 mt-1 text-xl" />
                  <div>
                    <p className="font-medium">School Choir</p>
                    <p className="text-sm text-gray-500">Member since 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;