import { useState } from "react";
import { Link } from "react-router-dom";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import useNotification from "../../hooks/useNotification.js";
import { useForgotPassMutation } from "../../services/auth.js";
import styles from "./ForgotPass.module.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPass, { isLoading, isError, error }] = useForgotPassMutation();
  const showNotification = useNotification();

  // Validate email format
  function validateEmail() {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("A valid email is required.");
      return false;
    }
    setEmailError("");
    return true;
  }

  // Handle form submission
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!validateEmail()) return;

      const res = await forgotPass(email).unwrap();
      setEmail("");
      // inform the user
      showNotification({
        title: "",
        message: res.message,
        iconType: "success",
        duration: 4000,
      });
    } catch (error) {
      console.log(error);
      // show the error to user
      showNotification({
        title: "Opps something went wrong",
        message: error.data?.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  }

  return (
    <div className={styles.forgotPassPage}>
      <main id="content" role="main" className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Forgot password?</h1>
          <p className={styles.subtitle}>
            Remember your password?{" "}
            <Link className={styles.link} to="/sign-in">
              Sign in here
            </Link>
          </p>
        </div>

        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`${styles.input} ${
                      emailError ? styles.inputError : ""
                    }`}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    onBlur={validateEmail} // Validate on blur
                  />
                </div>
                {emailError && (
                  <p className={styles.errorMessage}>{emailError}</p>
                )}
                {isError && <p className={styles.errorMessage}>{error}</p>}
              </div>
              <div>
                <PrimaryBtn type="submit" isLoading={isLoading}>
                  Reset password
                </PrimaryBtn>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPass;
