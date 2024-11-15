import { useSelector } from "react-redux";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import styles from "./Profile.module.css";

function Profile() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  console.log(user, isAuthenticated, isLoading);

  return (
    <div className={styles.profilePage}>
      <Header />
      <div className={styles.profileContent}></div>
      <Footer />
    </div>
  );
}

export default Profile;
