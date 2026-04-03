import React, { useEffect, useState } from 'react'
import { UserCheck, UserIcon, UserX, UserPlus, Filter, X } from 'lucide-react'
import StandardStatCard from '../../../components/comman_components/StandardStatCard'
import ReusableTable from '../../../components/comman_components/ReusableTable'
import Header from '../../../components/comman_components/Header'
import Sidebar from '../Sidebar'
import {
    fetchEnquiryCount,
    fetchAllEnquiries,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry
} from '../../../helper/requests-method/apiMethods'

const EnquiryPage = () => {
    const [stats, setStats] = useState({
        totalEnquiries: 0,
        activeEnquiries: 0,
        inactiveEnquiries: 0,
        admittedEnquiries: 0,
    });

    const [enquiryData, setEnquiryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const buildEnquiryPayload = (data = {}) => ({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        className: data.className || '',
        address: data.address || '',
        parentName: data.parentName || '',
        oldSchool: data.oldSchool || '',
        source: data.source || '',
        description: data.description || '',
        status: data.status || '',
        date: data.date || data.enquiry_date || ''
    });

    // Define columns for enquiry management
    const enquiryColumns = [
        {
            key: 'name',
            header: 'Student Name',
            required: true,
            type: 'text',
            placeholder: 'Enter student name'
        },
        {
            key: 'phone',
            header: 'Phone Number',
            required: true,
            type: 'tel',
            placeholder: 'Enter phone number'
        },
        {
            key: 'email',
            header: 'Email',
            required: false,
            type: 'email',
            placeholder: 'Enter email address',
            hideInTable: true // Hide in table display but show in forms
        },
        {
            key: 'parentName',
            header: 'Parent Name',
            required: true,
            type: 'text',
            placeholder: 'Enter parent name'
        },
        {
            key: 'className',
            header: 'Class',
            required: true,
            type: 'select',
            options: [
                { value: 'Nursery', label: 'Nursery' },
                { value: 'LKG', label: 'LKG' },
                { value: 'UKG', label: 'UKG' },
                { value: 'Class 1', label: 'Class 1' },
                { value: 'Class 2', label: 'Class 2' },
                { value: 'Class 3', label: 'Class 3' },
                { value: 'Class 4', label: 'Class 4' },
                { value: 'Class 5', label: 'Class 5' },
                { value: 'Class 6', label: 'Class 6' },
                { value: 'Class 7', label: 'Class 7' },
                { value: 'Class 8', label: 'Class 8' },
                { value: 'Class 9', label: 'Class 9' },
                { value: 'Class 10', label: 'Class 10' },
                { value: 'Class 11', label: 'Class 11' },
                { value: 'Class 12', label: 'Class 12' }
            ]
        },
        {
            key: 'oldSchool',
            header: 'Previous School',
            required: false,
            type: 'text',
            placeholder: 'Enter previous school name',
            hideInTable: true // Hide in table display but show in forms
        },
        {
            key: 'source',
            header: 'Source',
            required: true,
            type: 'select',
            options: [
                { value: 'visit', label: 'Visit' },
                { value: 'social_media', label: 'Social Media' },
                { value: 'mobile', label: 'Mobile' },
                { value: 'referral', label: 'Referral' },
                { value: 'friend', label: 'Friend' },
                { value: 'parent', label: 'Parent' },
                { value: 'other', label: 'Other' }
            ],
            render: (value) => {
                const sourceMap = {
                    visit: 'Visit',
                    social_media: 'Social Media',
                    mobile: 'Mobile',
                    referral: 'Referral',
                    friend: 'Friend',
                    parent: 'Parent',
                    other: 'Other'
                };
                return sourceMap[value] || value || 'N/A';
            }
        },
        {
            key: 'date',
            header: 'Enquiry Date',
            required: true,
            type: 'date',
            render: (value, row) => {
                const dateValue = value || row?.enquiry_date;
                if (!dateValue) return 'N/A';
                try {
                    const date = new Date(dateValue);
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
            key: 'status',
            header: 'Status',
            required: true,
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'admitted', label: 'Admitted' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'emailenquiry', label: 'Email Enquiry' },
                { value: 'counsling_schedule', label: 'Counsling Schedule' }
            ],
            render: (value) => {
                const statusMap = {
                    active: { text: 'Active', color: 'bg-green-100 text-green-800' },
                    inactive: { text: 'Inactive', color: 'bg-yellow-100 text-yellow-800' },
                    admitted: { text: 'Admitted', color: 'bg-violet-100 text-violet-700' },
                    emailenquiry: { text: 'Email Enquiry', color: 'bg-blue-100 text-blue-800' },
                    counsling_schedule: { text: 'Counsling Schedule', color: 'bg-orange-100 text-orange-800' }
                };
                const status = statusMap[value] || { text: value || 'N/A', color: 'bg-gray-100 text-gray-800' };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                    </span>
                );
            }
        },
        {
            key: 'address',
            header: 'Address',
            required: false,
            type: 'textarea',
            placeholder: 'Enter complete address',
            hideInTable: true // Hide in table display but show in forms
        },
        {
            key: 'description',
            header: 'Description/Remarks',
            required: false,
            type: 'textarea',
            placeholder: 'Enter any additional information',
            hideInTable: true // Hide in table display but show in forms
        }
    ];

    // Filter columns for table display (exclude hideInTable columns)
    const displayColumns = enquiryColumns.filter(col => !col.hideInTable);

    // API functions for enquiry management
    const handleCreateEnquiry = async (enquiryData) => {
        try {
            setLoading(true);
            const response = await createEnquiry(buildEnquiryPayload(enquiryData));
            if (response.success) {
                // Refresh the enquiry list after successful creation
                await fetchEnquiries();
                return {
                    success: true,
                    message: response.message || 'Enquiry added successfully!'
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Failed to create enquiry'
                };
            }
        } catch (error) {
            console.error('Error creating enquiry:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create enquiry'
            };
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEnquiry = async (id, enquiryData) => {
        try {
            setLoading(true);
            const response = await updateEnquiry(id, buildEnquiryPayload(enquiryData));
            if (response.success) {
                // Refresh the enquiry list after successful update
                await fetchEnquiries();
                return {
                    success: true,
                    message: response.message || 'Enquiry updated successfully!'
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Failed to update enquiry'
                };
            }
        } catch (error) {
            console.error('Error updating enquiry:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update enquiry'
            };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEnquiry = async (id) => {
        try {
            setLoading(true);
            const response = await deleteEnquiry(id);
            if (response.success) {
                // Refresh the enquiry list after successful deletion
                await fetchEnquiries();
                return {
                    success: true,
                    message: response.message || 'Enquiry deleted successfully!'
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Failed to delete enquiry'
                };
            }
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete enquiry'
            };
        } finally {
            setLoading(false);
        }
    };

    // Fetch all enquiries from API
    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await fetchAllEnquiries();

            if (response.success && response.data) {
                setEnquiryData(response.data);
            } else {
                setEnquiryData([]);
            }
        } catch {
            setEnquiryData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await fetchEnquiryCount();
                if (res && res.success && res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error('Error fetching enquiry stats:', error);
            }
        };

        // Fetch both stats and enquiries on component mount
        getStats();
        fetchEnquiries();
    }, []);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        source: '',
        status: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        startDate: '',
        endDate: '',
        source: '',
        status: ''
    });

    // Filter Logic using appliedFilters instead of active filters
    const filteredEnquiryData = enquiryData.filter(enquiry => {
        // Date Filter
        let dateMatch = true;
        if (appliedFilters.startDate || appliedFilters.endDate) {
            const recordDate = enquiry.date || enquiry.enquiry_date;
            if (!recordDate) return false;

            const enquiryDate = new Date(recordDate);
            if (isNaN(enquiryDate.getTime())) return false;

            enquiryDate.setHours(0, 0, 0, 0);

            if (appliedFilters.startDate) {
                const start = new Date(appliedFilters.startDate);
                start.setHours(0, 0, 0, 0);
                if (enquiryDate < start) dateMatch = false;
            }
            if (appliedFilters.endDate) {
                const end = new Date(appliedFilters.endDate);
                end.setHours(0, 0, 0, 0);
                if (enquiryDate > end) dateMatch = false;
            }
        }

        // Source Filter
        const sourceMatch = !appliedFilters.source || enquiry.source === appliedFilters.source;

        // Status Filter
        const statusMatch = !appliedFilters.status || enquiry.status === appliedFilters.status;

        return dateMatch && sourceMatch && statusMatch;
    });

    const handleApplyFilters = () => {
        setAppliedFilters({ ...filters });
    };

    const handleClearFilters = () => {
        const cleared = { startDate: '', endDate: '', source: '', status: '' };
        setFilters(cleared);
        setAppliedFilters(cleared);
    };

    return (
        <div className="bg-slate-200 flex h-screen overflow-hidden">
            <Sidebar />

            <div
                className="overflow-auto relative z-1 flex-col"
                style={{
                    height: "100vh",
                    width: "100vw",
                    gap: "10px",
                    display: "flex",
                    transition: "margin-left 0.3s ease"
                }}
            >
                <Header />

                <main className="max-w-full py-4 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StandardStatCard name="Total Enquiry" icon={UserIcon} value={stats.totalEnquiries.toLocaleString()} color="#7c3aed" />
                        <StandardStatCard name="Active Enquiry" icon={UserCheck} value={stats.activeEnquiries.toLocaleString()} color="#f59e0b" />
                        <StandardStatCard name="InActive Enquiry" icon={UserX} value={stats.inactiveEnquiries.toLocaleString()} color="#ef4444" />
                        <StandardStatCard name="Admitted Enquiry" icon={UserPlus} value={stats.admittedEnquiries.toLocaleString()} color="#10b981" />
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
                        {/* Header Row */}
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={18} className="text-violet-600" />
                            <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
                        </div>

                        {/* Filters & Actions Grid - Using 12-column grid for precise width control */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-4 items-end">
                            {/* Date range - Giving it more columns (5/12) to prevent overflow */}
                            <div className="lg:col-span-5 space-y-1.5">
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">Date Range</label>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 focus-within:border-violet-400 transition-all">
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                            className="bg-transparent border-none p-0 text-sm focus:ring-0 outline-none text-gray-700 w-full cursor-pointer h-8"
                                            style={{ colorScheme: 'light' }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-gray-300 px-1">TO</span>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                            className="bg-transparent border-none p-0 text-sm focus:ring-0 outline-none text-gray-700 w-full cursor-pointer h-8"
                                            style={{ colorScheme: 'light' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Source dropdown - 2/12 columns */}
                            <div className="lg:col-span-2 space-y-1.5">
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">Source</label>
                                <select
                                    value={filters.source}
                                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-gray-700 cursor-pointer transition-all h-10.5"
                                >
                                    <option value="">All Sources</option>
                                    <option value="visit">Visit</option>
                                    <option value="social_media">Social Media</option>
                                    <option value="mobile">Mobile</option>
                                    <option value="referral">Referral</option>
                                    <option value="friend">Friend</option>
                                    <option value="parent">Parent</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Status dropdown - 2/12 columns */}
                            <div className="lg:col-span-2 space-y-1.5">
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-gray-700 cursor-pointer transition-all h-10.5"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="admitted">Admitted</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="emailenquiry">Email Enquiry</option>
                                    <option value="counsling_schedule">Counsling Schedule</option>
                                </select>
                            </div>

                            {/* Action Buttons - Remaining 3/12 columns */}
                            <div className="lg:col-span-3 flex items-center gap-3">
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 whitespace-nowrap"
                                >
                                    Apply Filters
                                </button>
                                {(filters.startDate || filters.endDate || filters.source || filters.status || appliedFilters.status || appliedFilters.source) && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                        title="Clear all filters"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <ReusableTable
                        title="Admission Enquiry"
                        initialData={filteredEnquiryData}
                        columns={enquiryColumns}
                        displayColumns={displayColumns}
                        apiFunction={handleCreateEnquiry}
                        updateApiFunction={handleUpdateEnquiry}
                        deleteApiFunction={handleDeleteEnquiry}
                        searchPlaceholder="Search by name, phone, email"
                        addButtonText="Add New Enquiry"
                        exportFileName="enquiries"
                        loading={loading}
                        showActions={{
                            add: true,
                            edit: true,
                            delete: true,
                            view: true
                        }}
                    />
                </main>
            </div>
        </div>
    )
}

export default EnquiryPage;