import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import axios from 'axios';

const SuperAdminSchoolList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [School, setSchool] = useState([]);
  const [schoolDataa,setSchoolData]= useState([]);

  useEffect(()=>{
    axios.get("http://192.168.1.16:3000/superAdmin/getSchool").then((data)=>{
        const schoolData = data?.data?.data?.school
        setSchool(schoolData)
    })
  },[])

  const schoolData = [
    {
      schoolId: 'SCH001',
      schoolName: 'ABC School',
      branch: '123 Main St, City A',
      totalStudents: 1200,
      totalTeachers: 75,
      totalStaff: 30,
      status: 'Active',
      email:'abc@gmail.com',
      affiliation: 'CBSE',
    },
    {
      schoolId: 'SCH003',
      schoolName: 'PQR School',
      branch: '789 Pine Rd, City C',
      totalStudents: 600,
      totalTeachers: 45,
      totalStaff: 20,
      status: 'Inactive',
      email:'abc@gmail.com',
      affiliation: 'State Board',
    },
  ];

  const handleDelete = (schoolId) => {
    if (window.confirm('Are you sure you want to mark this school as inactive?')) {
      setSchoolData((prev) =>
        prev.map((school) =>
          school.schoolId === schoolId ? { ...school, status: 'Inactive' } : school
        )
      );
      setSelectedSchool(null);
    }
  };

  const SchoolCard = ({ school }) => (
    <>
    {
      console.log(school)
    }
    <div
      onClick={() => setSelectedSchool(school)}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative"
    >
      <div className={`absolute top-0 left-0 w-full h-2 ${school.status === "Active" ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-red-400 to-gray-500'}`}></div>
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5m4-4h6" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{school.schoolName}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {school.branch}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${school.isDeleted === false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {school.status} 
     
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p><span className="font-medium text-gray-900">{school.totalStudents}</span> Students</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p><span className="font-medium text-gray-900">{school.totalTeachers}</span> Teachers</p>
          </div>
        </div>
      </div>
    </div>
      </>
  );

  return (
    <div className="flex">
      <SuperAdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <SuperAdminHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className={`flex-1 p-6 md:p-8 lg:p-10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">School Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {School.map((school,i) => (
              <SchoolCard key={i}  school={school} />
            ))}
          </div>

          {selectedSchool && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 hover:scale-102">
                <div className={`absolute top-0 left-0 w-full h-3 ${selectedSchool.status === 'Active' ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-red-400 to-gray-500'}`}></div>
                <div className="flex justify-between items-center mb-6 mt-4 sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5m4-4h6" />
                    </svg>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{selectedSchool.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedSchool(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <Section title="Basic Information">
                    <Grid>
                      <Text label="School ID" value={selectedSchool.schoolId} />
                      <Text label="Name" value={selectedSchool.schoolName} />
                      <Text label="Branch" value={selectedSchool.branch} />
                      <Text label="Email" value={selectedSchool.email} />
                      <Text label="Affiliation" value={selectedSchool.affiliation} />
                      <Text label="Status" value={selectedSchool.status} color={selectedSchool.status === 'Active' ? 'text-green-600' : 'text-red-600'} />
                    </Grid>
                  </Section>

                  <Section title="Super Admin Controls">
                    <div className="flex flex-wrap gap-3">
                      <ActionButton to={`/school/edit/${selectedSchool.schoolId}`} icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" label="Edit School" color="bg-indigo-600" hover="hover:bg-indigo-700" />
                      <ActionButton icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label="Update Fees" color="bg-yellow-600" hover="hover:bg-yellow-700" />
                      <ActionButton onClick={() => handleDelete(selectedSchool.schoolId)} icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12" label="Mark as Inactive" color="bg-red-600" hover="hover:bg-red-700" />
                    </div>
                  </Section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl shadow-sm">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
    {children}
  </div>
);

const Grid = ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">{children}</div>;

const Text = ({ label, value, color = 'text-gray-900' }) => (
  <p>{label}: <span className={`font-medium ${color}`}>{value}</span></p>
);

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-gray-600">
      <thead>
        <tr className="border-b">
          {headers.map((h, i) => (
            <th key={i} className="py-2 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b">
            {row.map((cell, j) => (
              <td key={j} className="py-2">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ActionButton = ({ to, onClick, icon, label, color, hover }) => {
  const baseClass = `px-4 py-2 ${color} text-white rounded-xl ${hover} transition-colors flex items-center gap-2`;
  return to ? (
    <Link to={to} className={baseClass}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </Link>
  ) : (
    <button onClick={onClick} className={baseClass}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </button>
  );
};

export default SuperAdminSchoolList;