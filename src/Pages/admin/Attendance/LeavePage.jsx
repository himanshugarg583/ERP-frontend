import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import StandardStatCard from "../../../components/comman_components/StandardStatCard";
import ReusableTable from "../../../components/comman_components/ReusableTable";
import { Users, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { getAllLeaves, updateLeaveStatus, applyLeave, getAllClassesDropdown, getAllStudentsByClass } from "../../../helper/requests-method/apiMethods";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeavePage = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Form state for applying leave
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    class_id: '',
    start_date: '',
    end_date: '',
    leave_type: '',
    reason: '',
  });

  // Define columns for leave management
  const leaveColumns = [
    { 
      key: 'student_name', 
      header: 'Student Name', 
      required: true,
      type: 'text',
      placeholder: 'Enter student name',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'student_id', 
      header: 'Student ID', 
      required: false,
      type: 'text',
      placeholder: 'Enter student ID',
      hideInTable: true
    },
    { 
      key: 'class', 
      header: 'Class', 
      required: false,
      type: 'text',
      placeholder: 'Enter class',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'start_date', 
      header: 'Start Date', 
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
      key: 'end_date', 
      header: 'End Date', 
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
      key: 'total_days', 
      header: 'Total Days', 
      required: false,
      type: 'number',
      placeholder: 'Enter total days',
      render: (value) => value ? `${value} days` : 'N/A'
    },
    { 
      key: 'leave_type', 
      header: 'Leave Type',
      required: true,
      type: 'select',
      options: [
        { value: 'sick', label: 'Sick' },
        { value: 'casual', label: 'Casual' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'other', label: 'Other' }
      ],
      render: (value) => {
        if (!value) return 'N/A';
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      required: true,
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ],
      render: (value) => {
        if (!value) return 'N/A';
        const statusLower = value.toLowerCase();
        const statusClass = statusLower === 'approved' 
          ? 'bg-green-100 text-green-800' 
          : statusLower === 'rejected' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-yellow-100 text-yellow-800';
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    { 
      key: 'reason', 
      header: 'Reason', 
      required: true,
      type: 'textarea',
      placeholder: 'Enter reason for leave',
      hideInTable: true
    },
    { 
      key: 'rejection_reason', 
      header: 'Rejection Reason', 
      required: false,
      type: 'textarea',
      placeholder: 'Enter rejection reason',
      hideInTable: true
    }
  ];

  // Filter columns for table display (exclude hideInTable columns)
  const displayColumns = leaveColumns.filter(col => !col.hideInTable);

  // Fetch all leaves from API
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await getAllLeaves();
      
      if (response.success && response.data && response.data.leaves) {
        const mappedLeaves = response.data.leaves.map(leave => ({
          id: leave.leave_id || leave.id,
          leave_id: leave.leave_id || leave.id,
          student_name: leave.student_name || (leave.student?.User?.name) || '-',
          student_id: leave.student_id || '-',
          class: leave.class || (leave.student?.ClassSection ? `${leave.student.ClassSection.class_name}-${leave.student.ClassSection.section_name}` : '-'),
          from: leave.from || leave.start_date || '-',
          to: leave.to || leave.end_date || '-',
          start_date: leave.start_date || leave.from || '-',
          end_date: leave.end_date || leave.to || '-',
          total_days: leave.total_days || '-',
          leave_type: leave.leave_type || '-',
          reason: leave.reason || '-',
          status: leave.status || 'pending',
          approved_by: leave.approved_by || '-',
          rejection_reason: leave.rejection_reason || '',
          attachment: leave.attachment || '',
          created_at: leave.created_at || '-',
        }));
        
        setLeaveData(mappedLeaves);
        
        // Calculate stats
        const totalLeaves = mappedLeaves.length;
        const pending = mappedLeaves.filter(l => (l.status || '').toLowerCase() === 'pending').length;
        const approved = mappedLeaves.filter(l => (l.status || '').toLowerCase() === 'approved').length;
        const rejected = mappedLeaves.filter(l => (l.status || '').toLowerCase() === 'rejected').length;
        
        setStats({
          totalLeaves,
          pending,
          approved,
          rejected,
        });
      } else {
        setLeaveData([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching leave applications');
      setLeaveData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes for dropdown
  const fetchClasses = async () => {
    try {
      const response = await getAllClassesDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        toast.error('Failed to fetch classes');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching classes');
    }
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classId) => {
    if (!classId) {
      setStudents([]);
      setFormData({ ...formData, student_id: '', class_id: '' });
      return;
    }

    try {
      setIsLoadingStudents(true);
      const response = await getAllStudentsByClass(classId);
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        toast.error('Failed to fetch students');
        setStudents([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching students');
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setFormData({ ...formData, class_id: classId, student_id: '' });
    fetchStudentsByClass(classId);
  };

  // Handle form input changes
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentFile(file);
    }
  };

  // Handle leave submission
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.class_id || !formData.student_id || !formData.start_date || !formData.end_date || !formData.leave_type || !formData.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        student_id: parseInt(formData.student_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        leave_type: formData.leave_type,
        reason: formData.reason,
      };

      const response = await applyLeave(payload, attachmentFile);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Leave application submitted successfully!');
        // Reset form
        setFormData({
          student_id: '',
          class_id: '',
          start_date: '',
          end_date: '',
          leave_type: '',
          reason: '',
        });
        setSelectedClassId('');
        setStudents([]);
        setAttachmentFile(null);
        setIsFormOpen(false);
        // Reset file input
        const fileInput = document.getElementById('attachment');
        if (fileInput) fileInput.value = '';
        // Refresh leaves list
        fetchLeaves();
      } else {
        toast.error('Failed to submit leave application');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while submitting the leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchClasses();
  }, []);

  // Handle update leave status (this will be called from ReusableTable's edit)
  const handleUpdateLeave = async (id, leaveData) => {
    try {
      setLoading(true);
      const payload = {
        status: leaveData.status,
        ...(leaveData.rejection_reason && { rejection_reason: leaveData.rejection_reason }),
      };

      const response = await updateLeaveStatus(id, payload);
      
      if (response.success || response.message) {
        await fetchLeaves();
        return { 
          success: true, 
          message: response.message || 'Leave status updated successfully!'
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Failed to update leave status' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update leave status' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle create leave (not used in admin, but required by ReusableTable)
  const handleCreateLeave = async (leaveData) => {
    return { 
      success: false, 
      message: 'Please use the student portal to apply for leave' 
    };
  };

  // Handle delete leave (not used in admin, but required by ReusableTable)
  const handleDeleteLeave = async (id) => {
    return { 
      success: false, 
      message: 'Delete functionality not available for admin' 
    };
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
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="max-w-full py-4 px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StandardStatCard 
              name="Total Leaves" 
              icon={Users} 
              value={stats.totalLeaves.toLocaleString()} 
              color="#7c3aed"
            />
            <StandardStatCard 
              name="Pending" 
              icon={Clock} 
              value={stats.pending.toLocaleString()} 
              color="#f59e0b"
            />
            <StandardStatCard 
              name="Approved" 
              icon={CheckCircle} 
              value={stats.approved.toLocaleString()} 
              color="#10b981"
            />
            <StandardStatCard 
              name="Rejected" 
              icon={XCircle} 
              value={stats.rejected.toLocaleString()} 
              color="#ef4444"
            />
          </div>

          {/* Apply Leave Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Apply for Student Leave
                </h2>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base"
                >
                  <Plus size={18} />
                  {isFormOpen ? 'Hide Form' : 'Apply Leave'}
                </button>
              </div>
            </div>

            {isFormOpen && (
              <div className="p-4 sm:p-6">
                <form onSubmit={handleLeaveSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Class <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="class_id"
                        value={selectedClassId}
                        onChange={handleClassChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name} - {cls.section_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Student Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleFormInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!selectedClassId || isLoadingStudents}
                        required
                      >
                        <option value="">
                          {isLoadingStudents ? 'Loading students...' : selectedClassId ? 'Select Student' : 'Please select class first'}
                        </option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Leave Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="leave_type"
                        value={formData.leave_type}
                        onChange={handleFormInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 cursor-pointer"
                        required
                      >
                        <option value="">Select Leave Type</option>
                        <option value="sick">Sick</option>
                        <option value="casual">Casual</option>
                        <option value="emergency">Emergency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleFormInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleFormInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Reason for Leave <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleFormInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200 resize-y"
                        placeholder="Explain the reason for leave request"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Attachment (Optional)
                      </label>
                      <input
                        type="file"
                        id="attachment"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-colors duration-200"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      {attachmentFile && (
                        <p className="text-sm text-gray-600 mt-1">Selected: {attachmentFile.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setFormData({
                          student_id: '',
                          class_id: '',
                          start_date: '',
                          end_date: '',
                          leave_type: '',
                          reason: '',
                        });
                        setSelectedClassId('');
                        setStudents([]);
                        setAttachmentFile(null);
                        const fileInput = document.getElementById('attachment');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2.5 rounded-md font-medium transition-colors duration-200 text-sm cursor-pointer ${
                        isSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-violet-600 text-white hover:bg-violet-700'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Leave Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <ReusableTable
            title="Leave Management"
            initialData={leaveData}
            columns={leaveColumns}
            displayColumns={displayColumns}
            apiFunction={handleCreateLeave}
            updateApiFunction={handleUpdateLeave}
            deleteApiFunction={handleDeleteLeave}
            searchPlaceholder="Search by student name, class, leave type"
            addButtonText="Add New Leave"
            exportFileName="leaves"
            loading={loading}
            showActions={{
              add: false, // Admin doesn't add leaves, students do
              edit: true,
              delete: false, // Admin doesn't delete leaves
              view: true
            }}
          />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default LeavePage;
