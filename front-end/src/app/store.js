import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/auth/authSlice";
import newWeekReducers from "../features/newWeekForm/newWeekFormSlice";
import signInReducers from '../features/userSignIn/userSignInSlice';
import signUpReducers from "../features/userSignUp/userSignUpSlice";
import { authApi } from "../services/auth";

const store = configureStore({
    reducer: {
        signIn: signInReducers,
        signUp: signUpReducers,
        auth: authReducers,
        newWeekForm: newWeekReducers,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
    devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store;