import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/authSlice";
import signInReducers from "../features/userSignInSlice";
import signUpReducers from "../features/userSignUpSlice";
import userReducers from '../features/userSlice';
import { authApi } from "../services/auth";
import { milestoneApi } from "../services/milestone";
import { userApi } from "../services/user";

const store = configureStore({
  reducer: {
    signIn: signInReducers,
    signUp: signUpReducers,
    auth: authReducers,
    user: userReducers,
    [authApi.reducerPath]: authApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(milestoneApi.middleware)
      .concat(userApi.middleware),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
