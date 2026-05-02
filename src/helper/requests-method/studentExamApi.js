import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://erp-backend-1-svup.onrender.com';

const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('token') || '';

const request = async ({ method, url, data, params, responseType = 'json' }) => {
  const response = await axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    params,
    responseType,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const getStudentTimetableV2 = (params) => request({ method: 'get', url: '/api/v2/student/exam/timetable', params });
export const getStudentResultsV2 = (params) => request({ method: 'get', url: '/api/v2/student/exam/results', params });
export const getStudentEventWiseSubjectMarksV2 = (params) =>
  request({ method: 'get', url: '/api/v2/student/exam/results/event-wise-subject-marks', params });
export const getStudentExamSchedulesV2 = (params) => request({ method: 'get', url: '/api/v2/student/exam/schedules', params });
export const getStudentExamScheduleTimetableV2 = (examEventId) =>
  request({ method: 'get', url: `/api/v2/student/exam/schedules/${examEventId}/timetable` });
export const getStudentDocumentsV2 = (params) => request({ method: 'get', url: '/api/v2/student/exam/documents', params });
export const downloadStudentDocumentV2 = async (documentUuid) => {
  const blob = await request({
    method: 'get',
    url: `/api/v2/student/exam/documents/${documentUuid}/download`,
    responseType: 'blob',
  });

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `document-${documentUuid}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return { success: true, message: 'Document download started' };
};
