import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TurnstileWidget from "../../components/TurnstileWidget";
import {
  setUserNewErrors,
  updateNewUser,
} from "../../features/userSignUpSlice";
import useNotification from "../../hooks/useNotification.js";
import { useScrollRestoration } from "../../hooks/useScrollRestoration.js";
import { useSignUpUserMutation } from "../../services/auth.js";
import styles from "./SignUp.module.css";

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_DOMAIN = "gmail.com";
const isGmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === ALLOWED_DOMAIN;
};

const SignUp = () => {
  const captchaWidgetRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [hasEmailSent, setHasEmailSent] = useState(false);
  const { newUser, newUserErrors } = useSelector((state) => state.signUp);
  const { fName, email, password, surePass, agree } = newUser;
  const {
    fName: fNameError,
    email: emailError,
    password: passwordError,
    surePass: surePassError,
    agree: agreeError,
  } = newUserErrors;

  const dispatch = useDispatch();
  const showNotification = useNotification();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();

  // manage the scroll position
  useScrollRestoration();

  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;
      dispatch(
        updateNewUser({
          name,
          value: type === "checkbox" ? checked : value,
        })
      );
    },
    [dispatch]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!fName.trim()) errors.fName = "Full name is required";
    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      errors.email = "Valid email required";
    } else if (!isGmail(email)) {
      errors.email = "Only Gmail accounts allowed";
    }

    if (password.length < 6) errors.password = "Password must be 6+ characters";
    if (password !== surePass) errors.surePass = "Passwords don't match";

    if (!agree) errors.agree = "You must agree to continue";

    dispatch(setUserNewErrors(errors));
    return Object.keys(errors).length === 0;
  }, [fName, email, password, surePass, agree, dispatch]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!captchaToken) {
        showNotification({
          title: "CAPTCHA Required",
          message: "Please complete the CAPTCHA verification",
          iconType: "error",
          duration: 4000,
        });
        return;
      }

      if (validateForm()) {
        // Additional Gmail check for valid formatted emails
        if (!isGmail(email)) {
          showNotification({
            title: "Email Restriction",
            message: "We currently only accept Gmail accounts for registration",
            iconType: "error",
            duration: 6000,
          });
          return;
        }

        try {
          const result = await signUpUser({
            name: fName,
            email,
            password,
            turnstileToken: captchaToken,
          }).unwrap();
          showNotification({
            title: result.msg,
            iconType: "success",
            duration: 4000,
          });
          setHasEmailSent(true);
        } catch (error) {
          showNotification({
            title: "Account creation failed",
            message: error?.message || "Please check your details",
            iconType: "error",
            duration: 6000,
          });
          setHasEmailSent(false);
        }
      }
    },
    [
      captchaToken,
      validateForm,
      signUpUser,
      fName,
      email,
      password,
      showNotification,
    ]
  );

  return (
    <div className={styles.signUpContainer}>
      {hasEmailSent ? (
        <VerifyYourEmail email={newUser?.email} />
      ) : (
        <div className={styles.formContainer}>
          <h2 aria-live="polite">Create Your Account</h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div>
              <input
                type="text"
                id="fName"
                name="fName"
                value={fName}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter Full Name"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={!!fNameError}
                aria-describedby={fNameError ? "name-error" : undefined}
              />
              <label htmlFor="fName" className={styles.formLabel}>
                Your full name
              </label>
              {fNameError && (
                <p id="name-error" role="alert" className={styles.errorMessage}>
                  {fNameError}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              <label htmlFor="email" className={styles.formLabel}>
                Your email
              </label>
              {emailError && (
                <p
                  id="email-error"
                  role="alert"
                  className={styles.errorMessage}
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Enter password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              <label htmlFor="password" className={styles.formLabel}>
                Your password
              </label>

              {/* Password toggle icon */}
              <span
                className={styles.passEyeIcon}
                style={{ bottom: passwordError ? "26px" : undefined }}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <FaEyeSlash className={styles.eyeIcon} />
                ) : (
                  <FaEye className={styles.eyeIcon} />
                )}
              </span>

              {passwordError && (
                <p
                  id="password-error"
                  role="alert"
                  className={styles.errorMessage}
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="surePass"
                name="surePass"
                value={surePass}
                onChange={handleChange}
                className={styles.inputField}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-invalid={!!surePassError}
                aria-describedby={
                  surePassError ? "confirm-password-error" : undefined
                }
              />
              <label htmlFor="surePass" className={styles.formLabel}>
                Confirm Password
              </label>

              <span
                className={styles.passEyeIcon}
                style={{ bottom: surePassError ? "26px" : undefined }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                tabIndex={0}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className={styles.eyeIcon} />
                ) : (
                  <FaEye className={styles.eyeIcon} />
                )}
              </span>

              {surePassError && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className={styles.errorMessage}
                >
                  {surePassError}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className={styles.termsBox}>
              <input
                type="checkbox"
                id="terms"
                name="agree"
                checked={agree}
                onChange={handleChange}
                aria-invalid={!!agreeError}
                aria-describedby={agreeError ? "terms-error" : undefined}
              />
              <label htmlFor="terms">
                I agree to the <Link to="/tac">terms and conditions</Link>.
              </label>
              {agreeError && (
                <p
                  id="terms-error"
                  role="alert"
                  className={styles.errorMessage}
                >
                  {agreeError}
                </p>
              )}
            </div>

            {/* Turnstile Widget */}
            <TurnstileWidget
              ref={captchaWidgetRef}
              onVerify={setCaptchaToken}
              onError={(error) => {
                showNotification({
                  title: "CAPTCHA Error",
                  message:
                    error?.message ||
                    "CAPTCHA verification failed. Please try again.",
                  iconType: "error",
                  duration: 4000,
                });
                setCaptchaToken("");
                captchaWidgetRef.current?.reset();
              }}
              onExpire={() => {
                showNotification({
                  title: "CAPTCHA Expired",
                  message:
                    "The CAPTCHA challenge has expired. Please verify again.",
                  iconType: "warning",
                  duration: 4000,
                });
                setCaptchaToken("");
                captchaWidgetRef.current?.reset();
              }}
              options={{
                theme: "dark",
                action: "signin",
              }}
            />

            {/* Submit Section */}
            <div className={styles.submitBtn}>
              <button
                type="submit"
                disabled={isLoading}
                aria-disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating account..." : "Submit"}
              </button>

              <p>
                Have an account?{" "}
                <Link to="/sign-in" className={styles.signInLink}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const VerifyYourEmail = ({ email }) => {
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
    <div className={styles.verifyEmailSection}>
      <div className={styles.verifyEmailIcons}>
        <FaEnvelopeCircleCheck />
      </div>
      <h2>Please verify your email</h2>
      <p>
        You&#39;re almost there! We sent an email to{" "}
        {email ? (
          <a
            href={getEmailProviderLink(email)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verifyEmailHighlight}
          >
            {email}
          </a>
        ) : (
          <span className={styles.verifyEmailHighlight}>
            your provided email
          </span>
        )}
      </p>

      <p>
        Just click on the link in that email to complete sign up. If you
        don&#39;t see it, you may need to{" "}
        {email ? (
          <a
            href={getEmailProviderLink(email)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verifyEmailHighlight}
          >
            check your spam
          </a>
        ) : (
          <span className={styles.verifyEmailHighlight}>check your spam</span>
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

VerifyYourEmail.propTypes = {
  email: PropTypes.string,
};

export default SignUp;
