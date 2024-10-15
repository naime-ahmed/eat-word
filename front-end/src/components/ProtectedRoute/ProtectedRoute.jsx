import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    console.log("loading...");
    return <div>Loading...</div>;
  }

  // If user is not authenticated after loading is done, redirect to sign-in
  console.log("inside protected", isAuthenticated, isLoading);
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
