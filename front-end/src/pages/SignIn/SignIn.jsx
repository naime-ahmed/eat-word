import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "../../assets/logoIcon.webp";
import TurnstileWidget from "../../components/TurnstileWidget.jsx";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn.jsx";
import Skeleton from "../../components/ui/loader/Skeleton/Skeleton.jsx";
import { setUser } from "../../features/authSlice.js";
import {
  resetForm,
  setUserErrors,
  updateUser,
} from "../../features/userSignInSlice";
import useNotification from "../../hooks/useNotification.js";
import { useScrollRestoration } from "../../hooks/useScrollRestoration.js";
import { useSignInUserMutation } from "../../services/auth.js";
import { parseJwt } from "../../utils/parseJWT.js";
import styles from "./SignIn.module.css";

const GoogleSignIn = lazy(() =>
  import("../../components/OAuth/Google/GoogleSignIn")
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const captchaWidgetRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, userErrors } = useSelector((state) => state.signIn);
  const { email, password } = user;
  const { email: emailError, password: passwordError } = userErrors;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNotification = useNotification();

  const [signInUser, { isLoading }] = useSignInUserMutation();

  // manage the scroll position
  useScrollRestoration();

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      dispatch(updateUser({ name, value }));
    },
    [dispatch]
  );

  const validateForm = useCallback(() => {
    let errors = {};

    if (!EMAIL_REGEX.test(email)) {
      errors.email = "Valid email is required";
    }
    if (!password) {
      errors.password = "Password required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    dispatch(setUserErrors(errors));
    return Object.keys(errors).length === 0;
  }, [email, password, dispatch]);

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
        try {
          const result = await signInUser({
            email,
            password,
            turnstileToken: captchaToken,
          }).unwrap();
          dispatch(resetForm());

          localStorage.setItem("access-token", result.accessToken);
          dispatch(setUser(parseJwt(result.accessToken)));

          showNotification({
            title: result?.message,
            iconType: "success",
            duration: 4000,
          });

          // store user sign in event
          localStorage.setItem("hasACC", true);

          navigate("/my-space");
        } catch (error) {
          showNotification({
            title: "Unable to sign in",
            message:
              error?.message ||
              error?.data?.message ||
              "Please check your credentials",
            iconType: "error",
            duration: 4000,
          });
        } finally {
          // Reset captcha
          captchaWidgetRef.current?.reset();
          setCaptchaToken("");
        }
      }
    },
    [
      email,
      password,
      validateForm,
      signInUser,
      dispatch,
      showNotification,
      navigate,
      captchaToken,
    ]
  );

  return (
    <div className={styles.signInContainer}>
      <main className={styles.formContainer}>
        <div className={styles.loginHeader}>
          <img src={logoIcon} alt="brand icon" />
          <h2 aria-live="polite">Welcome Back</h2>
          <small>Please enter your details to sign in</small>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={styles.inputField}
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              placeholder="Enter email"
            />
            <label htmlFor="email" className={styles.formLabel}>
              Your email
            </label>
            {emailError && (
              <p id="email-error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className={styles.passwordSection}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={styles.inputField}
              autoComplete="current-password"
              required
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              placeholder="Enter password"
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
              <p id="password-error" role="alert">
                {passwordError}
              </p>
            )}
            <Link to="/forgot-password" className={styles.forgotPass}>
              Forgot Password?
            </Link>
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

          <div className={styles.submitBtn}>
            <PrimaryBtn
              btnType="submit"
              disabled={isLoading}
              colorOne="#1A73E8"
              colorTwo="#1A73E8"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              <span>Submit</span>
            </PrimaryBtn>

            <p className={styles.separator} aria-hidden="true">
              or
            </p>

            <Suspense fallback={<Skeleton width={280} height={42} />}>
              <div className={styles.googleLogin}>
                <GoogleSignIn />
              </div>
            </Suspense>

            <p>
              New here?{" "}
              <Link to="/sign-up" className={styles.signUpLink}>
                Create account
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
