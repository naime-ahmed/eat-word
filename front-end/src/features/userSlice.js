import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    userError: {}
}

const userSlice = createSlice({name: "user", initialState, reducers:{
    setUserData(state, action){
        state.user = action.payload;
    },
    setUserError(state, action){
        state.userError = action.payload;
    }
}})

export const {setUserData, setUserError} = userSlice.actions;

export default userSlice.reducer;