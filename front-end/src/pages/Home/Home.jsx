import Header from "../../components/shared/Header/Header";
import style from "./Home.module.css";
import BaseTheory from "./Sections/BaseTheory/BaseTheory";
import Hero from "./Sections/Hero/Hero";
import JourneyOfAWord from "./Sections/JourneyOfAWord/JourneyOfAWord";
import Tutorials from "./Sections/Tutorials/Tutorials";

const Home = () => {
  return (
    <div className={style.homeContainer}>
      <Header />
      <Hero />
      <Tutorials />
      <BaseTheory />
      <JourneyOfAWord />
    </div>
  );
};

export default Home;
