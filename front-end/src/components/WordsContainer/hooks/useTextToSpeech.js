import { useEffect, useRef, useState } from "react";
import useNotification from "../../../hooks/useNotification";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utteranceRate, setUtteranceRate] = useState(0.5);
  const voicesRef = useRef([]);
  const showNotification = useNotification();

  // Load voices immediately and keep in ref
  useEffect(() => {
    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis?.getVoices() || [];
    };
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  const getBestVoice = (lang = 'en-US') => {
    const voices = voicesRef.current;
    return voices.find(v => v.lang === lang) || 
           voices.find(v => v.lang.startsWith('en')) || 
           null;
  };

  const speckText = async (text) => {
    if (!('speechSynthesis' in window)) {
      showNotification({
        title: "Feature Not Supported",
        message: "Your browser does not support text-to-speech.",
        iconType: "error",
        duration: 3000,
      });
      return;
    }

    // Cancel immediately if speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      const synth = window.speechSynthesis;
      const newRate = utteranceRate === 1 ? 0.5 : 1;
      
      if (voicesRef.current.length === 0) {
        voicesRef.current = synth.getVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.voice = getBestVoice();
      utterance.rate = newRate;
      utterance.pitch = 1;

      // Use promise to handle async flow
      await new Promise((resolve, reject) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = (e) => {
          setIsSpeaking(false);
          reject(e);
        };

        synth.speak(utterance);
        setIsSpeaking(true);
      });
      
      setUtteranceRate(newRate);
    } catch (e) {
      handleSpeechError(e);
      // Fallback to cloud-based TTS here later
    }
  };

  const handleSpeechError = (e) => {    
    let title = "Speech Error";
    let message = "An error occurred while trying to speak this text.";
    if (e.error === 'synthesis-failed') {
      message = "Speech synthesis failed. Please try again or check browser support.";
    }else if (e.error === "interrupted") {
      title = "Speech Interrupted!";
      message = "Please let the current speech finish before starting a new one";
    }
     else if (voicesRef.current.length === 0) {
      message = "No voices available for text-to-speech.";
    }

    showNotification({
      title,
      message,
      iconType: "error",
      duration: 4000,
    });
  };

  return { speckText, isSpeaking };
};