import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, FileText, Download, X, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAdminNotices, addAdminNotice, updateAdminNotice, deleteAdminNotice } from '../../helper/requests-method/apiMethods';

const AdminNotes = () => {
  const [notices, setNotices] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_type: 'all',
    attachment: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getAdminNotices();
      if (response.success && response.data) {
        setNotices(response.data.notices || []);
        setTotalNotices(response.data.total_notices || 0);
      } else {
        toast.error(response.message || 'Failed to fetch notices');
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
      setAttachmentPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.target_type) errors.target_type = 'Target type is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      target_type: 'all',
      attachment: null,
    });
    setFormErrors({});
    setAttachmentPreview(null);
    setIsEditMode(false);
    setSelectedNotice(null);
  };

  const handleOpenForm = (notice = null) => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        message: notice.message || '',
        target_type: notice.targets?.[0]?.target_type || 'all',
        attachment: null,
      });
      setIsEditMode(true);
      setSelectedNotice(notice);
      setAttachmentPreview(notice.attachment || null);
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
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
        title: formData.title,
        message: formData.message,
        target_type: formData.target_type,
      };

      let response;
      if (isEditMode && selectedNotice) {
        response = await updateAdminNotice(selectedNotice.notice_id, payload, formData.attachment);
      } else {
        response = await addAdminNotice(payload, formData.attachment);
      }

      if (response.success) {
        toast.success(response.message || (isEditMode ? 'Notice updated successfully' : 'Notice created successfully'));
        handleCloseForm();
        fetchNotices();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save notice:', error);
      toast.error(error.response?.data?.message || 'Failed to save notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setIsViewModalOpen(true);
  };

  const handleEditNotice = (notice) => {
    handleOpenForm(notice);
  };

  const handleDeleteClick = (notice) => {
    setNoticeToDelete(notice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;

    try {
      setLoading(true);
      const response = await deleteAdminNotice(noticeToDelete.notice_id);
      if (response.success) {
        toast.success(response.message || 'Notice deleted successfully');
        setIsDeleteModalOpen(false);
        setNoticeToDelete(null);
        fetchNotices();
      } else {
        toast.error(response.message || 'Failed to delete notice');
      }
    } catch (error) {
      console.error('Failed to delete notice:', error);
      toast.error(error.response?.data?.message || 'Failed to delete notice');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTargetTypeBadge = (targetType) => {
    const typeLower = targetType?.toLowerCase();
    const colors = {
      all: 'bg-blue-100 text-blue-800',
      teacher: 'bg-purple-100 text-purple-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[typeLower] || colors.all}`}>
        {targetType?.charAt(0).toUpperCase() + targetType?.slice(1) || 'All'}
      </span>
    );
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment) {
      window.open(attachment, '_blank');
    }
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <Sidebar />
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Admin Notices
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage and create notices for all users
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    {totalNotices} {totalNotices === 1 ? 'Notice' : 'Notices'}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Notice</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notices Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading notices...</p>
              </div>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notices Available</h3>
              <p className="text-gray-500 mb-4">Create your first notice to get started.</p>
              <button
                onClick={() => handleOpenForm()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Notice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notices.map((notice) => (
                <div
                  key={notice.notice_id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
                >
                  {/* Notice Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                          {notice.title || 'Untitled Notice'}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          {getTargetTypeBadge(notice.targets?.[0]?.target_type || 'all')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notice Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="flex-1 mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {notice.message || 'No message available'}
                      </p>
                    </div>

                    {/* Notice Footer */}
                    <div className="border-t border-gray-200 pt-4 mt-auto">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div className="flex flex-col gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>By: {notice.created_by || 'Admin'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{formatDateShort(notice.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewNotice(notice)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditNotice(notice)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(notice)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        {notice.attachment && (
                          <button
                            onClick={() => handleDownloadAttachment(notice.attachment)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                            title="Download attachment"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Add/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {isEditMode ? 'Edit Notice' : 'Create New Notice'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter notice title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter notice message"
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="target_type"
                      value={formData.target_type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.target_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                    </select>
                    {formErrors.target_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.target_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {attachmentPreview && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">File selected</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Notice' : 'Create Notice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Notice Modal */}
        {isViewModalOpen && selectedNotice && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                      {selectedNotice.title || 'Notice Details'}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTargetTypeBadge(selectedNotice.targets?.[0]?.target_type || 'all')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedNotice(null);
                    }}
                    className="text-white hover:text-gray-200 transition-colors ml-4"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1 font-medium">Created By</div>
                    <p className="text-gray-900 font-semibold">
                      {selectedNotice.created_by || 'Admin'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1 font-medium">Date</div>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(selectedNotice.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <FileText size={16} />
                    <span>Message</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedNotice.message || 'No message available'}
                    </p>
                  </div>
                </div>
                {selectedNotice.attachment && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <Download size={16} />
                      <span>Attachment</span>
                    </div>
                    <button
                      onClick={() => handleDownloadAttachment(selectedNotice.attachment)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={18} />
                      <span>Download Attachment</span>
                    </button>
                  </div>
                )}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedNotice(null);
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && noticeToDelete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Notice</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete the notice &quot;{noticeToDelete.title}&quot;?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setNoticeToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={loading}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
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

export default AdminNotes;

