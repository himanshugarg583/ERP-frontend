import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, GraduationCap, Search, Filter, X } from 'lucide-react';
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
    fetchClassDropdown,
    API_ENDPOINTS,
    authorizedGet
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
    const [selectedClass, setSelectedClass] = useState('');
    const [appliedClass, setAppliedClass] = useState('');

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

    // Fetch students with pagination and filter
    const fetchStudents = useCallback(async (page = 1, limit = 10, classId = '') => {
        setLoading(true);
        try {
            const url = `${API_ENDPOINTS.GET_ALL_STUDENTS}?page=${page}&limit=${limit}${classId ? `&class_section_id=${classId}` : ''}`;
            const response = await authorizedGet(url);
            if (response.success && response.data) {
                const mappedData = response.data.map((student) => ({
                    id: student.student_id,
                    student_id: student.student_id,
                    name: student.User?.name || 'N/A',
                    roll_number: student.roll_number || 'N/A',
                    class_name: student.ClassSection?.class_name || 'N/A',
                    section_name: student.ClassSection?.section_name || 'N/A',
                    class_section_id: student.class_section_id || '',
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
                // Store raw data for advanced filtering
                setRawClassData(response.data);

                const mappedClasses = response.data.map((cls) => ({
                    value: cls.id.toString(),
                    label: `${cls.class_name}${cls.section_name ? ` - ${cls.section_name}` : ''}`,
                    class_name: cls.class_name,
                    section_name: cls.section_name
                }));
                setClassOptions(mappedClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, []);

    const [rawClassData, setRawClassData] = useState([]);
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');

    useEffect(() => {
        fetchStats();
        fetchStudents(1, 10, appliedClass);
        fetchClasses();
    }, [fetchStats, fetchStudents, fetchClasses, refreshKey, appliedClass]);

    const handleSearch = () => {
        // Find the ID that matches both class and section
        console.log('Searching for:', { filterClass, filterSection });

        let targetId = '';
        if (filterClass && filterSection) {
            const match = rawClassData.find(
                item => item.class_name === filterClass && item.section_name === filterSection
            );
            if (match) targetId = match.id.toString();
        } else if (filterClass) {
            // Find first match if only class is selected? 
            // Or maybe the first ID for this class. 
            // Better to show nothing if not fully specified if the API requires IDs
            const match = rawClassData.find(item => item.class_name === filterClass);
            if (match) targetId = match.id.toString();
        }

        setAppliedClass(targetId);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleReset = () => {
        setFilterClass('');
        setFilterSection('');
        setSelectedClass('');
        setAppliedClass('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

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
            key: 'name',
            header: 'Student Name',
            required: true,
            type: 'text',
        },
        {
            key: 'class_name',
            header: 'Class',
            required: true,
            type: 'text',
        },
        {
            key: 'section_name',
            header: 'Section',
            required: true,
            type: 'text',
        },
        {
            key: 'roll_number',
            header: 'Roll Number',
            required: true,
            type: 'text',
        },
        {
            key: 'class_section_id',
            header: 'Class ID',
            required: true,
            type: 'select',
            options: classOptions,
            hideInTable: true
        }
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

                        {/* Filter Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-5"
                        >
                            <div className="flex flex-col lg:flex-row items-end gap-6">
                                {/* Class Filter */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        Select Class
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filterClass}
                                            onChange={(e) => {
                                                setFilterClass(e.target.value);
                                                setFilterSection(''); // Reset section when class changes
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 cursor-pointer appearance-none transition-all"
                                        >
                                            <option value="">All Classes</option>
                                            {[...new Set(rawClassData.map(item => item.class_name))].map(className => (
                                                <option key={className} value={className}>{className}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Filter size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Filter */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        Select Section
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filterSection}
                                            onChange={(e) => setFilterSection(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 cursor-pointer appearance-none transition-all shadow-sm active:bg-white"
                                        >
                                            <option value="">All Sections</option>
                                            {['A', 'B', 'C', 'D', 'E'].map(sec => (
                                                <option key={sec} value={sec}>{sec}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Filter size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSearch}
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer"
                                    >
                                        <Search size={18} />
                                        Search
                                    </motion.button>

                                    {(filterClass || filterSection || appliedClass) && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleReset}
                                            className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-red-50 cursor-pointer"
                                        >
                                            <X size={18} />
                                            Reset
                                        </motion.button>
                                    )}
                                </div>
                            </div>
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
