import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/defaultUserProfileImage.webp";
import Popup from "../../components/Popup/Popup";
import ConfirmActionDialog from "../../components/Popup/PopUpContents/ConfirmActionDialog/ConfirmActionDialog";
import Error from "../../components/shared/Error/Error";
import Footer from "../../components/shared/Footer/Footer";
import Header from "../../components/shared/Header/Header";
import PrimaryBtn from "../../components/ui/button/PrimaryBtn/PrimaryBtn";
import LanguageSearch from "../../components/ui/input/LanguageSearch/LanguageSearch";
import ClassicSpinner from "../../components/ui/loader/ClassicSpinner/ClassicSpinner";
import SpinnerForPage from "../../components/ui/loader/SpinnerForPage/SpinnerForPage";
import { setSignOutUser } from "../../features/authSlice";
import { setUserData } from "../../features/userSlice";
import useNotification from "../../hooks/useNotification";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import {
  useBringUserByIdQuery,
  useUpdatePasswordMutation,
  useUpdateUserMutation,
} from "../../services/user";
import { userPropTypes } from "../../utils/propTypes";
import { LANGUAGE_MAP } from "../../utils/supportedLan";
import styles from "./Profile.module.css";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useBringUserByIdQuery(user?.id);
  const [isChanging, setIsChanging] = useState(false);
  const showNotification = useNotification();

  const [
    updateUser,
    { isLoading: isLoadingUpdate, isError: isErrorUpdate, error: errorUpdate },
  ] = useUpdateUserMutation();

  const userData = data?.data;
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    profilePicture: "",
    preferences: {
      language: "",
      device: "",
    },
  });

  // manage the scroll position
  useScrollRestoration();

  // Update useEffect
  useEffect(() => {
    if (userData) {
      setBasicInfo({
        name: userData.name || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "",
        preferences: {
          language: userData.preferences?.language || "",
          device: userData.preferences?.device || "",
        },
      });
    }
  }, [userData]);

  const handleBasicInfoChange = (name, value) => {
    if (name.startsWith("preferences.")) {
      const [parent, child] = name.split(".");
      setBasicInfo((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBasicInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePicChange = (newProfilePic) => {
    setBasicInfo((prev) => ({ ...prev, profilePicture: newProfilePic }));
  };

  const handleBasicInfoChangeClick = async () => {
    try {
      const changedBasicInfo = {
        preferences: {},
      };

      // Name
      if (userData?.name !== basicInfo?.name) {
        changedBasicInfo.name = basicInfo.name;
      }

      // Profile Picture
      if (userData?.profilePicture !== basicInfo?.profilePicture) {
        changedBasicInfo.profilePicture = basicInfo.profilePicture;
      }

      // Language
      if (userData?.preferences?.language !== basicInfo.preferences?.language) {
        changedBasicInfo.preferences.language = basicInfo.preferences.language;
      }

      // Device
      if (userData?.preferences?.device !== basicInfo.preferences?.device) {
        changedBasicInfo.preferences.device = basicInfo.preferences.device;
      }

      // Clean empty preferences object
      if (Object.keys(changedBasicInfo.preferences).length === 0) {
        delete changedBasicInfo.preferences;
      }

      if (Object.keys(changedBasicInfo).length === 0) {
        showNotification({
          title: "No changes detected",
          message: "",
          duration: 4000,
        });
        return;
      }

      const updatedUser = await updateUser(changedBasicInfo).unwrap();

      if (
        isErrorUpdate ||
        [400, 404, 500].includes(updatedUser?.error?.status)
      ) {
        showNotification({
          title: "Something went wrong!",
          message:
            errorUpdate?.error?.message || "An unexpected error occurred",
          iconType: "error",
          duration: 4000,
        });
      } else {
        dispatch(setUserData(updatedUser?.user));
        showNotification({
          title: "Update successful!",
          message: updatedUser?.message || "",
          iconType: "success",
          duration: 4000,
        });
        setIsChanging(false);
      }
    } catch (error) {
      showNotification({
        title: "Something went wrong",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  };

  const handleIsChanging = () => {
    setIsChanging((prev) => !prev);
  };

  // retry fetching profile data
  const retry = () => window.location.reload();

  return (
    <div className={styles.profilePage}>
      <Header />
      {isLoading ? (
        <SpinnerForPage />
      ) : (
        <div className={styles.profileContent}>
          {isError ? (
            <Error
              message={
                error?.message ||
                "some thing went wrong while bringing profile info!"
              }
              showRetry={true}
              onRetry={retry}
              retryLabel="try again later"
            ></Error>
          ) : (
            <>
              <div className={styles.profileHead}>
                <p>My Profile</p>
                <div className={styles.profileActionBtns}>
                  {/* {!isChanging && <AccountAction user={data?.data} />} */}
                  <PrimaryBtn handleClick={handleIsChanging}>
                    {isChanging ? (
                      <>
                        <HiMiniXMark /> Cancel Edit
                      </>
                    ) : (
                      <>
                        <LiaEditSolid /> Edit
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
  const showNotification = useNotification();
  const handleProfilePicChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validImageTypes.includes(file.type)) {
      showNotification({
        title: "Invalid File Type",
        message: "Please upload a valid image file (PNG, JPG or JPEG).",
        iconType: "error",
        duration: 4000,
      });
      return;
    }

    const maxSizeKB = 300;
    if (file.size > maxSizeKB * 1024) {
      showNotification({
        title: "File Too Large",
        message: `File size must be less than ${maxSizeKB}KB.`,
        iconType: "error",
        duration: 4000,
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
      showNotification({
        title: "Upload Failed",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  };

  return (
    <div className={styles.profileImg}>
      <img src={profilePicture || defaultProfilePic} alt="profile picture" />
      {isChanging && (
        <label htmlFor="file-upload" className={styles.updateImgBtn}>
          <MdOutlineEdit />
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

ProfileImage.propTypes = {
  profilePicture: PropTypes.string,
  isChanging: PropTypes.bool,
  onProfilePicChange: PropTypes.func,
};

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

NameAndEmail.propTypes = {
  isChanging: PropTypes.bool,
  basicInfo: PropTypes.object,
  onBasicInfoChange: PropTypes.func,
};

// This component responsible for preferred settings
function PreferredSettings({ isChanging, basicInfo, onBasicInfoChange }) {
  // console.log(LANGUAGE_MAP[basicInfo?.preferences?.language]);
  const handleSelectLanguage = (languageCode) => {
    // For example, update your state or call a handler:
    onBasicInfoChange("preferences.language", languageCode);
  };
  const language_map = LANGUAGE_MAP();

  return (
    <div className={isChanging ? styles.preferredEdit : styles.preferredShow}>
      {isChanging ? (
        <div>
          <LanguageSearch
            onSelectLanguage={handleSelectLanguage}
            curLang={language_map[[basicInfo?.preferences?.language]] || ""}
          />
        </div>
      ) : (
        <div>
          <p>Your language:</p>
          <p>
            {basicInfo?.preferences.language
              ? language_map[[basicInfo?.preferences?.language]]
              : "You haven't given yet"}
          </p>
        </div>
      )}
      <div>
        {isChanging ? (
          <select
            name="preferredDevice"
            onChange={(e) =>
              onBasicInfoChange("preferences.device", e.target.value)
            }
            value={basicInfo?.preferences.device || ""}
            className={styles.selectField}
          >
            <option value="" disabled>
              what device you will use often?
            </option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Desktop</option>
          </select>
        ) : (
          <div>
            <p>preferred device:</p>
            <p>
              {basicInfo?.preferences.device
                ? basicInfo?.preferences.device
                : "you haven't selected yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

PreferredSettings.propTypes = {
  isChanging: PropTypes.bool,
  basicInfo: PropTypes.object,
  onBasicInfoChange: PropTypes.func,
};

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
  const showNotification = useNotification();

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
        showNotification({
          title: "Update successful",
          message: res?.data?.message || "Your password has been updated!",
          iconType: "success",
          duration: 4000,
        });
        setIsChanging(false);
      }
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Something went wrong",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
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

ChangePasswordForm.propTypes = {
  setIsChanging: PropTypes.func,
};

// delete account (logic changed to deactivate)
function AccountAction({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [isShowDeactivateAC, setIsShowDeactivateAC] = useState(false);
  const showNotification = useNotification();
  console.log(user);
  const handleDeactivateAccount = async () => {
    try {
      const res = await updateUser({ status: "deactivate" });
      console.log(res);
      if (res?.data) {
        navigate("/");
        dispatch(setUserData({}));
        dispatch(setSignOutUser());
        localStorage.removeItem("access-token");
        showNotification({
          title: "deactivation successful!",
          message: "Account has been deactivated successfully",
          iconType: "success",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("Error on account deactivation:", error);
      showNotification({
        title: "Something went wrong",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    } finally {
      setIsShowDeactivateAC(false);
    }
  };

  const handleOpenIsShowDeleteAC = () => {
    setIsShowDeactivateAC(true);
  };

  const handleCloseIsShowDeleteAC = () => {
    setIsShowDeactivateAC(false);
  };

  const handleActivateAccount = async () => {
    try {
      const res = await updateUser({ status: "active" });
      console.log(res);
    } catch (error) {
      console.error("Error on account Activation:", error);
      showNotification({
        title: "Something went wrong",
        message: error.message || "An unexpected error occurred",
        iconType: "error",
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <Popup
        isOpen={isShowDeactivateAC}
        onClose={handleCloseIsShowDeleteAC}
        showCloseButton={isLoading ? false : true}
      >
        <ConfirmActionDialog
          title="Confirm Account Deactivation"
          description="We're sorry to see you go. If there's anything we could improve, we'd love to hear your feedback. To confirm deactivation, please type: "
          confirmationText="deactivate my account"
          onConfirm={handleDeactivateAccount}
          confirmButtonText="Deactivate My Account"
        />
        {isLoading && (
          <div className={styles.deletingACC}>
            <ClassicSpinner /> Deactivating your account...
          </div>
        )}
      </Popup>
      {user?.status === "deactivate" ? (
        <PrimaryBtn
          handleClick={handleActivateAccount}
          isLoading={isLoading}
          loadingText="Deactivating..."
          colorOne="rgb(5 129 10)"
          colorTwo="rgb(26 206 89)"
        >
          {" "}
          Activate Account{" "}
        </PrimaryBtn>
      ) : (
        <PrimaryBtn
          handleClick={handleOpenIsShowDeleteAC}
          isLoading={isLoading}
          loadingText="Deactivating..."
          colorOne="rgb(153 17 12)"
          colorTwo="rgb(201 12 99)"
        >
          Deactivate Account
        </PrimaryBtn>
      )}
    </div>
  );
}

AccountAction.propTypes = userPropTypes;
