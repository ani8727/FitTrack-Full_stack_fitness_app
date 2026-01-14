import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
    userId: sessionStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.user.sub;

      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      sessionStorage.setItem('userId', action.payload.user.sub);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;