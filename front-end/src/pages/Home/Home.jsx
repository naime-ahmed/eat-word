import { Suspense, lazy } from "react";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import style from "./Home.module.css";
import BaseTheory from "./Sections/BaseTheory/BaseTheory";
import Hero from "./Sections/Hero/Hero";
import IntroVideo from "./Sections/IntroVideo/IntroVideo";
import JourneyOfAWord from "./Sections/JourneyOfAWord/JourneyOfAWord";
const Testimonials = lazy(() => import("./Sections/Testimonials/Testimonials"));

const Home = () => {
  return (
    <div className={style.homeContainer}>
      <Header />
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
