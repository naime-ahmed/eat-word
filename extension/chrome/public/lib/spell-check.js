import { Typo } from "../lib/typo.js";

export const SpellChecker = {
  dictionary: null,

  async load() {
    if (this.dictionary) {
      console.log("Dictionary already loaded.");
      return;
    }

    try {
      // Get the URLs for the dictionary files from the extension's package.
      const dictionaryPath = chrome.runtime.getURL(
        "dictionaries/en_US/en_US.dic"
      );
      const affixPath = chrome.runtime.getURL("dictionaries/en_US/en_US.aff");

      // Fetch the dictionary files.
      const [dicFile, affFile] = await Promise.all([
        fetch(dictionaryPath).then((res) => res.text()),
        fetch(affixPath).then((res) => res.text()),
      ]);

      this.dictionary = new Typo("en_US", affFile, dicFile);
    } catch (error) {
      console.error("Error loading dictionary:", error);
    }
  },

  // Check if a word is misspelled.
  async check(word) {
    const key = "ignoredWords";
    const result = await chrome.storage.session.get(key);
     console.log("res for checking word from storage", result);
    const list = result[key] || [];

    if (!this.dictionary || list.includes(word.toLowerCase())) {
      return true;
    }

    return this.dictionary.check(word);
  },

  // Get spelling suggestions for a misspelled word.
  suggest(word) {
    if (!this.dictionary) {
      console.warn("Dictionary not loaded yet. Cannot get suggestions.");
      return [];
    }
    return this.dictionary.suggest(word);
  },
};

// Immediately start loading the dictionary when this script is loaded.
SpellChecker.load();
