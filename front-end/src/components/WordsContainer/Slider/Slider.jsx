import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoArrowBackOutline, IoArrowForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import { useBringMilestoneWordQuery } from "../../../services/milestone";
import Notification from "../../Notification/Notification";
import { wordSchemaForClient } from "../utils";
import styles from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";

const Carousel = ({ curMilestone }) => {
  const [words, setWords] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );
  // Effect to update words when data is available
  useEffect(() => {
    setWords(data?.words || []);
  }, [data]);

  // Append new word
  const handleAppendWord = async () => {
    const hasUnsavedWord = words.some((word) => !word._id);

    if (hasUnsavedWord) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      return;
    }

    const newWord = wordSchemaForClient(curMilestone);
    setWords((prev) => [...prev, newWord]);

    setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.slideTo(words.length);
      }
    }, 0);
  };

  return (
    <div className={styles.container}>
      <SwiperReact
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={false}
        slidesPerView={"auto"}
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
        onSwiper={setSwiperInstance}
      >
        {words.map((word, index) => (
          <SwiperSlide key={word?._id} className={styles.swiperSlide}>
            <SliderCard
              key={word?._id}
              word={word}
              setWords={setWords}
              wordIdx={index}
              curMilestone={curMilestone}
            />
          </SwiperSlide>
        ))}

        <div className={styles.sliderControler}>
          <div className={`${styles.swiperButtonPrev} ${styles.sliderArrow}`}>
            <IoArrowBackOutline /> <span>Previous</span>
          </div>
          <div className={`${styles.swiperButtonNext} ${styles.sliderArrow}`}>
            <span>Next</span>
            <IoArrowForward />
          </div>
        </div>
      </SwiperReact>
      {/* Add new word */}
      <div className={styles.addNewWord}>
        <button onClick={handleAppendWord}>
          <IoIosAdd /> Add new word
        </button>
      </div>
      {showNotification && (
        <Notification
          title="Warning! "
          message="Please provide word to save it before adding a new word."
          isOpen={showNotification}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Carousel;
