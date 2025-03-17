import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoArrowBackOutline, IoArrowForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import useNotification from "../../../hooks/useNotification";
import { useBringMilestoneWordQuery } from "../../../services/milestone";
import { milestonePropTypes } from "../../../utils/propTypes";
import Error from "../../shared/Error/Error";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import { wordSchemaForClient } from "../utils";
import styles from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";

const Carousel = ({ curMilestone, isOnRecallMood }) => {
  const [words, setWords] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [generatingCells, setGeneratingCells] = useState([]); // [[rowIdx,colId],[rowIdx,colId]]
  console.log("words from carousel: ", words);
  const showNotification = useNotification();
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );

  useEffect(() => {
    if (data?.words.length > 0) {
      setWords(data?.words);
    } else {
      setWords([wordSchemaForClient(curMilestone)]);
    }
  }, [data, curMilestone]);

  useEffect(() => {
    if (swiperInstance && words.length > 0) {
      swiperInstance.update();
      swiperInstance.slideTo(swiperInstance.activeIndex, 0);
    }
  }, [words, swiperInstance]);

  // Append new word
  const handleAppendWord = async () => {
    const hasUnsavedWord = words.some((word) => !word._id);

    if (hasUnsavedWord) {
      showNotification({
        title: "There is a unsaved word",
        message: "Please provide word to save it before adding a new word.",
        duration: 4000,
      });
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

  // retry on error
  const retry = () => window.location.reload();

  // reached the milestone?
  const hasReached =
    curMilestone?.wordsCount ===
    Math.max(curMilestone?.targetWords, words?.length);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.sliderSkeletonLoader}>
          <Skeleton width={340} height={46} />
          <Skeleton width={340} height={46} />
          <Skeleton width={340} height={46} />
          <Skeleton width={340} height={46} />
          <Skeleton width={340} height={46} />
          <div className={styles.sliderController}>
            <Skeleton width={340} height={46} />
            <Skeleton width={340} height={46} />
          </div>
          <Skeleton width={340} height={23} />
        </div>
      ) : isError ? (
        <Error
          message={
            error?.message || "something went wrong while bringing words"
          }
          showRetry={true}
          onRetry={retry}
        />
      ) : (
        <>
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
              <SwiperSlide
                key={word._id || `temp-${index}`}
                className={styles.swiperSlide}
              >
                <SliderCard
                  key={word._id || `temp-card-${index}`}
                  word={word}
                  setWords={setWords}
                  wordIdx={index}
                  curMilestone={curMilestone}
                  isOnRecallMood={isOnRecallMood}
                  generatingCells={generatingCells}
                  setGeneratingCells={setGeneratingCells}
                />
              </SwiperSlide>
            ))}

            <div className={styles.sliderControler}>
              <div
                className={`${styles.swiperButtonPrev} ${styles.sliderArrow}`}
              >
                <IoArrowBackOutline /> <span>Previous</span>
              </div>
              <div
                className={`${styles.swiperButtonNext} ${styles.sliderArrow}`}
              >
                <span>Next</span>
                <IoArrowForward />
              </div>
            </div>
          </SwiperReact>

          {!hasReached && (
            <div className={styles.addNewWord}>
              <button onClick={handleAppendWord}>
                <IoIosAdd /> Add new word
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

Carousel.propTypes = {
  curMilestone: milestonePropTypes,
  isOnRecallMood: PropTypes.bool,
};

export default Carousel;
