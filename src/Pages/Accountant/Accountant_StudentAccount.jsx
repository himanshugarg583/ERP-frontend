import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye, FaTimes, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Sidebar from './Accountant_Sidebar';
import Header from './Accountant_Header';
import { getClassSectionDropdown, getStudentsByClass, getStudentFeeDetails } from '../../helper/requests-method/feeV1Api';
import { toast } from 'react-toastify';

const AccountantStudentAccounts = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [classSectionsList, setClassSectionsList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [studentsList, setStudentsList] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeDetails, setFeeDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        fetchClassSections();
    }, []);

    const fetchClassSections = async () => {
        try {
            const response = await getClassSectionDropdown();
            if (response?.success) {
                setClassSectionsList(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching class sections:', error);
            toast.error('Failed to fetch class sections');
        }
    };

    const handleClassSelection = async (e) => {
        const class_section_id = e.target.value;
        setSelectedClass(class_section_id);
        
        if (class_section_id) {
            setIsLoadingStudents(true);
            try {
                const response = await getStudentsByClass(class_section_id);
                if (response?.success) {
                    setStudentsList(response.data || []);
                } else {
                    setStudentsList([]);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students');
                setStudentsList([]);
            } finally {
                setIsLoadingStudents(false);
            }
        } else {
            setStudentsList([]);
        }
    };

    const handleViewDetails = async (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setIsLoadingDetails(true);
        setFeeDetails(null);
        
        try {
            const response = await getStudentFeeDetails(student.id);
            if (response?.success) {
                setFeeDetails(response.data);
            } else {
                toast.error('Failed to fetch fee details');
            }
        } catch (error) {
            console.error('Error fetching fee details:', error);
            toast.error('Failed to fetch student fee details');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setFeeDetails(null);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            paid: { bg: 'bg-green-100', text: 'text-green-800', icon: <FaCheckCircle className="inline mr-1" /> },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaClock className="inline mr-1" /> },
            partial: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <FaClock className="inline mr-1" /> },
            overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: <FaTimesCircle className="inline mr-1" /> }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon}
                {status}
            </span>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 overflow-y-auto lg:ml-64">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <div className="p-4 md:p-6">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center text-indigo-700">
                        Student Accounts
                    </h1>

                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FaUsers className="text-teal-600 text-2xl" />
                            <h2 className="text-xl font-semibold text-gray-800">View Students by Class</h2>
                        </div>

                        {/* Class Section Selector */}
                        <div className="mb-6 max-w-md">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Select Class/Section <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedClass}
                                onChange={handleClassSelection}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">-- Select Class/Section --</option>
                                {classSectionsList.map((cs) => (
                                    <option key={cs.id} value={cs.id}>
                                        {cs.class_name} - {cs.section_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Students List */}
                        {selectedClass && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Students List</h3>
                                {isLoadingStudents ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">Loading students...</p>
                                    </div>
                                ) : studentsList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-teal-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Roll Number</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Gender</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone Number</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Father Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {studentsList.map((student, index) => (
                                                    <tr key={student.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {student.roll_number || <span className="text-gray-400">N/A</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {student.name}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {student.gender ? (
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    student.gender === 'male' 
                                                                        ? 'bg-blue-100 text-blue-800' 
                                                                        : 'bg-pink-100 text-pink-800'
                                                                }`}>
                                                                    {student.gender}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">N/A</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {student.phone_no || <span className="text-gray-400">N/A</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {student.father_name && student.father_name !== 'N/A' ? student.father_name : <span className="text-gray-400">N/A</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => handleViewDetails(student)}
                                                                className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                                            >
                                                                <FaEye className="mr-1.5" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                                            <p className="text-sm text-teal-700">
                                                <strong>Total Students:</strong> {studentsList.length}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-lg">No students found for this class</p>
                                        <p className="text-sm mt-1">Try selecting a different class</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fee Details Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-white bg-opacity-40 transition-opacity backdrop-blur-sm" onClick={closeModal}></div>

                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900">Student Fee Details</h3>
                                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                                <FaTimes className="h-6 w-6" />
                                            </button>
                                        </div>

                                        {isLoadingDetails ? (
                                            <div className="text-center py-12">
                                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                                                <p className="mt-4 text-gray-600">Loading fee details...</p>
                                            </div>
                                        ) : feeDetails ? (
                                            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                                                {/* Student Info */}
                                                <div className="bg-linear-to-r from-teal-50 to-blue-50 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Student Information</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Name</p>
                                                            <p className="font-medium">{feeDetails.student_info?.User?.name || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Roll Number</p>
                                                            <p className="font-medium">{feeDetails.student_info?.roll_number || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Class</p>
                                                            <p className="font-medium">
                                                                {feeDetails.student_info?.ClassSection?.class_name} - {feeDetails.student_info?.ClassSection?.section}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Gender</p>
                                                            <p className="font-medium capitalize">{feeDetails.student_info?.gender || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Phone</p>
                                                            <p className="font-medium">{feeDetails.student_info?.phone_no || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Email</p>
                                                            <p className="font-medium text-sm">{feeDetails.student_info?.User?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fee Summary */}
                                                <div className="bg-white border-2 border-teal-200 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Fee Summary</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Original Amount</p>
                                                            <p className="font-bold text-lg text-gray-900">₹{parseFloat(feeDetails.fee_summary?.total_original_amount || 0).toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Discount</p>
                                                            <p className="font-bold text-lg text-orange-600">₹{parseFloat(feeDetails.fee_summary?.total_discount_amount || 0).toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Final Amount</p>
                                                            <p className="font-bold text-lg text-indigo-600">₹{parseFloat(feeDetails.fee_summary?.total_final_amount || 0).toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Fees Assigned</p>
                                                            <p className="font-bold text-lg text-gray-700">{feeDetails.fee_summary?.total_fees_assigned || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fee Details with Installments */}
                                                {feeDetails.fee_details && feeDetails.fee_details.length > 0 ? (
                                                    <div>
                                                        <h4 className="font-semibold text-lg mb-3 text-gray-800">Fee Details & Installments</h4>
                                                        {feeDetails.fee_details.map((fee, index) => (
                                                            <div key={fee.id} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                                                                {/* Fee Info */}
                                                                <div className="bg-gray-50 p-4">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h5 className="font-semibold text-gray-900">Academic Year: {fee.academic_year}</h5>
                                                                            <div className="mt-2 flex gap-4">
                                                                                <p className="text-sm text-gray-600">Original: <span className="font-medium text-gray-900">₹{parseFloat(fee.original_amount).toLocaleString()}</span></p>
                                                                                {fee.discount_amount > 0 && (
                                                                                    <p className="text-sm text-gray-600">Discount: <span className="font-medium text-orange-600">₹{parseFloat(fee.discount_amount).toLocaleString()}</span></p>
                                                                                )}
                                                                                <p className="text-sm text-gray-600">Final: <span className="font-medium text-indigo-600">₹{parseFloat(fee.final_amount).toLocaleString()}</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Installments Table */}
                                                                {fee.installments && fee.installments.length > 0 && (
                                                                    <div className="overflow-x-auto">
                                                                        <table className="min-w-full divide-y divide-gray-200">
                                                                            <thead className="bg-gray-100">
                                                                                <tr>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Installment #</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Paid Amount</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                                {fee.installments.map((inst) => (
                                                                                    <tr key={inst.id} className="hover:bg-gray-50">
                                                                                        <td className="px-4 py-2 text-sm font-medium">#{inst.installment_number}</td>
                                                                                        <td className="px-4 py-2 text-sm font-medium">₹{parseFloat(inst.amount).toLocaleString()}</td>
                                                                                        <td className="px-4 py-2 text-sm font-medium text-green-600">₹{parseFloat(inst.paid_amount).toLocaleString()}</td>
                                                                                        <td className="px-4 py-2 text-sm">{getStatusBadge(inst.status)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>No fee details available</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>Failed to load fee details</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            onClick={closeModal}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AccountantStudentAccounts;