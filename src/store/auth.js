import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) ?? false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        uid: action.payload.uid,
        email: action.payload.email,
      };
    },
    logoutSuccess: (state) => {
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
