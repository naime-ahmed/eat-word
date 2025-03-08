// src/App.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import NotificationContainer from "./components/Notification/Notification.jsx";
import { setLoading } from "./features/authSlice";
import { setUserData, setUserError } from "./features/userSlice.js";
import { useBringUserByIdQuery } from "./services/user.js";
import { checkAuthentication } from "./thunks/authThunk.js";

function App() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  // fetch user data
  const { data: userData, error: userError } = useBringUserByIdQuery(
    authUser?.id,
    { skip: !authUser?.id }
  );

  useEffect(() => {
    // get the token from local storage
    const token = localStorage.getItem("access-token");

    const verifyToken = async () => {
      if (token) {
        try {
          await dispatch(checkAuthentication(token));
        } catch (err) {
          console.error("Authentication check failed", err);
        }
      } else {
        // If no token, ensure loading is set to false
        dispatch(setLoading(false));
      }
    };

    verifyToken();
  }, [dispatch]);

  useEffect(() => {
    if (userData?.data) {
      dispatch(setUserData(userData?.data));
    }

    if (userError) {
      dispatch(setUserError(userError));
    }
  }, [userData, userError, dispatch]);

  return (
    <>
      <Outlet />
      <NotificationContainer />
    </>
  );
}

export default App;
