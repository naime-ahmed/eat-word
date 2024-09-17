import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./app/store";
import "./index.css";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";

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
    element: <SignIn />,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <NotFound />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <NotFound />,
  },
  {
    path: "/tac",
    element: <TermsAndConditions />,
    errorElement: <NotFound />,
  },
  {
    path: "/privacyPolicy",
    element: <PrivacyPolicy />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
