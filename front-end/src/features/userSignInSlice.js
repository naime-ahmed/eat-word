import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  user: {
    email: "",
    password: "",
    captcha: "",
  },
  userErrors: {},
};

// Create the slice
const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    // Update user fields
    updateUser(state, action) {
      const { name, value } = action.payload;
      state.user[name] = value;
    },

    // set user error
    setUserErrors(state, action) {
      state.userErrors = action.payload;
    },

    // Reset form
    resetForm(state) {
      state.user = {
        email: "",
        password: "",
        captcha: "",
      };
      state.userErrors = {};
    },
  },
});

// Export the actions
export const { updateUser, setUserErrors, resetForm } = signInSlice.actions;

// Export the reducer
export default signInSlice.reducer;
