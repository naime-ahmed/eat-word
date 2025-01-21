import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defaultProfilePic from "../../assets/defaultUserProfileImage.png";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import { setUserData } from "../../features/userSlice";
import { useDeleteUserMutation } from "../../services/auth";
import {
  useBringUserByIdQuery,
  useUpdatePasswordMutation,
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
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    profilePicture: "",
    preferredLang: "",
    preferredDevice: "",
  });

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

  const handleBasicInfoChange = (name, value) => {
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (newProfilePic) => {
    setBasicInfo((prev) => ({ ...prev, profilePicture: newProfilePic }));
  };

  const handleBasicInfoChangeClick = async () => {
    try {
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

      if (Object.keys(changedBasicInfo).length === 0) {
        console.log("No changes detected, skipping server update.");
        return;
      }

      const updatedUser = await updateUser(changedBasicInfo);

      if (
        isErrorUpdate ||
        [400, 404, 500].includes(updatedUser?.error?.status)
      ) {
        Swal.fire({
          title: "Something went wrong",
          text:
            updatedUser?.error?.data?.message || "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "ok",
        });
      } else {
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

  const handleIsChanging = () => {
    setIsChanging((prev) => !prev);
  };

  return (
    <div className={styles.profilePage}>
      <Header />
      {isLoading ? (
        <SpinnerForPage />
      ) : (
        <div className={styles.profileContent}>
          {isError ? (
            <Error error={error}></Error>
          ) : (
            <>
              <div className={styles.profileHead}>
                <p>My Profile</p>
                <div className={styles.profileActionBtns}>
                  {!isChanging && <DeleteAccount />}
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
              </div>
              <div className={styles.basicInfo}>
                <ProfileImage
                  profilePicture={basicInfo?.profilePicture}
                  isChanging={isChanging}
                  onProfilePicChange={handleProfilePicChange}
                />
                <NameAndEmail
                  isChanging={isChanging}
                  basicInfo={basicInfo}
                  onBasicInfoChange={handleBasicInfoChange}
                />
                <PreferredSettings
                  isChanging={isChanging}
                  basicInfo={basicInfo}
                  onBasicInfoChange={handleBasicInfoChange}
                />
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
              {isChanging && userData?.authProvider === "local" && (
                <div className={styles.divider}></div>
              )}
              {isChanging && userData?.authProvider === "local" && (
                <ChangePasswordForm setIsChanging={setIsChanging} />
              )}
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;

// profile image component
function ProfileImage({ profilePicture, isChanging, onProfilePicChange }) {
  const handleProfilePicChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      onProfilePicChange(resData.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        title: "Upload Failed",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.profileImg}>
      <img src={profilePicture || defaultProfilePic} alt="profile picture" />
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
  );
}

// component responsible to name and email field
function NameAndEmail({ isChanging, basicInfo, onBasicInfoChange }) {
  const handleBasicInfoChange = (event) => {
    const { name, value } = event.target;
    onBasicInfoChange(name, value);
  };

  return (
    <div
      className={isChanging ? styles.nameAndEmailEdit : styles.nameAndEmailShow}
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
  );
}

// This component responsible for preferred settings
function PreferredSettings({ isChanging, basicInfo, onBasicInfoChange }) {
  const handleBasicInfoChange = (event) => {
    const { name, value } = event.target;
    onBasicInfoChange(name, value); // Notify parent of the change
  };

  return (
    <div className={isChanging ? styles.preferredEdit : styles.preferredShow}>
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
  );
}

// this component is responsible for changing password
function ChangePasswordForm({ setIsChanging }) {
  const [
    updatePassword,
    { isLoading: isLoadingUpPass, isError: isErrorUpPass, error: errorUpPass },
  ] = useUpdatePasswordMutation();
  const [pass, setPass] = useState({
    curPass: "",
    curPassError: "",
    newPass: "",
    newPassError: "",
    retypePass: "",
    retypePassError: "",
  });

  const handlePassChangeClick = async (e) => {
    e.preventDefault();

    const curPassError =
      pass.curPass === "" ? "current password is required" : "";
    let newPassError = pass.newPass === "" ? "new password is required" : "";
    let retypePassError =
      pass.retypePass === "" ? "retype the new password" : "";

    if (pass.newPass && pass.retypePass && pass.newPass != pass.retypePass) {
      retypePassError = "didn't match with new password";
    }

    if (pass.newPass && pass.curPass && pass.newPass === pass.curPass) {
      newPassError = "current password and this password is same! lol";
    }

    if (newPassError === "" && pass.newPass.length < 6) {
      newPassError = "password is too small";
    }

    setPass((prevPass) => ({
      ...prevPass,
      curPassError,
      newPassError,
      retypePassError,
    }));

    if (curPassError || newPassError || retypePassError) {
      console.log("Validation failed, returning...");
      return;
    }

    try {
      const res = await updatePassword({
        curPass: pass?.curPass,
        newPass: pass?.newPass,
      });

      if (res?.data) {
        Swal.fire({
          title: res?.data?.message || "Update successful",
          icon: "success",
          confirmButtonText: "ok",
        });
        setIsChanging(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Something went wrong",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  const handlePassChange = (event) => {
    const { name, value } = event.target;
    setPass((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
          {pass.curPassError && <small>{pass.curPassError}</small>}
          {isErrorUpPass && <small>{errorUpPass?.data?.message}</small>}
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
          {pass.newPassError && <small>{pass.newPassError}</small>}
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
          {pass.retypePassError && <small>{pass.retypePassError}</small>}
        </div>
      </div>
      <div className={styles.changePassBtn}>
        <PrimaryBtn btnType="submit" isLoading={isLoadingUpPass}>
          Change Password
        </PrimaryBtn>
      </div>
    </form>
  );
}

// delete account
function DeleteAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteUser, { isLoading, isError, error }] = useDeleteUserMutation();

  const handleDeleteAccount = async () => {
    console.log("del click");
    try {
      const warningResult = await Swal.fire({
        title: "Are you sure?",
        text: "Your Account and all associated contents will be removed permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, sign out",
      });

      if (!warningResult.isConfirmed) {
        return;
      }
      const res = await deleteUser();

      if (res?.data) {
        navigate("/");
        dispatch(setUserData({}));
        Swal.fire({
          title: res?.data?.message || "Account has been deleted successfully",
          icon: "success",
          confirmButtonText: "ok",
        });
      }
    } catch (error) {
      console.error("Error on account deletion:", error);
      Swal.fire({
        title: "Something went wrong",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  };

  return (
    <div>
      <PrimaryBtn
        handleClick={handleDeleteAccount}
        isLoading={isLoading}
        loadingText="Deleting..."
        colorOne="rgb(153 17 12)"
        colorTwo="rgb(201 12 99)"
      >
        Delete Account
      </PrimaryBtn>
    </div>
  );
}
