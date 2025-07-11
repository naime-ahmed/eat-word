// GoogleLogin.js
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../features/authSlice";
import { useDeviceFingerprint } from "../../../hooks/useDeviceFingerprint";
import useNotification from "../../../hooks/useNotification";
import { parseJwt } from "../../../utils/parseJWT";

function GoogleSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNotification = useNotification();
  const fp = useDeviceFingerprint();

  const handleLoginSuccess = async (response) => {
    try {
      console.log("device fingerprint: ", fp);
      // Extract the Google ID token
      const googleToken = response.credential;

      // Send the ID token to your backend
      const backendResponse = await fetch(
        `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: googleToken,
            deviceFingerPrint: fp,
            promoCode: "EARLY_BIRD_FREE_PREMIUM_1_MONTH",
          }),
        }
      );

      const result = await backendResponse.json();

      // save access token into local-storage
      localStorage.setItem("access-token", result.accessToken);

      showNotification({
        title: "Success!",
        message: result?.message,
        iconType: "success",
        duration: 4000,
      });
      dispatch(setUser(parseJwt(result.accessToken)));
      navigate("/my-space");
    } catch (error) {
      console.error("Sign in failed:", error);
      // show the error to user
      showNotification({
        title: "Unable to sign in",
        message: error.data?.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
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
        cookiePolicy="single_host_origin"
        theme="filled_blue"
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleSignIn;
