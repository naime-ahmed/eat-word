let selectedText = '';
let floatingIcon = null;
let popupPanel = null;
let tooltip = null;
let fadeTimeout = null;
let selectionTimeout = null;

function createFloatingIcon(x, y) {
  removeFloatingIcon();
  clearTimeout(fadeTimeout);

  const icon = document.createElement("div");
  icon.id = "eatword-floating-icon";

  const img = document.createElement("img");
  try {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
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
    showTooltip(icon);
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
    createPopupPanel(iconRect.left + window.scrollX, iconRect.top + window.scrollY, selectedText);

    icon.style.transform = "scale(0.9)";
    setTimeout(() => {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: "OPEN_POPUP",
          text: selectedText,
          position: { x: iconRect.left + window.scrollX, y: iconRect.top + window.scrollY },
        });
      }
      removeFloatingIcon();
    }, 100);
  });

  document.body.appendChild(icon);
  floatingIcon = icon;

  requestAnimationFrame(() => {
    floatingIcon.style.transform = "scale(1)";
    floatingIcon.style.opacity = "1";
  });

  startFadeTimer();
}

function createPopupPanel(x, y, text) {
  removePopupPanel();
  
  popupPanel = document.createElement('div');
  popupPanel.id = 'eatword-popup-panel';
  
  const iframe = document.createElement('iframe');
  iframe.id = 'eatword-popup-iframe';
  
  iframe.src = chrome.runtime.getURL(`index.html?text=${encodeURIComponent(text)}`);
  
  const panelWidth = 512;
  const panelHeight = 256;
  const maxWidth = Math.min(window.innerWidth - 32, panelWidth);
  const maxHeight = Math.min(window.innerHeight - 32, panelHeight);
  
  Object.assign(popupPanel.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${panelWidth}px`,
    height: `${panelHeight}px`,
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`,
    zIndex: '2147483647',
    background: 'transparent',
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    transform: 'scale(0.95)',
    opacity: '0',
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
    visibility: 'hidden'
  });
  
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: 'none'
  });
  
  popupPanel.appendChild(iframe);
  document.body.appendChild(popupPanel);
  
  // Wait for iframe to load and get actual dimensions
  iframe.onload = () => {
    setTimeout(() => {
      const rect = popupPanel.getBoundingClientRect();
      const adjustedPosition = getAdjustedPosition(x, y, rect.width, rect.height);
      
      popupPanel.style.left = `${adjustedPosition.x}px`;
      popupPanel.style.top = `${adjustedPosition.y}px`;
      popupPanel.style.visibility = 'visible';
      
      requestAnimationFrame(() => {
        popupPanel.style.transform = 'scale(1)';
        popupPanel.style.opacity = '1';
      });
    }, 50);
  };
  
  // Fallback in case iframe doesn't load
  setTimeout(() => {
    if (popupPanel && popupPanel.style.visibility === 'hidden') {
      const rect = popupPanel.getBoundingClientRect();
      const adjustedPosition = getAdjustedPosition(x, y, rect.width || maxWidth, rect.height || maxHeight);
      
      popupPanel.style.left = `${adjustedPosition.x}px`;
      popupPanel.style.top = `${adjustedPosition.y}px`;
      popupPanel.style.visibility = 'visible';
      
      requestAnimationFrame(() => {
        popupPanel.style.transform = 'scale(1)';
        popupPanel.style.opacity = '1';
      });
    }
  }, 200);
}

function getAdjustedPosition(x, y, width, height) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  
  let adjustedX = x;
  let adjustedY = y;
  
  if (x + width > viewportWidth + scrollX) {
    adjustedX = viewportWidth + scrollX - width - 10;
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

function showTooltip(iconElement) {
  hideTooltip();
  
  tooltip = document.createElement('div');
  tooltip.id = 'eatword-tooltip';
  tooltip.innerHTML = 'Translate with Eat Word';
  
  const arrow = document.createElement('div');
  arrow.className = 'tooltip-arrow';
  
  Object.assign(tooltip.style, {
    position: 'absolute',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    zIndex: '2147483648',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    opacity: '0',
    transform: 'translateY(-5px)',
    transition: 'all 0.2s ease-out',
    pointerEvents: 'none'
  });
  
  Object.assign(arrow.style, {
    position: 'absolute',
    width: '0',
    height: '0',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #1f2937',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)'
  });
  
  tooltip.appendChild(arrow);
  document.body.appendChild(tooltip);
  
  const iconRect = iconElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  const tooltipX = iconRect.left + window.scrollX + (iconRect.width / 2) - (tooltipRect.width / 2);
  const tooltipY = iconRect.top + window.scrollY - tooltipRect.height - 10;
  
  tooltip.style.left = `${tooltipX}px`;
  tooltip.style.top = `${tooltipY}px`;
  
  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
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
  if (floatingIcon) {
    floatingIcon.remove();
    floatingIcon = null;
  }
  hideTooltip();
  clearTimeout(fadeTimeout);
}

function removePopupPanel() {
  if (popupPanel) {
    popupPanel.remove();
    popupPanel = null;
  }
}

function getRandomizedPosition(mouseX, mouseY) {
  const radius = 35; // 70px diameter = 35px radius
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radius;
  
  const x = mouseX + Math.cos(angle) * distance;
  const y = mouseY + Math.sin(angle) * distance;
  
  return { x, y };
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

document.addEventListener('mouseup', (e) => {
  if (e.target.closest('#eatword-floating-icon') || e.target.closest('#eatword-popup-panel')) {
    return;
  }
  removePopupPanel();
  handleTextSelection(e.clientX + window.scrollX, e.clientY + window.scrollY);
});

document.addEventListener('mousedown', (e) => {
  setTimeout(() => {
    if (!e.target.closest('#eatword-floating-icon') && !e.target.closest('#eatword-popup-panel')) {
      removeFloatingIcon();
      removePopupPanel();
    }
  }, 100);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    removePopupPanel();
    removeFloatingIcon();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_INPAGE_POPUP') {
    const { text, position } = message;
    selectedText = text;
    createPopupPanel(position.x, position.y, text);
    sendResponse({ status: "success" });
  }
  return true;
});