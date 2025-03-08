import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { LANGUAGE_MAP } from "../../../../utils/supportedLan";
import styles from "./LanguageSearch.module.css";

const language_map = LANGUAGE_MAP();

const LanguageSearch = ({
  onSelectLanguage,
  curLang,
  inlineStyles = null,
  fieldId = "",
  isRequired = false,
}) => {
  const [inputValue, setInputValue] = useState(curLang);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const lowerInput = inputValue.toLowerCase().trim();

    if (!lowerInput) {
      setSuggestions([]);
      return;
    }

    // Find exact match and auto-select
    const exactMatchEntry = Object.entries(language_map).find(
      ([, name]) => name.toLowerCase() === lowerInput
    );

    if (exactMatchEntry) {
      const [code] = exactMatchEntry;
      onSelectLanguage(code);
      setSuggestions([]);
      return;
    }

    // Filter and sort languages based on the input.
    const filtered = Object.entries(language_map)
      .filter(([, name]) => name.toLowerCase().includes(lowerInput))
      .sort((a, b) => {
        const aStarts = a[1].toLowerCase().startsWith(lowerInput);
        const bStarts = b[1].toLowerCase().startsWith(lowerInput);
        return bStarts - aStarts || a[1].localeCompare(b[1]);
      });

    setSuggestions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        id={fieldId}
        placeholder="Search the language and select"
        className={styles.inputField}
        value={inputValue}
        style={inlineStyles}
        onChange={(e) => setInputValue(e.target.value)}
        required={isRequired}
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

LanguageSearch.propTypes = {
  onSelectLanguage: PropTypes.func.isRequired,
  curLang: PropTypes.string,
  inlineStyles: PropTypes.object,
  fieldId: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default LanguageSearch;
