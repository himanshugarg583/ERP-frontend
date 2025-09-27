import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import SuperAdminHeader from './SuperAdminHeader'; 
import SuperAdminSidebar from './SuperAdminSidebar'; 
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 

const initialAdmins = [
  { id: 1, name: 'John Doe', email: 'john@xyz.com', phone: '1234567890', school: 'XYZ School', branch: 'Main', lastLogin: '12 Mar 2025', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@abc.com', phone: '0987654321', school: 'ABC School', branch: 'Secondary', lastLogin: '10 Mar 2025', status: 'Inactive' },
];

const SuperAdminDetails = () => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm({ mode: 'onChange' });
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const addAdmin = (data) => {
    if (isEditing) {
      setAdmins(admins.map(admin => 
        admin.id === editingId ? { ...data, id: editingId, lastLogin: admin.lastLogin, status: admin.status } : admin
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const tempPassword = Math.random().toString(36).slice(-8);
      const newAdminData = { ...data, id: admins.length + 1, lastLogin: 'N/A', status: 'Active', password: tempPassword };
      setAdmins([...admins, newAdminData]);
    }
    reset();
  };

  const deleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  const editAdmin = (admin) => {
    setIsEditing(true);
    setEditingId(admin.id);
    setValue('name', admin.name);
    setValue('email', admin.email);
    setValue('phone', admin.phone);
    setValue('school', admin.school);
    setValue('branch', admin.branch);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.school.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10">
        <SuperAdminSidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64"> 
        <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md z-20">
          <SuperAdminHeader />
        </div>
        <main className="flex-1 pt-16 px-6 pb-6 mt-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? 'Edit Admin' : 'Add New Admin'}
            </h2>
            <form onSubmit={handleSubmit(addAdmin)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  {...register('name', { required: 'Full Name is required' })} 
                  className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}/>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })} 
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}/>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Phone number must be exactly 10 digits'
                    }
                  })} 
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={10}
                  className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}/>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="School Name" 
                  {...register('school', { required: 'School name is required' })} 
                  className={`border ${errors.school ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}/>
                {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school.message}</p>}
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Branch" 
                  {...register('branch', { required: 'Branch is required' })} 
                  className={`border ${errors.branch ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}/>
                {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>}
              </div>

              <button 
                type="submit" 
                className="bg-blue-600 text-white rounded-lg p-3 flex items-center justify-center hover:bg-blue-700 transition duration-200">
                {isEditing ? (
                  <>
                    <FaEdit className="mr-2" /> Update Admin
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Admin
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Admin List Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Admin List</h2>
              <input 
                type="text" 
                placeholder="Search by Name, Email, School, or Branch" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdmins.map(admin => (
                <div 
                  key={admin.id} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <h3 className="font-semibold text-lg text-gray-800">{admin.name}</h3>
                  <p className="text-gray-600">Email: {admin.email}</p>
                  <p className="text-gray-600">Phone: {admin.phone}</p>
                  <p className="text-gray-600">School: <span className="font-medium">{admin.school}</span></p>
                  <p className="text-gray-600">Branch: <span className="font-medium">{admin.branch}</span></p>
                  <p className="text-gray-600">Last Login: {admin.lastLogin}</p>
                  <p className="text-gray-600">Status: 
                    <span className={`ml-2 ${admin.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                      {admin.status === 'Active' ? '● Active' : '● Inactive'}
                    </span>
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <button 
                      onClick={() => editAdmin(admin)} 
                      className="text-blue-600 hover:text-blue-800 flex items-center transition">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => deleteAdmin(admin.id)} 
                      className="text-red-600 hover:text-red-800 flex items-center transition">
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDetails;