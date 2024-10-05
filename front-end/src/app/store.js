import { configureStore } from "@reduxjs/toolkit";
import signInReducers from '../features/userSignIn/userSignInSlice';
import signUpReducers from "../features/userSignUp/userSignUpSlice";
import { usersApi } from "../services/users";

const store = configureStore({
    reducer: {
        signIn: signInReducers,
        signUp: signUpReducers,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware),
    devTools: import.meta.env.NODE_ENV !== 'production',
})

export default store;