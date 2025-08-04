import { SpellChecker } from "./lib/spell-check.js";

import {
  isSpellCheckEnabled,
  isTranslationEnabled,
} from "./lib/inti-feature-state.js";

// Handle extension installation and context menu setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    eatword_settings: {
      autoSave: false,
      soundEnabled: true,
      theme: "dark",
      language: "auto",
    },
  });

  // Create a context menu item for text selection
  chrome.contextMenus.create({
    id: "eatword-translation",
    title: 'Translate "%s" with EatWord',
    contexts: ["selection"],
  });
});

async function handleAuthCheck(sendResponse) {
  const { accessToken, user } = await chrome.storage.local.get([
    "accessToken",
    "user",
  ]);

  if (!accessToken) {
    sendResponse({ isAuthenticated: false });
    return;
  }

  try {
    const response = await fetch(
      `https://eat-word-naime-ahmeds-projects.vercel.app/auth`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      }
    );

    if (response.ok) {
      sendResponse({ isAuthenticated: true, user: user });
      return;
    }

    const errorData = await response.json();
    if (
      response.status === 401 &&
      errorData.message === "Access token expired"
    ) {
      const newUser = await handleTokenRefresh();

      if (newUser) {
        sendResponse({ isAuthenticated: true, user: newUser });
      } else {
        sendResponse({ isAuthenticated: false });
      }
    } else {
      sendResponse({ isAuthenticated: false });
    }
  } catch (error) {
    console.error(
      "handleAuthCheck: Network or other error during auth check.",
      error
    );
    sendResponse({ isAuthenticated: false });
  }
}

async function handleTokenRefresh() {
  try {
    const response = await fetch(
      `https://eat-word-naime-ahmeds-projects.vercel.app/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();

      const newUser = {
        id: data.id,
        email: data.email,
        role: data.role,
        subscriptionType: data.subscriptionType,
      };

      await chrome.storage.local.set({
        accessToken: data.accessToken,
        user: newUser,
      });
      return newUser;
    }
    return null;
  } catch (error) {
    console.error(
      "handleTokenRefresh: Network or other error during token refresh.",
      error
    );
    return null;
  }
}

// Listen for login success messages from your website
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (
      !sender.url.startsWith("https://eatword.com") &&
      !sender.url.startsWith("http://localhost")
    ) {
      return;
    }

    if (message.type === "LOGIN_SUCCESS") {
      chrome.storage.local.set(
        {
          accessToken: message.accessToken,
          user: message.user,
        },
        () => {
          chrome.runtime.sendMessage({
            action: "AUTH_STATE_CHANGED",
            isAuthenticated: true,
            user: message.user,
          });

          sendResponse({ status: "success", message: "Data stored." });
        }
      );

      return true;
    }
  }
);

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "eatword-translation") {
    const selectedText = info.selectionText?.trim();
    if (
      selectedText &&
      selectedText.length > 0 &&
      selectedText.length <= 1000
    ) {
      try {
        const isEnabled = await isTranslationEnabled();
        if (isEnabled) {
          // Send message to the specific tab that was clicked
          chrome.tabs.sendMessage(tab.id, {
            type: "SHOW_INPAGE_POPUP",
            selectedText: selectedText,
          });
        }
      } catch (error) {
        console.error("Error processing context menu click:", error);
      }
    }
  }
});

// Listen for messages from content scripts or the popup UI.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const messageType = request.type || request.action;

  switch (messageType) {
    case "api-request":
      fetch(request.url, request.options)
        .then(async (response) => {
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
              sendResponse(await response.json());
            } else {
              sendResponse({});
            }
          } else {
            sendResponse({
              error: true,
              status: response.status,
              statusText: response.statusText,
              body: await response.json(),
            });
          }
        })
        .catch((error) => {
          sendResponse({
            error: true,
            message: error.message,
            isNetworkError: true,
          });
        });
      return true;

    case "CHECK_AUTH":
      handleAuthCheck(sendResponse);
      return true;

    case "check-word":
      (async () => {
        try {
          const isCorrect = await SpellChecker.check(request.word);
          sendResponse({ isCorrect });
        } catch (err) {
          console.error("Error checking word:", err);
          sendResponse({ status: "error", error: err.message });
        }
      })();
      return true;

    case "get-suggestions":
      const suggestions = SpellChecker.suggest(request.word);
      console.log("suggestions from bg: ", suggestions);
      sendResponse({ suggestions });
      break;

    case "store-ignored-word":
      const key = "ignoredWords";
      const word = request.word.toLowerCase();
      (async () => {
        try {
          const result = await chrome.storage.session.get(key);
          const list = result[key] || [];
          if (!list.includes(word)) {
            list.push(word);
            await chrome.storage.session.set({ [key]: list });
          }
          sendResponse({ status: "success" });
        } catch (err) {
          console.error("Error storing word:", err);
          sendResponse({ status: "error", error: err.message });
        }
      })();
      return true;
    case "check-spelling-enabled":
      isSpellCheckEnabled()
        .then((enabled) => {
          sendResponse({ enabled: enabled });
        })
        .catch((error) => {
          console.error("Error determining spell check state:", error);
          sendResponse({ enabled: true });
        });
      return true;
    case "check-translation-enabled":
      isTranslationEnabled()
        .then((enabled) => {
          sendResponse({ enabled: enabled });
        })
        .catch((error) => {
          console.error("Error determining translation state:", error);
          sendResponse({ enabled: true });
        });
      return true;
    default:
      console.log("Unknown message received in background:", messageType);
      break;
  }
});

// Handle Keyboard Shortcut commands
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "open-eatword") {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection();
          const text = selection.toString().trim();
          if (text) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            return {
              text: text,
              position: {
                x: rect.left + window.scrollX + rect.width / 2 - 210,
                y: rect.bottom + window.scrollY + 10,
              },
            };
          }
          return { text: "", position: { x: 200, y: 200 } };
        },
      },
      (results) => {
        if (results && results[0] && results[0].result.text) {
          const { text, position } = results[0].result;
          chrome.tabs.sendMessage(tab.id, {
            type: "SHOW_INPAGE_POPUP",
            text: text,
            position: position,
          });
        }
      }
    );
  }
});
