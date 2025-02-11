import { useNavigate } from "react-router-dom";
import crown from "../../assets/crown.png";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import FancyBtn from "../../components/ui/button/FancyBtn/FancyBtn";

import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Popup from "../../components/Popup/Popup";
import GeneralMessage from "../../components/Popup/PopUpContents/GeneralMessage/GeneralMessage";
import styles from "./Pricing.module.css";

const Pricing = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showMessageToPro, setShowMessageToPro] = useState(false);
  const [showMessageToLifeT, setShowMessageToLifeT] = useState(false);

  // Auto-scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <FaCheck className={styles.iconCheck} /> 500 words/month
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Basic Definitions
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Community Support
              </li>
              <li>
                <IoCloseOutline className={styles.iconClose} /> AI-Powered
                Learning Tools
              </li>
              <li>
                <IoCloseOutline className={styles.iconClose} /> Spaced
                Repetition System
              </li>
              <li>
                <IoCloseOutline className={styles.iconClose} /> Progress
                Analytics
              </li>
              <li>
                <IoCloseOutline className={styles.iconClose} /> Priority Support
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
                ($3.33/month billed annually)
              </span>
            </small>
          </div>
          <div className={styles.paidPriceCardFeatures}>
            <ul>
              <li>
                <FaCheck className={styles.iconCheck} /> Unlimited Words
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Advanced AI Suggestions
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Smart Spaced Repetition
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Contextual Learning
                Engine
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Detailed Progress
                Reports
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Priority Email Support
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Cross-Device Sync
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
                <FaCheck className={styles.iconCheck} /> All Pro Features
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Lifetime Updates
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Personalized Learning
                Plan
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> VIP Support (24h
                response)
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Exclusive Content
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Beta Feature Access
              </li>
              <li>
                <FaCheck className={styles.iconCheck} /> Account Guardianship
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
