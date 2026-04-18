import React, { useState, useEffect } from 'react';
import { Bell, CalendarDays, Download, FileText, Megaphone, Paperclip, Sparkles, Users } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentNotices } from '../../helper/requests-method/apiMethods';

const TARGET_STYLE = {
  all: {
    label: 'All Students',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  class: {
    label: 'Class Notice',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  individual: {
    label: 'Personal Notice',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

const getPayloadFromResponse = (response) => {
  if (response?.data?.data?.notices) {
    return response.data;
  }
  if (response?.data?.notices) {
    return response;
  }
  if (response?.notices) {
    return {
      success: true,
      statusCode: 200,
      message: 'Notices fetched successfully',
      data: response,
    };
  }
  return null;
};

const normalizeNotice = (notice, index) => {
  const targetKey = (notice.target || notice.target_type || 'all').toLowerCase();
  const safeTarget = TARGET_STYLE[targetKey] ? targetKey : 'all';

  return {
    id: notice.id || notice.notice_id || `notice-${index}`,
    title: notice.title || 'Untitled Notice',
    message: notice.message || 'No message available',
    attachment: notice.attachment || null,
    createdAt: notice.created_at || null,
    target: safeTarget,
  };
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Date unavailable';

  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return diffHours <= 1 ? 'Posted 1 hour ago' : `Posted ${diffHours} hours ago`;
  }
  return diffDays === 1 ? 'Posted 1 day ago' : `Posted ${diffDays} days ago`;
};

const trimText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

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

      const payload = getPayloadFromResponse(response);

      if (payload?.success && payload?.data) {
        const mappedNotices = (payload.data.notices || [])
          .map((notice, index) => normalizeNotice(notice, index))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setNotices(mappedNotices);
        setTotalNotices(payload.data.total_notices ?? mappedNotices.length);
      } else {
        toast.error(payload?.message || 'Failed to fetch notices');
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = (attachment) => {
    if (attachment) {
      window.open(attachment, '_blank');
    }
  };

  const latestNotice = notices[0] || null;
  const remainingNotices = notices.slice(1);

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedNotice(null);
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
          <div className="mb-6 relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 p-5 sm:p-7 text-white shadow-lg">
            <div className="absolute -top-14 -right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-10 w-44 h-44 bg-cyan-200/25 rounded-full blur-2xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide mb-3">
                  <Sparkles size={14} />
                  Student Notice Board
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Notices and Announcements</h1>
                <p className="text-white/90 text-sm sm:text-base mt-2">
                  {totalNotices} {totalNotices === 1 ? 'notice' : 'notices'} available
                </p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 sm:p-12 text-center">
              <Bell className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Notices Available</h3>
              <p className="text-gray-500">There are no notices right now. New updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {latestNotice && (
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      <Megaphone size={14} />
                      Latest Notice
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      latestNotice.attachment
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      <Paperclip size={14} />
                      {latestNotice.attachment ? 'Attachment' : 'No Attachment'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{latestNotice.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">{latestNotice.message}</p>
                    <button
                      onClick={() => handleDownloadAttachment(latestNotice.attachment)}
                      disabled={!latestNotice.attachment}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors self-start ${
                        latestNotice.attachment
                          ? 'cursor-pointer bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                          : 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                      }`}
                    >
                      <Download size={16} />
                      {latestNotice.attachment ? 'Attachment' : 'No Attachment'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={16} />
                      {formatDate(latestNotice.createdAt)}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">{latestNotice.createdBy}</span>
                  </div>
                </div>
              )}

              {remainingNotices.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">More Notices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {remainingNotices.map((notice) => (
                      <div
                        key={notice.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-200">
                            Notice
                          </span>
                          <span className="text-xs text-gray-500">{formatDateShort(notice.createdAt)}</span>
                        </div>

                        <h4 className="text-base font-semibold text-gray-900 mb-2">{notice.title}</h4>
                        <div className="flex items-start justify-between gap-3 flex-1">
                          <p className="text-sm text-gray-600 flex-1">{trimText(notice.message, 130)}</p>
                          <button
                            onClick={() => handleDownloadAttachment(notice.attachment)}
                            disabled={!notice.attachment}
                            className={`inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${
                              notice.attachment
                                ? 'cursor-pointer text-indigo-700 hover:text-indigo-800'
                                : 'cursor-not-allowed text-gray-400'
                            }`}
                          >
                            <Download size={15} />
                            {notice.attachment ? 'Attachment' : 'No Attachment'}
                          </button>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {isViewModalOpen && selectedNotice && (
          <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
                      {selectedNotice.title || 'Notice Details'}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white/90">{formatRelativeTime(selectedNotice.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="cursor-pointer text-white hover:text-gray-200 transition-colors ml-4"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Users size={16} />
                      <span className="font-medium">Created By</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {selectedNotice.createdBy}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <CalendarDays size={16} />
                      <span className="font-medium">Date</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(selectedNotice.createdAt)}
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
                      <Paperclip size={16} />
                      <span>Attachment</span>
                    </div>
                    <button
                      onClick={() => handleDownloadAttachment(selectedNotice.attachment)}
                      className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={18} />
                      <span>Download Attachment</span>
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

