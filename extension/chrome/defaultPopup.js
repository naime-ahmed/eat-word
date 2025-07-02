// Check if we're in a Chrome extension context
if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
  console.warn("Not in a Chrome extension context. Auth check skipped.");
} else {
  // Check authentication status
  chrome.runtime.sendMessage({ action: "CHECK_AUTH" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Auth check failed:", chrome.runtime.lastError.message);
    } else if (response && response.isAuthenticated) {
      updateAuthButton(true);
    } else {
      updateAuthButton(false);
    }
  });
}

const getExtensionId = () => {
  if (typeof chrome !== "undefined" && chrome.runtime?.id) {
    return chrome.runtime.id;
  }
  return "your-dev-extension-id";
};

// Update button based on authentication status
function updateAuthButton(isAuthenticated) {
  const authButton = document.getElementById("authButton");

  if (isAuthenticated) {
    authButton.textContent = "Visit Eat Word";
    authButton.classList.add("authenticated");
    authButton.onclick = () => {
      chrome.tabs.create({ url: `http://localhost:5173/` });
    };
  } else {
    authButton.textContent = "Log in";
    authButton.classList.remove("authenticated");
    authButton.onclick = () => {
      chrome.tabs.create({
        url: `http://localhost:5173/extension-signin?extensionId=${getExtensionId()}`,
      });
    };
  }
}

// Logo click handler
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoContainer").onclick = () => {
    chrome.tabs.create({ url: `http://localhost:5173/` });
  };

  // Default button click handler (in case auth check fails)
  document.getElementById("authButton").onclick = () => {
    chrome.tabs.create({
      url: `http://localhost:5173/extension-signin?extensionId=${getExtensionId()}`,
    });
  };
});
