let selectedText = "";
let floatingIcon = null;
let popupPanel = null;
let tooltip = null;
let fadeTimeout = null;
let selectionTimeout = null;

// Track popup state
let popupIframe = null;
let isPopupPinned = false;
let popupPosition = { x: 0, y: 0 };
let pinnedViewportPosition = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };
let isDragging = false;

function createFloatingIcon(x, y) {
  removeFloatingIcon();
  clearTimeout(fadeTimeout);

  const icon = document.createElement("div");
  icon.id = "eatword-floating-icon";

  const img = document.createElement("img");
  try {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.getURL
    ) {
      img.src = chrome.runtime.getURL("icon-48.png");
    } else {
      icon.innerHTML = "🟡";
      img.style.display = "none";
    }
  } catch (error) {
    icon.innerHTML = "🟡";
    img.style.display = "none";
  }
  img.alt = "EatWord";
  img.style.width = "24px";
  img.style.height = "24px";
  img.style.display = "block";

  Object.assign(icon.style, {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    cursor: "pointer",
    zIndex: "2147483646",
    backgroundColor: "#020817",
    borderRadius: "12px",
    padding: "6px",
    boxShadow: "0 8px 32px rgba(2, 8, 23, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    transform: "scale(0.8)",
    opacity: "0",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "auto",
    fontSize: "20px",
    textAlign: "center",
    lineHeight: "32px",
  });

  if (img.src && img.src !== window.location.href) {
    icon.appendChild(img);
  }

  icon.addEventListener("mouseenter", () => {
    clearTimeout(fadeTimeout);
    icon.style.transform = "scale(1.1)";
    icon.style.backgroundColor = "#1e293b";
    if (window.innerWidth > 600) {
      showTooltip(icon);
    }
  });

  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1)";
    icon.style.backgroundColor = "#020817";
    hideTooltip();
    startFadeTimer();
  });

  icon.addEventListener("click", (e) => {
    e.stopPropagation();
    hideTooltip();
    const iconRect = icon.getBoundingClientRect();
    createPopupPanel(
      iconRect.left + window.scrollX,
      iconRect.top + window.scrollY,
      selectedText
    );

    icon.style.transform = "scale(0.9)";
    setTimeout(() => {
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.sendMessage
      ) {
        chrome.runtime.sendMessage({
          type: "OPEN_POPUP",
          text: selectedText,
          position: {
            x: iconRect.left + window.scrollX,
            y: iconRect.top + window.scrollY,
          },
        });
      }
      removeFloatingIcon();
    }, 100);
  });

  document.body.appendChild(icon);

  let currentIcon = icon;
  requestAnimationFrame(() => {
    if (document.body.contains(currentIcon)) {
      currentIcon.style.transform = "scale(1)";
      currentIcon.style.opacity = "1";
    }
  });

  floatingIcon = icon;
  startFadeTimer();
}

function createPopupPanel(x, y, text) {
  removePopupPanel();

  popupPanel = document.createElement("div");
  popupPanel.id = "eatword-popup-panel";

  const iframe = document.createElement("iframe");
  iframe.id = "eatword-popup-iframe";

  iframe.src = chrome.runtime.getURL(
    `index.html?text=${encodeURIComponent(text)}`
  );
  popupIframe = iframe;

  const panelWidth = 512;
  const maxWidth = Math.min(window.innerWidth - 32, panelWidth);
  const maxHeight = Math.min(window.innerHeight - 32, 400);
  const isMobile = window.innerWidth < 600;

  // Calculate initial position based on device type
  let initialX, initialY;

  if (isMobile) {
    // For mobile, center it horizontally in the viewport.
    initialX = (window.innerWidth - maxWidth) / 2;
    initialY = window.scrollY + window.innerHeight * 0.4 - maxHeight / 2;
  } else {
    // For desktop, use the coordinates from the text selection.
    initialX = x;
    initialY = y;
  }
  popupPosition = { x: initialX, y: initialY };

  Object.assign(popupPanel.style, {
    position: "absolute",
    left: `${popupPosition.x}px`,
    top: `${popupPosition.y}px`,
    width: `${panelWidth}px`,
    height: `150px`,
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`,
    zIndex: "2147483646",
    background: "#0F182C",
    boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
    overflow: "hidden",
    transform: "scale(0.95)",
    opacity: "0",
    transition:
      "transform 0.2s ease-out, opacity 0.2s ease-out, height 0.2s ease-in-out",
    visibility: "hidden",
    cursor: "move",
  });

  Object.assign(iframe.style, {
    width: "100%",
    height: "100%",
    border: "none",
    pointerEvents: "auto",
  });

  const dragHandle = document.createElement("div");
  Object.assign(dragHandle.style, {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    height: "26px",
    backgroundColor: "transparent",
    cursor: "move",
    zIndex: "2147483647",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  });

  popupPanel.appendChild(dragHandle);
  popupPanel.appendChild(iframe);
  document.body.appendChild(popupPanel);

  dragHandle.addEventListener("mousedown", startDrag);

  iframe.onload = () => {
    window.addEventListener("message", handleIframeMessage);

    setTimeout(() => {
      adjustPopupPosition();
      popupPanel.style.visibility = "visible";
      requestAnimationFrame(() => {
        popupPanel.style.transform = "scale(1)";
        popupPanel.style.opacity = "1";
      });
    }, 50);
  };

  window.addEventListener("scroll", handleScroll);
}

function adjustPopupPosition() {
  if (!popupPanel) return;

  const rect = popupPanel.getBoundingClientRect();
  const adjustedPosition = getAdjustedPosition(
    popupPosition.x,
    popupPosition.y,
    rect.width,
    rect.height
  );

  popupPanel.style.left = `${adjustedPosition.x}px`;
  popupPanel.style.top = `${adjustedPosition.y}px`;
  popupPosition = adjustedPosition;
}

function getAdjustedPosition(x, y, width, height) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let adjustedX = x;
  let adjustedY = y;

  if (x + width > viewportWidth + scrollX) {
    adjustedX = viewportWidth + scrollX - width - 50;
  }
  if (adjustedX < scrollX) {
    adjustedX = scrollX + 10;
  }

  if (y + height > viewportHeight + scrollY) {
    adjustedY = y - height - 10;
  }
  if (adjustedY < scrollY) {
    adjustedY = scrollY + 10;
  }

  return { x: adjustedX, y: adjustedY };
}

function startDrag(e) {
  isDragging = true;
  const rect = popupPanel.getBoundingClientRect();

  // Calculate offset from mouse to popup corner
  dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  // Change cursor and add move/end listeners
  document.body.style.cursor = "grabbing";
  popupPanel.style.cursor = "grabbing";
  popupPanel.style.boxShadow = "0px 15px 50px rgba(0, 0, 0, 0.3)";

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!isDragging) return;

  // Calculate new position
  const x = e.clientX - dragOffset.x + window.scrollX;
  const y = e.clientY - dragOffset.y + window.scrollY;

  // Update popup position
  popupPanel.style.left = `${x}px`;
  popupPanel.style.top = `${y}px`;
  popupPosition = { x, y };

  // Update pinned position if pinned
  if (isPopupPinned) {
    const rect = popupPanel.getBoundingClientRect();
    pinnedViewportPosition = {
      x: rect.left,
      y: rect.top,
    };
  }
}

function stopDrag() {
  isDragging = false;

  // Reset cursor and remove listeners
  document.body.style.cursor = "";
  popupPanel.style.cursor = "move";
  popupPanel.style.boxShadow = "0px 10px 40px rgba(0, 0, 0, 0.2)";

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

function handleScroll() {
  if (!popupPanel) return;

  if (isPopupPinned) {
    popupPanel.style.left = `${pinnedViewportPosition.x + window.scrollX}px`;
    popupPanel.style.top = `${pinnedViewportPosition.y + window.scrollY}px`;
  }
}

// create the message handler function outside.
function handleIframeMessage(event) {
  if (
    !popupIframe ||
    !popupIframe.contentWindow ||
    event.source !== popupIframe.contentWindow
  ) {
    return;
  }

  // toggle pin
  if (event.data.type === "SET_PIN_STATE") {
    setPinnedState(event.data.pinned);
  }

  // Check for our custom resize message type
  if (event.data && event.data.type === "resize-eatword-panel") {
    const contentHeight = event.data.height;

    // This is the maximum height the panel is allowed to have.
    const maxHeight = Math.min(window.innerHeight - 32, 400);

    const newHeight = Math.min(contentHeight, maxHeight);

    if (popupPanel) {
      popupPanel.style.height = `${newHeight}px`;
    }
  }
}

function setPinnedState(pinned) {
  isPopupPinned = pinned;

  if (isPopupPinned && popupPanel) {
    // Store current viewport-relative position
    const rect = popupPanel.getBoundingClientRect();
    pinnedViewportPosition = {
      x: rect.left,
      y: rect.top,
    };

    // Immediately update position to account for current scroll
    popupPanel.style.left = `${pinnedViewportPosition.x + window.scrollX}px`;
    popupPanel.style.top = `${pinnedViewportPosition.y + window.scrollY}px`;
  }
}

function showTooltip(iconElement) {
  hideTooltip();

  tooltip = document.createElement("div");
  tooltip.id = "eatword-tooltip";
  tooltip.innerHTML = "Translate with Eat Word";

  const arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";

  Object.assign(tooltip.style, {
    position: "absolute",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    whiteSpace: "nowrap",
    zIndex: "2147483647",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    opacity: "0",
    transform: "translateY(-5px)",
    transition: "all 0.2s ease-out",
    pointerEvents: "none",
  });

  Object.assign(arrow.style, {
    position: "absolute",
    width: "0",
    height: "0",
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #1f2937",
    bottom: "-6px",
    left: "50%",
    transform: "translateX(-50%)",
  });

  tooltip.appendChild(arrow);
  document.body.appendChild(tooltip);

  const iconRect = iconElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  const tooltipX =
    iconRect.left + window.scrollX + iconRect.width / 2 - tooltipRect.width / 2;
  const tooltipY = iconRect.top + window.scrollY - tooltipRect.height - 10;

  tooltip.style.left = `${tooltipX}px`;
  tooltip.style.top = `${tooltipY}px`;

  requestAnimationFrame(() => {
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";
  });
}

function hideTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

function startFadeTimer() {
  clearTimeout(fadeTimeout);
  fadeTimeout = setTimeout(() => {
    removeFloatingIcon();
  }, 3000);
}

function removeFloatingIcon() {
  if (floatingIcon && document.body.contains(floatingIcon)) {
    floatingIcon.remove();
  }
  floatingIcon = null;
  hideTooltip();
  clearTimeout(fadeTimeout);
}

function removePopupPanel() {
  if (popupPanel) {
    // Clean up event listeners
    window.removeEventListener("message", handleIframeMessage);
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);

    popupPanel.remove();
    popupPanel = null;
  }
}

function getRandomizedPosition(mouseX, mouseY) {
  const radius = 35;
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radius;

  // Calculate initial position around the mouse in page coordinates
  const initialPageX = mouseX + Math.cos(angle) * distance;
  const initialPageY = mouseY + Math.sin(angle) * distance;

  // Convert to viewport coordinates for boundary checking
  const initialViewportX = initialPageX - window.scrollX;
  const initialViewportY = initialPageY - window.scrollY;

  // Define the safe viewport area with a 90px margin
  const marginX = 126;
  const marginY = 60;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Define the boundaries of the safe area relative to the viewport
  const minX = marginX;
  const maxX = viewportWidth - marginX;
  const minY = marginY;
  const maxY = viewportHeight - marginY;

  // Clamp the viewport coordinates to stay within the safe area
  const clampedViewportX = Math.max(minX, Math.min(initialViewportX, maxX));
  const clampedViewportY = Math.max(minY, Math.min(initialViewportY, maxY));

  // Convert clamped viewport coordinates back to page coordinates
  const finalX = clampedViewportX + window.scrollX;
  const finalY = clampedViewportY + window.scrollY;

  return { x: finalX, y: finalY };
}

function handleTextSelection(mouseX, mouseY) {
  clearTimeout(selectionTimeout);

  selectionTimeout = setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0 && text.length <= 1000) {
      selectedText = text;
      const randomPos = getRandomizedPosition(mouseX, mouseY);
      createFloatingIcon(randomPos.x, randomPos.y);
    } else {
      removeFloatingIcon();
    }
  }, 50);
}

document.addEventListener("mouseup", (e) => {
  if (
    e.target.closest("#eatword-floating-icon") ||
    e.target.closest("#eatword-popup-panel")
  ) {
    return;
  }
  removePopupPanel();
  handleTextSelection(e.clientX + window.scrollX, e.clientY + window.scrollY);
});

document.addEventListener("mousedown", (e) => {
  setTimeout(() => {
    if (
      !e.target.closest("#eatword-floating-icon") &&
      !e.target.closest("#eatword-popup-panel")
    ) {
      removeFloatingIcon();
      removePopupPanel();
    }
  }, 100);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    removePopupPanel();
    removeFloatingIcon();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_INPAGE_POPUP") {
    const { text, position } = message;
    selectedText = text;
    createPopupPanel(position.x, position.y, text);
    sendResponse({ status: "success" });
  }
  return true;
});
