// Testimonials.jsx
import { useEffect, useState } from "react";
import Marquee from "../../../../components/Marquee/Marquee";
import Testimonial from "../../../../components/Testimonial/Testimonial";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/testimonial`)
      .then((response) => response.json())
      .then((data) => {
        setTestimonials(data?.testimonials);
      })
      .catch((error) => {
        console.log("Error fetching testimonials", error);
      });
  }, []);

  console.log(testimonials);
  const firstRow = testimonials?.slice(0, testimonials.length / 2);
  const secondRow = testimonials?.slice(testimonials.length / 2);

  return (
    <div className={styles.container}>
      <div className={styles.gradientLine}></div>
      <div className={styles.gradientBackground}></div>
      <div className={styles.testimonialHead}>
        <h1>Words of Praise</h1>
        <p>
          See how &#34;Your Word&#34; is transforming vocabulary mastery for
          learner
        </p>
      </div>

      <Marquee pauseOnHover>
        {firstRow.map((review) => (
          <Testimonial key={review?._id} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover>
        {secondRow.map((review) => (
          <Testimonial key={review?._id} {...review} />
        ))}
      </Marquee>
      <div className={styles.gradientLeft} />
      <div className={styles.gradientRight} />
    </div>
  );
};

export default Testimonials;
