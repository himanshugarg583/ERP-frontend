import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, GraduationCap, Search, Filter } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import Header from '../../../components/comman_components/Header';
import Footer from '../../../components/comman_components/Footer';
import Sidebar from '../Sidebar';
import { toast } from 'react-toastify';
import {
    getAllStudents,
    getStudentStats,
    updateStudent,
    fetchClassDropdown
} from '../../../helper/requests-method/apiMethods';

const StudentsDetails = () => {
    const [stats, setStats] = useState({
        totalActiveStudents: 0,
        maleStudents: 0,
        femaleStudents: 0,
    });

    const [studentsData, setStudentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [classOptions, setClassOptions] = useState([]);

    // Fetch student stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await getStudentStats();
            if (response.success && response.data) {
                setStats({
                    totalActiveStudents: response.data.totalActiveStudents || 0,
                    maleStudents: response.data.maleStudents || 0,
                    femaleStudents: response.data.femaleStudents || 0,
                });
            }
        } catch (error) {
            console.error('Error fetching student stats:', error);
        }
    }, []);

    // Fetch students with pagination
    const fetchStudents = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await getAllStudents(page, limit);
            if (response.success && response.data) {
                const mappedData = response.data.map((student) => ({
                    id: student.student_id,
                    student_id: student.student_id,
                    name: student.User?.name || 'N/A',
                    roll_number: student.roll_number || 'N/A',
                    class_name: student.ClassSection?.class_name || 'N/A',
                    section_name: student.ClassSection?.section_name || '',
                    father_name: student.parentDetails?.father_name || 'N/A',
                    email: student.User?.email || 'N/A',
                    phone_no: student.User?.phone_no || 'N/A',
                    dob: student.User?.dob || '',
                    gender: student.User?.gender || '',
                    address: student.User?.address || '',
                }));
                setStudentsData(mappedData);

                if (response.pagination) {
                    setPagination({
                        page: response.pagination.page || page,
                        limit: response.pagination.limit || limit,
                        total: response.pagination.total || 0,
                        totalPages: response.pagination.totalPages || 0,
                    });
                }
            } else {
                toast.error(response.message || 'Failed to fetch students');
                setStudentsData([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch students');
            setStudentsData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch class options for dropdown
    const fetchClasses = useCallback(async () => {
        try {
            const response = await fetchClassDropdown();
            if (response.success && response.data) {
                const mappedClasses = response.data.map((cls) => ({
                    value: cls.id.toString(),
                    label: `${cls.class_name}${cls.section_name ? ` - ${cls.section_name}` : ''}`,
                }));
                setClassOptions(mappedClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchStudents(1, 10);
        fetchClasses();
    }, [fetchStats, fetchStudents, fetchClasses, refreshKey]);

    // Handle update student
    const handleUpdateStudent = async (id, studentData) => {
        const updateData = { ...studentData };
        if (updateData.class_section_id && typeof updateData.class_section_id === 'string') {
            updateData.class_section_id = parseInt(updateData.class_section_id);
        }

        const response = await updateStudent(id, updateData);
        if (response.success) {
            toast.success(response.message || 'Student updated successfully');
            setRefreshKey(prev => prev + 1);
            fetchStats();
            return response;
        } else {
            toast.error(response.message || 'Failed to update student');
            throw new Error(response.message || 'Failed to update student');
        }
    };

    // Define columns for student management
    const studentColumns = [
        {
            key: 'student_id',
            header: 'Student ID',
            required: false,
            type: 'text',
            hideInTable: true
        },
        {
            key: 'name',
            header: 'Student Name',
            required: true,
            type: 'text',
            placeholder: 'Enter student name'
        },
        {
            key: 'roll_number',
            header: 'Roll Number',
            required: false,
            type: 'text',
            placeholder: 'Enter roll number'
        },
        {
            key: 'email',
            header: 'Email',
            required: true,
            type: 'email',
            placeholder: 'Enter email address'
        },
        {
            key: 'phone_no',
            header: 'Phone Number',
            required: true,
            type: 'tel',
            placeholder: 'Enter phone number'
        },
        {
            key: 'class_section_id',
            header: 'Class & Section',
            required: true,
            type: 'select',
            options: classOptions,
            placeholder: 'Select class & section'
        },
        {
            key: 'dob',
            header: 'Date of Birth',
            required: true,
            type: 'date',
            render: (value) => {
                if (!value) return 'N/A';
                try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return 'Invalid Date';
                    return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } catch {
                    return 'Invalid Date';
                }
            }
        },
        {
            key: 'gender',
            header: 'Gender',
            required: true,
            type: 'select',
            options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
            ],
            render: (value) => {
                if (!value) return 'N/A';
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        {
            key: 'address',
            header: 'Address',
            required: false,
            type: 'textarea',
            placeholder: 'Enter address',
            hideInTable: true
        },
        {
            key: 'father_name',
            header: 'Father Name',
            required: false,
            type: 'text',
            placeholder: 'Enter father name',
            hideInTable: true
        },
    ];

    const displayColumns = studentColumns.filter(col => !col.hideInTable);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex AddStudent">
            <Sidebar />
            <div
                className='overflow-auto relative z-1 flex flex-col'
                style={{
                    height: '100vh',
                    width: '100vw',
                    transition: 'margin-left 0.3s ease'
                }}
            >
                <Header />
                <main className="flex-1 overflow-auto w-full py-6 px-4 md:px-6">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Students Details
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Manage and view all student information
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            <StandardStatCard
                                name="Total Active Students"
                                icon={Users}
                                value={stats.totalActiveStudents}
                                color="#6366f1"
                            />
                            <StandardStatCard
                                name="Male Students"
                                icon={UserCheck}
                                value={stats.maleStudents}
                                color="#3b82f6"
                            />
                            <StandardStatCard
                                name="Female Students"
                                icon={UserX}
                                value={stats.femaleStudents}
                                color="#ec4899"
                            />
                        </motion.div>

                        {/* Students Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {loading && studentsData.length === 0 ? (
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-slate-600 font-medium">Loading students...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ReusableTable
                                        title="Students List"
                                        columns={studentColumns}
                                        displayColumns={displayColumns}
                                        apiFunction={null}
                                        updateApiFunction={handleUpdateStudent}
                                        initialData={studentsData}
                                        searchPlaceholder="Search students by name, roll number, email..."
                                        addButtonText="Add Student"
                                        exportFileName="students_details"
                                        showActions={{ add: false, edit: true, delete: false, view: true }}
                                    />

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 mt-4"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="text-sm text-slate-600 font-medium">
                                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
                                                </div>
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => fetchStudents(pagination.page - 1, pagination.limit)}
                                                        disabled={pagination.page === 1 || loading}
                                                        className="px-4 py-2 text-sm bg-white hover:bg-indigo-50 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 font-medium"
                                                    >
                                                        Previous
                                                    </motion.button>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                                            let pageNum;
                                                            if (pagination.totalPages <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (pagination.page <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                                pageNum = pagination.totalPages - 4 + i;
                                                            } else {
                                                                pageNum = pagination.page - 2 + i;
                                                            }
                                                            return (
                                                                <motion.button
                                                                    key={pageNum}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => fetchStudents(pageNum, pagination.limit)}
                                                                    disabled={loading}
                                                                    className={`px-3 py-2 text-sm rounded-lg transition-all font-medium ${pagination.page === pageNum
                                                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                                                            : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
                                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                                >
                                                                    {pageNum}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => fetchStudents(pagination.page + 1, pagination.limit)}
                                                        disabled={pagination.page === pagination.totalPages || loading}
                                                        className="px-4 py-2 text-sm bg-white hover:bg-indigo-50 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 font-medium"
                                                    >
                                                        Next
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default StudentsDetails;
