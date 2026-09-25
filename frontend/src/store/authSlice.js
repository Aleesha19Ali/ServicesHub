import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // Login ke baad user information save karega
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    // Logout ke baad user information clear karega
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;