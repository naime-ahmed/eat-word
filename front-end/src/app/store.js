import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/authSlice";
import notificationReducer from "../features/notificationSlice";
import popupZIndexReducer from "../features/popupZIndexSlice";
import signInReducers from "../features/userSignInSlice";
import signUpReducers from "../features/userSignUpSlice";
import userReducers from "../features/userSlice";
import { authApi } from "../services/auth";
import { generativeApi } from "../services/generativeAi";
import { milestoneApi } from "../services/milestone";
import { userApi } from "../services/user";
import { wordApi } from "../services/word";

const store = configureStore({
  reducer: {
    signIn: signInReducers,
    signUp: signUpReducers,
    auth: authReducers,
    user: userReducers,
    popupZIndex: popupZIndexReducer,
    notification: notificationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [wordApi.reducerPath]: wordApi.reducer,
    [generativeApi.reducerPath]: generativeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(milestoneApi.middleware)
      .concat(userApi.middleware)
      .concat(wordApi.middleware)
      .concat(generativeApi.middleware),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
