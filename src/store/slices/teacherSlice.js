import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schedule: [],
  attendanceSummary: null,
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeacherSchedule: (state, action) => {
      state.schedule = action.payload || [];
    },
    setTeacherAttendanceSummary: (state, action) => {
      state.attendanceSummary = action.payload || null;
    },
    setTeacherLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    setTeacherError: (state, action) => {
      state.error = action.payload || null;
    },
    resetTeacher: () => initialState,
  },
});

export const {
  setTeacherSchedule,
  setTeacherAttendanceSummary,
  setTeacherLoading,
  setTeacherError,
  resetTeacher,
} = teacherSlice.actions;

export default teacherSlice.reducer;


