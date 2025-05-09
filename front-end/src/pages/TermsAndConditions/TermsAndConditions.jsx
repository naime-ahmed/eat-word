import { Link } from "react-router-dom";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import styles from "./TermsAndConditions.module.css";

const TermsAndConditions = () => {
  // manage the scroll position
  useScrollRestoration();

  return (
    <div className={styles.tacContainer}>
      <Header />
      <div className={styles.tacTextContainer}>
        <h1>Terms and Conditions</h1>
        <p>
          Welcome to Eat Word. By accessing or using our service, you agree to
          comply with and be bound by the following terms and conditions.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By signing up for, accessing, or using our application, you agree to
          these Terms and Conditions. If you do not agree, you may not use the
          service.
        </p>

        <h2>2. User Responsibilities</h2>
        <p>
          When using the Eat Word platform, users are responsible for
          maintaining the confidentiality of their account credentials and for
          all activities that occur under their account.
        </p>

        <h2>3. Usage of Services</h2>
        <p>
          Our platform is provided primarily for personal use, to help
          individuals improve their vocabulary skills. Any misuse, including
          sharing inappropriate content or using the service for commercial gain
          without permission, is prohibited.
        </p>

        <h2>4. Privacy and Data Collection</h2>
        <p>
          Eat Word values your privacy. By using our service, you agree to our{" "}
          <Link to="/privacyPolicy">Privacy Policy</Link>, which outlines how we
          collect, store, and use your personal information.
        </p>

        <h2>5. AI Integration</h2>
        <p>
          Our platform uses AI to help users automatically fill in word
          definitions, synonyms, and examples. While we strive for accuracy, we
          do not guarantee that all suggestions provided by the AI will be
          error-free. The user is responsible for verifying the accuracy of the
          information.
        </p>

        <h2>6. Changes to the Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue the service at
          any time without notice. We are not liable for any damages resulting
          from these changes.
        </p>

        <h2>7. Termination</h2>
        <p>
          Eat Word may terminate or suspend your account if you breach these
          terms. Upon termination, your right to access the service will cease
          immediately.
        </p>

        <h2>8. Intellectual Property</h2>
        <p>
          All content provided within Eat Word, including text, design, logos,
          and software, is the property of Eat Word and its affiliates. You may
          not copy, distribute, or create derivative works without our
          permission.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Eat Word will not be liable for any indirect, incidental, or
          consequential damages resulting from the use or inability to use the
          service.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms and Conditions at any time.
          Continued use of the service after such changes will constitute
          acceptance of the new terms.
        </p>

        <p>
          If you have any questions about these Terms and Conditions, please
          contact us at <Link to="/contact">Contact Us</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
