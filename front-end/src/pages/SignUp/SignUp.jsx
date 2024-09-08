import { Link } from "react-router-dom";
import style from "./SignUp.module.css";

const SignUp = () => {
  return (
    <div className={style.signUpContainer}>
      <div className={style.formContainer}>
        <h2>Create Your Account</h2>
        <form action="">
          <div>
            <label htmlFor="fName">Your full name </label>
            <span>&#8727;</span>
            <br />
            <input
              type="text"
              name="fName"
              id="fName"
              placeholder="Enter Full Name"
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
          </div>
          <div className={style.termsBox}>
            <input type="checkbox" name="terms" id="terms" />
            <label htmlFor="terms">
              I agree to the terms and conditions.
            </label>{" "}
            <span>&#8727;</span>
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
