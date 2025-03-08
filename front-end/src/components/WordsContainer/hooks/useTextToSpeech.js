import { useState } from "react";
import useNotification from "../../../hooks/useNotification";

export const useTextToSpeech = () => {
  // state for text to speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utteranceRate, setUtteranceRate] = useState(0.5);
  const showNotification = useNotification();

  const speckText = (text) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const newRate = utteranceRate === 1 ? 0.5 : 1;
      setUtteranceRate(newRate);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = newRate;
      utterance.pitch = 1;

      // event listener for error
      utterance.onerror = (e) => {
        switch (e.error) {
          case "language-not-supported":
            showNotification({
              title: "Unsupported Langue",
              message: "The selected language is not supported",
              iconType: "error",
              duration: 3000,
            });
            break;
          case "language-unavailable":
            showNotification({
              title: "Langue unavailable",
              message: "The selected language is unavailable",
              iconType: "error",
              duration: 3000,
            });
            break;
          default:
            showNotification({
              title: "Failed to recite",
              message: "An error occurred while trying to speak this text.",
              iconType: "error",
              duration: 3000,
            });
        }
        setIsSpeaking(false);
      };
      // start speaking
      window.speechSynthesis.speak(utterance);
      // when speech ends
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      showNotification({
        title: "Failed to recite",
        message: "Your browser does not support text-to-speech.",
        iconType: "error",
        duration: 3000,
      });
    }
  };

  return {
    speckText,
    isSpeaking,
  };
};
