import PropTypes from "prop-types";
import { useState } from "react";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import useNotification from "../../hooks/useNotification.js";
import { useForgotPassMutation } from "../../services/auth.js";
import styles from "./ForgotPass.module.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasEmailSent, setHasEmailSent] = useState(false);

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
      setHasEmailSent(true);
    } catch (error) {
      setHasEmailSent(false);
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
      {hasEmailSent ? (
        <ResetYourEmail />
      ) : (
        <main id="content" role="main" className={styles.container}>
          <h1 className={styles.title}>Forgot password?</h1>

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
                      onBlur={validateEmail}
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
                <p className={styles.subtitle}>
                  Remember your password?{" "}
                  <Link className={styles.link} to="/sign-in">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      )}
    </div>
  );
};

const ResetYourEmail = ({ email }) => {
  const getEmailProviderLink = (email) => {
    if (!email || !email.includes("@")) return `mailto:${email}`;
    const domain = email.split("@")[1].toLowerCase();
    switch (domain) {
      case "gmail.com":
        return "https://mail.google.com/";
      case "yahoo.com":
        return "https://mail.yahoo.com/";
      case "outlook.com":
      case "hotmail.com":
        return "https://outlook.live.com/";
      default:
        return `mailto:${email}`;
    }
  };

  return (
    <div className={styles.resetEmailSection}>
      <div className={styles.resetEmailIcons}>
        <FaEnvelopeCircleCheck />
      </div>
      <h2>Please check your email</h2>
      <p>
        You&#39;re almost there! We sent an email to{" "}
        {email ? (
          <a
            href={getEmailProviderLink(email)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resetEmailHighlight}
          >
            {email}
          </a>
        ) : (
          <span className={styles.resetEmailHighlight}>
            your provided email
          </span>
        )}
      </p>

      <p>
        Just click on the link in that email to reset your password. If you
        don&#39;t see it, you may need to{" "}
        {email ? (
          <a
            href={getEmailProviderLink(email)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resetEmailHighlight}
          >
            check your spam
          </a>
        ) : (
          <span className={styles.resetEmailHighlight}>check your spam</span>
        )}{" "}
        folder.
      </p>
      <p>
        Still can&#39;t find the email?{" "}
        <Link to="/contact" className={styles.contactLink}>
          Contact us
        </Link>
      </p>
    </div>
  );
};

ResetYourEmail.propTypes = {
  email: PropTypes.string,
};

export default ForgotPass;
