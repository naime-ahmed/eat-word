import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
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
import TwoDBtn from "../../ui/button/TwoDBtn/TwoDBtn";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import { wordSchemaForClient } from "../utils";
import styles from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";

const Carousel = ({
  curMilestone,
  isOnRecallMood,
  setWordsLimit,
  setGenAILimit,
}) => {
  const [words, setWords] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const trackRef = useRef(null);
  const [generatingCells, setGeneratingCells] = useState([]);
  const showNotification = useNotification();
  const { data, isLoading, isError, error } = useBringMilestoneWordQuery(
    curMilestone?._id
  );
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (data?.words.length > 0) {
      setWords(data.words);
    } else {
      setWords([wordSchemaForClient(curMilestone)]);
    }

    setWordsLimit((prev) => (!prev?.total ? data?.wordRateLimit : prev));
    setGenAILimit((prev) => (!prev?.total ? data?.genAIRateLimit : prev));
  }, [data, curMilestone, setWordsLimit, setGenAILimit]);

  // derive total
  const totalWord = words.length;
  const progressPct =
    totalWord > 1 ? ((activeSlide - 1) / (totalWord - 1)) * 100 : 0;

  useEffect(() => {
    if (swiperInstance && words.length > 0) {
      swiperInstance.update();
      swiperInstance.slideTo(swiperInstance.activeIndex, 0);
    }
  }, [words, swiperInstance]);

  const handleAppendWord = () => {
    const hasUnsavedWord = words.some((w) => !w._id);
    if (hasUnsavedWord) {
      showNotification({
        title: "There is an unsaved word",
        message: "Please provide word to save it before adding a new word.",
        duration: 4000,
      });
      swiperInstance?.slideTo(words.length - 1);
      return;
    }
    const newWord = wordSchemaForClient(curMilestone);
    setWords((prev) => [...prev, newWord]);
    setTimeout(() => {
      swiperInstance?.slideTo(words.length);
    }, 0);
  };

  const retry = () => window.location.reload();

  const hasReached =
    curMilestone?.wordsCount ===
    Math.max(curMilestone?.targetWords, words.length);

  // POINTER/DRAG HANDLERS
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !swiperInstance) return;
    let dragging = false;

    const onPointerMove = (e) => {
      if (!dragging) return;
      const rect = track.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = x / rect.width;
      const idx = Math.round(pct * (totalWord - 1));
      swiperInstance.slideTo(idx);
      setActiveSlide(idx + 1);
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    const onPointerDown = (e) => {
      e.preventDefault();
      dragging = true;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };

    // bind just to the “thumb” pseudo‐element container
    const thumb = track.querySelector(`.${styles.sliderDivider}`);
    if (thumb) {
      thumb.addEventListener("pointerdown", onPointerDown);
    }
    return () => {
      if (thumb) {
        thumb.removeEventListener("pointerdown", onPointerDown);
      }
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [swiperInstance, totalWord]);

  return (
    <div className={styles.container}>
      <div
        ref={trackRef}
        className={styles.divider}
        style={{ position: "relative" }}
      >
        {words?.length > 1 && (
          <div
            className={styles.sliderDivider}
            style={{ "--progress": `${progressPct}%` }}
          />
        )}
      </div>
      {isLoading ? (
        <div className={styles.sliderSkeletonLoader}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width={340} height={46} />
          ))}
          <div className={styles.sliderController}>
            <Skeleton width={340} height={46} />
            <Skeleton width={340} height={46} />
          </div>
          <Skeleton width={340} height={23} />
        </div>
      ) : isError ? (
        <Error
          message={
            error?.message || "Something went wrong while bringing words"
          }
          showRetry
          onRetry={retry}
        />
      ) : (
        <>
          <SwiperReact
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={false}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            modules={[EffectCoverflow, Navigation]}
            className={styles.swiperContainer}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveSlide(s.activeIndex + 1)}
          >
            {words.map((word, idx) => (
              <SwiperSlide
                key={word._id || `temp-${idx}`}
                className={styles.swiperSlide}
              >
                <SliderCard
                  word={word}
                  setWords={setWords}
                  wordIdx={idx}
                  curMilestone={curMilestone}
                  isOnRecallMood={isOnRecallMood}
                  generatingCells={generatingCells}
                  setGeneratingCells={setGeneratingCells}
                  setGenAILimit={setGenAILimit}
                  setWordsLimit={setWordsLimit}
                />
              </SwiperSlide>
            ))}
            <div className={styles.sliderController}>
              <div ref={prevRef}>
                <TwoDBtn
                  className={styles.sliderArrow}
                  isDisabled={activeSlide === 1}
                >
                  <span className={styles.sliderControllerContent}>
                    <IoArrowBackOutline /> Previous
                  </span>
                </TwoDBtn>
              </div>
              <div ref={nextRef}>
                <TwoDBtn
                  className={styles.sliderArrow}
                  isDisabled={activeSlide === totalWord}
                >
                  <span className={styles.sliderControllerContent}>
                    Go Next <IoArrowForward />
                  </span>
                </TwoDBtn>
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
  curMilestone: milestonePropTypes.isRequired,
  isOnRecallMood: PropTypes.bool,
  setWordsLimit: PropTypes.func.isRequired,
  setGenAILimit: PropTypes.func.isRequired,
};

export default Carousel;
