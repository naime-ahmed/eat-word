import { useNavigate } from "react-router-dom";
import crown from "../../assets/crown.png";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import FancyBtn from "../../components/ui/button/FancyBtn/FancyBtn";

import { useState } from "react";
import { useSelector } from "react-redux";
import Popup from "../../components/Popup/Popup";
import GeneralMessage from "../../components/Popup/PopUpContents/GeneralMessage/GeneralMessage";
import styles from "./Pricing.module.css";

const Pricing = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showMessageToPro, setShowMessageToPro] = useState(false);
  const [showMessageToLifeT, setShowMessageToLifeT] = useState(false);

  const navigate = useNavigate();

  const handleFreeClick = () => {
    if (isAuthenticated) {
      navigate("/my-space");
    } else {
      navigate("/sign-in");
    }
  };

  const handleProOpen = () => {
    setShowMessageToPro(true);
  };
  const handleProClose = () => {
    setShowMessageToPro(false);
  };

  const handleLifeTimeOpen = () => {
    setShowMessageToLifeT(true);
  };
  const handleLifeTimeClose = () => {
    setShowMessageToLifeT(false);
  };

  return (
    <div className={styles.pricingPage}>
      <Header />
      <div className={styles.pricingSection}>
        {/* Free Tier - Gateway to Conversion */}
        <div className={styles.free}>
          <div className={styles.freePriceCardTitle}>
            <h3>Starter</h3>
            <p>Begin Your Learning Journey</p>
          </div>
          <div className={styles.freePriceCardAmount}>
            <span>Free</span> <small>forever</small>
          </div>
          <div className={styles.freePriceCardFeatures}>
            <ul>
              <li>
                <i className="fa-solid fa-check"></i>500 words/month
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Basic Definitions
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Community Support
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>AI-Powered Learning Tools
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>Spaced Repetition System
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>Progress Analytics
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>Priority Support
              </li>
            </ul>
          </div>
          <div className={styles.pricingCTA}>
            <FancyBtn
              clickHandler={handleFreeClick}
              btnWidth="255px"
              btnHeight="38px"
            >
              Start Learning Free
            </FancyBtn>
          </div>
          <div className={styles.radialGradFree}></div>
        </div>

        {/* Premium Tier - Recommended Option */}
        <div className={styles.premium}>
          <div className={styles.popularBadge}>Most Popular</div>
          <div className={styles.PaidPriceCardTitle}>
            <h3>Pro Learner</h3>
            <p>Optimal Learning Experience</p>
          </div>
          <div className={styles.paidPriceCardAmount}>
            <span>$4.99</span>
            <small>
              /month{" "}
              <span className={styles.billingNote}>
                ($5.50/month billed annually)
              </span>
            </small>
          </div>
          <div className={styles.paidPriceCardFeatures}>
            <ul>
              <li>
                <i className="fa-solid fa-check"></i>Unlimited Words
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Advanced AI Suggestions
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Smart Spaced Repetition
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Contextual Learning Engine
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Detailed Progress Reports
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Priority Email Support
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Cross-Device Sync
              </li>
            </ul>
          </div>
          <div className={styles.pricingCTA}>
            <FancyBtn
              btnWidth="255px"
              btnHeight="38px"
              accentColor="gold"
              clickHandler={handleProOpen}
            >
              Start 7-Day Free Trial
            </FancyBtn>
          </div>
          <div className={styles.guaranteeNote}>
            30-Day Money Back Guarantee
          </div>
          {showMessageToPro && (
            <Popup isOpen={showMessageToPro} onClose={handleProClose}>
              <GeneralMessage
                title="Coming Soon!"
                message="Thanks for your interest in the Pro Plan! We're excited to let you know that it will be available soon."
                onClose={handleProClose}
                btnText="Got it!"
              />
            </Popup>
          )}
        </div>

        {/* Elite Tier - Premium Offering */}
        <div className={styles.elite}>
          <div className={styles.PaidPriceCardTitle}>
            <h3>Lifetime Master</h3>
            <p>Ultimate Learning Companion</p>
          </div>
          <div className={styles.paidPriceCardAmount}>
            <span>$99.99</span>
            <small>one-time pay</small>
          </div>
          <div className={styles.paidPriceCardFeatures}>
            <ul>
              <li>
                <i className="fa-solid fa-check"></i>All Pro Features
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Lifetime Updates
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Personalized Learning Plan
              </li>
              <li>
                <i className="fa-solid fa-check"></i>VIP Support (24h response)
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Exclusive Content
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Beta Feature Access
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Account Guardianship
              </li>
            </ul>
          </div>
          <div className={styles.pricingCTA}>
            <FancyBtn
              clickHandler={handleLifeTimeOpen}
              btnWidth="255px"
              btnHeight="38px"
            >
              Become Lifetime Member
            </FancyBtn>
          </div>
          <div className={styles.crownImg}>
            <img src={crown} alt="exclusive membership" />
          </div>
          <div className={styles.valueNote}>
            Save $200+ vs 5 years subscription
          </div>
          <div className={styles.radialGradPaid}></div>
          {showMessageToLifeT && (
            <Popup isOpen={showMessageToLifeT} onClose={handleLifeTimeClose}>
              <GeneralMessage
                title="Coming Soon!"
                message="Thanks for your interest in the one-time pay Plan! We're excited to let you know that it will be available soon."
                onClose={handleLifeTimeClose}
                btnText="Got it!"
              />
            </Popup>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
