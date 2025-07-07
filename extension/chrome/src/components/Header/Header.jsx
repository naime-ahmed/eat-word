import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { BiFontSize } from "react-icons/bi";
import { IoSwapHorizontal } from "react-icons/io5";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { fontSizeAtom } from "../../../atoms/fontSize";
import { langAtom } from "../../../atoms/language";
import { isPinnedAtom } from "../../../atoms/popupState";
import { selectedTextAtom, translatedTextAtom } from "../../../atoms/text.js";
import { userAtom } from "../../../atoms/user.js";
import brandLogo from "../../assets/logo.png";
import CopyToClip from "../CopyToClip";
import SelectLanguage from "../SelectLanguage";
import SaveWord from "./SaveWord";

const Header = () => {
  const user = useAtomValue(userAtom);
  const [lang, setLang] = useAtom(langAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [selectedText, setSelectedText] = useAtom(selectedTextAtom);
  const resultText = useAtomValue(translatedTextAtom);

  const [isLanguageLocked, setIsLanguageLocked] = useState(false);
  const [isPinned, setIsPinned] = useAtom(isPinnedAtom);

  // Load locked state from localStorage on mount
  useEffect(() => {
    const savedLockState = localStorage.getItem("eatword-language-locked");

    if (savedLockState === "true") {
      setIsLanguageLocked(true);
      const savedLanguages = localStorage.getItem("eatword-locked-languages");
      if (savedLanguages) {
        setLang(JSON.parse(savedLanguages));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedLang = (code) => {
    if (!isLanguageLocked) {
      setLang({ ...lang, selected: code });
    }
  };

  const handleTranslateToLang = (code) => {
    if (!isLanguageLocked) {
      setLang({ ...lang, translateTo: code });
    }
  };

  const handleLanguageLock = () => {
    if (isLanguageLocked) {
      setIsLanguageLocked(false);
      localStorage.removeItem("eatword-language-locked");
      localStorage.removeItem("eatword-locked-languages");
    } else {
      setIsLanguageLocked(true);
      localStorage.setItem("eatword-language-locked", "true");
      localStorage.setItem("eatword-locked-languages", JSON.stringify(lang));
    }
  };

  const handlePin = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);

    // Send message to parent window (content script)
    window.parent.postMessage(
      {
        type: "SET_PIN_STATE",
        pinned: newPinnedState,
      },
      "*"
    );
  };

  const handleFontSize = () => {
    if (fontSize === 14) {
      setFontSize(16);
    } else if (fontSize === 16) {
      setFontSize(18);
    } else if (fontSize === 18) {
      setFontSize(14);
    }
  };

  const isWord = useMemo(() => {
    if (!selectedText || selectedText.trim() === "") {
      return false;
    }
    const trimmedText = selectedText.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    return wordCount === 1;
  }, [selectedText]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full mx-auto">
      {/* brand and quick tools */}
      <div className="flex justify-between">
        <a href="http://localhost:5173/" target="_blank">
          <img src={brandLogo} className="w-20 sm:w-24" alt="Eat Word logo" />
        </a>
        <div className="flex gap-4 items-center">
          {/* save word and login */}
          {isWord && <SaveWord />}

          {/* Quick Actions Section */}
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <div className="flex items-center gap-2 sm:gap-1 bg-slate-800/40 rounded-lg p-1 border border-slate-700/40">
              {/* Font Size Button */}
              <button
                onClick={handleFontSize}
                className="p-1 sm:p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                title="Adjust font size"
              >
                <BiFontSize className="w-4 h-4" />
              </button>

              {/* Copy Button */}
              <CopyToClip text={selectedText} />

              {/* Pin Button */}
              <button
                onClick={handlePin}
                className={`p-1 sm:p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isPinned
                    ? "text-blue-400 bg-blue-500/20 hover:bg-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
                }`}
                title={isPinned ? "Unpin popup" : "Pin popup"}
              >
                {isPinned ? (
                  <TiPin className="w-4 h-4" />
                ) : (
                  <TiPinOutline className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="flex gap-2 items-center justify-center mb-4">
        {/* Language Lock Button */}
        <div className="flex items-center justify-center sm:justify-start">
          <button
            onClick={handleLanguageLock}
            className={`p-1 sm:p-2 rounded-lg transition-all duration-200 border ${
              isLanguageLocked
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
                : "bg-slate-700/50 border-slate-600/60 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300"
            } focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
            title={isLanguageLocked ? "Unlock languages" : "Lock languages"}
          >
            {isLanguageLocked ? (
              <MdOutlineLock className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <MdOutlineLockOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Language Selectors Container */}
        <div className="flex gap-2 items-center justify-center flex-1 min-w-0">
          {/* Selected Text Language */}
          <div className="w-full">
            <div
              className={` relative transition-opacity duration-200 ${
                isLanguageLocked ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <SelectLanguage
                onSelectLanguage={handleSelectedLang}
                curLang={lang.selected}
                fieldId="select-from-lang"
              />
              <small className="absolute left-1 bottom-8 sm:bottom-9 text-[11px] sm:text-xs text-slate-400 font-mediums ">
                From
              </small>
            </div>
          </div>

          {/* Swap Languages Button */}
          <div>
            <button
              onClick={() => {
                if (
                  !isLanguageLocked &&
                  lang.selected !== "" &&
                  lang.selected !== "auto" &&
                  resultText !== ""
                ) {
                  setLang({
                    selected: lang.translateTo,
                    translateTo: lang.selected,
                  });
                  setSelectedText(resultText);
                  console.log("swapped clicked");
                }
              }}
              className={`p-1 sm:p-2 rounded-lg transition-all duration-200 ${
                isLanguageLocked ||
                lang.selected === "" ||
                lang.selected === "auto" ||
                resultText === ""
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
              title={
                isLanguageLocked ||
                lang.selected === "" ||
                lang.selected === "auto" ||
                resultText === ""
                  ? "Can't be swapped"
                  : "Swap languages"
              }
              disabled={isLanguageLocked || lang.selected === ""}
            >
              <IoSwapHorizontal className="w-3 sm:w-4  h-3 sm:h-4" />
            </button>
          </div>

          {/* Language to Translate To */}
          <div className="w-full">
            <div
              className={`relative transition-opacity duration-200 ${
                isLanguageLocked ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <SelectLanguage
                onSelectLanguage={handleTranslateToLang}
                curLang={lang.translateTo}
                fieldId="select-to-lang"
              />
              <small className="absolute bottom-8 sm:bottom-9 text-[11px] sm:text-xs text-slate-400 font-medium px-1">
                To
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
