import { useState } from "react";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import styles from "./Contact.module.css";

const Contact = () => {
  const [userMessage, setUserMessage] = useState({
    email: "",
    subject: "",
    message: "",
    captcha: "",
  });
  const [userMessageError, setUserMessageError] = useState({});

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    setUserMessage({ ...userMessage, [name]: value });
  }

  function validateFrom() {
    let errors = {};

    if (!userMessage.email || !/\S+@\S+\.\S+/.test(userMessage.email)) {
      errors.email = "Valid email is required";
    }

    if (!userMessage.captcha || userMessage.captcha !== "16") {
      errors.captcha = "Captcha failed!";
    }

    setUserMessageError({ ...errors });
    return Object.keys(errors).length === 0;
  }

  function handelSubmit(event) {
    event.preventDefault();

    if (validateFrom()) {
      console.log(userMessage);
      // Reset the form to default values
      setUserMessage({
        email: "",
        subject: "",
        message: "",
        captcha: "",
      });
    }
  }

  return (
    <div className={styles.contactPage}>
      <Header />
      <div className={styles.contactContainer}>
        <div className={styles.contactForm}>
          <form onSubmit={handelSubmit}>
            <div>
              <label htmlFor="email">
                Your Email <span>&#8727;</span>
              </label>
              <br />
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={userMessage.email}
                required
                placeholder="email"
              />
              {userMessageError.email && <p>{userMessageError.email}</p>}
            </div>
            <div>
              <label htmlFor="subject">Message about?</label>
              <br />
              <input
                type="text"
                name="subject"
                id="subject"
                onChange={handleChange}
                value={userMessage.subject}
                placeholder="message about?"
              />
            </div>
            <div>
              <label htmlFor="message">
                Write your message <span>&#8727;</span>
              </label>
              <br />
              <textarea
                name="message"
                id="message"
                onChange={handleChange}
                value={userMessage.message}
                required
                placeholder="write your message here"
              />
            </div>
            <div>
              <label htmlFor="captcha">
                What is 9+7? <span>&#8727;</span>
              </label>
              <br />
              <input
                type="number"
                name="captcha"
                id="captcha"
                onChange={handleChange}
                value={userMessage.captcha}
                required
              />
              {userMessageError.captcha && <p>{userMessageError.captcha}</p>}
            </div>
            <div className={styles.contactBtn}>
              <button type="submit">Send message</button>
            </div>
          </form>
        </div>
        <div className={styles.contactInfo}>
          <h2>Contact Us</h2>
          <div>
            <div>
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <p>Location: 2^#, Orion, Mars </p>
          </div>
          <div>
            <div>
              <i className="fa-solid fa-phone"></i>
            </div>
            <p>Phone: +8801926527995</p>
          </div>
          <div>
            <div>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
            <p>Email: support@eatwords.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
