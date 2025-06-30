import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { RiSaveLine } from "react-icons/ri";
import { userAtom } from "../../../atoms/user";
import MilestonesPopup from "./MilestonesPopup";

const SaveWord = () => {
  const user = useAtomValue(userAtom);
  console.log(user);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const saveButtonRef = useRef(null);

  const getExtensionId = () => {
    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      return chrome.runtime.id;
    }
    return "your-dev-extension-id";
  };

  const handleSaveClick = () => {
    setIsPopupVisible((prev) => !prev);
  };

  return (
    <>
      <div className="">
        {user.isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 w-20 bg-slate-700 rounded-md"></div>
          </div>
        ) : user.isAuthenticated ? (
          <button
            ref={saveButtonRef}
            onClick={handleSaveClick}
            className="flex gap-1 justify-center items-center px-2 sm:px-3 py-1 text-[14px] sm:text-base text-slate-200 sm:text-slate-400 hover:text-slate-200 bg-slate-700/60 sm:bg-transparent sm:hover:bg-slate-700/60 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
            title="Save this word to a milestone"
          >
            <RiSaveLine /> save
          </button>
        ) : (
          <a
            href={`${
              import.meta.env.VITE_EAT_WORD_CLIENT_URL
            }extension-signin?extensionId=${getExtensionId()}`}
            className="flex gap-1 items-center justify-center px-2 sm:px-3 py-1 text-xs sm:text-base text-slate-200 sm:text-slate-400 hover:text-slate-200 bg-slate-700/60 sm:bg-transparent sm:hover:bg-slate-700/60 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 no-underline cursor-pointer"
            title="login to save this word"
            target="_blank"
            rel="noopener noreferrer"
          >
            log in <CiLogin />
          </a>
        )}
      </div>

      {user.isAuthenticated && (
        <MilestonesPopup
          isVisible={isPopupVisible}
          targetRef={saveButtonRef}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
};

export default SaveWord;
