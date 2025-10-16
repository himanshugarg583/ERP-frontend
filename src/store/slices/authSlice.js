import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogin: (state, action) => {
      const { user, token } = action.payload || {};
      state.user = user || null;
      state.token = token || null;
      state.role = user?.role || null;
    },
    authLogout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { authLogin, authLogout } = authSlice.actions;
export default authSlice.reducer;


