import { Link } from "react-router-dom";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.PPContainer}>
      <Header />
      <div className={styles.PPTextContainer}>
        <h1>Privacy Policy</h1>
        <p>
          At Your Words, we are committed to protecting your privacy. This
          Privacy Policy outlines how we collect, use, and safeguard your
          personal information when you use our platform.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          When you sign up for Your Words, we collect personal information such
          as your name, email address, and other details necessary for creating
          and maintaining your account.
        </p>

        <h2>2. Use of Collected Information</h2>
        <p>
          We use the information collected to provide, maintain, and improve our
          services. This includes personalizing your experience, sending
          updates, and enhancing the functionality of the app.
        </p>

        <h2>3. AI-Driven Data Processing</h2>
        <p>
          Your Words uses AI tools to help users automatically generate word
          meanings, synonyms, and example sentences. The data processed by the
          AI is not shared with third parties unless otherwise stated.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties without your consent, except when required by law
          or to protect the rights of our platform.
        </p>

        <h2>5. Security Measures</h2>
        <p>
          We take your privacy seriously and implement industry-standard
          security measures to protect your personal information from
          unauthorized access, misuse, or disclosure.
        </p>

        <h2>6. Cookies and Tracking</h2>
        <p>
          Your Words may use cookies to improve your experience on our platform.
          Cookies help us remember your preferences and understand how you use
          our service. You can control cookies through your browser settings.
        </p>

        <h2>7. Third-Party Services</h2>
        <p>
          We may use third-party services, such as analytics providers, to
          enhance our platform. These services may collect non-personally
          identifiable information to analyze how our app is used.
        </p>

        <h2>8. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to
          provide our services and comply with legal obligations. You can
          request deletion of your account and data at any time by contacting
          us.
        </p>

        <h2>9. User Rights</h2>
        <p>
          As a user, you have the right to access, correct, or delete your
          personal information at any time. You can manage your account settings
          or reach out to us at <Link to="/contactUs">Contact</Link> for
          assistance.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to our practices.
          Any updates will be posted on this page, and continued use of the
          service after such changes will indicate acceptance of the revised
          policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at <Link to="/contactUs">Contact</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
