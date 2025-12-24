import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentLeaves, applyStudentLeave, deleteStudentLeave } from '../../helper/requests-method/apiMethods';

const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({
    total_leaves: 0,
    pending_count: 0,
    approved_count: 0,
    rejected_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await getStudentLeaves();
      if (response.success && response.data) {
        setLeaves(response.data.leaves || []);
        setSummary({
          total_leaves: response.data.total_leaves || 0,
          pending_count: response.data.pending_count || 0,
          approved_count: response.data.approved_count || 0,
          rejected_count: response.data.rejected_count || 0,
        });
      } else {
        toast.error(response.message || 'Failed to fetch leaves');
      }
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.leave_type) errors.leave_type = 'Leave type is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    if (!formData.reason.trim()) errors.reason = 'Reason is required';

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) {
        errors.end_date = 'End date cannot be before start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    // Convert YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        leave_type: formData.leave_type,
        start_date: formatDateForAPI(formData.start_date),
        end_date: formatDateForAPI(formData.end_date),
        reason: formData.reason.trim(),
      };

      const response = await applyStudentLeave(payload);
      if (response.success) {
        toast.success(response.message || 'Leave application submitted successfully');
        setIsFormOpen(false);
        setFormData({
          leave_type: 'sick',
          start_date: '',
          end_date: '',
          reason: '',
        });
        setFormErrors({});
        fetchLeaves(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to submit leave application');
      }
    } catch (error) {
      console.error('Failed to submit leave:', error);
      toast.error(error.response?.data?.message || 'Failed to submit leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (leave) => {
    setLeaveToDelete(leave);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leaveToDelete) return;

    try {
      const response = await deleteStudentLeave(leaveToDelete.id);
      if (response.success) {
        toast.success(response.message || 'Leave application deleted successfully');
        setIsDeleteModalOpen(false);
        setLeaveToDelete(null);
        fetchLeaves(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete leave');
      }
    } catch (error) {
      console.error('Failed to delete leave:', error);
      toast.error(error.response?.data?.message || 'Failed to delete leave');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'approved') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
          <CheckCircle size={14} /> Approved
        </span>
      );
    } else if (statusLower === 'rejected') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
          <XCircle size={14} /> Rejected
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
          <Clock size={14} /> Pending
        </span>
      );
    }
  };

  const getLeaveTypeBadge = (type) => {
    const typeLower = type?.toLowerCase();
    const colors = {
      sick: 'bg-blue-100 text-blue-800',
      casual: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[typeLower] || colors.other}`}>
        {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Other'}
      </span>
    );
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: '95vh',
          width: '100vw',
          gap: '10px',
          display: 'flex',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-auto">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Leave Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Apply for leave and track your leave applications
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Plus size={20} />
              <span>Apply for Leave</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leaves</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_leaves}</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.pending_count}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.approved_count}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.rejected_count}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Leave Applications Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">My Leave Applications</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading leaves...</p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No leave applications found</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Apply for your first leave
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getLeaveTypeBadge(leave.leave_type)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(leave.start_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(leave.end_date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calculateDays(leave.start_date, leave.end_date)} days
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {leave.reason || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(leave.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(leave.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {leave.status?.toLowerCase() === 'pending' && (
                            <button
                              onClick={() => handleDeleteClick(leave)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete leave"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Apply Leave Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-indigo-600 text-white p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Apply for Leave</h2>
                    <p className="text-indigo-100 mt-1 text-sm">Fill in the details to apply for leave</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData({
                        leave_type: 'sick',
                        start_date: '',
                        end_date: '',
                        reason: '',
                      });
                      setFormErrors({});
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="leave_type"
                      value={formData.leave_type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.leave_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
                      <option value="emergency">Emergency Leave</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.leave_type && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.leave_type}</p>
                    )}
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.start_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.start_date && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.end_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.end_date && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.end_date}</p>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Please explain your reason for leave..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
                        formErrors.reason ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.reason && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData({
                        leave_type: 'sick',
                        start_date: '',
                        end_date: '',
                        reason: '',
                      });
                      setFormErrors({});
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && leaveToDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="text-red-600" size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Delete Leave Application
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">
                      Are you sure you want to delete this leave application?
                    </p>
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
                      <p><span className="font-medium">Type:</span> {leaveToDelete.leave_type}</p>
                      <p><span className="font-medium">Dates:</span> {formatDate(leaveToDelete.start_date)} - {formatDate(leaveToDelete.end_date)}</p>
                    </div>
                    <p className="text-xs text-red-600 font-medium mt-2">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setLeaveToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StudentLeave;

