export function createSuggestionPopover() {
  let currentWord = "";

  // Create the main popover container
  const popover = document.createElement("div");
  popover.setAttribute("data-popover-id", "suggestion-popover");
  Object.assign(popover.style, {
    position: "absolute",
    zIndex: "2147483647",
    display: "none",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.05)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: "14px",
    width: "280px",
    overflow: "hidden",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "0",
    transform: "translateY(-8px) scale(0.95)",
    padding: "0",
    backdropFilter: "blur(8px)",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  });
  document.body.appendChild(popover);

  // Header with title and close button
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px 12px 18px",
    borderBottom: "1px solid #e5e7eb",
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
  });

  const title = document.createElement("div");
  title.textContent = "Correct the spelling";
  Object.assign(title.style, {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.025em",
    textTransform: "uppercase",
  });

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  Object.assign(closeBtn.style, {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    borderRadius: "6px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  });
  closeBtn.onmouseenter = () => {
    closeBtn.style.backgroundColor = "#f3f4f6";
    closeBtn.style.color = "#374151";
    closeBtn.style.transform = "scale(1.1)";
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.backgroundColor = "transparent";
    closeBtn.style.color = "#9ca3af";
    closeBtn.style.transform = "scale(1)";
  };
  closeBtn.onclick = () => hide();

  header.appendChild(title);
  header.appendChild(closeBtn);
  popover.appendChild(header);

  // Container for suggestion list with custom scrollbar
  const listContainer = document.createElement("div");
  Object.assign(listContainer.style, {
    maxHeight: "160px",
    overflowY: "auto",
    padding: "8px 0",
    scrollbarWidth: "thin",
    scrollbarColor: "#d1d5db transparent",
  });

  // Custom scrollbar styles for webkit browsers
  const scrollbarStyle = document.createElement("style");
  scrollbarStyle.textContent = `
    [data-popover-id="suggestion-popover"] *::-webkit-scrollbar {
      width: 6px;
    }
    [data-popover-id="suggestion-popover"] *::-webkit-scrollbar-track {
      background: transparent;
    }
    [data-popover-id="suggestion-popover"] *::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
      transition: background 0.2s ease;
    }
    [data-popover-id="suggestion-popover"] *::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `;
  document.head.appendChild(scrollbarStyle);

  popover.appendChild(listContainer);

  // Footer actions
  const footer = document.createElement("div");
  Object.assign(footer.style, {
    borderTop: "1px solid #e5e7eb",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    padding: "4px 0",
  });

  const makeAction = (text, icon) => {
    const btn = document.createElement("div");
    btn.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">${icon}</span>
        <span>${text}</span>
      </div>
    `;
    Object.assign(btn.style, {
      padding: "12px 18px",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "13px",
      color: "#6b7280",
      transition: "all 0.15s ease",
      borderRadius: "0",
      fontWeight: "500",
    });
    btn.onmouseenter = () => {
      btn.style.backgroundColor = "#f3f4f6";
      btn.style.color = "#374151";
    };
    btn.onmouseleave = () => {
      btn.style.backgroundColor = "transparent";
      btn.style.color = "#6b7280";
    };
    return btn;
  };

  const ignoreIcon = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path>
      <path d="M3 16.2V21m0 0h4.8M3 21l6-6"></path>
      <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"></path>
      <path d="M3 7.8V3m0 0h4.8M3 3l6 6"></path>
    </svg>
  `;

  const dictIcon = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"></path>
    </svg>
  `;

  const ignoreBtn = makeAction("Ignore for now", ignoreIcon);

  ignoreBtn.onclick = async () => {
  console.log("clicked ignore for", currentWord);
  
  if (currentWord) {
    const textSpan = ignoreBtn.querySelector('div > span:nth-child(2)');
    
    // Show processing state
    textSpan.textContent = "Ignoring...";
    ignoreBtn.style.pointerEvents = "none";

    try {
      console.log(`Adding "${currentWord}" to session ignore list`);
      const res = await chrome.runtime.sendMessage({
        type: "store-ignored-word",
        word: currentWord
      });

      if (res.status === "error") {
        console.error("Error storing word:", res.error);
        // Optional: Revert button text on error
        textSpan.textContent = "Failed - Retry?";
        ignoreBtn.style.pointerEvents = "auto";
        return;
      }
      
      console.log("Word added to session storage:", currentWord);
    } catch (err) {
      console.error("Message error:", err);
      // Handle messaging errors here
    } finally {
      // Revert to original text
      textSpan.textContent = "Ignore for now";
      ignoreBtn.style.pointerEvents = "auto";
      hide();
    }
  } else {
    hide();
  }
};

  const addDictBtn = makeAction("Add to dictionary", dictIcon);
  addDictBtn.onclick = () => {
    if (currentWord) {
      console.log("Added to custom dictionary:", currentWord.toLowerCase());
      // implement the custom dictionary feature
    }
    hide();
  };

  footer.appendChild(ignoreBtn);
  footer.appendChild(addDictBtn);
  popover.appendChild(footer);

  // Enhanced show method
  const show = async (top, left, suggestions, onSelect, word = "") => {
    // Clear and populate suggestions
    listContainer.innerHTML = "";
    currentWord = word;

    if (!suggestions.length) {
      const empty = document.createElement("div");
      empty.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span style="color: #9ca3af; font-size: 13px;">No suggestions found</span>
        </div>
      `;
      listContainer.appendChild(empty);
    } else {
      const ul = document.createElement("ul");
      Object.assign(ul.style, {
        listStyle: "none",
        margin: "0",
        padding: "0",
      });

      suggestions.forEach((suggestion, index) => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        Object.assign(li.style, {
          padding: "10px 18px",
          cursor: "pointer",
          fontSize: "14px",
          color: "#374151",
          transition: "all 0.15s ease",
          fontWeight: "500",
          borderLeft: "3px solid transparent",
        });

        if (index === 0) {
          li.style.backgroundColor = "#dbeafe";
          li.style.borderLeftColor = "#3b82f6";
          li.style.color = "#1d4ed8";
        }

        li.onmouseenter = () => {
          li.style.backgroundColor = "#dbeafe";
          li.style.borderLeftColor = "#3b82f6";
          li.style.color = "#1d4ed8";
        };
        li.onmouseleave = () => {
          if (index !== 0) {
            li.style.backgroundColor = "transparent";
            li.style.borderLeftColor = "transparent";
            li.style.color = "#374151";
          }
        };
        li.onclick = () => {
          onSelect(suggestion);
          hide();
        };
        ul.appendChild(li);
      });
      listContainer.appendChild(ul);
    }

    // Enhanced positioning with viewport awareness
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverRect = { width: 280, height: 280 };

    let adjustedLeft = left;
    let adjustedTop = top;

    // Adjust horizontal position if too close to right edge
    if (left + popoverRect.width > viewportWidth - 20) {
      adjustedLeft = viewportWidth - popoverRect.width - 20;
    }

    // Adjust vertical position if too close to bottom edge
    if (top + popoverRect.height > viewportHeight - 20) {
      adjustedTop = top - popoverRect.height - 10;
    }

    // Position and animate in
    popover.style.top = `${adjustedTop}px`;
    popover.style.left = `${adjustedLeft}px`;
    popover.style.display = "block";

    // Force reflow then animate
    popover.offsetHeight;
    requestAnimationFrame(() => {
      popover.style.opacity = "1";
      popover.style.transform = "translateY(0) scale(1)";
    });
  };

  const hide = () => {
    popover.style.opacity = "0";
    popover.style.transform = "translateY(-8px) scale(0.95)";
    setTimeout(() => {
      popover.style.display = "none";
    }, 200);
  };

  return {
    show,
    hide,
  };
}
