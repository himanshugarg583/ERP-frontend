import axios from 'axios';

const API_BASE_URL = String(import.meta.env.SCHOOL_ERP_BACKEND_URL || '').replace(/\/$/, '');

const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('token') || '';

const request = async ({ method, url, data, params }) => {
  const response = await axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    params,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const listTeacherAssignedPapersV2 = (params) => request({ method: 'get', url: '/api/v2/teacher/exam/papers', params });
export const listTeacherTimetableV2 = (params) => request({ method: 'get', url: '/api/v2/teacher/exam/timetable', params });
export const listTeacherPaperStudentsV2 = (examPaperUuid) =>
  request({ method: 'get', url: `/api/v2/teacher/exam/papers/${examPaperUuid}/students` });
export const listTeacherPaperMarksV2 = (examPaperUuid) =>
  request({ method: 'get', url: `/api/v2/teacher/exam/papers/${examPaperUuid}/marks` });
export const upsertTeacherMarksV2 = (examPaperUuid, payload) =>
  request({ method: 'post', url: `/api/v2/teacher/exam/papers/${examPaperUuid}/marks/upsert`, data: payload });
export const submitTeacherMarksV2 = (examPaperUuid, payload) =>
  request({ method: 'post', url: `/api/v2/teacher/exam/papers/${examPaperUuid}/marks/submit`, data: payload });
export const bulkTeacherAttendanceV2 = (examPaperUuid, payload) =>
  request({ method: 'post', url: `/api/v2/teacher/exam/papers/${examPaperUuid}/attendance/bulk`, data: payload });

export const listTeacherExamTermsDropdownV2 = () =>
  request({ method: 'get', url: '/api/v2/teacher/exam/dropdowns/terms' });
export const listTeacherExamEventsDropdownV2 = (params) =>
  request({ method: 'get', url: '/api/v2/teacher/exam/dropdowns/events', params });
export const listTeacherExamClassSectionsDropdownV2 = () =>
  request({ method: 'get', url: '/api/v2/teacher/exam/dropdowns/class-sections' });
export const listTeacherExamPapersDropdownV2 = (params) =>
  request({ method: 'get', url: '/api/v2/teacher/exam/dropdowns/papers', params });
export const listTeacherExamStudentsDropdownV2 = (params) =>
  request({ method: 'get', url: '/api/v2/teacher/exam/dropdowns/students', params });
export const listTeacherExamMarksRegistersV2 = (params) =>
  request({ method: 'get', url: '/api/v2/teacher/exam/marks/registers', params });
export const getTeacherExamMarksRegisterByPaperV2 = (examPaperId, params) =>
  request({ method: 'get', url: `/api/v2/teacher/exam/marks/registers/${examPaperId}`, params });
export const upsertTeacherExamMarksRegistersV2 = (payload) =>
  request({ method: 'post', url: '/api/v2/teacher/exam/marks/registers', data: payload });
