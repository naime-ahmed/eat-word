import Header from "../../components/shared/Header/Header";
import style from "./Home.module.css";
import Hero from "./Sections/Hero/Hero";
import Tutorials from "./Sections/Tutorials/Tutorials";

const Home = () => {
  return (
    <div className={style.homeContainer}>
      <Header />
      <Hero />
      <Tutorials />
    </div>
  );
};

export default Home;
