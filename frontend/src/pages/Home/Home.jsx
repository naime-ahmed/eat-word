import Hero from "../../components/Hero/Hero";
import Header from "../../components/Shared/Header/Header";
import Tutorials from "../../components/Tutorials/Tutorials";
import "./Home.css";
// https://www.youtube.com/watch?v=ANrYhHN8Dl4
// use modular css [name].module.css
const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Tutorials />
    </div>
  );
};

export default Home;
