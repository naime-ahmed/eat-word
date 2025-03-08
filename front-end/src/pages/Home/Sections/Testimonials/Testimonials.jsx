import { useEffect, useState } from "react";
import Marquee from "../../../../components/Marquee/Marquee";
import Error from "../../../../components/shared/Error/Error";
import Testimonial from "../../../../components/Testimonial/Testimonial";
import Skeleton from "../../../../components/ui/loader/Skeleton/Skeleton";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Try to load cached testimonials from sessionStorage
        const cached = sessionStorage.getItem("testimonials");
        if (cached) {
          setTestimonials(JSON.parse(cached));
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/review`,
            {
              method: "GET",
              mode: "cors",
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const testimonialsData = data?.testimonials || [];
          setTestimonials(testimonialsData);
          sessionStorage.setItem(
            "testimonials",
            JSON.stringify(testimonialsData)
          );
        }
        setHasError(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Calculate the midpoint safely
  const midPoint = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, midPoint);
  const secondRow = testimonials.slice(midPoint);

  return (
    <section className={styles.container}>
      <div className={styles.gradientLine}></div>
      <div className={styles.gradientBackground}></div>
      <div className={styles.testimonialHead}>
        <h1>Words of Praise</h1>
        <p>
          See how &#34;Eat Word&#34; is transforming vocabulary mastery for
          learners
        </p>
      </div>

      {isLoading ? (
        <div className={styles.skeletonLoader}>
          <Skeleton width={290} height={100} />
          <Skeleton width={290} height={100} />
          <Skeleton width={290} height={100} />
          <Skeleton width={290} height={100} />
        </div>
      ) : hasError ? (
        <Error message="We're unable to display testimonials at this time. This may be caused by your ad blocker. Or try refreshing the page." />
      ) : (
        <>
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
        </>
      )}

      <div className={styles.gradientLeft} />
      <div className={styles.gradientRight} />
    </section>
  );
};

export default Testimonials;
