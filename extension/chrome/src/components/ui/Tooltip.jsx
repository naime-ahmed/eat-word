import { createPortal } from "react-dom";

const Tooltip = ({ message, position, type = "success", isVisible }) => {
  if (!isVisible || !position.top) {
    return null;
  }

  // Base classes for the tooltip
  const baseClasses =
    "absolute whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all duration-200 ease-out";

  // Conditional classes based on the 'type' prop
  const typeClasses = {
    success: "bg-gray-800 text-white border border-gray-700",
    error: "bg-red-800/95 text-white border border-red-600/50",
  };

  // Classes for visibility and animation
  const visibilityClasses = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-2 pointer-events-none";

  return createPortal(
    <div
      style={{ left: position.left, top: position.top }}
      className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses} z-[9999]`}
      role="tooltip"
    >
      {message}
      {/* Arrow pointing upwards */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[6px] h-0 w-0 border-x-[6px] border-x-transparent"
        style={{
          borderBottom: `6px solid ${
            type === "error" ? "rgb(153 27 27 / 0.95)" : "#1f2937"
          }`,
        }}
      />
    </div>,
    document.body
  );
};

export default Tooltip;
