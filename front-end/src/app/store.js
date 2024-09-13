import { configureStore } from "@reduxjs/toolkit";
import signInReducers from '../features/userSignIn/userSignInSlice';

const store = configureStore({
    reducer: {
        signIn: signInReducers
    }
})

export default store;