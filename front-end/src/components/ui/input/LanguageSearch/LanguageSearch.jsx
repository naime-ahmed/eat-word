import React, { useEffect, useState } from "react";
import { LANGUAGE_MAP } from "../../../../utils/supportedLan";
import styles from "./LanguageSearch.module.css";

const language_map = LANGUAGE_MAP();

const LanguageSearch = ({ onSelectLanguage, curLang }) => {
  const [inputValue, setInputValue] = useState(curLang);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const lowerInput = inputValue.toLowerCase().trim();

    if (!lowerInput) {
      setSuggestions([]);
      return;
    }

    const exactMatch = Object.values(language_map).some(
      (langName) => langName.toLowerCase() === lowerInput
    );
    if (exactMatch) {
      setSuggestions([]);
      return;
    }

    // Filter and sort languages based on the input.
    const filtered = Object.entries(language_map)
      .filter(([, name]) => name.toLowerCase().includes(lowerInput))
      .sort((a, b) => {
        const aStarts = a[1].toLowerCase().startsWith(lowerInput);
        const bStarts = b[1].toLowerCase().startsWith(lowerInput);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a[1].localeCompare(b[1]);
      });
    setSuggestions(filtered);
  }, [inputValue]);

  const handleSelect = (code, name) => {
    setInputValue(name);
    onSelectLanguage(code);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        name="preferredLang"
        placeholder="What's your comfortable language?"
        className={styles.inputField}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue &&
        !Object.values(language_map).includes(inputValue) &&
        suggestions.length === 0 && (
          <div className={styles.noSuggestions}>No language found</div>
        )}
      {suggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {suggestions.map(([code, name]) => (
            <li
              key={code}
              className={styles.suggestionItem}
              onClick={() => handleSelect(code, name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSearch;
