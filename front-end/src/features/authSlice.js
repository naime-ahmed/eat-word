import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      (state.isAuthenticated = true), (state.user = action.payload);
      state.isLoading = false;
    },
    setSignOutUser: (state) => {
      (state.isAuthenticated = false), (state.user = null);
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setSignOutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;