import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { useForgotPassMutation } from "../../services/auth.js";
import styles from "./ForgotPass.module.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPass, { isLoading, isError, error }] = useForgotPassMutation();

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
      console.log("change email res", res);
      setEmail("");
      // inform the user
      Swal.fire({
        title: res.message,
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.log(error);
      // show the error to user
      Swal.fire({
        title: "Opps something went wrong",
        text: error.data?.message || "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
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
