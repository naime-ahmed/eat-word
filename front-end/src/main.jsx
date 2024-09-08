import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import SingIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
    errorElement: <NotFound />,
  },
  {
    path: "/signIn",
    element: <SingIn />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
