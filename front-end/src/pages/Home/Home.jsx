import Header from "../../components/shared/Header/Header";
import style from "./Home.module.css";
import Hero from "./Sections/Hero/Hero";

const Home = () => {
  return (
    <div className={style.homePage}>
      <div className={style.homeContainer}>
        <Header />
        <Hero />
      </div>
    </div>
  );
};

export default Home;
