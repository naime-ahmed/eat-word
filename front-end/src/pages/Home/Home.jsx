import { Suspense, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import style from "./Home.module.css";
import BaseTheory from "./Sections/BaseTheory/BaseTheory";
import Hero from "./Sections/Hero/Hero";
import IntroVideo from "./Sections/IntroVideo/IntroVideo";
import JourneyOfAWord from "./Sections/JourneyOfAWord/JourneyOfAWord";
const Testimonials = lazy(() => import("./Sections/Testimonials/Testimonials"));

const Home = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [showBanner, setShowBanner] = useState(false);
  useScrollRestoration();
  useEffect(() => {
    if (!isLoading) {
      const hasClosed = sessionStorage.getItem("promoClosed");
      if (!hasClosed && !isAuthenticated) {
        setTimeout(() => setShowBanner(true), 4000);
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleCloseBanner = () => {
    sessionStorage.setItem("promoClosed", "true");
    setShowBanner(false);
  };

  const headerTop = window.innerWidth > 900 && showBanner ? "36px" : "0px";

  return (
    <div className={style.homeContainer}>
      <PromoBanner show={showBanner} onClose={handleCloseBanner} />
      <Header top={headerTop} />
      <Hero />
      <IntroVideo />
      <JourneyOfAWord />
      <BaseTheory />
      <Suspense fallback={<div>Loading testimonials...</div>}>
        <Testimonials />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Home;
