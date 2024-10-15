import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { checkAuthentication, setLoading } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set loading to true initially
    dispatch(setLoading(true));

    // get the token from local storage
    const token = localStorage.getItem("access-token");

    const verifyToken = async () => {
      if (token) {
        await dispatch(checkAuthentication(token));
      } else {
        // If no token, ensure loading is set to false
        dispatch(setLoading(false));
      }
    };

    verifyToken().catch((err) => {
      console.error("Authentication check failed", err);
      dispatch(setLoading(false));
    });
  }, [dispatch]);

  return <Outlet />;
}

export default App;
