import { configureStore } from "@reduxjs/toolkit";
import signInReducers from '../features/userSignIn/userSignInSlice';
import signUpReducers from "../features/userSignUp/userSignUpSlice";
import { authApi } from "../services/auth.js";

const store = configureStore({
    reducer: {
        signIn: signInReducers,
        signUp: signUpReducers,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
    devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store;