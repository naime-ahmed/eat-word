import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { MdOutlineError } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import useNotification from "../../hooks/useNotification";
import { useResetPassMutation } from "../../services/auth";
import styles from "./ResetPass.module.css";

const ResetPass = () => {
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showNotification = useNotification();

  // Function to read the token and id from the URL
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [resetPass, setResetPass] = useState({
    newPass: "",
    seeNewPass: false,
    newPassError: "",
    retypePass: "",
    seeRetypePass: false,
    retypePassError: "",
  });

  const [resetPassword, { isLoading, isError, error }] = useResetPassMutation();

  function handleOnChange(e) {
    setResetPass((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      let newPassError = "";
      let retypePassError = "";
      if (resetPass.newPass === "") {
        newPassError = "lol, you gotta fill this out";
      }
      if (resetPass.retypePass === "") {
        retypePassError = "Confirm you pass please";
      }
      if (resetPass.newPass && resetPass.newPass.length < 6) {
        newPassError = "password is too week";
      }
      if (
        resetPass.retypePass &&
        resetPass.newPass &&
        resetPass.newPass !== resetPass.retypePass
      ) {
        retypePassError = "didn't match with new password!";
      }

      setResetPass((prev) => ({ ...prev, newPassError, retypePassError }));
      if (newPassError || retypePassError) return;

      // try to send token, id, new password
      const res = await resetPassword({
        newPass: resetPass.newPass,
        token,
      }).unwrap();

      showNotification({
        title: res?.message || "reset successful",
        message: "Now you can sign in with new password",
        iconType: "success",
        duration: 4000,
      });
      setIsResetSuccess(true);
      setResetPass({
        newPass: "",
        seeNewPass: false,
        newPassError: "",
        retypePass: "",
        seeRetypePass: false,
        retypePassError: "",
      });
    } catch (error) {
      setIsResetSuccess(false);
      showNotification({
        title: "Something went wrong",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  }

  function handleNavigate(route) {
    navigate(`/${route}`);
  }

  return (
    <div className={styles.forgotPassPage}>
      {token ? (
        isResetSuccess ? (
          <ResetSuccess />
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.resetPassHeader}>
              <h2>Reset your password</h2>
            </div>
            <form onSubmit={handleOnSubmit}>
              <div className={styles.newPass}>
                <label htmlFor="newPass">Enter new password</label>
                <input
                  type={resetPass.seeNewPass ? "text" : "password"}
                  name="newPass"
                  id="newPass"
                  onChange={handleOnChange}
                  value={resetPass.newPass}
                  autoComplete="on"
                  autoFocus
                  required
                />
                <span
                  className={styles.passEyeIcon}
                  style={{
                    bottom: resetPass.newPassError ? "26px" : undefined,
                  }}
                  onClick={() =>
                    setResetPass((prev) => ({
                      ...prev,
                      seeNewPass: !prev.seeNewPass,
                    }))
                  }
                  role="button"
                  aria-label={
                    resetPass.seeNewPass ? "Hide password" : "Show password"
                  }
                  tabIndex={0}
                >
                  {resetPass.seeNewPass ? (
                    <FaEyeSlash className={styles.eyeIcon} />
                  ) : (
                    <FaEye className={styles.eyeIcon} />
                  )}
                </span>
                {resetPass.newPassError && <p>{resetPass.newPassError}</p>}
              </div>
              <div className={styles.retypePass}>
                <label htmlFor="retypePass">Confirm new password</label>
                <input
                  type={resetPass.seeRetypePass ? "text" : "password"}
                  name="retypePass"
                  id="retypePass"
                  onChange={handleOnChange}
                  value={resetPass.retypePass}
                  autoComplete="on"
                  required
                />
                <span
                  className={styles.passEyeIcon}
                  style={{
                    bottom: resetPass.retypePassError ? "26px" : undefined,
                  }}
                  onClick={() =>
                    setResetPass((prev) => ({
                      ...prev,
                      seeRetypePass: !prev.seeRetypePass,
                    }))
                  }
                  role="button"
                  aria-label={
                    resetPass.seeRetypePass ? "Hide password" : "Show password"
                  }
                  tabIndex={0}
                >
                  {resetPass.seeRetypePass ? (
                    <FaEyeSlash className={styles.eyeIcon} />
                  ) : (
                    <FaEye className={styles.eyeIcon} />
                  )}
                </span>
                {resetPass.retypePassError && (
                  <p>{resetPass.retypePassError}</p>
                )}
              </div>
              <div className={styles.submitBtn}>
                <PrimaryBtn type="submit" isLoading={isLoading}>
                  Reset Password
                </PrimaryBtn>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className={styles.errorMessage}>
          <p>
            <MdOutlineError />
          </p>
          <h2>
            {isError ? "Invalid or expired token" : "Unauthorized request!"}
          </h2>
          <p>
            {isError
              ? error?.message ||
                "Something went wrong while resetting the password."
              : "You are supposed to request first!"}
          </p>
          <PrimaryBtn handleClick={() => handleNavigate("forgot-password")}>
            Request to reset
          </PrimaryBtn>
        </div>
      )}
    </div>
  );
};

const ResetSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.resetPassSuccess}>
      <div className={styles.resetPassSucIcon}>
        <HiMiniShieldCheck />
      </div>
      <h2>Password reset successful!</h2>
      <p>
        Your password has been successfully updated. You&#39;re all set to
        access your account with your new credentials.
      </p>
      <PrimaryBtn handleClick={() => navigate("/sign-in")}>
        Sign In to Your Account
      </PrimaryBtn>
      <p className={styles.needHelp}>
        Need help?{" "}
        <Link to="/contact" className={styles.helpLink}>
          Contact our support team
        </Link>
      </p>
    </div>
  );
};

export default ResetPass;
