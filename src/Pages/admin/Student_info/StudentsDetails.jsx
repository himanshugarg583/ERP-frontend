import React, { useEffect, useState, useCallback } from 'react';
import { Users, UserCheck, UserX, GraduationCap } from 'lucide-react';
import StandardStatCard from '../../../components/comman_components/StandardStatCard';
import ReusableTable from '../../../components/comman_components/ReusableTable';
import Header from '../../../components/comman_components/Header';
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
                // Map API response to table format
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

    // Handle update student - wrapper for ReusableTable
    const handleUpdateStudent = async (id, studentData) => {
        // Map class_section_id if it's a string value
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

    // Display columns (columns to show in table)
    const displayColumns = studentColumns.filter(col => !col.hideInTable);

    return (
        <div className="bg-slate-200 flex AddStudent">
            <Sidebar />
            <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
                <Header />
                <main className="w-full py-4 md:py-6 px-4 md:px-6">
                    <div className="space-y-4 md:space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        </div>

                        {/* Students Table */}
                        {loading && studentsData.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                <div className="text-center py-8 text-slate-500">Loading students...</div>
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
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="text-sm text-slate-600">
                                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => fetchStudents(pagination.page - 1, pagination.limit)}
                                                    disabled={pagination.page === 1 || loading}
                                                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => fetchStudents(pageNum, pagination.limit)}
                                                            disabled={loading}
                                                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                                                pagination.page === pageNum
                                                                    ? 'bg-violet-600 text-white'
                                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => fetchStudents(pagination.page + 1, pagination.limit)}
                                                    disabled={pagination.page === pagination.totalPages || loading}
                                                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentsDetails;

