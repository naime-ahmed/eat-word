import { useEffect, useRef, useState } from "react";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiTelegramLogoFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import TurnstileWidget from "../../components/TurnstileWidget";
import useNotification from "../../hooks/useNotification";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import styles from "./Contact.module.css";

const Contact = () => {
  const captchaWidgetRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const { user } = useSelector((state) => state.user);
  const showNotification = useNotification();

  const [userMessage, setUserMessage] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setUserMessage((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
    }));
  }, [user]);

  const [userMessageError, setUserMessageError] = useState({});

  // manage the scroll position
  useScrollRestoration();

  function handleChange(event) {
    const { name, value } = event.target;
    setUserMessage({ ...userMessage, [name]: value });
  }

  function validateForm() {
    let errors = {};

    if (!userMessage.name.trim()) {
      errors.name = "Name is required";
    }
    if (!userMessage.email || !/\S+@\S+\.\S+/.test(userMessage.email)) {
      errors.email = "Valid email is required";
    }
    if (!userMessage.message.trim()) {
      errors.message = "Message is required";
    }
    setUserMessageError(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
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
      const { name, email, message } = userMessage;
      try {
        setIsSending(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_EAT_WORD_BACKEND_URL
          }/email/send-contact-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              message,
              turnstileToken: captchaToken,
            }),
          }
        );
        const data = await response.json();

        if (data.success) {
          showNotification({
            title: "We got you!",
            message:
              data?.message || "I got you. I will respond as soon as possible.",
            iconType: "success",
            duration: 4000,
          });
        } else {
          showNotification({
            title: "Error sending message",
            message:
              data?.error || "something went wrong while sending your message",
            iconType: "error",
            duration: 8000,
          });
        }
      } catch (error) {
        showNotification({
          title: "Error sending message",
          message:
            error?.message || "something went wrong while sending your message",
          iconType: "error",
          duration: 4000,
        });
      } finally {
        setUserMessage({
          name: user.name || "",
          email: user.email || "",
          message: "",
        });
        setIsSending(false);
        captchaWidgetRef.current?.reset();
        setCaptchaToken("");
      }
    }
  }

  return (
    <div className={styles.contactPage}>
      <Header />
      <div className={styles.contactContainer}>
        <div className={styles.contactForm}>
          <form onSubmit={handleSubmit}>
            <div>
              <br />
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={userMessage.name}
                required
                placeholder="Your Name"
                className={styles.inputField}
                disabled={user?.name}
              />
              <label htmlFor="name" className={styles.formLabel}>
                Your Name
              </label>
              {userMessageError.name && (
                <p className={styles.errorText}>{userMessageError.name}</p>
              )}
            </div>
            <div>
              <br />
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={userMessage.email}
                required
                placeholder="Your Email"
                className={styles.inputField}
                disabled={user?.email}
              />
              <label htmlFor="email" className={styles.formLabel}>
                Your Email
              </label>
              {userMessageError.email && (
                <p className={styles.errorText}>{userMessageError.email}</p>
              )}
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
              {userMessageError.message && (
                <p className={styles.errorText}>{userMessageError.message}</p>
              )}
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

            <div className={styles.contactBtn}>
              <button type="submit" disabled={isSending}>
                {isSending ? "sending..." : "Send message"}
              </button>
            </div>
          </form>
        </div>
        <div className={styles.contactInfo}>
          <h2>Contact Us</h2>
          <div>
            <div>
              <MdOutlineLocationOn />
            </div>
            <p>Location: 2^#, Orion, Mars</p>
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
