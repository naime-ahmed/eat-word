import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  resetNewUserForm,
  setUserNewErrors,
  updateNewUser,
} from "../../features/userSignUp/userSignUpSlice";
import { useSignUpUserMutation } from "../../services/auth.js";

import { setUser } from "../../features/auth/authSlice.js";
import { parseJwt } from "../../utils/parseJWT.js";
import style from "./SignUp.module.css";

const SignUp = () => {
  // state of new user
  const { newUser, newUserErrors } = useSelector((state) => state.signUp);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // use the singUp mutation
  const [singUpUser, { isLoading, isError, error }] = useSignUpUserMutation();

  // handle the form field change
  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }

    dispatch(updateNewUser({ name, value }));
  }

  // validate the provided data
  function validateFrom() {
    let errors = {};
    if (!newUser.fName) errors.fName = "Full name is required";
    if (!newUser.email || !/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "Valid email is required";
    }

    if (!newUser.password || newUser.password.length < 6) {
      errors.password = "Too weak password";
    }
    if (!newUser.surePass || newUser.password != newUser.surePass) {
      errors.surePass = "Password dose not match";
    }
    if (!newUser.captcha || newUser.captcha !== "8") {
      errors.captcha = "Captcha failed!";
    }
    if (!newUser.agree) errors.agree = "You must agree to continue";

    dispatch(setUserNewErrors(errors));
    return Object.keys(errors).length === 0;
  }

  // request sever to create user
  async function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      try {
        const formData = {
          name: newUser.fName,
          email: newUser.email,
          password: newUser.password,
        };

        const result = await singUpUser(formData).unwrap();

        // Reset the form to default values
        dispatch(resetNewUserForm());
        // save access token into local-storage
        localStorage.setItem("access-token", result.accessToken);

        // update isAuth state
        dispatch(setUser(parseJwt(result.accessToken)));
        navigate("/");

        // inform the user success result
        Swal.fire({
          title: result.message,
          icon: "success",
          confirmButtonText: "got it",
        });
      } catch (error) {
        console.error("sing-up failed", error);
        // show the error to user
        Swal.fire({
          title: "Unable to create account!",
          text: error.data?.message || "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "ok",
        });
      }
    }
  }
  return (
    <div className={style.signUpContainer}>
      <div className={style.formContainer}>
        <h2>Create Your Account</h2>
        <form onSubmit={handelSubmit}>
          <div>
            <input
              type="text"
              name="fName"
              id="fName"
              placeholder="Enter Full Name"
              onChange={handleChange}
              value={newUser.fName}
              className={style.inputField}
              required
            />
            <label htmlFor="fName" className={style.formLabel}>
              Your full name
            </label>
            {newUserErrors.fName && <p>{newUserErrors.fName}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
              value={newUser.email}
              className={style.inputField}
              required
            />
            <label htmlFor="email" className={style.formLabel}>
              Your email
            </label>
            {newUserErrors.email && <p>{newUserErrors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              onChange={handleChange}
              value={newUser.password}
              className={style.inputField}
              required
            />
            <label htmlFor="password" className={style.formLabel}>
              your password
            </label>
            {newUserErrors.password && <p>{newUserErrors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="surePass"
              id="surePass"
              placeholder="confirm password"
              onChange={handleChange}
              value={newUser.surePass}
              className={style.inputField}
              required
            />
            <label htmlFor="surePass" className={style.formLabel}>
              Confirm Password
            </label>
            {newUserErrors.surePass && <p>{newUserErrors.surePass}</p>}
          </div>
          <div>
            <input
              type="number"
              name="captcha"
              id="captcha"
              placeholder="Answer"
              onChange={handleChange}
              value={newUser.captcha}
              className={style.inputField}
              required
            />
            <label htmlFor="captcha" className={style.formLabel}>
              What is 3 + 5?
            </label>
            {newUserErrors.captcha && <p>{newUserErrors.captcha}</p>}
          </div>
          <div className={style.termsBox}>
            <input
              type="checkbox"
              name="agree"
              id="terms"
              checked={newUser.agree}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              I agree to the <Link to="/tac">terms and conditions</Link>.
            </label>
            {newUserErrors.agree && <p>{newUserErrors.agree}</p>}
          </div>
          <div className={style.submitBtn}>
            <button type="submit" disabled={isLoading}>
              {" "}
              {isLoading ? "submitting..." : "Submit"}
            </button>
            {isError && <p style={{ margin: "0 19px" }}>{error.message}</p>}
            <br />
            <p>
              Have an account? <Link to="/signIn">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
