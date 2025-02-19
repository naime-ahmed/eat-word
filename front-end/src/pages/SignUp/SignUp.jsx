import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setUserNewErrors,
  updateNewUser,
} from "../../features/userSignUpSlice";
import useNotification from "../../hooks/useNotification.js";
import { useScrollRestoration } from "../../hooks/useScrollRestoration.js";
import { useSignUpUserMutation } from "../../services/auth.js";
import style from "./SignUp.module.css";

// Validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAPTCHA_ANSWER = "8";
const ALLOWED_DOMAIN = "gmail.com";
const isGmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === ALLOWED_DOMAIN;
};

const SignUp = () => {
  const { newUser, newUserErrors } = useSelector((state) => state.signUp);
  const { fName, email, password, surePass, captcha, agree } = newUser;
  const {
    fName: fNameError,
    email: emailError,
    password: passwordError,
    surePass: surePassError,
    captcha: captchaError,
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
    if (captcha !== CAPTCHA_ANSWER) errors.captcha = "Captcha failed!";
    if (!agree) errors.agree = "You must agree to continue";

    dispatch(setUserNewErrors(errors));
    return Object.keys(errors).length === 0;
  }, [fName, email, password, surePass, captcha, agree, dispatch]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

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
          }).unwrap();

          showNotification({
            title: result.msg,
            iconType: "success",
            duration: 4000,
          });
        } catch (error) {
          showNotification({
            title: "Account creation failed",
            message: error.data?.message || "Please check your details",
            iconType: "error",
            duration: 6000,
          });
        }
      }
    },
    [validateForm, signUpUser, fName, email, password, showNotification]
  );

  return (
    <div className={style.signUpContainer}>
      <div className={style.formContainer}>
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
              className={style.inputField}
              placeholder="Enter Full Name"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={!!fNameError}
              aria-describedby={fNameError ? "name-error" : undefined}
            />
            <label htmlFor="fName" className={style.formLabel}>
              Your full name
            </label>
            {fNameError && (
              <p id="name-error" role="alert" className={style.errorMessage}>
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
              className={style.inputField}
              placeholder="Enter email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            <label htmlFor="email" className={style.formLabel}>
              Your email
            </label>
            {emailError && (
              <p id="email-error" role="alert" className={style.errorMessage}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={style.inputField}
              placeholder="Enter password"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            <label htmlFor="password" className={style.formLabel}>
              Your password
            </label>
            {passwordError && (
              <p
                id="password-error"
                role="alert"
                className={style.errorMessage}
              >
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              id="surePass"
              name="surePass"
              value={surePass}
              onChange={handleChange}
              className={style.inputField}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={!!surePassError}
              aria-describedby={
                surePassError ? "confirm-password-error" : undefined
              }
            />
            <label htmlFor="surePass" className={style.formLabel}>
              Confirm Password
            </label>
            {surePassError && (
              <p
                id="confirm-password-error"
                role="alert"
                className={style.errorMessage}
              >
                {surePassError}
              </p>
            )}
          </div>

          {/* Captcha Field */}
          <div>
            <input
              type="number"
              id="captcha"
              name="captcha"
              value={captcha}
              onChange={handleChange}
              className={style.inputField}
              placeholder="Answer"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={!!captchaError}
              aria-describedby={captchaError ? "captcha-error" : undefined}
            />
            <label htmlFor="captcha" className={style.formLabel}>
              What is 3 + 5?
            </label>
            {captchaError && (
              <p id="captcha-error" role="alert" className={style.errorMessage}>
                {captchaError}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className={style.termsBox}>
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
              <p id="terms-error" role="alert" className={style.errorMessage}>
                {agreeError}
              </p>
            )}
          </div>

          {/* Submit Section */}
          <div className={style.submitBtn}>
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
              <Link to="/sign-in" className={style.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
