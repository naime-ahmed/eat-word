import crown from "../../assets/crown.png";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import FancyBtn from "../../components/ui/button/FancyBtn/FancyBtn";

import styles from "./Pricing.module.css";

const Pricing = () => {
  return (
    <div className={styles.pricingPage}>
      <Header />
      <div className={styles.pricingSection}>
        <div className={styles.free}>
          <div className={styles.freePriceCardTitle}>
            <h3>Free</h3>
            <p>For Plebs</p>
          </div>
          <div className={styles.freePriceCardAmount}>
            <span>$0</span> <small>/month</small>
          </div>
          <div className={styles.freePriceCardFeatures}>
            <ul>
              <li>
                <i className="fa-solid fa-check"></i>Unlimited words
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Chrome Extension Access
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Email support
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>AI assistance
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>Story with your words
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>Early access at everything
              </li>
              <li>
                <i className="fa-solid fa-xmark"></i>One to One support
              </li>
            </ul>
          </div>
          <div>
            <FancyBtn btnWidth="255px" btnHeight="38px">
              Stay Pleb
            </FancyBtn>
          </div>
          <div className={styles.radialGradFree}></div>
        </div>
        <div className={styles.premium}>
          <div className={styles.PaidPriceCardTitle}>
            <h3>Premium</h3>
            <p>For Elites</p>
          </div>
          <div className={styles.paidPriceCardAmount}>
            <span>$4.99</span>
            <small>/month</small>
          </div>
          <div className={styles.paidPriceCardFeatures}>
            <ul>
              <li>
                <i className="fa-solid fa-check"></i>Unlimited words
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Chrome Extension Access
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Email support
              </li>
              <li>
                <i className="fa-solid fa-check"></i>AI assistance
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Story with your words
              </li>
              <li>
                <i className="fa-solid fa-check"></i>Early access at everything
              </li>
              <li>
                <i className="fa-solid fa-check"></i>One to One support
              </li>
            </ul>
          </div>
          <div>
            <FancyBtn btnWidth="255px" btnHeight="38px">
              Become Elite
            </FancyBtn>
          </div>
          <div className={styles.crownImg}>
            <img src={crown} alt="crown image" />
          </div>
          <div className={styles.radialGradPaid}></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
