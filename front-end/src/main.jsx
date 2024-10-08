import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
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
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/signIn",
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
