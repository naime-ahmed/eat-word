// Testimonials.jsx
import { useEffect, useState } from "react";
import Marquee from "../../../../components/Marquee/Marquee";
import Testimonial from "../../../../components/Testimonial/Testimonial";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = () => {
      fetch(`${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/testimonial`)
        .then((response) => response.json())
        .then((data) => {
          const testimonialsData = data?.testimonials || [];
          setTestimonials(testimonialsData);
          sessionStorage.setItem(
            "testimonials",
            JSON.stringify(testimonialsData)
          );
        })
        .catch(console.error);
    };

    try {
      const cached = sessionStorage.getItem("testimonials");
      if (cached) {
        setTestimonials(JSON.parse(cached));
      } else {
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Cache error:", error);
      fetchTestimonials();
    }
  }, []);

  const firstRow = testimonials?.slice(0, testimonials.length / 2);
  const secondRow = testimonials?.slice(testimonials.length / 2);

  return (
    <section className={styles.container}>
      <div className={styles.gradientLine}></div>
      <div className={styles.gradientBackground}></div>
      <div className={styles.testimonialHead}>
        <h1>Words of Praise</h1>
        <p>
          See how &#34;Eat Word&#34; is transforming vocabulary mastery for
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
    </section>
  );
};

export default Testimonials;
