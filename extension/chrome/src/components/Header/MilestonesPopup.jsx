import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineReload } from "react-icons/ai";
import { IoIosWarning } from "react-icons/io";
import { RiFunctionAddFill } from "react-icons/ri";
import { selectedTextAtom } from "../../../atoms/text.js";
import { translationAtom } from "../../../atoms/translation.js";
import useFetch from "../../hooks/useFetch.js";
import { useMutation } from "../../hooks/useMutation.js";
import {
  extractWordData,
  wordSchemaForClient,
} from "../../utils/processWordData.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

const MilestonesPopup = ({ isVisible, targetRef, onClose }) => {
  const word = useAtomValue(selectedTextAtom);
  const translation = useAtomValue(translationAtom);
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [milestones, setMilestones] = useState({});

  const { mutate, loading: isAppending, error: appendError } = useMutation();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data, loading, error, retry } = useFetch(
    "http://localhost:5000/milestones",
    {
      includeToken: true,
    }
  );

  useEffect(() => {
    if (data?.milestones) {
      const incomplete = data.milestones.filter(
        (milestone) => milestone.targetWords !== milestone.wordsCount
      );
      setMilestones(incomplete);
    } else {
      setMilestones([]);
    }
  }, [data]);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [isVisible, targetRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        targetRef.current &&
        !targetRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, targetRef]);

  if (!isVisible) {
    return null;
  }

  // handle saving word
  const handleSaveWord = async (milestoneId, addedBy) => {
    setSaveSuccess(false);
    const selectedMilestone = milestones.find(
      (milestone) => milestone._id === milestoneId
    );

    const extractDataToSave = extractWordData(translation, word);
    const wordToSave = wordSchemaForClient({
      id: milestoneId,
      addedBy: addedBy,
      learnSynonyms: selectedMilestone.learnSynonyms,
      includeDefinition: selectedMilestone.selectedMilestone,
      ...extractDataToSave,
    });
    try {
      const response = await mutate("http://localhost:5000/words", {
        method: "POST",
        body: wordToSave,
        includeToken: true,
        credentials: "include",
      });

      console.log("Word saved successfully!", response);
      setSaveSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      console.error("Failed to save the word from component.", appendError);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3 p-1.5 sm:p-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="h-4 sm:h-5 w-4 sm:w-5 bg-slate-600 rounded-full"></div>
              <div className="h-3 sm:h-4  w-20 sm:w-28 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-3 sm:p-4 flex flex-col items-center gap-3 text-red-400">
          <IoIosWarning className="w-8 sm:w-10 h-8 sm:h-10" />
          <p className="text-center text-sm">Failed to load milestones.</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-200 px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer"
          >
            <AiOutlineReload className="w-4 sm:w-5 h-4 sm:h-5" />
            Retry
          </button>
        </div>
      );
    }

    return (
      <>
        {milestones.length === 0 ? (
          <div className="space-y-1 p-1">
            <h2 className="w-full px-2.5 sm:px-3 py-2 text-sm text-slate-300">
              No milestone found
            </h2>
            <a
              href="http://localhost:5173/my-space"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full px-2.5 sm:px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors no-underline cursor-pointer"
            >
              <RiFunctionAddFill className="w-4 sm:w-5 h-4 sm:h-5" />{" "}
              <span>Create one</span>
            </a>
          </div>
        ) : isAppending ? (
          <div className="p-2 sm:p-3 flex gap-3 justify-center items-center">
            {" "}
            <LoadingSpinner /> <span>Saving...</span>
          </div>
        ) : appendError ? (
          <div className="flex flex-col gap-3 p-2 sm:p-3">
            <span className="text-red-400 text-base">Failed to save!</span>
            <span className="text-slate-300">{appendError?.body?.message}</span>
          </div>
        ) : saveSuccess ? (
          <p className="p-2.5 sm:p-3 text-green-400 text-base">
            Saved successfully!
          </p>
        ) : (
          <ul
            className="space-y-1 max-h-40 sm:max-h-52 overflow-y-auto p-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500/50 hover:scrollbar-thumb-slate-400/70 scrollbar-thumb-rounded-full"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
            }}
          >
            {milestones.map((milestone, i) => (
              <li key={milestone?._id || i}>
                <button
                  onClick={() =>
                    handleSaveWord(milestone._id, milestone.addedBy)
                  }
                  className="w-full text-left flex items-center gap-3 p-2.5 sm:px-3 py-1.5 sm:py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
                >
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full"></span>
                  {milestone?.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  return createPortal(
    <div
      ref={popupRef}
      style={{
        left: position.left,
        top: position.top,
        transform: "translateX(-50%)",
      }}
      className="absolute bg-slate-800 text-white border border-slate-700 rounded-lg shadow-2xl z-50 w-42 sm:w-56"
      role="dialog"
    >
      <div className="absolute left-1/2 -translate-x-1/2 -top-[7px] h-0 w-0 border-x-[7px] border-x-transparent border-b-[7px] border-b-slate-700" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-[6px] h-0 w-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-slate-800" />
      <div className="p-2.5 sm:p-3 border-b border-slate-700">
        <h3 className="font-semibold text-slate-200">Save to your milestone</h3>
      </div>
      {renderContent()}
    </div>,
    document.body
  );
};

export default MilestonesPopup;
