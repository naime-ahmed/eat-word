import { useState } from "react";
import { Link } from "react-router-dom";
import style from "./SignIn.module.css";

const SignUp = () => {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    captcha: "",
  });

  const [newUserErrors, setNewUserError] = useState({});

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;
    setNewUser({ ...newUser, [name]: value });
  }

  function validateFrom() {
    let errors = {};
    if (!newUser.email || !/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "Valid email is required";
    }
    if (!newUser.password) {
      errors.password = "password required";
    }
    if (!newUser.captcha || newUser.captcha !== "8") {
      errors.captcha = "Captcha failed!";
    }

    setNewUserError(errors);
    return Object.keys(errors).length === 0;
  }

  function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      console.log(newUser);
      // Reset the form to default values
      setNewUser({
        email: "",
        password: "",
        captcha: "",
      });
    }
  }
  return (
    <div className={style.signUpContainer}>
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

export default SignUp;
