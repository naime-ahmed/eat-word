import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import style from "./Testimonials.module.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          speed: 2500,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  useEffect(() => {
    fetch("/DB/testimonials.json")
      .then((response) => response.json())
      .then((data) => {
        setTestimonials(data);
      })
      .catch((error) => {
        console.log("Error fetching testimonials", error);
      });
  }, []);

  return (
    <div className={`${style.testimonialContainer} slider-container`}>
      <h1>Words of praise</h1>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={style.testimonialCard}>
            <blockquote>{testimonial.review}</blockquote>
            <p>
              - {testimonial.name}, {testimonial.profession}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
