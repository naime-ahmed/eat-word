import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/authSlice";
import signInReducers from "../features/userSignInSlice";
import signUpReducers from "../features/userSignUpSlice";
import { authApi } from "../services/auth";
import { milestoneApi } from "../services/milestone";

const store = configureStore({
  reducer: {
    signIn: signInReducers,
    signUp: signUpReducers,
    auth: authReducers,
    [authApi.reducerPath]: authApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(milestoneApi.middleware),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
