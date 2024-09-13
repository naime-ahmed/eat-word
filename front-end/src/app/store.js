import { configureStore } from "@reduxjs/toolkit";
import signInReducers from '../features/userSignIn/userSignInSlice';
import signUpReducers from "../features/userSignUp/userSignUpSlice";

const store = configureStore({
    reducer: {
        signIn: signInReducers,
        signUp: signUpReducers
    }
})

export default store;