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

(async () => {
  // In a content script, we must dynamically import modules that are web-accessible.
  const helperModuleSrc = chrome.runtime.getURL("lib/suggest-word-list.js");
  const { createSuggestionPopover } = await import(helperModuleSrc);

  // --- Add CSS for red underline overlay ---
  const style = document.createElement("style");
  style.textContent = `
  .eatword-overlay {
    position: absolute;
    pointer-events: none; /* The main container is not interactive */
    z-index: 9998;
    overflow: hidden; /* Clips the inner content */
    /* These styles are copied from the target element by JS */
  }

  .eatword-overlay > div {
    /* This is the inner scrollable wrapper */
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: transparent !important; /* Hide the mirrored text */
    word-wrap: break-word;
  }
  
  /* This is the span for the highlighted word *inside* the overlay */
  .eatword-misspelled-overlay {
    position: relative; /* Anchor for the custom underline */
    text-decoration: none !important;
    background-color: transparent;
    pointer-events: auto; /* Make the word itself hoverable/clickable for suggestions */
    transition: background-color 0.2s ease-in-out;
  }

  /* The animated custom underline */
  .eatword-misspelled-overlay::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: red;
    bottom: 0px;
    left: 0;
    transform-origin: left;
    transform: scaleX(0);
    animation: eatword-grow-underline 0.3s ease-out forwards;
  }

  /* The red background on hover */
  .eatword-misspelled-overlay:hover {
    background-color: rgba(255, 82, 82, 0.15);
  }

  @keyframes eatword-grow-underline {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
`;
  document.head.appendChild(style);

  // --- State and Initialization ---
  const popover = createSuggestionPopover();
  let activeEditableElement = null;
  let currentMisspelledWordInfo = null;
  let isCheckingSpelling = false;
  let overlayElement = null;
  let misspelledWords = new Map(); // Store misspelled words and their positions

  const handleSuggestionSelect = (selectedWord) => {
    if (!currentMisspelledWordInfo || !activeEditableElement) return;

    const { startPos, endPos } = currentMisspelledWordInfo;

    if (
      activeEditableElement.tagName === "TEXTAREA" ||
      activeEditableElement.tagName === "INPUT"
    ) {
      const currentValue = activeEditableElement.value;
      const newValue =
        currentValue.substring(0, startPos) +
        selectedWord +
        currentValue.substring(endPos);
      activeEditableElement.value = newValue;

      const inputEvent = new Event("input", { bubbles: true });
      activeEditableElement.dispatchEvent(inputEvent);

      const newCursorPos = startPos + selectedWord.length;
      activeEditableElement.focus();
      activeEditableElement.setSelectionRange(newCursorPos, newCursorPos);
    } else if (activeEditableElement.isContentEditable) {
      // Filter to find only the text nodes we are interested in.
      const filter = {
        acceptNode: (node) => {
          if (node.parentElement.closest("pre, code")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      };

      const walker = document.createTreeWalker(
        activeEditableElement,
        NodeFilter.SHOW_TEXT,
        filter
      );
      let charCount = 0;
      let node;
      let found = false;

      // Walk through the text nodes to find the one containing the misspelled word
      while ((node = walker.nextNode()) && !found) {
        const nodeLength = node.textContent.length;

        // Check if the misspelled word starts within this text node
        if (startPos >= charCount && startPos < charCount + nodeLength) {
          const range = document.createRange();
          const localStart = startPos - charCount;
          const localEnd = endPos - charCount;

          // Ensure the word ends in the same node
          if (localEnd <= nodeLength) {
            range.setStart(node, localStart);
            range.setEnd(node, localEnd);

            range.deleteContents();
            const correctedNode = document.createTextNode(selectedWord);
            range.insertNode(correctedNode);

            // Place the cursor right after the newly inserted word
            range.setStartAfter(correctedNode);
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            found = true;
          }
        }
        charCount += nodeLength;
      }

      // Dispatch an input event so frameworks (React, etc.) see the change
      const inputEvent = new InputEvent("input", { bubbles: true });
      activeEditableElement.dispatchEvent(inputEvent);
    }

    popover.hide();
    currentMisspelledWordInfo = null;
    // Re-run the spell check to update the overlay
    setTimeout(() => checkSpellingInElement(activeEditableElement), 100);
  };

  const createOverlay = (element) => {
    if (overlayElement) {
      // Clean up old scroll listener if it exists
      const oldListener = overlayElement.listener;
      if (oldListener && overlayElement.targetElement) {
        overlayElement.targetElement.removeEventListener("scroll", oldListener);
      }
      overlayElement.remove();
    }

    const overlay = document.createElement("div");
    overlay.className = "eatword-overlay";

    const scrollWrapper = document.createElement("div");
    overlay.appendChild(scrollWrapper);

    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    Object.assign(overlay.style, {
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.top + window.scrollY}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    // Copy font and text properties to the inner scroll wrapper to mirror the text
    const relevantStyles = [
      "fontFamily",
      "fontSize",
      "lineHeight",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "letterSpacing",
      "wordSpacing",
      "textAlign",
      "textIndent",
      "whiteSpace",
      "borderWidth",
    ];
    relevantStyles.forEach((style) => {
      scrollWrapper.style[style] = computedStyle[style];
    });

    document.body.appendChild(overlay);
    overlayElement = overlay;

    // --- CRITICAL: Synchronize Scrolling ---
    const syncScroll = () => {
      scrollWrapper.scrollTop = element.scrollTop;
      scrollWrapper.scrollLeft = element.scrollLeft;
    };

    element.addEventListener("scroll", syncScroll);
    overlayElement.listener = syncScroll;
    overlayElement.targetElement = element;

    syncScroll(); // Sync initially
  };

  const updateOverlay = (element, text) => {
    if (!overlayElement) return;

    const scrollWrapper = overlayElement.firstChild;
    if (!scrollWrapper) return;

    let highlightedHTML = "";
    let lastIndex = 0;

    const sortedWords = Array.from(misspelledWords.values()).sort(
      (a, b) => a.startPos - b.startPos
    );

    sortedWords.forEach(({ word, startPos, endPos }) => {
      // Sanitize text by creating text nodes to prevent HTML injection
      highlightedHTML += document.createTextNode(
        text.substring(lastIndex, startPos)
      ).textContent;
      const misspelledText = document.createTextNode(
        text.substring(startPos, endPos)
      ).textContent;

      highlightedHTML += `<span class="eatword-misspelled-overlay" data-word="${word}" data-start="${startPos}" data-end="${endPos}">${misspelledText}</span>`;
      lastIndex = endPos;
    });

    highlightedHTML += document.createTextNode(
      text.substring(lastIndex)
    ).textContent;

    // Use innerHTML, converting newlines to <br> for proper rendering
    scrollWrapper.innerHTML = highlightedHTML.replace(/\n/g, "<br>");
  };

  const checkSpellingInElement = (element) => {
    if (isCheckingSpelling || !element) return;

    isCheckingSpelling = true;
    misspelledWords.clear();

    // Use innerText for contentEditable to get a clean text representation
    const textContent = element.isContentEditable
      ? element.innerText
      : element.value;

    createOverlay(element);

    if (!textContent.trim()) {
      if (overlayElement) overlayElement.firstChild.innerHTML = "";
      isCheckingSpelling = false;
      return;
    }

    const wordRegex = /\b[a-zA-Z']+\b/g;
    let match;
    const wordsToCheck = new Map();

    while ((match = wordRegex.exec(textContent)) !== null) {
      const word = match[0];
      // Skip single letters or non-words
      if (!/^[a-zA-Z']{2,}$/.test(word)) continue;
      const startPos = match.index;
      const endPos = startPos + word.length;
      if (!wordsToCheck.has(word)) wordsToCheck.set(word, []);
      wordsToCheck.get(word).push({ startPos, endPos });
    }

    if (wordsToCheck.size === 0) {
      // Call with empty misspelled map to clear old highlights
      updateOverlay(element, textContent);
      isCheckingSpelling = false;
      return;
    }

    let checkedWords = 0;
    const totalWords = wordsToCheck.size;

    wordsToCheck.forEach((positions, word) => {
      chrome.runtime.sendMessage({ type: "check-word", word }, (response) => {
        checkedWords++;
        if (!chrome.runtime.lastError && response && !response.isCorrect) {
          positions.forEach((pos) => {
            misspelledWords.set(`${word}_${pos.startPos}`, { word, ...pos });
          });
        }

        if (checkedWords === totalWords) {
          updateOverlay(element, textContent);
          isCheckingSpelling = false;
        }
      });
    });
  };

  document.addEventListener("focusin", (e) => {
    // e.stopPropagation();
    if (
      e.target.isContentEditable ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "INPUT"
    ) {
      activeEditableElement = e.target;
      setTimeout(() => checkSpellingInElement(activeEditableElement), 100);
    }
  });

  let inputTimeout;
  document.addEventListener("input", (e) => {
    // e.stopPropagation();
    if (e.target === activeEditableElement) {
      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(() => {
        checkSpellingInElement(activeEditableElement);
      }, 1000);
    }
  });

  document.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("eatword-misspelled-overlay")) {
      const word = e.target.dataset.word;
      const startPos = parseInt(e.target.dataset.start);
      const endPos = parseInt(e.target.dataset.end);
      const rect = e.target.getBoundingClientRect();

      // Store the word and its position. The `.element` property is no longer needed.
      currentMisspelledWordInfo = { word, startPos, endPos };

      chrome.runtime.sendMessage(
        { type: "get-suggestions", word },
        (response) => {
          console.log("suggestion res: ", response);
          if (chrome.runtime.lastError) return;
          if (
            response &&
            response.suggestions &&
            response.suggestions.length > 0
          ) {
            popover.show(
              window.scrollY + rect.bottom + 2,
              window.scrollX + rect.left,
              response.suggestions,
              handleSuggestionSelect,
              word
            );
          }
        }
      );
    }
  });

  document.addEventListener("mouseout", (e) => {
    let isMisspelled =
      e.target.classList.contains("eatword-misspelled") ||
      e.target.classList.contains("eatword-misspelled-overlay");
    let isPopover = e.target.closest("[data-popover-id]");

    if (isMisspelled || isPopover) {
      setTimeout(() => {
        const stillHoveringWord = document.querySelector(
          ".eatword-misspelled:hover, .eatword-misspelled-overlay:hover"
        );
        const stillHoveringPopover = document.querySelector(
          "[data-popover-id]:hover"
        );

        if (!stillHoveringWord && !stillHoveringPopover) {
          popover.hide();
          currentMisspelledWordInfo = null;
        }
      }, 100);
    }
  });

  document.addEventListener("click", (e) => {
    // Hide popover if clicking anywhere but the popover itself
    if (!e.target.closest("[data-popover-id]")) {
      popover.hide();
    }
  });

  document.addEventListener("focusout", (e) => {
    if (e.target === activeEditableElement) {
      setTimeout(() => {
        // Check if focus has moved to the popover or elsewhere
        const isFocusInsidePopover = document.querySelector(
          "[data-popover-id]:focus-within"
        );
        if (
          overlayElement &&
          !activeEditableElement.matches(":focus") &&
          !isFocusInsidePopover
        ) {
          overlayElement.remove();
          overlayElement = null;
        }
      }, 100);
    }
  });

  const repositionOverlay = () => {
    if (overlayElement && activeEditableElement) {
      const rect = activeEditableElement.getBoundingClientRect();
      overlayElement.style.left = `${rect.left + window.scrollX}px`;
      overlayElement.style.top = `${rect.top + window.scrollY}px`;
    }
  };

  window.addEventListener("resize", repositionOverlay);
  window.addEventListener("scroll", repositionOverlay, true); // Use capture for better response

})();
