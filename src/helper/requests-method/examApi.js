import axios from 'axios';

const API_BASE_URL = String(import.meta.env.SCHOOL_ERP_BACKEND_URL || '').replace(/\/$/, '');

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

// V2 Admin - Exam Terms (API resource: /types)
export const createExamTypeV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/types', data: payload });
export const listExamTypesV2 = () => request({ method: 'get', url: '/api/v2/admin/exam/types' });
export const updateExamTypeV2 = (examTypeUuid, payload) =>
  request({ method: 'patch', url: `/api/v2/admin/exam/types/${examTypeUuid}`, data: payload });
export const deleteExamTypeV2 = (examTypeUuid) => request({ method: 'delete', url: `/api/v2/admin/exam/types/${examTypeUuid}` });

// V2 Admin - Exam Events
export const createExamEventV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/events', data: payload });
export const listExamEventsV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/events', params });
export const getExamEventByIdV2 = (examEventUuid) => request({ method: 'get', url: `/api/v2/admin/exam/events/${examEventUuid}` });
export const updateExamEventV2 = (examEventUuid, payload) =>
  request({ method: 'patch', url: `/api/v2/admin/exam/events/${examEventUuid}`, data: payload });
export const deleteExamEventV2 = (examEventUuid) => request({ method: 'delete', url: `/api/v2/admin/exam/events/${examEventUuid}` });

// V2 Admin - Exam Papers
export const createExamPaperV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/papers', data: payload });
export const listExamPapersV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/papers', params });
export const updateExamPaperV2 = (examPaperUuid, payload) =>
  request({ method: 'patch', url: `/api/v2/admin/exam/papers/${examPaperUuid}`, data: payload });
export const deleteExamPaperV2 = (examPaperUuid) => request({ method: 'delete', url: `/api/v2/admin/exam/papers/${examPaperUuid}` });

// V2 Admin - Timetable
export const createExamTimetableEntryV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/timetable', data: payload });
export const listExamTimetableEntriesV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/timetable', params });
export const updateExamTimetableEntryV2 = (examTimetableUuid, payload) =>
  request({ method: 'patch', url: `/api/v2/admin/exam/timetable/${examTimetableUuid}`, data: payload });
export const deleteExamTimetableEntryV2 = (examTimetableUuid) =>
  request({ method: 'delete', url: `/api/v2/admin/exam/timetable/${examTimetableUuid}` });

// V2 Admin - Marks
export const listMarksEntriesV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/marks', params });
export const approveMarksEntryV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/marks/approve', data: payload });
export const lockMarksEntryV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/marks/lock', data: payload });

// V2 Admin - Marks Registers (bulk class register APIs)
export const createMarksRegistersV2 = (payload) =>
  request({ method: 'post', url: '/api/v2/admin/exam/marks/registers', data: payload });
export const listMarksRegistersV2 = (params) =>
  request({ method: 'get', url: '/api/v2/admin/exam/marks/registers', params });
export const getMarksRegisterByPaperV2 = (examPaperId, params) =>
  request({ method: 'get', url: `/api/v2/admin/exam/marks/registers/${examPaperId}`, params });
export const updateMarksRegistersV2 = (payload) =>
  request({ method: 'put', url: '/api/v2/admin/exam/marks/registers', data: payload });

// V2 Admin - Attendance
export const createExamAttendanceV2 = (payload) =>
  request({ method: 'post', url: '/api/v2/admin/exam/attendance', data: payload });
export const createExamAttendanceBulkV2 = (payload) =>
  request({ method: 'post', url: '/api/v2/admin/exam/attendance/bulk', data: payload });
export const listExamAttendanceV2 = (params) =>
  request({ method: 'get', url: '/api/v2/admin/exam/attendance', params });
export const getExamAttendanceByIdV2 = (attendanceId) =>
  request({ method: 'get', url: `/api/v2/admin/exam/attendance/${attendanceId}` });
export const updateExamAttendanceV2 = (attendanceId, payload) =>
  request({ method: 'put', url: `/api/v2/admin/exam/attendance/${attendanceId}`, data: payload });
export const deleteExamAttendanceV2 = (attendanceId) =>
  request({ method: 'delete', url: `/api/v2/admin/exam/attendance/${attendanceId}` });

// V2 Admin - Results
export const listResultsV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/results', params });
export const recomputeResultsV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/results/recompute', data: payload });
export const publishResultsV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/results/publish', data: payload });

// V2 Admin - Templates & Documents
export const createDocumentTemplateV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/templates', data: payload });
export const listDocumentTemplatesV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/templates', params });
export const updateDocumentTemplateV2 = (documentTemplateUuid, payload) =>
  request({ method: 'patch', url: `/api/v2/admin/exam/templates/${documentTemplateUuid}`, data: payload });
export const generateDocumentV2 = (payload) => request({ method: 'post', url: '/api/v2/admin/exam/documents/generate', data: payload });
export const listDocumentsV2 = (params) => request({ method: 'get', url: '/api/v2/admin/exam/documents', params });
export const getAdmitCardDataV2 = (params) =>
  request({ method: 'get', url: '/api/v2/admin/exam/documents/admit-card-data', params });
