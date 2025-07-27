const SPELL_CHECK_ENABLED_KEY = "spellCheckEnabled";
const TRANSLATION_ENABLED_KEY = "translationEnabled";

async function getActiveTabDomain() {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout getting active tab")), 1000)
    );
    const tabsPromise = chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tabs = await Promise.race([tabsPromise, timeoutPromise]);
    if (tabs && tabs[0]?.url) {
      const url = new URL(tabs[0].url);
      return url.hostname; // e.g., "mail.google.com"
    }
  } catch (error) {
    console.warn("Could not get active tab domain:", error.message);
  }
  return null;
}

export async function getFeatureState(featureKey, defaultFallback = true) {
  try {
    const currentDomain = await getActiveTabDomain();
    let effectiveValue = defaultFallback;

    // 1. Check Global Default
    const globalDefaultsResult = await chrome.storage.local.get([featureKey]);
    const globalDefaultValue = globalDefaultsResult[featureKey];

    if (globalDefaultValue !== undefined) {
      effectiveValue = globalDefaultValue;
      // console.log(`Found global default for ${featureKey}: ${effectiveValue}`);
    } else {
      // console.log(`No global default found for ${featureKey}, using fallback: ${effectiveValue}`);
    }

    // 2. Check Domain-Specific Setting (if domain is available)
    if (currentDomain) {
      const domainSettingsResult = await chrome.storage.local.get([
        currentDomain,
      ]);
      const domainSettings = domainSettingsResult[currentDomain];
      if (domainSettings && domainSettings[featureKey] !== undefined) {
        effectiveValue = domainSettings[featureKey];
      } else if (domainSettings) {
        // console.log(`Domain settings exist for ${currentDomain} but not for key ${featureKey}`);
      } else {
        // console.log(`No domain-specific settings found for ${currentDomain}`);
      }
    } else {
      console.log("No active domain found to check for domain-specific settings.");
    }

    return effectiveValue;
  } catch (error) {
    console.error(`Error getting state for feature ${featureKey}:`, error);
    return defaultFallback;
  }
}

export async function isSpellCheckEnabled() {
  return await getFeatureState(SPELL_CHECK_ENABLED_KEY, true);
}

export async function isTranslationEnabled() {
  return await getFeatureState(TRANSLATION_ENABLED_KEY, true);
}
