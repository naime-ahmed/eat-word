import Header from "../../components/shared/Header/Header";
import Hero from "./Sections/Hero/Hero";

import style from "./Home.module.css";

const Home = () => {
  return (
    <div className={style.homeContainer}>
      <Header />
      <Hero />
    </div>
  );
};

export default Home;
