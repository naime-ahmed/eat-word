import { useEffect, useState } from "react";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiTelegramLogoFill } from "react-icons/pi";
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

  // Auto-scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <br />
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={userMessage.email}
                required
                placeholder="email"
                className={styles.inputField}
              />
              <label htmlFor="email" className={styles.formLabel}>
                Your Email
              </label>
              {userMessageError.email && <p>{userMessageError.email}</p>}
            </div>
            <div>
              <br />
              <input
                type="text"
                name="subject"
                id="subject"
                onChange={handleChange}
                value={userMessage.subject}
                placeholder="message about?"
                className={styles.inputField}
              />
              <label htmlFor="subject" className={styles.formLabel}>
                Message about?
              </label>
            </div>
            <div>
              <br />
              <textarea
                name="message"
                id="message"
                onChange={handleChange}
                value={userMessage.message}
                required
                placeholder="Write your message"
                className={`${styles.inputField} ${styles.textAreaField}`}
              />
              <label htmlFor="message" className={styles.formLabel}>
                Write your message
              </label>
            </div>
            <div>
              <br />
              <input
                type="number"
                name="captcha"
                id="captcha"
                onChange={handleChange}
                value={userMessage.captcha}
                required
                placeholder="What is 9+7?"
                className={styles.inputField}
              />
              <label htmlFor="captcha" className={styles.formLabel}>
                What is 9+7?
              </label>
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
              <MdOutlineLocationOn />
            </div>
            <p>Location: 2^#, Orion, Mars </p>
          </div>
          <div>
            <div>
              <LuPhoneCall />
            </div>
            <p>Phone: +8801926527995</p>
          </div>
          <div>
            <div>
              <PiTelegramLogoFill />
            </div>
            <p>Email: support@eatword.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
