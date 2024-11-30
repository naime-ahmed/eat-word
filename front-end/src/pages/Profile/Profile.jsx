import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import defaultProfilePic from "../../assets/defaultUserProfileImage.png";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import { setUserData, setUserError } from "../../features/userSlice";
import {
  useBringUserByIdQuery,
  useUpdateUserMutation,
} from "../../services/user";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useBringUserByIdQuery(user?.id);
  const [isChanging, setIsChanging] = useState(false);

  const [
    updateUser,
    { isLoading: isLoadingUpdate, isError: isErrorUpdate, error: errorUpdate },
  ] = useUpdateUserMutation();

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
  if (isError) {
    console.log(error);
    dispatch(setUserError(error));
  } else {
    console.log("from profile", userData);
    dispatch(setUserData(userData));
  }

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

  // function to handle profile img change
  async function handleProfilePicChange(event) {
    const file = event.target.files?.[0]; // Access the first file selected safely

    if (!file) {
      console.log("No file selected.");
      return;
    }

    // Validate the file type
    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validImageTypes.includes(file.type)) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Please upload a valid image file (PNG or JPEG).",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate the file size (300 KB limit)
    const maxSizeKB = 300;
    if (file.size > maxSizeKB * 1024) {
      Swal.fire({
        title: "File Too Large",
        text: `File size must be less than ${maxSizeKB}KB.`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Prepare data for Cloudinary upload
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "eatwordCloudImg");
      data.append("cloud_name", "dspfa3xt1");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dspfa3xt1/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error?.message || "Failed to upload image."
        );
      }

      const resData = await response.json();

      // Update state with the uploaded image URL
      setBasicInfo((prev) => ({
        ...prev,
        profilePicture: resData.secure_url,
      }));
    } catch (error) {
      // Display error to the user
      console.error("Error uploading image:", error);
      Swal.fire({
        title: "Upload Failed",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const handleBasicInfoChangeClick = async () => {
    try {
      // Construct the object with only changed fields
      const changedBasicInfo = {};
      if (userData?.name !== basicInfo?.name) {
        changedBasicInfo.name = basicInfo?.name;
      }
      if (userData?.profilePicture !== basicInfo?.profilePicture) {
        changedBasicInfo.profilePicture = basicInfo?.profilePicture;
      }
      if (userData?.preferredLang !== basicInfo?.preferredLang) {
        changedBasicInfo.preferredLang = basicInfo?.preferredLang;
      }
      if (userData?.preferredDevice !== basicInfo?.preferredDevice) {
        changedBasicInfo.preferredDevice = basicInfo?.preferredDevice;
      }

      // Check if any field was actually changed
      if (Object.keys(changedBasicInfo).length === 0) {
        console.log("No changes detected, skipping server update.");
        return;
      }

      // Make the server call to update the user
      const updatedUser = await updateUser(changedBasicInfo);

      if (isErrorUpdate || [400, 404].includes(updatedUser?.error?.status)) {
        // Display error to the user
        Swal.fire({
          title: "Something went wrong",
          text:
            errorUpdate?.data?.message ||
            updatedUser?.error?.data?.message ||
            "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "ok",
        });
      } else {
        // Update state and notify the user
        dispatch(setUserData(updatedUser?.data?.user));
        Swal.fire({
          title: updatedUser?.data?.message || "Update successful",
          icon: "success",
          confirmButtonText: "ok",
        });
        setIsChanging(false);
      }
    } catch (error) {
      console.error("Error updating basic info:", error);
      Swal.fire({
        title: "Something went wrong",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  function handlePassChange(event) {
    const { name, value } = event.target;
    setPass({ ...pass, [name]: value });
  }

  const handlePassChangeClick = (e) => {
    e.preventDefault();

    // Validate fields
    const curPassError = pass.curPass === "";
    const newPassError = pass.newPass === "";
    const retypePassError = pass.retypePass === "";

    // Update state with validation errors
    setPass((prevPass) => ({
      ...prevPass,
      curPassError,
      newPassError,
      retypePassError,
    }));

    // If there are any validation errors, return early
    if (curPassError || newPassError || retypePassError) {
      console.log("Validation failed, returning...");
      return;
    }

    // Proceed with the function if no validation errors
    console.log("Password change details:", pass);
  };

  const handleIsChanging = () => {
    setIsChanging((prev) => !prev);
    // reset password fields
    setPass({
      curPass: "",
      curPassError: false,
      newPass: "",
      newPassError: false,
      retypePass: "",
      retypePassError: false,
    });
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
            <PrimaryBtn handleClick={handleIsChanging}>
              {isChanging ? (
                <>
                  <i className="fa-solid fa-xmark"></i> Cancel Edit
                </>
              ) : (
                <>
                  <i className="far fa-edit"></i> Edit
                </>
              )}
            </PrimaryBtn>
          </div>
          <div className={styles.basicInfo}>
            <div className={styles.profileImg}>
              <img
                src={basicInfo?.profilePicture || defaultProfilePic}
                alt="profile picture"
              />
              {isChanging && (
                <label htmlFor="file-upload" className={styles.updateImgBtn}>
                  <i className="fa-solid fa-pen"></i>
                  <input
                    id="file-upload"
                    onChange={handleProfilePicChange}
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </label>
              )}
            </div>
            <div
              className={
                isChanging ? styles.nameAndEmailEdit : styles.nameAndEmailShow
              }
            >
              <div>
                {isChanging ? (
                  <input
                    type="text"
                    name="name"
                    onChange={handleBasicInfoChange}
                    value={basicInfo?.name}
                    className={styles.inputField}
                  />
                ) : (
                  <div>
                    <p>Your Name:</p>
                    <p>{basicInfo?.name}</p>
                  </div>
                )}
              </div>
              <div>
                {isChanging ? (
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={basicInfo?.email}
                    className={styles.inputField}
                    title="Email can't be changed now"
                    style={{ cursor: "not-allowed" }}
                  />
                ) : (
                  <div>
                    <p>Your Email:</p>
                    <p>{basicInfo?.email}</p>
                  </div>
                )}
              </div>
            </div>
            <div
              className={
                isChanging ? styles.preferredEdit : styles.preferredShow
              }
            >
              {isChanging ? (
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
              ) : (
                <div>
                  <p>Your language:</p>
                  <p>
                    {basicInfo?.preferredLang
                      ? basicInfo?.preferredLang
                      : "You haven't given yet"}
                  </p>
                </div>
              )}
              <div>
                {isChanging ? (
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
                ) : (
                  <div>
                    <p>preferred device:</p>
                    <p>
                      {basicInfo?.preferredDevice
                        ? basicInfo?.preferredDevice
                        : "you haven't selected yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isChanging && (
            <div className={styles.saveBasicInfo}>
              <PrimaryBtn
                handleClick={handleBasicInfoChangeClick}
                isLoading={isLoadingUpdate}
              >
                Save changes
              </PrimaryBtn>
            </div>
          )}
          {isChanging && <div className={styles.divider}></div>}
          {isChanging && (
            <form onSubmit={handlePassChangeClick}>
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
                    autoComplete="on"
                  />
                  {pass.curPassError && (
                    <small>current password required</small>
                  )}
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
                    autoComplete="on"
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
                    autoComplete="on"
                  />
                  {pass.retypePassError && (
                    <small>retype password required</small>
                  )}
                </div>
              </div>
              <div className={styles.changePassBtn}>
                <PrimaryBtn btnType="submit">Change Password</PrimaryBtn>
              </div>
            </form>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
