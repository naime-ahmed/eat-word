import { useState } from "react";
import { Link } from "react-router-dom";
import style from "./SignUp.module.css";

const SignUp = () => {
  const [newUser, setNewUser] = useState({
    fName: "",
    email: "",
    password: "",
    surePass: "",
    captcha: "",
    agree: false,
  });

  const [newUserErrors, setNewUserError] = useState({});

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }

    setNewUser({ ...newUser, [name]: value });
  }

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

    setNewUserError(errors);
    return Object.keys(errors).length === 0;
  }

  function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      console.log(newUser);
      // Reset the form to default values
      setNewUser({
        fName: "",
        email: "",
        password: "",
        surePass: "",
        captcha: "",
        agree: false,
      });
    }
  }
  return (
    <div className={style.signUpContainer}>
      <div className={style.formContainer}>
        <h2>Create Your Account</h2>
        <form onSubmit={handelSubmit}>
          <div>
            <label htmlFor="fName">Your full name </label>
            <span>&#8727;</span>
            <br />
            <input
              type="text"
              name="fName"
              id="fName"
              placeholder="Enter Full Name"
              onChange={handleChange}
              value={newUser.fName}
              required
            />
            {newUserErrors.fName && <p>{newUserErrors.fName}</p>}
          </div>
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
              value={newUser.email}
              required
            />
            {newUserErrors.email && (
              <p style={{ color: "#821131" }}>{newUserErrors.email}</p>
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
              value={newUser.password}
              required
            />
            {newUserErrors.password && (
              <p style={{ color: "#821131" }}>{newUserErrors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="surePass">Confirm Password</label>
            <span>&#8727;</span>
            <br />
            <input
              type="password"
              name="surePass"
              id="surePass"
              placeholder="confirm password"
              onChange={handleChange}
              value={newUser.surePass}
              required
            />
            {newUserErrors.surePass && (
              <p style={{ color: "#821131" }}>{newUserErrors.surePass}</p>
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
              value={newUser.captcha}
              required
            />
            {newUserErrors.captcha && (
              <p style={{ color: "#821131" }}>{newUserErrors.captcha}</p>
            )}
          </div>
          <div className={style.termsBox}>
            <input
              type="checkbox"
              name="agree"
              id="terms"
              checked={newUser.agree}
              onChange={handleChange}
            />
            <label htmlFor="terms">I agree to the terms and conditions.</label>{" "}
            <span>&#8727;</span>
            {newUserErrors.agree && (
              <p style={{ color: "#821131" }}>{newUserErrors.agree}</p>
            )}
          </div>
          <div className={style.submitBtn}>
            <button type="submit">Submit</button>
            <br />
            <p>
              Have an account? <Link to="/signIn">long in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
