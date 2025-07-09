import { useEffect, useRef, useState } from "react";
import { PiSpeakerHigh, PiSpeakerNone } from "react-icons/pi";
import { useSpeech } from "react-text-to-speech";
/*
react-text-to-speech:
https://rtts.vercel.app/

*/
const SpeakerIcon = ({ text, classes }) => {
  const [speechError, setSpeechError] = useState("");
  const speechTimeoutRef = useRef(null);
  const [clickCount, setClickCount] = useState(true);
  console.log("speech error: ", speechError);
  const { speechStatus, isInQueue, start, pause, stop, queue } = useSpeech({
    text: text,
    onError: (error) => {
      setSpeechError(error.message || "failed to speak");
      // Clear timeout on error
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
    },
    onStop: (event) => {
      console.log("Speech Stopped:", event);
      // Clear timeout when speech stops
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
    },
    onPause: (event) => {
      console.log("Speech Paused:", event);
    },
    onQueueChange: (queue) => {
      console.log("Queue updated:", queue);
    },
  });
  console.log("is speech in q: ", isInQueue);
  console.log("speech status: ", speechStatus);

  // Calculate speech duration based on text length and complexity
  const calculateSpeechDuration = (text) => {
    if (!text || text.trim().length === 0) return 0;

    const cleanText = text.trim();
    const wordCount = cleanText.split(/\s+/).length;
    const charCount = cleanText.length;

    let duration;

    if (wordCount === 1) {
      // Single word: 100ms per character + base 400ms (includes startup delay)
      duration = Math.max(1000, charCount * 100 + 400);
    } else if (wordCount <= 5) {
      // Short phrases: 80ms per character + 200ms per word + 300ms base
      duration = Math.max(1500, charCount * 80 + wordCount * 200 + 300);
    } else {
      // Longer text: More efficient rate
      // Base calculation: 60ms per character + 150ms per word + 500ms base
      duration = Math.max(2000, charCount * 60 + wordCount * 150 + 500);
    }

    // Add extra time for punctuation (natural pauses)
    const punctuationCount = (cleanText.match(/[.!?,:;]/g) || []).length;
    duration += punctuationCount * 300; // 300ms pause per punctuation

    // Add startup delay for first click (browsers need time to initialize)
    if (clickCount === 2) {
      duration += 800; // Extra 800ms for first speech initialization
    }

    // Cap the maximum duration (30 seconds should be plenty for 1000 chars)
    return Math.min(duration, 30000);
  };

  // Auto-stop speech after calculated duration
  useEffect(() => {
    if (speechStatus === "started" && text) {
      const duration = calculateSpeechDuration(text);
      console.log(
        `Speech duration calculated: ${duration}ms for text: "${text}"`
      );

      // Clear any existing timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      // Set new timeout to stop speech
      speechTimeoutRef.current = setTimeout(() => {
        console.log("Auto-stopping speech after calculated duration");
        stop();
        speechTimeoutRef.current = null;
      }, duration);
    }

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechStatus, text, stop]);

  const handleSpeakClick = async () => {
    setSpeechError("");
    setClickCount((prev) => prev + 1);

    if (isInQueue || speechStatus === "started") {
      stop();
      // Clear the timeout since we're manually stopping
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
    } else {
      if (clickCount === 1) {
        try {
          // Create a small test utterance to "unlock" speech synthesis
          const testUtterance = new SpeechSynthesisUtterance(" ");
          testUtterance.volume = 0; // Silent
          testUtterance.rate = 10; // Very fast
          window.speechSynthesis.speak(testUtterance);

          // Small delay to ensure the test utterance processes
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.log("Test utterance failed:", error);
        }
      }
      // Start the speech
      start();
    }
  };

  // Determine button state and icon
  const isPlaying = speechStatus === "started";
  const buttonAriaLabel = isPlaying ? "Stop speaking" : "Speak text";
  const buttonTitle = isPlaying ? "Click to stop" : "Click to hear";

  return (
    <button
      className={`p-1 sm:p-2 w-8 sm:w-[38px] h-8 sm:h-[38px] flex items-center justify-center border border-slate-700 rounded-md hover:bg-slate-600/30 transition-colors relative ${classes}`}
      onClick={handleSpeakClick}
      aria-label={buttonAriaLabel}
      title={buttonTitle}
      disabled={!text || text.trim().length === 0}
    >
      {isPlaying ? (
        <PiSpeakerHigh className="text-lg sm:text-xl" />
      ) : (
        <PiSpeakerNone className="text-lg sm:text-xl" />
      )}
    </button>
  );
};

export default SpeakerIcon;
