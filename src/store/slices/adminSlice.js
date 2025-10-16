import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminStats: (state, action) => {
      state.stats = action.payload || null;
    },
    setAdminLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    setAdminError: (state, action) => {
      state.error = action.payload || null;
    },
    resetAdmin: () => initialState,
  },
});

export const { setAdminStats, setAdminLoading, setAdminError, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;


