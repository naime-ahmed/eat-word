import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import ActivateACCCard from "../../components/ActivateACCCard/ActivateACCCard";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import { setUser } from "../../features/authSlice.js";
import { resetNewUserForm } from "../../features/userSignUpSlice";
import { useDeviceFingerprint } from "../../hooks/useDeviceFingerprint.js";
import { useActivateUserMutation } from "../../services/auth";
import { parseJwt } from "../../utils/parseJWT.js";
import styles from "./ActiveAcc.module.css";

const ActiveAcc = () => {
  const [isActivated, setIsActivated] = useState(true);
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activateToken } = useParams();
  const [activateUser, { isLoading }] = useActivateUserMutation();
  const fp = useDeviceFingerprint();

  // Function to handle navigation
  const handleNavigate = (route) => {
    navigate(`/${route}`);
  };

  // Server request for activation
  useEffect(() => {
    const reqServer = async () => {
      if (localStorage.getItem("access-token")) return;
      try {
        const { accessToken, message } = await activateUser({
          activation_token: activateToken,
          deviceFingerPrint: fp,
          promoCode: "EARLY_BIRD_FREE_PREMIUM_1_MONTH",
        }).unwrap();

        // Reset the sign-up form
        dispatch(resetNewUserForm());

        // Save the access token in local storage
        localStorage.setItem("access-token", accessToken);

        // Update user authentication state
        dispatch(setUser(parseJwt(accessToken)));

        // Update activation state
        setMsg(message);
        setIsActivated(true);
      } catch (error) {
        console.error("Activation error:", error);
        setMsg(error?.data?.msg || "Oops, something went wrong");
        setIsActivated(false);
      }
    };

    if (activateToken && fp) {
      reqServer();
    }
  }, [activateToken, activateUser, dispatch, fp]);

  // Return loading spinner or activation card based on state
  return (
    <div className={styles.ActiveAccPage}>
      <div className={styles.ActiveAccContainer}>
        {isLoading || !fp ? (
          <SpinnerForPage />
        ) : isActivated ? (
          <ActivateACCCard
            isSuccess={true}
            p1="Account activation successful!"
            p2="Your account has been successfully activated."
            btnText="Let's go!"
            btnColorLeft="#078900"
            btnColorRight="#079200"
            btnClick={() => handleNavigate("my-space")}
          />
        ) : (
          <ActivateACCCard
            isSuccess={false}
            p1={msg}
            p2="An unknown error occurred during the activation process."
            btnText="Try again"
            btnColorLeft="#FF0000"
            btnColorRight="#FF4500"
            btnClick={() => handleNavigate("sign-up")}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveAcc;
