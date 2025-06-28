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
    id: "eatword-lookup",
    title: 'Translate "%s" with EatWord',
    contexts: ["selection"],
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "api-request") {
    fetch(request.url, request.options)
      .then(async (response) => {
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
          }
          return {};
        }

        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
          body: await response.json(),
        });
      })
      .then((data) => {
        sendResponse(data);
      })
      .catch((error) => {
        console.error("Background fetch error:", error);
        sendResponse(error);
      });

    return true;
  }
});

function storeTextAndOpenPopup(text) {
  chrome.storage.local.set({ selectedText: text }, () => {
    chrome.action.openPopup();
  });
}

// handle authentication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check authentication status
  if (request.action === "CHECK_AUTH") {
    console.log("checking login");
    handleAuthCheck(sendResponse);
    return true; // Indicates async response
  }
});

async function handleAuthCheck(sendResponse) {
  const { accessToken, user } = await chrome.storage.local.get([
    "accessToken",
    "user",
  ]);

  if (!accessToken) {
    console.log(
      "handleAuthCheck: No access token found. User is not authenticated."
    );
    sendResponse({ isAuthenticated: false });
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/auth`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    if (response.ok) {
      console.log(
        "handleAuthCheck: Token is valid. User is authenticated.",
        user
      );
      sendResponse({ isAuthenticated: true, user: user });
      return;
    }

    const errorData = await response.json();
    console.log("error verifying acc token: ", errorData);
    if (
      response.status === 401 &&
      errorData.message === "Access token expired"
    ) {
      console.log("handleAuthCheck: Access token expired. Attempting refresh.");

      const newUser = await handleTokenRefresh();

      if (newUser) {
        console.log("handleAuthCheck: Token refresh successful.");
        sendResponse({ isAuthenticated: true, user: newUser });
      } else {
        console.log("handleAuthCheck: Token refresh failed.");
        sendResponse({ isAuthenticated: false });
      }
    } else {
      console.log("handleAuthCheck: Token is invalid, not an expiry issue.");
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
    const response = await fetch(`http://localhost:5000/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

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

      console.log(
        "handleTokenRefresh: Successfully refreshed token and stored new user data."
      );
      return newUser;
    }
    console.log(
      "handleTokenRefresh: Refresh token request failed with status:",
      response.status
    );
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
      !sender.url.startsWith(
        "https://eat-word-naime-ahmeds-projects.vercel.app/"
      ) &&
      !sender.url.startsWith("http://localhost")
    ) {
      return;
    }

    if (message.type === "LOGIN_SUCCESS") {
      console.log(
        "onMessageExternal: LOGIN_SUCCESS message received.",
        message
      );

      chrome.storage.local.set(
        {
          accessToken: message.accessToken,
          user: message.user,
        },
        () => {
          console.log(
            "onMessageExternal: Tokens and user data stored successfully."
          );

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
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "eatword-lookup" && info.selectionText) {
    // Send a message to the content script in the active tab to show the UI
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_INPAGE_POPUP",
      text: info.selectionText,
      position: { x: 200, y: 200 },
    });
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOOKUP_TEXT_AND_OPEN_POPUP") {
    storeTextAndOpenPopup(message.text);
    sendResponse({ status: "success, popup opened" });
    return true;
  }
});
