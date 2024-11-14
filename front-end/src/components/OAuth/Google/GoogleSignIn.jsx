// GoogleLogin.js
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setUser } from "../../../features/authSlice";
import { parseJwt } from "../../../utils/parseJWT";

function GoogleSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSuccess = async (response) => {
    console.log(response);
    try {
      // Extract the Google ID token
      const googleToken = response.credential;

      // Send the ID token to your backend
      const backendResponse = await fetch(
        `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: googleToken }),
        }
      );

      const result = await backendResponse.json();
      console.log("Backend response:", result);

      // save access token into local-storage
      localStorage.setItem("access-token", result.accessToken);

      // inform the user
      Swal.fire({
        title: result.message,
        icon: "success",
        confirmButtonText: "Got it",
      });
      dispatch(setUser(parseJwt(result.accessToken)));
      navigate("/my-space");
    } catch (error) {
      console.error("Sign in failed:", error);
      // show the error to user
      Swal.fire({
        title: "Unable to sign in",
        text: error.data?.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const handleLoginError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        buttonText="Sign In with Google"
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        cookiePolicy={"single_host_origin"}
        theme="filled_blue"
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleSignIn;
