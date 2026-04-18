import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit, Trash2, Download, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from '../../components/comman_components/Header';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAdminNotices,
  addAdminNotice,
  updateAdminNotice,
  deleteAdminNotice,
  getAllClassesDropdown,
} from '../../helper/requests-method/apiMethods';

const TARGET_OPTIONS = ['all', 'all_classes', 'all_teachers', 'all_staff', 'class'];

const TARGET_LABELS = {
  all: 'All',
  all_classes: 'All Classes',
  all_teachers: 'All Teachers',
  all_staff: 'All Staff',
  class: 'Class',
};

const ATTACHMENT_PATTERN = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;

const normalizeClassSectionOptions = (rawList) => {
  if (!Array.isArray(rawList)) return [];

  const seen = new Set();
  const options = [];

  rawList.forEach((item, index) => {
    const id = item?.class_section_id ?? item?.id ?? item?.value ?? item?.class_id ?? null;
    if (id === null || id === undefined) return;

    const idString = String(id);
    if (seen.has(idString)) return;

    const className = item?.class_name || item?.className || item?.class || item?.name || `Class ${index + 1}`;
    const sectionName = item?.section_name || item?.sectionName || item?.section || '';
    const label = item?.label || [className, sectionName].filter(Boolean).join(' - ');

    seen.add(idString);
    options.push({ value: idString, label });
  });

  return options;
};

const extractNoticeTargetType = (notice) => {
  const type = notice?.targets?.[0]?.target_type || notice?.target_type || 'all';
  return TARGET_OPTIONS.includes(type) ? type : 'all';
};

const AdminNotes = () => {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);
  const [classOptions, setClassOptions] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_type: 'all',
    class_section_ids: [],
    attachment: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClassSectionDropdownOpen, setIsClassSectionDropdownOpen] = useState(false);

  useEffect(() => {
    fetchNotices();
    fetchClassSections();
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

  const fetchClassSections = async () => {
    try {
      setClassLoading(true);
      const response = await getAllClassesDropdown();
      if (response?.success && response?.data) {
        setClassOptions(normalizeClassSectionOptions(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch class sections:', error);
    } finally {
      setClassLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'target_type' && value !== 'class') {
        setIsClassSectionDropdownOpen(false);
        return { ...prev, target_type: value, class_section_ids: [] };
      }
      return { ...prev, [name]: value };
    });

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'target_type' && value !== 'class' && formErrors.class_section_ids) {
      setFormErrors((prev) => ({ ...prev, class_section_ids: '' }));
    }
  };

  const toggleClassSectionSelection = (selectedValue) => {
    setFormData((prev) => {
      const alreadySelected = prev.class_section_ids.includes(selectedValue);
      const updated = alreadySelected
        ? prev.class_section_ids.filter((value) => value !== selectedValue)
        : [...prev.class_section_ids, selectedValue];

      return { ...prev, class_section_ids: updated };
    });

    if (formErrors.class_section_ids) {
      setFormErrors((prev) => ({ ...prev, class_section_ids: '' }));
    }
  };

  const getSelectedClassSummary = () => {
    const count = formData.class_section_ids.length;
    if (count === 0) return 'Select Class Sections';
    if (count === 1) {
      const match = classOptions.find((option) => option.value === formData.class_section_ids[0]);
      return match?.label || '1 class selected';
    }
    return `${count} classes selected`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setFormData((prev) => ({ ...prev, attachment: null }));
      return;
    }

    if (!ATTACHMENT_PATTERN.test(file.name)) {
      toast.error('Only jpg, jpeg, png, pdf, doc, docx files are allowed');
      e.target.value = '';
      setFormData((prev) => ({ ...prev, attachment: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.target_type) errors.target_type = 'Target type is required';
    if (formData.target_type === 'class' && formData.class_section_ids.length === 0) {
      errors.class_section_ids = 'At least one class is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildNoticePayload = () => {
    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      target_type: formData.target_type,
    };

    if (formData.target_type === 'class') {
      payload.class_section_ids = formData.class_section_ids.map((id) => Number(id));
    }

    return payload;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      target_type: 'all',
      class_section_ids: [],
      attachment: null,
    });
    setFormErrors({});
    setIsClassSectionDropdownOpen(false);
    setIsEditMode(false);
    setSelectedNotice(null);
  };

  const handleOpenForm = (notice = null) => {
    if (notice) {
      const targetType = extractNoticeTargetType(notice);
      const existingClassIds = targetType === 'class'
        ? Array.from(new Set((notice.targets || [])
          .map((target) => target.class_section_id ?? target.class_section?.id ?? null)
          .filter((id) => id !== null && id !== undefined)
          .map((id) => String(id))))
        : [];

      setFormData({
        title: notice.title || '',
        message: notice.message || '',
        target_type: targetType,
        class_section_ids: existingClassIds,
        attachment: null,
      });

      setIsEditMode(true);
      setSelectedNotice(notice);
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
      const payload = buildNoticePayload();

      let response;
      if (isEditMode && selectedNotice) {
        response = await updateAdminNotice(selectedNotice.notice_id, payload, formData.attachment);
      } else {
        response = await addAdminNotice(payload, formData.attachment);
      }

      const statusCode = response?.statusCode;
      const isSuccess = Boolean(response?.success) || statusCode === 200 || statusCode === 201;

      if (isSuccess) {
        if (!isEditMode) {
          toast.success('Notice created successfully.');
        } else {
          toast.success(response?.message || 'Notice updated successfully.');
        }

        handleCloseForm();
        fetchNotices();
      } else if (statusCode === 400) {
        toast.error(response?.message || 'Bad Request');
      } else if (statusCode === 401 || statusCode === 403) {
        toast.error('Session expired or insufficient permission');
        navigate('/login');
      } else if (statusCode === 500) {
        toast.error('Internal Server Error.');
      } else {
        toast.error(response?.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save notice:', error);

      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      if (statusCode === 400) {
        toast.error(backendMessage || 'Bad Request');
      } else if (statusCode === 401 || statusCode === 403) {
        toast.error('Session expired or insufficient permission');
        navigate('/login');
      } else if (statusCode === 500) {
        toast.error('Internal Server Error.');
      } else {
        toast.error(backendMessage || 'Failed to save notice');
      }
    } finally {
      setIsSubmitting(false);
    }
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
      all_classes: 'bg-violet-100 text-violet-800',
      all_teachers: 'bg-purple-100 text-purple-800',
      all_staff: 'bg-emerald-100 text-emerald-800',
      class: 'bg-amber-100 text-amber-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[typeLower] || colors.all}`}>
        {TARGET_LABELS[typeLower] || 'All'}
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
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Notice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attachment</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {notices.map((notice) => (
                      <tr key={notice.notice_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {notice.title || 'Untitled Notice'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-md truncate">
                          {notice.message || 'No message available'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getTargetTypeBadge(extractNoticeTargetType(notice))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {formatDateShort(notice.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {notice.attachment ? (
                            <button
                              onClick={() => handleDownloadAttachment(notice.attachment)}
                              className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-800"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditNotice(notice)}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium"
                              title="Edit"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(notice)}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* Add/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-linear-to-r from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-t-lg">
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
                      <option value="all">all</option>
                      <option value="all_classes">all_classes</option>
                      <option value="all_teachers">all_teachers</option>
                      <option value="all_staff">all_staff</option>
                      <option value="class">class</option>
                    </select>
                    {formErrors.target_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.target_type}</p>
                    )}
                  </div>

                  {formData.target_type === 'class' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        class_section_ids <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsClassSectionDropdownOpen((prev) => !prev)}
                          className={`w-full px-4 py-2 text-left border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${
                            formErrors.class_section_ids ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          {getSelectedClassSummary()}
                        </button>

                        {isClassSectionDropdownOpen && (
                          <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto p-2 space-y-1">
                            {classLoading ? (
                              <p className="text-xs text-gray-500 px-2 py-1">Loading class sections...</p>
                            ) : classOptions.length === 0 ? (
                              <p className="text-xs text-gray-500 px-2 py-1">No class sections available</p>
                            ) : (
                              classOptions.map((option) => {
                                const checked = formData.class_section_ids.includes(option.value);
                                return (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleClassSectionSelection(option.value)}
                                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-800">{option.label}</span>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                      {formErrors.class_section_ids && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.class_section_ids}</p>
                      )}
                    </div>
                  )}

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
                    {formData.attachment && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{formData.attachment.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && noticeToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-md flex items-center justify-center p-4">
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

