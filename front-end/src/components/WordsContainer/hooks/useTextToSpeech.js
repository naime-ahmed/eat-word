import { useState } from "react";

export const useTextToSpeech = () => {
  // state for text to speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utteranceRate, setUtteranceRate] = useState(0.5);
  const [speechError, setSpeechError] = useState(null);
  const [notifySpeechError, setNotifySpeechError] = useState(false);

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
        setNotifySpeechError(true);
        switch (e.error) {
          case "language-not-supported":
            setSpeechError("The selected language is not supported");
            break;
          case "language-unavailable":
            setSpeechError("The selected language is unavailable");
            break;
          default:
            setSpeechError(
              "An error occurred while trying to speak this text."
            );
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
      setNotifySpeechError(true);
      setSpeechError("Your browser does not support text-to-speech.");
    }
  };

  return { speckText, isSpeaking, speechError, notifySpeechError, setNotifySpeechError };
};
