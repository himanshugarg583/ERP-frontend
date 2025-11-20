import React, { useState, useEffect } from 'react';
import { getAllLeaves, applyLeave, getLeaveById, updateLeaveStatus, getAllClassesDropdown, getAllStudentsByClass } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, X, Check, XCircle } from 'lucide-react';
import ReactModal from 'react-modal';

const LeaveComponent = () => {
  // Leave Applications State
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Class and Student Dropdown State
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  
  // Form State
  const [newLeave, setNewLeave] = useState({
    student_id: '',
    class_id: '',
    start_date: '',
    end_date: '',
    leave_type: '',
    reason: '',
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  
  // View/Edit State
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    rejection_reason: '',
  });
  const [leaveToUpdate, setLeaveToUpdate] = useState(null);

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const response = await getAllLeaves();
      if (response.success && response.data && response.data.leaves) {
        // Map the response data to match component structure
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
        setLeaveApplications(mappedLeaves);
      } else {
        toast.error('Failed to fetch leave applications');
        setLeaveApplications([]);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error(error.response?.data?.message || 'Error fetching leave applications');
      setLeaveApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all classes for dropdown
  const fetchClasses = async () => {
    try {
      const response = await getAllClassesDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        toast.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error(error.response?.data?.message || 'Error fetching classes');
    }
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classId) => {
    if (!classId) {
      setStudents([]);
      setNewLeave({ ...newLeave, student_id: '', class_id: '' });
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
      console.error('Error fetching students:', error);
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
    setNewLeave({ ...newLeave, class_id: classId, student_id: '' }); // Reset student when class changes
    fetchStudentsByClass(classId);
  };

  useEffect(() => {
    fetchLeaves();
    fetchClasses();
  }, []);

  // Handle form input changes
  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave({ ...newLeave, [name]: value });
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
    if (!newLeave.class_id || !newLeave.student_id || !newLeave.start_date || !newLeave.end_date || !newLeave.leave_type || !newLeave.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    if (new Date(newLeave.start_date) > new Date(newLeave.end_date)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        student_id: parseInt(newLeave.student_id),
        start_date: newLeave.start_date,
        end_date: newLeave.end_date,
        leave_type: newLeave.leave_type,
        reason: newLeave.reason,
      };

      const response = await applyLeave(payload, attachmentFile);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Leave application submitted successfully!');
        // Reset form
        setNewLeave({
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
        // Reset file input
        const fileInput = document.getElementById('attachment');
        if (fileInput) fileInput.value = '';
        // Refresh leaves list
        fetchLeaves();
      } else {
        toast.error('Failed to submit leave application');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error(error.response?.data?.message || 'An error occurred while submitting the leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view leave details
  const handleViewLeave = async (leaveId) => {
    try {
      const response = await getLeaveById(leaveId);
      if (response.success && response.data) {
        setSelectedLeave(response.data);
        setIsViewModalOpen(true);
      } else {
        toast.error('Failed to fetch leave details');
      }
    } catch (error) {
      console.error('Error fetching leave details:', error);
      toast.error(error.response?.data?.message || 'Error fetching leave details');
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!leaveToUpdate || !statusUpdate.status) {
      toast.error('Please select a status');
      return;
    }

    if (statusUpdate.status === 'rejected' && !statusUpdate.rejection_reason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setIsUpdatingStatus(true);
      const payload = {
        status: statusUpdate.status,
        ...(statusUpdate.rejection_reason && { rejection_reason: statusUpdate.rejection_reason }),
      };

      const response = await updateLeaveStatus(leaveToUpdate.leave_id || leaveToUpdate.id, payload);
      
      if (response.success || response.message) {
        toast.success(response.message || 'Leave status updated successfully');
        setIsStatusModalOpen(false);
        setStatusUpdate({ status: '', rejection_reason: '' });
        setLeaveToUpdate(null);
        fetchLeaves(); // Refresh leaves list
      } else {
        toast.error('Failed to update leave status');
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error(error.response?.data?.message || 'Error updating leave status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open status update modal
  const openStatusModal = (leave) => {
    setLeaveToUpdate(leave);
    setStatusUpdate({
      status: leave.status || '',
      rejection_reason: leave.rejection_reason || '',
    });
    setIsStatusModalOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'approved') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'rejected') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen p-6 rounded-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full mx-auto">
        {/* Apply Leave Form */}
        <div className="bg-white shadow-md p-6 mb-6 rounded-lg">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-semibold">Apply for Student Leave</h2>
          </div>
          
          <form onSubmit={handleLeaveSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Class *</label>
                <select
                  name="class_id"
                  value={selectedClassId}
                  onChange={handleClassChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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

              <div>
                <label className="block text-gray-700 mb-1">Student Name *</label>
                <select
                  name="student_id"
                  value={newLeave.student_id}
                  onChange={handleLeaveInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
              
              <div>
                <label className="block text-gray-700 mb-1">Leave Type *</label>
                <select
                  name="leave_type"
                  value={newLeave.leave_type}
                  onChange={handleLeaveInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="sick">Sick</option>
                  <option value="casual">Casual</option>
                  <option value="emergency">Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={newLeave.start_date}
                  onChange={handleLeaveInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  name="end_date"
                  value={newLeave.end_date}
                  onChange={handleLeaveInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Reason for Leave *</label>
                <textarea
                  name="reason"
                  value={newLeave.reason}
                  onChange={handleLeaveInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Explain the reason for leave request"
                  rows="3"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Attachment (Optional)</label>
                <input
                  type="file"
                  id="attachment"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  accept="image/*,.pdf,.doc,.docx"
                />
                {attachmentFile && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {attachmentFile.name}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Leave Application'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Leave Applications Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Leave Applications</h2>
          
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : leaveApplications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No leave applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Student Name</th>
                    <th className="border px-4 py-2 text-left">Student ID</th>
                    <th className="border px-4 py-2 text-left">Class</th>
                    <th className="border px-4 py-2 text-center">From</th>
                    <th className="border px-4 py-2 text-center">To</th>
                    <th className="border px-4 py-2 text-center">Days</th>
                    <th className="border px-4 py-2 text-left">Leave Type</th>
                    <th className="border px-4 py-2 text-center">Status</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveApplications.map(leave => (
                    <tr key={leave.id || leave.leave_id}>
                      <td className="border px-4 py-2">{leave.student_name}</td>
                      <td className="border px-4 py-2">{leave.student_id}</td>
                      <td className="border px-4 py-2">{leave.class}</td>
                      <td className="border px-4 py-2 text-center">{leave.from ? new Date(leave.from).toLocaleDateString() : '-'}</td>
                      <td className="border px-4 py-2 text-center">{leave.to ? new Date(leave.to).toLocaleDateString() : '-'}</td>
                      <td className="border px-4 py-2 text-center">{leave.total_days || '-'}</td>
                      <td className="border px-4 py-2">{leave.leave_type ? leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1) : '-'}</td>
                      <td className="border px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(leave.status)}`}>
                          {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewLeave(leave.leave_id || leave.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openStatusModal(leave)}
                            className="text-violet-600 hover:text-violet-800"
                            title="Update Status"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Leave Details Modal */}
        <ReactModal
          isOpen={isViewModalOpen}
          onRequestClose={() => setIsViewModalOpen(false)}
          contentLabel="Leave Details"
          appElement={document.getElementById("root")}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              width: "90%",
              maxWidth: "600px",
              margin: "auto",
              padding: "20px",
              borderRadius: "8px",
            },
          }}
        >
          {selectedLeave && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Leave Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Student Name:</span> {selectedLeave.student?.User?.name || '-'}
                </div>
                <div>
                  <span className="font-medium">Student ID:</span> {selectedLeave.student_id || '-'}
                </div>
                <div>
                  <span className="font-medium">Class:</span> {selectedLeave.student?.ClassSection ? `${selectedLeave.student.ClassSection.class_name}-${selectedLeave.student.ClassSection.section_name}` : '-'}
                </div>
                <div>
                  <span className="font-medium">Start Date:</span> {selectedLeave.start_date ? new Date(selectedLeave.start_date).toLocaleDateString() : '-'}
                </div>
                <div>
                  <span className="font-medium">End Date:</span> {selectedLeave.end_date ? new Date(selectedLeave.end_date).toLocaleDateString() : '-'}
                </div>
                <div>
                  <span className="font-medium">Leave Type:</span> {selectedLeave.leave_type ? selectedLeave.leave_type.charAt(0).toUpperCase() + selectedLeave.leave_type.slice(1) : '-'}
                </div>
                <div>
                  <span className="font-medium">Reason:</span> {selectedLeave.reason || '-'}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(selectedLeave.status)}`}>
                    {selectedLeave.status ? selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1) : 'Pending'}
                  </span>
                </div>
                {selectedLeave.rejection_reason && (
                  <div>
                    <span className="font-medium">Rejection Reason:</span> {selectedLeave.rejection_reason}
                  </div>
                )}
                {selectedLeave.attachment && (
                  <div>
                    <span className="font-medium">Attachment:</span>
                    <a href={selectedLeave.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                      View Attachment
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-medium">Created At:</span> {selectedLeave.created_at ? new Date(selectedLeave.created_at).toLocaleString() : '-'}
                </div>
              </div>
            </div>
          )}
        </ReactModal>

        {/* Update Status Modal */}
        <ReactModal
          isOpen={isStatusModalOpen}
          onRequestClose={() => setIsStatusModalOpen(false)}
          contentLabel="Update Leave Status"
          appElement={document.getElementById("root")}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              width: "90%",
              maxWidth: "500px",
              margin: "auto",
              padding: "20px",
              borderRadius: "8px",
            },
          }}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Update Leave Status</h2>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            {leaveToUpdate && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Student:</span> {leaveToUpdate.student_name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">From:</span> {leaveToUpdate.from ? new Date(leaveToUpdate.from).toLocaleDateString() : '-'} 
                  {' '} <span className="font-medium">To:</span> {leaveToUpdate.to ? new Date(leaveToUpdate.to).toLocaleDateString() : '-'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Status *</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {statusUpdate.status === 'rejected' && (
                <div>
                  <label className="block text-gray-700 mb-1">Rejection Reason *</label>
                  <textarea
                    value={statusUpdate.rejection_reason}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, rejection_reason: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                    placeholder="Enter rejection reason"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    </div>
  );
};

export default LeaveComponent;
