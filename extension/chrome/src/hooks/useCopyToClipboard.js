import { useCallback, useEffect, useRef, useState } from "react";

export const useCopyToClipboard = ({ timeout = 2000, onCopy, onError } = {}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = useCallback(async (text) => {
    if (typeof text !== 'string' && typeof text !== 'number') {
        const error = new Error(`Cannot copy text of type ${typeof text}.`);
        console.error(error);
        if (onError) onError(error);
        return;
    }

    const textToCopy = String(text);

    try {
      // Modern clipboard API
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopy) onCopy(textToCopy);
    } catch (err) {
      // Fallback for older browsers
      let successful = false;
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.select();
        successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          if (onCopy) onCopy(textToCopy);
        } else {
            throw new Error("Copy command was unsuccessful.");
        }
      } catch (fallbackErr) {
        console.error("Clipboard copy failed: ", fallbackErr);
        if (onError) onError(fallbackErr);
      }
    }
  }, [onCopy, onError]);

  useEffect(() => {
    if (copied) {
      // Clear previous timeout if a new copy is made
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, timeout);
    }
  }, [copied, timeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy: handleCopy };
};