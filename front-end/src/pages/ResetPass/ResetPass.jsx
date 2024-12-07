import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { useResetPassMutation } from "../../services/auth";
import styles from "./ResetPass.module.css";

const ResetPass = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

      console.log(resetPass);

      // try to send token, id, new password
      const res = await resetPassword({
        newPass: resetPass.newPass,
        token,
      }).unwrap();
      console.log("resetReqRes", res);
      Swal.fire({
        title: res?.message || "reset successful",
        text: "Now you can sign in with new password",
        icon: "success",
        confirmButtonText: "Okay",
      });
      setResetPass({
        newPass: "",
        seeNewPass: false,
        newPassError: "",
        retypePass: "",
        seeRetypePass: false,
        retypePassError: "",
      });
    } catch (error) {
      console.log("resetReqError", error);
      Swal.fire({
        title: "Something went wrong",
        text: error.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  }

  function handleNavigate(route) {
    navigate(`/${route}`);
  }

  return (
    <div className={styles.ForgotPassPage}>
      {token || isError ? (
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
                className={styles.newPassEyeIcon}
                style={{ bottom: resetPass.newPassError ? "26px" : undefined }}
              >
                <i
                  onClick={() =>
                    setResetPass((prev) => ({
                      ...prev,
                      ["seeNewPass"]: !prev["seeNewPass"],
                    }))
                  }
                  className={`fa-solid fa-eye${
                    resetPass.seeNewPass ? "-slash" : ""
                  }`}
                ></i>
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
                className={styles.retypePassEyeIcon}
                style={{
                  bottom: resetPass.retypePassError ? "26px" : undefined,
                }}
              >
                <i
                  onClick={() =>
                    setResetPass((prev) => ({
                      ...prev,
                      ["seeRetypePass"]: !prev["seeRetypePass"],
                    }))
                  }
                  className={`fa-solid fa-eye${
                    resetPass.seeRetypePass ? "-slash" : ""
                  }`}
                ></i>
              </span>
              {resetPass.retypePassError && <p>{resetPass.retypePassError}</p>}
            </div>
            <div className={styles.submitBtn}>
              <PrimaryBtn type="submit" isLoading={isLoading}>
                Reset Password
              </PrimaryBtn>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.errorMessage}>
          <p>
            <i className="fa-solid fa-circle-exclamation"></i>
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

export default ResetPass;
