import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GoogleSignIn from "../../components/OAuth/Google/GoogleSignIn";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { setUser } from "../../features/authSlice.js";
import {
  resetForm,
  setUserErrors,
  updateUser,
} from "../../features/userSignInSlice";
import { useSignInUserMutation } from "../../services/auth.js";
import { parseJwt } from "../../utils/parseJWT.js";
import style from "./SignIn.module.css";

const SignIn = () => {
  const { user, userErrors } = useSelector((state) => state.signIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // use the sing-in mutation
  const [signInUser, { isLoading }] = useSignInUserMutation();

  // handle the form field change
  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;
    dispatch(updateUser({ name, value }));
  }

  // validate the provided data
  function validateFrom() {
    let errors = {};
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Valid email is required";
    }
    if (!user.password) {
      errors.password = "password required";
    }
    if (user.password && user.password.length < 6) {
      errors.password = "incorrect password";
    }

    dispatch(setUserErrors(errors));
    return Object.keys(errors).length === 0;
  }

  // request server to sign-in user
  async function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      try {
        const formData = {
          email: user.email,
          password: user.password,
        };

        const result = await signInUser(formData).unwrap();
        // Reset the form to default values
        dispatch(resetForm());

        // save access token into local-storage
        localStorage.setItem("access-token", result.accessToken);

        // inform the user
        Swal.fire({
          title: result.message,
          icon: "success",
          confirmButtonText: "Got it",
        });
        dispatch(setUser(parseJwt(result.accessToken)));
        navigate("/my-space");
      } catch (error) {
        console.error("sing-in failed", error);
        // show the error to user
        Swal.fire({
          title: "Unable to sign in",
          text: error.data?.message || "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "ok",
        });
      }
    }
  }
  return (
    <div className={style.signInContainer}>
      <div className={style.backToHomeButton}>
        <PrimaryBtn>
          <Link to="/">
            <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Back
            Home
          </Link>
        </PrimaryBtn>
      </div>
      <div className={style.formContainer}>
        <h2>Sign In</h2>
        <form onSubmit={handelSubmit}>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
              value={user.email}
              className={style.inputField}
              autoComplete="on"
              required
            />
            <label htmlFor="email" className={style.formLabel}>
              Your email
            </label>
            {userErrors.email && <p>{userErrors.email}</p>}
          </div>

          <div className={style.passwordSection}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              onChange={handleChange}
              value={user.password}
              className={style.inputField}
              autoComplete="on"
              required
            />
            <label htmlFor="password" className={style.formLabel}>
              your password
            </label>
            {userErrors.password && <p>{userErrors.password}</p>}
            <Link to="/forgot-password" className={style.forgotPass}>
              Forgot Password?
            </Link>
          </div>
          <div className={style.submitBtn}>
            <button type="submit" disabled={isLoading}>
              {" "}
              {isLoading ? "submitting..." : "Submit"}
            </button>
            <p className={style.separator}>or</p>
            <div className={style.googleLogin}>
              <GoogleSignIn />
            </div>
            <p>
              New here? <Link to="/sign-up">Create account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
