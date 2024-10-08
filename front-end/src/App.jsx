import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { checkAuthentication } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // get the token from local storage
    const token = localStorage.getItem("access-token");
    console.log(token);
    const verifyToken = async () => {
      if (token) {
        await dispatch(checkAuthentication(token));
      }
    };

    verifyToken().catch((err) => {
      console.error("Authentication check failed", err);
    });
  }, [dispatch]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
