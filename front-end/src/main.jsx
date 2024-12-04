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
import Home from "./pages/Home/Home";
import Milestone from "./pages/Milestone/Milestone";
import MySpace from "./pages/MySpace/MySpace";
import NotFound from "./pages/NotFound/NotFound";
import Pricing from "./pages/Pricing/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Profile from "./pages/Profile/Profile";
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
        element: <PrivacyPolicy />,
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
