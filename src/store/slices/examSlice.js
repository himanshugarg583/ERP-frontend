import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as adminExamApi from '../../helper/requests-method/examApi';
import * as teacherExamApi from '../../helper/requests-method/teacherExamApi';
import * as studentExamApi from '../../helper/requests-method/studentExamApi';

const createExamThunk = (name, apiCall) =>
  createAsyncThunk(`exam/${name}`, async (payload, { rejectWithValue }) => {
    try {
      return await apiCall(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error?.message || 'Request failed' });
    }
  });

// V2 Admin - Terms (API resource: /types)
export const createExamTypeV2Thunk = createExamThunk('createExamTypeV2', (payload) => adminExamApi.createExamTypeV2(payload));
export const listExamTypesV2Thunk = createExamThunk('listExamTypesV2', () => adminExamApi.listExamTypesV2());
export const updateExamTypeV2Thunk = createExamThunk('updateExamTypeV2', ({ examTypeUuid, payload }) =>
  adminExamApi.updateExamTypeV2(examTypeUuid, payload)
);
export const deleteExamTypeV2Thunk = createExamThunk('deleteExamTypeV2', ({ examTypeUuid }) => adminExamApi.deleteExamTypeV2(examTypeUuid));

// V2 Admin - Events
export const createExamEventV2Thunk = createExamThunk('createExamEventV2', (payload) => adminExamApi.createExamEventV2(payload));
export const listExamEventsV2Thunk = createExamThunk('listExamEventsV2', (params) => adminExamApi.listExamEventsV2(params));
export const getExamEventByIdV2Thunk = createExamThunk('getExamEventByIdV2', ({ examEventUuid }) => adminExamApi.getExamEventByIdV2(examEventUuid));
export const updateExamEventV2Thunk = createExamThunk('updateExamEventV2', ({ examEventUuid, payload }) =>
  adminExamApi.updateExamEventV2(examEventUuid, payload)
);
export const deleteExamEventV2Thunk = createExamThunk('deleteExamEventV2', ({ examEventUuid }) => adminExamApi.deleteExamEventV2(examEventUuid));

// V2 Admin - Papers
export const createExamPaperV2Thunk = createExamThunk('createExamPaperV2', (payload) => adminExamApi.createExamPaperV2(payload));
export const listExamPapersV2Thunk = createExamThunk('listExamPapersV2', (params) => adminExamApi.listExamPapersV2(params));
export const updateExamPaperV2Thunk = createExamThunk('updateExamPaperV2', ({ examPaperUuid, payload }) =>
  adminExamApi.updateExamPaperV2(examPaperUuid, payload)
);
export const deleteExamPaperV2Thunk = createExamThunk('deleteExamPaperV2', ({ examPaperUuid }) => adminExamApi.deleteExamPaperV2(examPaperUuid));

// V2 Admin - Timetable
export const createExamTimetableEntryV2Thunk = createExamThunk('createExamTimetableEntryV2', (payload) =>
  adminExamApi.createExamTimetableEntryV2(payload)
);
export const listExamTimetableEntriesV2Thunk = createExamThunk('listExamTimetableEntriesV2', (params) =>
  adminExamApi.listExamTimetableEntriesV2(params)
);
export const updateExamTimetableEntryV2Thunk = createExamThunk('updateExamTimetableEntryV2', ({ examTimetableUuid, payload }) =>
  adminExamApi.updateExamTimetableEntryV2(examTimetableUuid, payload)
);
export const deleteExamTimetableEntryV2Thunk = createExamThunk('deleteExamTimetableEntryV2', ({ examTimetableUuid }) =>
  adminExamApi.deleteExamTimetableEntryV2(examTimetableUuid)
);

// V2 Admin - Marks
export const listMarksEntriesV2Thunk = createExamThunk('listMarksEntriesV2', (params) => adminExamApi.listMarksEntriesV2(params));
export const approveMarksEntryV2Thunk = createExamThunk('approveMarksEntryV2', (payload) => adminExamApi.approveMarksEntryV2(payload));
export const lockMarksEntryV2Thunk = createExamThunk('lockMarksEntryV2', (payload) => adminExamApi.lockMarksEntryV2(payload));
export const createMarksRegistersV2Thunk = createExamThunk('createMarksRegistersV2', (payload) =>
  adminExamApi.createMarksRegistersV2(payload)
);
export const listMarksRegistersV2Thunk = createExamThunk('listMarksRegistersV2', (params) =>
  adminExamApi.listMarksRegistersV2(params)
);
export const getMarksRegisterByPaperV2Thunk = createExamThunk('getMarksRegisterByPaperV2', ({ examPaperId, params }) =>
  adminExamApi.getMarksRegisterByPaperV2(examPaperId, params)
);
export const updateMarksRegistersV2Thunk = createExamThunk('updateMarksRegistersV2', (payload) =>
  adminExamApi.updateMarksRegistersV2(payload)
);
export const createExamAttendanceV2Thunk = createExamThunk('createExamAttendanceV2', (payload) =>
  adminExamApi.createExamAttendanceV2(payload)
);
export const createExamAttendanceBulkV2Thunk = createExamThunk('createExamAttendanceBulkV2', (payload) =>
  adminExamApi.createExamAttendanceBulkV2(payload)
);
export const listExamAttendanceV2Thunk = createExamThunk('listExamAttendanceV2', (params) =>
  adminExamApi.listExamAttendanceV2(params)
);
export const getExamAttendanceByIdV2Thunk = createExamThunk('getExamAttendanceByIdV2', ({ attendanceId }) =>
  adminExamApi.getExamAttendanceByIdV2(attendanceId)
);
export const updateExamAttendanceV2Thunk = createExamThunk('updateExamAttendanceV2', ({ attendanceId, payload }) =>
  adminExamApi.updateExamAttendanceV2(attendanceId, payload)
);
export const deleteExamAttendanceV2Thunk = createExamThunk('deleteExamAttendanceV2', ({ attendanceId }) =>
  adminExamApi.deleteExamAttendanceV2(attendanceId)
);

// V2 Admin - Results
export const listResultsV2Thunk = createExamThunk('listResultsV2', (params) => adminExamApi.listResultsV2(params));
export const recomputeResultsV2Thunk = createExamThunk('recomputeResultsV2', (payload) => adminExamApi.recomputeResultsV2(payload));
export const publishResultsV2Thunk = createExamThunk('publishResultsV2', (payload) => adminExamApi.publishResultsV2(payload));

// V2 Admin - Templates/Documents
export const createDocumentTemplateV2Thunk = createExamThunk('createDocumentTemplateV2', (payload) =>
  adminExamApi.createDocumentTemplateV2(payload)
);
export const listDocumentTemplatesV2Thunk = createExamThunk('listDocumentTemplatesV2', (params) =>
  adminExamApi.listDocumentTemplatesV2(params)
);
export const updateDocumentTemplateV2Thunk = createExamThunk('updateDocumentTemplateV2', ({ documentTemplateUuid, payload }) =>
  adminExamApi.updateDocumentTemplateV2(documentTemplateUuid, payload)
);
export const generateDocumentV2Thunk = createExamThunk('generateDocumentV2', (payload) => adminExamApi.generateDocumentV2(payload));
export const listDocumentsV2Thunk = createExamThunk('listDocumentsV2', (params) => adminExamApi.listDocumentsV2(params));
export const getAdmitCardDataV2Thunk = createExamThunk('getAdmitCardDataV2', (params) =>
  adminExamApi.getAdmitCardDataV2(params)
);

// V2 Teacher
export const listTeacherAssignedPapersV2Thunk = createExamThunk('listTeacherAssignedPapersV2', (params) =>
  teacherExamApi.listTeacherAssignedPapersV2(params)
);
export const listTeacherTimetableV2Thunk = createExamThunk('listTeacherTimetableV2', (params) => teacherExamApi.listTeacherTimetableV2(params));
export const listTeacherPaperStudentsV2Thunk = createExamThunk('listTeacherPaperStudentsV2', ({ examPaperUuid }) =>
  teacherExamApi.listTeacherPaperStudentsV2(examPaperUuid)
);
export const listTeacherPaperMarksV2Thunk = createExamThunk('listTeacherPaperMarksV2', ({ examPaperUuid }) =>
  teacherExamApi.listTeacherPaperMarksV2(examPaperUuid)
);
export const upsertTeacherMarksV2Thunk = createExamThunk('upsertTeacherMarksV2', ({ examPaperUuid, payload }) =>
  teacherExamApi.upsertTeacherMarksV2(examPaperUuid, payload)
);
export const submitTeacherMarksV2Thunk = createExamThunk('submitTeacherMarksV2', ({ examPaperUuid, payload }) =>
  teacherExamApi.submitTeacherMarksV2(examPaperUuid, payload)
);
export const bulkTeacherAttendanceV2Thunk = createExamThunk('bulkTeacherAttendanceV2', ({ examPaperUuid, payload }) =>
  teacherExamApi.bulkTeacherAttendanceV2(examPaperUuid, payload)
);

export const listTeacherExamTermsDropdownV2Thunk = createExamThunk('listTeacherExamTermsDropdownV2', () =>
  teacherExamApi.listTeacherExamTermsDropdownV2()
);
export const listTeacherExamEventsDropdownV2Thunk = createExamThunk('listTeacherExamEventsDropdownV2', (params) =>
  teacherExamApi.listTeacherExamEventsDropdownV2(params)
);
export const listTeacherExamClassSectionsDropdownV2Thunk = createExamThunk(
  'listTeacherExamClassSectionsDropdownV2',
  () => teacherExamApi.listTeacherExamClassSectionsDropdownV2()
);
export const listTeacherExamPapersDropdownV2Thunk = createExamThunk('listTeacherExamPapersDropdownV2', (params) =>
  teacherExamApi.listTeacherExamPapersDropdownV2(params)
);
export const listTeacherExamStudentsDropdownV2Thunk = createExamThunk('listTeacherExamStudentsDropdownV2', (params) =>
  teacherExamApi.listTeacherExamStudentsDropdownV2(params)
);
export const listTeacherExamMarksRegistersV2Thunk = createExamThunk('listTeacherExamMarksRegistersV2', (params) =>
  teacherExamApi.listTeacherExamMarksRegistersV2(params)
);
export const getTeacherExamMarksRegisterByPaperV2Thunk = createExamThunk(
  'getTeacherExamMarksRegisterByPaperV2',
  ({ examPaperId, params }) => teacherExamApi.getTeacherExamMarksRegisterByPaperV2(examPaperId, params)
);
export const upsertTeacherExamMarksRegistersV2Thunk = createExamThunk('upsertTeacherExamMarksRegistersV2', (payload) =>
  teacherExamApi.upsertTeacherExamMarksRegistersV2(payload)
);

// V2 Student
export const getStudentTimetableV2Thunk = createExamThunk('getStudentTimetableV2', (params) => studentExamApi.getStudentTimetableV2(params));
export const getStudentResultsV2Thunk = createExamThunk('getStudentResultsV2', (params) => studentExamApi.getStudentResultsV2(params));
export const getStudentDocumentsV2Thunk = createExamThunk('getStudentDocumentsV2', (params) => studentExamApi.getStudentDocumentsV2(params));
export const downloadStudentDocumentV2Thunk = createExamThunk('downloadStudentDocumentV2', ({ documentUuid }) =>
  studentExamApi.downloadStudentDocumentV2(documentUuid)
);

const initialState = {
  loadingByAction: {},
  errorByAction: {},
  responseByAction: {},
  lastAction: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    clearExamActionState: (state, action) => {
      const actionKey = action.payload;
      if (!actionKey) {
        return;
      }

      delete state.loadingByAction[actionKey];
      delete state.errorByAction[actionKey];
      delete state.responseByAction[actionKey];
      if (state.lastAction === actionKey) {
        state.lastAction = null;
      }
    },
    resetExamState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith('exam/') && action.type.endsWith('/pending'),
      (state, action) => {
        const actionKey = action.type.split('/')[1];
        state.loadingByAction[actionKey] = true;
        state.errorByAction[actionKey] = null;
        state.lastAction = actionKey;
      }
    );

    builder.addMatcher(
      (action) => action.type.startsWith('exam/') && action.type.endsWith('/fulfilled'),
      (state, action) => {
        const actionKey = action.type.split('/')[1];
        state.loadingByAction[actionKey] = false;
        state.responseByAction[actionKey] = action.payload;
        state.errorByAction[actionKey] = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.startsWith('exam/') && action.type.endsWith('/rejected'),
      (state, action) => {
        const actionKey = action.type.split('/')[1];
        state.loadingByAction[actionKey] = false;
        state.errorByAction[actionKey] = action.payload || { message: action.error?.message || 'Request failed' };
      }
    );
  },
});

export const { clearExamActionState, resetExamState } = examSlice.actions;

export default examSlice.reducer;
