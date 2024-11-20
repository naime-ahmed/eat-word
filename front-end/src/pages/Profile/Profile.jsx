import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import profilePic from "../../assets/defaultUserProfileImage.png";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { useBringUserByIdQuery } from "../../services/user";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError, error } = useBringUserByIdQuery(user?.id);

  const userData = data?.data;

  // Initialize state with empty values
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    profilePicture: "",
    preferredLang: "",
    preferredDevice: "",
  });

  // Log any errors (if present)
  if (isError) console.log(error);

  // Update state once userData is fetched
  useEffect(() => {
    if (userData) {
      setBasicInfo({
        name: userData.name || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "",
        preferredLang: userData.preferredLang || "",
        preferredDevice: userData.preferredDevice || "",
      });
    }
  }, [userData]);

  // Function to handle input changes
  function handleChange(event) {
    const { name, value, type, options } = event.target;

    setBasicInfo((prevBasicInfo) => ({
      ...prevBasicInfo,
      [name]:
        type === "select-multiple"
          ? Array.from(options)
              .filter((option) => option.selected)
              .map((option) => option.value)
          : value,
    }));
  }

  const handleClick = () => {
    console.log(basicInfo);
  };

  return (
    <div className={styles.profilePage}>
      <Header />
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <Error error={error}></Error>
      ) : (
        <div className={styles.profileContent}>
          <div className={styles.profileHead}>
            <p>My Profile</p>
            <i className="far fa-edit"></i>
          </div>
          <div className={styles.basicInfo}>
            <div className={styles.profileImg}>
              <img src={profilePic} alt="profile picture" />
            </div>
            <div className={styles.nameAndEmail}>
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={basicInfo?.name}
                  className={styles.inputField}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={basicInfo?.email}
                  className={styles.inputField}
                />
              </div>
            </div>
            <div className={styles.preferred}>
              <div>
                <input
                  list="languages"
                  name="preferredLang"
                  onChange={handleChange}
                  value={basicInfo?.preferredLang || ""}
                  className={styles.inputField}
                  placeholder="What’s your comfortable language?"
                />
                <datalist id="languages">
                  {[
                    "English",
                    "Spanish",
                    "Mandarin",
                    "Hindi",
                    "French",
                    "Arabic",
                    "Bengali",
                    "Russian",
                    "Portuguese",
                    "Japanese",
                    "German",
                    "Korean",
                    "Italian",
                    "Turkish",
                    "Vietnamese",
                  ].map((lang) => (
                    <option key={lang} value={lang} />
                  ))}
                </datalist>
              </div>
              <div>
                <select
                  name="preferredDevice"
                  onChange={handleChange}
                  value={basicInfo?.preferredDevice || ""}
                  className={styles.selectField}
                >
                  <option value="" disabled>
                    what device you will use often?
                  </option>
                  <option value="phone">Phone</option>
                  <option value="tablet">Tablet</option>
                  <option value="laptop">Laptop</option>
                  <option value="pc">PC</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.saveBasicInfo}>
            <PrimaryBtn handleClick={handleClick}>Save changes</PrimaryBtn>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.changePass}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.changePassBtn}>
            <PrimaryBtn>Change Password</PrimaryBtn>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
