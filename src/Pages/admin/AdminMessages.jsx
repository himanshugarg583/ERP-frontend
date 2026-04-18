import React, { useMemo, useState } from 'react';
import { Clock3, Mail, Paperclip, Send, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../../components/comman_components/Header';
import Sidebar from './Sidebar';
import 'react-toastify/dist/ReactToastify.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const splitEmails = (value) => {
  return value
    .split(/[,;\s]+/)
    .map((email) => email.trim())
    .filter(Boolean);
};

const AdminMessages = () => {
  const location = useLocation();
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    message: '',
    priority: 'normal',
    sendAt: '',
    attachment: null,
  });
  const [errors, setErrors] = useState({});

  const recipientCount = useMemo(() => splitEmails(formData.to).length, [formData.to]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const validate = () => {
    const nextErrors = {};

    const toList = splitEmails(formData.to);
    const ccList = splitEmails(formData.cc);

    if (toList.length === 0) {
      nextErrors.to = 'At least one recipient email is required';
    } else if (toList.some((email) => !EMAIL_PATTERN.test(email))) {
      nextErrors.to = 'Please enter valid recipient email addresses';
    }

    if (ccList.length > 0 && ccList.some((email) => !EMAIL_PATTERN.test(email))) {
      nextErrors.cc = 'Please enter valid CC email addresses';
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Message content is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    try {
      setIsSending(true);
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast.success('Mail prepared successfully. Integrate backend API to send it live.');

      setFormData({
        to: '',
        cc: '',
        subject: '',
        message: '',
        priority: 'normal',
        sendAt: '',
        attachment: null,
      });
      setErrors({});
    } catch (error) {
      toast.error(error?.message || 'Failed to prepare mail');
    } finally {
      setIsSending(false);
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
          <div className="mb-6 rounded-2xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 p-5 sm:p-7 text-white shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold">Communication Center</h1>
            <p className="text-white/90 text-sm sm:text-base mt-2">
              Send notices and emails from one place.
            </p>
          </div>

          <div className="mb-5 rounded-xl bg-white border border-gray-200 p-2 inline-flex gap-2 shadow-sm">
            <Link
              to="/admin/communication"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/admin/communication' || location.pathname === '/admin/notes'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Notices
            </Link>
            <Link
              to="/admin/messages"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/admin/messages'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Messages
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Send Mail</h2>
                <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  {recipientCount} recipient(s)
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="student1@mail.com, student2@mail.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.to ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.to && <p className="mt-1 text-xs text-red-600">{errors.to}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CC</label>
                  <input
                    type="text"
                    name="cc"
                    value={formData.cc}
                    onChange={handleInputChange}
                    placeholder="Optional CC emails"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.cc ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cc && <p className="mt-1 text-xs text-red-600">{errors.cc}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                    <input
                      type="datetime-local"
                      name="sendAt"
                      value={formData.sendAt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter mail subject"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={8}
                    placeholder="Write your message here..."
                    className={`w-full px-4 py-2.5 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Paperclip size={16} />
                    <span>{formData.attachment ? 'Change Attachment' : 'Add Attachment'}</span>
                    <input type="file" className="hidden" onChange={handleAttachment} />
                  </label>
                  {formData.attachment && (
                    <p className="mt-2 text-xs text-gray-600">Selected: {formData.attachment.name}</p>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                  >
                    <Send size={16} />
                    {isSending ? 'Preparing...' : 'Send Mail'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        to: '',
                        cc: '',
                        subject: '',
                        message: '',
                        priority: 'normal',
                        sendAt: '',
                        attachment: null,
                      });
                      setErrors({});
                    }}
                    className="cursor-pointer px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mail Summary</h3>

              <div className="space-y-3">
                <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                  <div className="flex items-center gap-2 text-indigo-700 mb-1">
                    <UserRound size={15} />
                    <span className="text-sm font-medium">Recipients</span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-800">{recipientCount}</p>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <Clock3 size={15} />
                    <span className="text-sm font-medium">Delivery</span>
                  </div>
                  <p className="text-sm text-amber-800">
                    {formData.sendAt ? 'Scheduled' : 'Send immediately'}
                  </p>
                </div>

                <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-3">
                  <div className="flex items-center gap-2 text-cyan-700 mb-1">
                    <Mail size={15} />
                    <span className="text-sm font-medium">Priority</span>
                  </div>
                  <p className="text-sm text-cyan-800 capitalize">{formData.priority}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                This screen is UI-ready. Connect this form to your backend mail API for live delivery.
              </p>
            </aside>
          </div>
        </main>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AdminMessages;
