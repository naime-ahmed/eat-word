import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import store from "./app/store";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./index.css";
import About from "./pages/About/About";
import ActiveAcc from "./pages/ActivateAcc/ActiveAcc";
import Contact from "./pages/Contact/Contact";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import Home from "./pages/Home/Home";
import Milestone from "./pages/Milestone/Milestone";
import MySpace from "./pages/MySpace/MySpace";
import NotFound from "./pages/NotFound/NotFound";
import Pricing from "./pages/Pricing/Pricing";
import PrivacyInfo from "./pages/PrivacyInfo/PrivacyInfo";
import Profile from "./pages/Profile/Profile";
import Release from "./pages/Release/Release";
import ResetPass from "./pages/ResetPass/ResetPass";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/my-space",
        element: (
          <ProtectedRoute>
            <MySpace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-space/:milestoneId",
        element: <Milestone />,
      },
      {
        path: "/price",
        element: <Pricing />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/activate/:activateToken",
        element: <ActiveAcc />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/extension-signin",
        element: <SignIn />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPass />,
      },
      {
        path: "/reset-password",
        element: <ResetPass />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/tac",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacyPolicy",
        element: <PrivacyInfo />,
      },
      {
        path: "/release",
        element: <Release />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
