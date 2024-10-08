import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.isAuthenticated = true,
            state.user = action.payload;
        },
        signOutUser: (state) => {
            state.isAuthenticated = false,
            state.user = null;
        }
    }
})

export const {setUser, signOutUser} = authSlice.actions;

// check if user is authenticated or not
export const checkAuthentication = (token) => async (dispatch) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_EAT_WORD_BASE_URL}/auth`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
            }
        });

        if (response.ok) {
            const user = await response.json();
            dispatch(setUser(user)); // Successful, set the user in state
        } else {
            const errorData = await response.json();

            if (errorData.message === "Access token expired") {
                console.log("inside refresh");
                // Call the refresh token endpoint if access token expired
                const refreshResponse = await fetch(`${import.meta.env.VITE_EAT_WORD_BASE_URL}/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include"
                });

                if (refreshResponse.ok) {
                    const refreshedData = await refreshResponse.json();
                    localStorage.setItem("access-token", refreshedData.accessToken); // Store new access token
                    dispatch(setUser(refreshedData)); // Update user in Redux
                } else {
                    dispatch(signOutUser()); // If refresh token fails, log out
                    const err = await refreshResponse.json();
                    console.log(err.message);
                }
            } else {
                dispatch(signOutUser()); // Other error cases, log out
                console.log("token invalid error");
            }
        }
    } catch (error) {
        console.error("Token verification failed", error);
        dispatch(signOutUser()); // Log out on any error
    }
};


export default authSlice.reducer;
