import Testimonial from "../../../../components/Testimonial/Testimonial";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonialHead}>
        <h1>Words of Praise</h1>
        <p>
          See how &#34;Your Word&#34; is transforming vocabulary mastery for
          learner
        </p>
      </div>
      <Testimonial lane="marqueOne" />
      <Testimonial lane="marqueTwo" />
    </div>
  );
};

export default Testimonials;
