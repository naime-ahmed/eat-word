import { useRef, useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import Tooltip from "./ui/Tooltip";

const CopyToClip = ({ text, className = "" }) => {
  const [tooltip, setTooltip] = useState({
    isVisible: false,
    message: "",
    position: {},
    type: "success",
  });
  const buttonRef = useRef(null);

  const showFeedbackTooltip = (message, type) => {
    if (!buttonRef.current) return;

    const btnRect = buttonRef.current.getBoundingClientRect();
    const tooltipElement = document.createElement("div");
    tooltipElement.innerText = message;
    // Temporarily apply some styles to measure width accurately
    Object.assign(tooltipElement.style, {
      position: "absolute",
      visibility: "hidden",
      fontFamily: "sans-serif",
      fontSize: "14px",
      fontWeight: "500",
      whiteSpace: "nowrap",
      padding: "8px 12px",
    });
    document.body.appendChild(tooltipElement);
    const tooltipWidth = tooltipElement.offsetWidth;
    document.body.removeChild(tooltipElement);

    // Position tooltip BELOW the button
    const position = {
      top: btnRect.bottom + window.scrollY + 8, // 8px gap
      left:
        btnRect.left + window.scrollX + btnRect.width / 2 - tooltipWidth / 2,
    };

    setTooltip({ isVisible: true, message, position, type });

    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  const handleCopySuccess = () => showFeedbackTooltip("Copied!", "success");
  const handleCopyError = () => showFeedbackTooltip("Failed to copy", "error");

  const { copied, copy } = useCopyToClipboard({
    onCopy: handleCopySuccess,
    onError: handleCopyError,
    timeout: 2100,
  });

  const handleButtonClick = (e) => {
    e.preventDefault();
    copy(text);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${className}`}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        disabled={copied}
      >
        {copied ? (
          <BsCheck2All className="w-4 h-4 text-green-400" />
        ) : (
          <IoCopyOutline className="w-4 h-4" title="copy to clipboard" />
        )}
      </button>

      <Tooltip
        isVisible={tooltip.isVisible}
        message={tooltip.message}
        position={tooltip.position}
        type={tooltip.type}
      />
    </>
  );
};

export default CopyToClip;
