import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  performance: null,
  upcomingClasses: [],
  assignments: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentPerformance: (state, action) => {
      state.performance = action.payload || null;
    },
    setStudentUpcomingClasses: (state, action) => {
      state.upcomingClasses = action.payload || [];
    },
    setStudentAssignments: (state, action) => {
      state.assignments = action.payload || [];
    },
    setStudentLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    setStudentError: (state, action) => {
      state.error = action.payload || null;
    },
    resetStudent: () => initialState,
  },
});

export const {
  setStudentPerformance,
  setStudentUpcomingClasses,
  setStudentAssignments,
  setStudentLoading,
  setStudentError,
  resetStudent,
} = studentSlice.actions;

export default studentSlice.reducer;


