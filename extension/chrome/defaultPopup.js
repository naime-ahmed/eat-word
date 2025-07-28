(async () => {
  // --- DOM Elements ---
  const logoContainer = document.getElementById("logoContainer");
  const authButton = document.getElementById("authButton");
  const spellCheckToggle = document.getElementById("spellCheckToggle");
  const translationToggle = document.getElementById("translationToggle");

  // --- Constants ---
  const SPELL_CHECK_ENABLED_KEY = "spellCheckEnabled";
  const TRANSLATION_ENABLED_KEY = "translationEnabled";
  let currentDomain = null;

  const getExtensionId = () => {
    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      return chrome.runtime.id;
    }
    return "your-dev-extension-id";
  };

  // Get the domain of the currently active tab
  const getCurrentTabDomain = async () => {
    if (typeof chrome === "undefined" || !chrome.tabs?.query) {
      console.warn("Not in a Chrome extension context. Cannot get tab domain.");
      return null;
    }
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]?.url) {
        const url = new URL(tabs[0].url);
        return url.hostname; // e.g., "mail.google.com"
      }
    } catch (error) {
      console.error("Error getting current tab domain:", error);
    }
    return null;
  };

  // --- Auth Check and Button Update ---
  const checkAuthStatus = async () => {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      console.warn("Not in a Chrome extension context. Auth check skipped.");
      return;
    }

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "CHECK_AUTH" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      if (response && response.isAuthenticated) {
        updateAuthButton(true);
      } else {
        updateAuthButton(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      updateAuthButton(false);
    }
  };

  const updateAuthButton = (isAuthenticated) => {
    if (isAuthenticated) {
      authButton.textContent = "Visit Eat Word";
      authButton.classList.add("authenticated");
      authButton.onclick = () => {
        chrome.tabs.create({ url: `https://eatword.com/` });
      };
    } else {
      authButton.textContent = "Log in";
      authButton.classList.remove("authenticated");
      authButton.onclick = () => {
        chrome.tabs.create({
          url: `https://eatword.com/extension-signin?extensionId=${getExtensionId()}`,
        });
      };
    }
  };

  // --- Feature Toggle Logic (Per Domain) ---

  // Load toggle states for the current domain
  const loadToggleStatesForDomain = async (domain) => {
    if (!domain) {
      console.warn("Cannot load toggle states: No domain provided.");
      // Set toggles to a default state (e.g., disabled) or disable them
      spellCheckToggle.checked = false;
      translationToggle.checked = false;
      spellCheckToggle.disabled = true;
      translationToggle.disabled = true;
      return;
    }

    try {
      // Get settings for this specific domain
      const result = await chrome.storage.local.get([domain]);
      const domainSettings = result[domain] || {};

      // Get global default settings
      const globalDefaults = await chrome.storage.local.get([
        SPELL_CHECK_ENABLED_KEY,
        TRANSLATION_ENABLED_KEY,
      ]);

      // Determine effective state: domain-specific setting, or fall back to global default, or true
      const isSpellCheckEnabled =
        domainSettings[SPELL_CHECK_ENABLED_KEY] ??
        globalDefaults[SPELL_CHECK_ENABLED_KEY] ??
        true;
      const isTranslationEnabled =
        domainSettings[TRANSLATION_ENABLED_KEY] ??
        globalDefaults[TRANSLATION_ENABLED_KEY] ??
        true;

      spellCheckToggle.checked = isSpellCheckEnabled;
      translationToggle.checked = isTranslationEnabled;
      // Ensure toggles are enabled once domain is known
      spellCheckToggle.disabled = false;
      translationToggle.disabled = false;
    } catch (error) {
      console.error(
        `Error loading toggle states for domain '${domain}':`,
        error
      );
      // Fail gracefully
      spellCheckToggle.checked = true;
      translationToggle.checked = true;
      spellCheckToggle.disabled = false;
      translationToggle.disabled = false;
    }
  };

  // Save toggle state for the current domain
  const saveToggleStateForDomain = async (domain, key, isEnabled) => {
    if (!domain) {
      console.warn("Cannot save toggle state: No domain provided.");
      return;
    }

    try {
      // Get existing settings for this domain
      const result = await chrome.storage.local.get([domain]);
      const domainSettings = result[domain] || {};
      domainSettings[key] = isEnabled;

      await chrome.storage.local.set({ [domain]: domainSettings });

      // --- Notify Active Tab Content Script ---
      // if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      //   const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      //   if (tabs[0]?.id) {
      //     try {
      //        chrome.tabs.sendMessage(tabs[0].id, {
      //          type: "FEATURE_TOGGLE_CHANGED",
      //          feature: key,
      //          enabled: isEnabled,
      //          domain: domain
      //        });
      //        console.log(`Sent message to active tab content script (${tabs[0].id}): FEATURE_TOGGLE_CHANGED for ${key} = ${isEnabled} on domain ${domain}`);
      //     } catch (sendError) {
      //         console.log("Could not send message to content script (might not be ready):", sendError.message);
      //     }
      //   }
      // }
    } catch (error) {
      console.error(`Error saving ${key} state for domain '${domain}':`, error);
    }
  };

  // --- Event Listeners ---

  document.addEventListener("DOMContentLoaded", async () => {
    logoContainer.onclick = () => {
      chrome.tabs.create({ url: `https://eatword.com/` });
    };

    // Get the current domain
    currentDomain = await getCurrentTabDomain();

    // Load initial states for the domain
    await loadToggleStatesForDomain(currentDomain);
    await checkAuthStatus();

    if (spellCheckToggle) {
      spellCheckToggle.addEventListener("change", () => {
        saveToggleStateForDomain(
          currentDomain,
          SPELL_CHECK_ENABLED_KEY,
          spellCheckToggle.checked
        );
      });
    } else {
      console.error("Spell Check Toggle element not found!");
    }

    if (translationToggle) {
      translationToggle.addEventListener("change", () => {
        saveToggleStateForDomain(
          currentDomain,
          TRANSLATION_ENABLED_KEY,
          translationToggle.checked
        );
      });
    } else {
      console.error("Translation Toggle element not found!");
    }

    authButton.onclick = () => {
      chrome.tabs.create({
        url: `https://eatword.com/extension-signin?extensionId=${getExtensionId()}`,
      });
    };
  });
})();
