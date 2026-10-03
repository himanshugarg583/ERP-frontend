import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminSidebar from './SuperAdminSidebar';
import axios from 'axios';

const SuperAdminSchool = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const superAdminBaseUrl = String(import.meta.env.SCHOOL_ERP_BACKEND_URL || '').replace(/\/$/, '');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      schoolName: '',
      branch: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      contactNumber: '',
      email: '',
      webLink: '',
      board: '',
      affiliationNumber: '',
      stateBoardType: '',
      gstNumber: '',
    },
    mode: 'onChange',
  });

  const boardValue = watch('board');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${superAdminBaseUrl}/superAdmin/createSchool`,  
        data,
      );
      console.log('Form Data Submitted:', response.data);
      alert('School Details Saved Successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleNumericInput = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); 
    e.target.value = numericValue; 
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <SuperAdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <SuperAdminHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Add New School</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">School Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                    <input
                      {...register('schoolName', { required: 'This field cannot be empty' })}
                      placeholder="Enter school name"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                    <input
                      {...register('branch')}
                      placeholder="Enter branch name (if applicable)"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                    <textarea
                      {...register('address', { required: 'This field cannot be empty' })}
                      placeholder="Enter complete address"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      rows="2"/>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      {...register('city', { required: 'This field cannot be empty' })}
                      placeholder="Enter city"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      {...register('state', { required: 'This field cannot be empty' })}
                      placeholder="Enter state"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      {...register('pinCode', {
                        required: 'This field cannot be empty',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Must be exactly 6 digits',
                        },
                      })}
                      maxLength={6}
                      placeholder="Enter pincode"
                      onInput={handleNumericInput} 
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                      {...register('contactNumber', {
                        required: 'This field cannot be empty',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'Must be exactly 10 digits',
                        },
                      })}
                      maxLength={10}
                      placeholder="Enter contact number"
                      onInput={handleNumericInput} 
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      {...register('email', {
                        required: 'This field cannot be empty',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                      placeholder="Enter email address"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                    <input
                      {...register('webLink', {
                        pattern: {
                          value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                          message: 'Enter a valid URL',
                        },
                      })}
                      placeholder="Enter website URL"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.webLink && <p className="text-red-500 text-sm mt-1">{errors.webLink.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation Board *</label>
                    <select
                      {...register('board', { required: 'This field cannot be empty' })}
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                      <option value="">Select Affiliation Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="Others">Others</option>
                    </select>
                    {errors.board && <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation Number (Optional)</label>
                    <input
                      {...register('affiliationNumber', {
                        validate: (value) => {
                          if (!value) return true;
                          if (boardValue === 'CBSE' && !/^\d{6}$/.test(value)) {
                            return 'CBSE affiliation must be exactly 6 digits';
                          }
                          if (boardValue === 'ICSE' && !/^[A-Z]{2}\d{6}$/.test(value)) {
                            return 'ICSE affiliation must be 2 letters followed by 6 digits (e.g., WB123456)';
                          }
                          if (boardValue === 'State Board' && !/^[A-Z]{2}\/\d{5}\/\d{4}$/.test(value)) {
                            return 'State Board affiliation must follow pattern MH/12345/2024';
                          }
                          return true;
                        },
                      })}
                      placeholder="Enter affiliation number"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.affiliationNumber && <p className="text-red-500 text-sm mt-1">{errors.affiliationNumber.message}</p>}
                  </div>
                  {boardValue === 'State Board' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">State Board Type *</label>
                      <input
                        {...register('stateBoardType', {
                          required: boardValue === 'State Board' ? 'This field cannot be empty' : false,
                        })}
                        placeholder="Enter state board type"
                        className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                      {errors.stateBoardType && <p className="text-red-500 text-sm mt-1">{errors.stateBoardType.message}</p>}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                    <input
                      {...register('gstNumber', {
                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                          message: 'GST Number must be 15 characters (e.g., 22AAAAA0000A1Z5)',
                        },
                      })}
                      maxLength={15}
                      placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"/>
                    {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber.message}</p>}
                  </div>
                </div>
              </section>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                >
                  <FaSave className="mr-2" /> Save School
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminSchool;