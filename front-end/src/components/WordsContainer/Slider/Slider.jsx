import { useEffect, useState } from "react";
import { IoArrowBackOutline, IoArrowForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import { useBringMilestoneWordQuery } from "../../../services/milestone";
import { useUpdateWords } from "../hooks/useUpdateWords";
import { wordSchemaForClient } from "../utils";
import styles from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";

const Carousel = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );
  const { updateWords, missingError, doNotify, setDoNotify } = useUpdateWords();

  // Effect to update words when data is available
  useEffect(() => {
    setWords(data?.words || []);
  }, [data]);

  // Append new word
  const handleAppendWord = async () => {
    const newWord = wordSchemaForClient(curMilestone);
    setWords((prev) => [...prev, newWord]);
  };

  const handleUpdateWords = (wordIdx, property, value) => {};

  return (
    <div className={styles.container}>
      <SwiperReact
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        // breakpoints={{
        //   // When window width is >= 320px (mobile)
        //   320: {
        //     slidesPerView: 1,
        //   },
        //   // When window width is >= 768px (tablet)
        //   768: {
        //     slidesPerView: 2,
        //   },
        //   // When window width is >= 1024px (desktop)
        //   1024: {
        //     slidesPerView: "auto",
        //   },
        // }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
          clickable: true,
        }}
        modules={[EffectCoverflow, Navigation]}
        className={styles.swiperContainer}
      >
        {words.map((word, index) => (
          <SwiperSlide key={word?._id} className={styles.swiperSlide}>
            <SliderCard word={word} wordIdx={index} />
          </SwiperSlide>
        ))}

        <div className={styles.sliderControler}>
          <div className={`${styles.swiperButtonPrev} ${styles.sliderArrow}`}>
            <IoArrowBackOutline />
          </div>
          <div className={`${styles.swiperButtonNext} ${styles.sliderArrow}`}>
            <IoArrowForward />
          </div>
        </div>
      </SwiperReact>
    </div>
  );
};

export default Carousel;
