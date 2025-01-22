// src/thunks/authThunks.js
import { setLoading, setSignOutUser, setUser } from "../features/authSlice.js";

export const checkAuthentication = (token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(
      `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const user = await response.json();
      dispatch(setUser(user)); // set the user in state
    } else {
      const errorData = await response.json();

      if (errorData.message === "Access token expired") {
        //  Handle refresh token
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth/refresh-token`,
          {
            method: "POST",
            // necessary to include cookies in cross-origin requests
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          const { accessToken, ...dataWithoutToken } = refreshedData;
          localStorage.setItem("access-token", accessToken);

          dispatch(setUser(dataWithoutToken)); // Set the user after refresh
        } else {
          dispatch(setSignOutUser()); // / Log out if refresh fails
        }
      } else {
        dispatch(setSignOutUser()); // Log out if access token is invalid
        console.log("token invalid error");
      }
    }
  } catch (error) {
    console.error("Token verification failed", error);
    dispatch(setSignOutUser()); // Log out on any error
  } finally {
    // Set loading to false after everything is done
    dispatch(setLoading(false));
  }
};
