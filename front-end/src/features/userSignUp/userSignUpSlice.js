import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newUser: {
        fName: "",
        email: "",
        password: "",
        surePass: "",
        captcha: "",
        agree: false,
    },
    newUserErrors : {}
}

const signUpSlice = createSlice({
    name: "singUp",
    initialState,
    reducers:{
        // Update user fields
        updateNewUser(state, action){
            const {name, value} = action.payload;
            state.newUser[name] = value;
        },
        
        // set user error
        setUserNewErrors(state, action){
            state.newUserErrors = action.payload;
        },

        // Reset form
        resetNewUserForm(state){
            state.newUser = {
                fName: "",
                email: "",
                password: "",
                surePass: "",
                captcha: "",
                agree: false,
            };
            state.newUserErrors = {};
        }
    }
})

export const {updateNewUser, setUserNewErrors, resetNewUserForm } = signUpSlice.actions;

// Export the reducer
export default signUpSlice.reducer;