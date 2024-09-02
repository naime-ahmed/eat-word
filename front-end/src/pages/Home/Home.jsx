import Header from "../../components/shared/Header/Header";
import style from "./Home.module.css";
import BaseTheory from "./Sections/BaseTheory/BaseTheory";
import Hero from "./Sections/Hero/Hero";
import Tutorials from "./Sections/Tutorials/Tutorials";

const Home = () => {
  return (
    <div className={style.homeContainer}>
      <Header />
      <Hero />
      <Tutorials />
      <BaseTheory />
    </div>
  );
};

export default Home;
