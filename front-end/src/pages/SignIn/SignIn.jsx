import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  resetForm,
  setUserErrors,
  updateUser,
} from "../../features/userSignIn/userSignInSlice";
import style from "./SignIn.module.css";

const SignIn = () => {
  const { user, userErrors } = useSelector((state) => state.signIn);
  const dispatch = useDispatch();

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;
    dispatch(updateUser({ name, value }));
  }

  function validateFrom() {
    let errors = {};
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Valid email is required";
    }
    if (!user.password) {
      errors.password = "password required";
    }
    if (!user.captcha || user.captcha !== "8") {
      errors.captcha = "Captcha failed!";
    }

    dispatch(setUserErrors(errors));
    return Object.keys(errors).length === 0;
  }

  function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      console.log(user);
      // Reset the form to default values
      dispatch(resetForm());
    }
  }
  return (
    <div className={style.signUpContainer}>
      <div className={style.backToHomeButton}>
        <Link to="/">
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Back Home
        </Link>
      </div>
      <div className={style.formContainer}>
        <h2>Welcome Back</h2>
        <form onSubmit={handelSubmit}>
          <div>
            <label htmlFor="email">Your email</label>
            <span>&#8727;</span>
            <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
              value={user.email}
              required
            />
            {userErrors.email && (
              <p style={{ color: "#821131" }}>{userErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">your password</label>
            <span>&#8727;</span>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              onChange={handleChange}
              value={user.password}
              required
            />
            {userErrors.password && (
              <p style={{ color: "#821131" }}>{userErrors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="captcha">What is 3 + 5?</label>
            <span>&#8727;</span>
            <br />
            <input
              type="number"
              name="captcha"
              id="captcha"
              placeholder="Answer"
              onChange={handleChange}
              value={user.captcha}
              required
            />
            {userErrors.captcha && (
              <p style={{ color: "#821131" }}>{userErrors.captcha}</p>
            )}
          </div>
          <div className={style.submitBtn}>
            <button type="submit">Submit</button>
            <br />
            <p>
              New here? <Link to="/signUp">Create account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
