import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultProfilePic from "../../assets/defaultUserProfileImage.png";
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
  // Initialize basic info state with empty values
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    profilePicture: "",
    preferredLang: "",
    preferredDevice: "",
  });

  // initialize the password state with empty values
  const [pass, setPass] = useState({
    curPass: "",
    curPassError: false,
    newPass: "",
    newPassError: false,
    retypePass: "",
    retypePassError: false,
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
  function handleBasicInfoChange(event) {
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

  const handleBasicInfoChangeClick = () => {
    console.log(basicInfo);
  };

  function handlePassChange(event) {
    const { name, value } = event.target;
    setPass({ ...pass, [name]: value });
  }

  const handlePassChangeClick = () => {
    setPass((prevPass) => ({
      ...prevPass,
      curPassError: pass.curPass === "",
      newPassError: pass.newPass === "",
      retypePassError: pass.retypePass === "",
    }));
    if (pass.curPassError || pass.newPassError || pass.retypePassError) {
      return;
    }
    console.log(pass);
    // Call server to update password
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
            <PrimaryBtn>
              Edit <i className="far fa-edit"></i>
            </PrimaryBtn>
          </div>
          <div className={styles.basicInfo}>
            <div className={styles.profileImg}>
              <img
                src={basicInfo.profilePicture || defaultProfilePic}
                alt="profile picture"
              />
            </div>
            <div className={styles.nameAndEmail}>
              <div>
                <input
                  type="text"
                  name="name"
                  onChange={handleBasicInfoChange}
                  value={basicInfo?.name}
                  className={styles.inputField}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  onChange={handleBasicInfoChange}
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
                  onChange={handleBasicInfoChange}
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
                  onChange={handleBasicInfoChange}
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
            <PrimaryBtn handleBasicInfoChangeClick={handleBasicInfoChangeClick}>
              Save changes
            </PrimaryBtn>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.changePass}>
            <div>
              <label htmlFor="curPass" className={styles.inputLabel}>
                Enter current password <small>&#42;</small>
              </label>

              <input
                type="password"
                name="curPass"
                id="curPass"
                onChange={handlePassChange}
                value={pass?.curPass}
                className={styles.inputField}
              />
              {pass.curPassError && <small>current password required</small>}
            </div>
            <div>
              <label htmlFor="newPass" className={styles.inputLabel}>
                Enter new password <small>&#42;</small>
              </label>

              <input
                type="password"
                name="newPass"
                id="newPass"
                onChange={handlePassChange}
                value={pass?.newPass}
                className={styles.inputField}
              />
              {pass.newPassError && <small>new password required</small>}
            </div>
            <div>
              <label htmlFor="retypePass" className={styles.inputLabel}>
                Enter new password Again <small>&#42;</small>
              </label>

              <input
                type="password"
                name="retypePass"
                id="retypePass"
                onChange={handlePassChange}
                value={pass?.retypePass}
                className={styles.inputField}
              />
              {pass.retypePassError && <small>retype password required</small>}
            </div>
          </div>
          <div className={styles.changePassBtn}>
            <PrimaryBtn handleClick={handlePassChangeClick}>
              Change Password
            </PrimaryBtn>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
