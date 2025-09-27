import React, { useEffect, useState } from 'react'
import { UserCheck, UserIcon, UserX, UserPlus } from 'lucide-react'
import StatCards from '../../../components/comman_components/StatsCards'
import ReusableTable from '../../../components/comman_components/ReusableTable'
import Header from '../../../components/comman_components/Header'
import Sidebar from '../Sidebar'
import EnquiryAddForm from '../../../components/enquiry/EnquiryAddForm'
import EnquiryEditForm from '../../../components/enquiry/EnquiryEditForm'
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
            key: 'address', 
            header: 'Address', 
            required: false,
            type: 'textarea',
            placeholder: 'Enter complete address',
            hideInTable: true // Hide in table display but show in forms
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
            key: 'description', 
            header: 'Description/Remarks', 
            required: false,
            type: 'textarea',
            placeholder: 'Enter any additional information',
            hideInTable: true // Hide in table display but show in forms
        },
        { 
            key: 'enquiry_date', 
            header: 'Enquiry Date', 
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
            key: 'status', 
            header: 'Status',
            required: true,
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'admitted', label: 'Admitted' }
            ],
            render: (value) => {
                const statusMap = {
                    active: { text: 'Active', color: 'bg-green-100 text-green-800' },
                    inactive: { text: 'Inactive', color: 'bg-yellow-100 text-yellow-800' },
                    admitted: { text: 'Admitted', color: 'bg-blue-100 text-blue-800' }
                };
                const status = statusMap[value] || statusMap.active;
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                    </span>
                );
            }
        }
    ];

    // Filter columns for table display (exclude hideInTable columns)
    const displayColumns = enquiryColumns.filter(col => !col.hideInTable);

    // API functions for enquiry management
    const handleCreateEnquiry = async (enquiryData) => {
        try {
            setLoading(true);
            const response = await createEnquiry(enquiryData);
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
            console.log('Updating enquiry with ID:', id, 'Data:', enquiryData); // Debug log
            const response = await updateEnquiry(id, enquiryData);
            console.log('Update response:', response); // Debug log
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
            console.log('Fetching enquiries...');
            const response = await fetchAllEnquiries();
            console.log('API Response:', response);
            
            if (response.success && response.data) {
                console.log('Enquiry data received:', response.data);
                setEnquiryData(response.data);
            } else {
                console.error('Failed to fetch enquiries:', response.message);
                setEnquiryData([]);
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error);
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
    
    return (
        <div className="bg-gray-100 flex h-screen overflow-hidden">
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
                
                <main className="max-w-full py-6 px-4 lg:px-8">
                    <div
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-7"
                    >  
                        <StatCards name="Total Enquiry" icon={UserIcon} value={stats.totalEnquiries.toLocaleString()} color="#6366f1"/>
                        <StatCards name="Active Enquiry" icon={UserCheck} value={stats.activeEnquiries.toLocaleString()} color="#f59e0b" />
                        <StatCards name="InActive Enquiry" icon={UserX} value={stats.inactiveEnquiries.toLocaleString()} color="#ef4444" />
                        <StatCards name="Admitted Enquiry" icon={UserPlus} value={stats.admittedEnquiries.toLocaleString()} color="#10b981" />
                    </div>
                    
                    <ReusableTable
                        title="Admission Enquiry"
                        initialData={enquiryData}
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