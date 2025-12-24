import React, { useState, useEffect } from 'react';
import { Bell, FileText, User, Calendar, Download, Eye } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentNotices } from '../../helper/requests-method/apiMethods';

const StudentNotice = () => {
  const [notices, setNotices] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getStudentNotices();
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

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setIsViewModalOpen(true);
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment) {
      // Assuming attachment is a URL or file path
      window.open(attachment, '_blank');
    }
  };

  const getTargetTypeBadge = (targetType) => {
    const typeLower = targetType?.toLowerCase();
    const colors = {
      all: 'bg-blue-100 text-blue-800',
      class: 'bg-purple-100 text-purple-800',
      individual: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[typeLower] || colors.all}`}>
        {targetType?.charAt(0).toUpperCase() + targetType?.slice(1) || 'All'}
      </span>
    );
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Notices & Announcements
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Stay updated with important notices and announcements
                </p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">
                  {totalNotices} {totalNotices === 1 ? 'Notice' : 'Notices'}
                </span>
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
              <p className="text-gray-500">There are no notices at the moment. Check back later for updates.</p>
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
                          {getTargetTypeBadge(notice.target_type)}
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex flex-col gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>By: {notice.created_by || 'Admin'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{formatDateShort(notice.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleViewNotice(notice)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          <span>View</span>
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

        {/* View Notice Modal */}
        {isViewModalOpen && selectedNotice && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                      {selectedNotice.title || 'Notice Details'}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTargetTypeBadge(selectedNotice.target_type)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedNotice(null);
                    }}
                    className="text-white hover:text-gray-200 transition-colors ml-4"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                {/* Notice Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <User size={16} />
                      <span className="font-medium">Created By</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {selectedNotice.created_by || 'Admin'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="font-medium">Date</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(selectedNotice.created_at)}
                    </p>
                  </div>
                </div>

                {/* Notice Message */}
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

                {/* Attachment */}
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

                {/* Modal Footer */}
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

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StudentNotice;

