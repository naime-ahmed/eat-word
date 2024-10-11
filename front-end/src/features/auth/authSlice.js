import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.isAuthenticated = true,
            state.user = action.payload;
            state.isLoading = false
        },
        signOutUser: (state) => {
            state.isAuthenticated = false,
            state.user = null;
            state.isLoading = false
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
})

export const {setUser, signOutUser, setLoading} = authSlice.actions;

// check if user is authenticated or not
export const checkAuthentication = (token) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const response = await fetch(`${import.meta.env.VITE_EAT_WORD_BASE_URL}/auth`, {
            method: "POST",
            credentials: "include",
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
                     // necessary to include cookies in cross-origin requests
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (refreshResponse.ok) {
                    const refreshedData = await refreshResponse.json();
                    const { accessToken, ...dataWithoutToken } = refreshedData;
                    localStorage.setItem("access-token", accessToken);

                    dispatch(setUser(dataWithoutToken)); // Update user in Redux
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
