import { Suspense, lazy, useCallback } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import Skeleton from "../../components/ui/loader/Skeleton/Skeleton.jsx";
import { setUser } from "../../features/authSlice.js";
import {
  resetForm,
  setUserErrors,
  updateUser,
} from "../../features/userSignInSlice";
import useNotification from "../../hooks/useNotification.js";
import { useSignInUserMutation } from "../../services/auth.js";
import { parseJwt } from "../../utils/parseJWT.js";
import style from "./SignIn.module.css";

const GoogleSignIn = lazy(() =>
  import("../../components/OAuth/Google/GoogleSignIn")
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const { user, userErrors } = useSelector((state) => state.signIn);
  const { email, password } = user;
  const { email: emailError, password: passwordError } = userErrors;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNotification = useNotification();

  const [signInUser, { isLoading }] = useSignInUserMutation();

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

      if (validateForm()) {
        try {
          const result = await signInUser({ email, password }).unwrap();
          dispatch(resetForm());

          localStorage.setItem("access-token", result.accessToken);
          dispatch(setUser(parseJwt(result.accessToken)));

          showNotification({
            title: result?.message,
            iconType: "success",
            duration: 4000,
          });

          navigate("/my-space");
        } catch (error) {
          showNotification({
            title: "Unable to sign in",
            message: error.data?.message || "Please check your credentials",
            iconType: "error",
            duration: 4000,
          });
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
    ]
  );

  return (
    <div className={style.signInContainer}>
      <nav className={style.backToHomeButton}>
        <PrimaryBtn handleClick={() => navigate("/")}>
          <IoArrowBack aria-hidden="true" />
          <span>Back Home</span>
        </PrimaryBtn>
      </nav>

      <main className={style.formContainer}>
        <h2 aria-live="polite">Sign In</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={style.inputField}
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              placeholder="Enter email"
            />
            <label htmlFor="email" className={style.formLabel}>
              Your email
            </label>
            {emailError && (
              <p id="email-error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className={style.passwordSection}>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={style.inputField}
              autoComplete="current-password"
              required
              aria-required="true"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              placeholder="Enter password"
            />
            <label htmlFor="password" className={style.formLabel}>
              Your password
            </label>
            {passwordError && (
              <p id="password-error" role="alert">
                {passwordError}
              </p>
            )}
            <Link to="/forgot-password" className={style.forgotPass}>
              Forgot Password?
            </Link>
          </div>

          <div className={style.submitBtn}>
            <button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Signing in..." : "Submit"}
            </button>

            <p className={style.separator} aria-hidden="true">
              or
            </p>

            <Suspense fallback={<Skeleton width={280} height={42} />}>
              <div className={style.googleLogin}>
                <GoogleSignIn />
              </div>
            </Suspense>

            <p>
              New here?{" "}
              <Link to="/sign-up" className={style.signUpLink}>
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
