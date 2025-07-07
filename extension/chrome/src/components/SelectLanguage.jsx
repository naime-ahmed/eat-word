import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_MAP } from "../utils/languages";

const SelectLanguage = ({
  onSelectLanguage,
  curLang = "",
  inlineStyles = null,
  fieldId = "",
  isRequired = false,
}) => {
  const language_map = LANGUAGE_MAP();
  const [selectedLanguage, setSelectedLanguage] = useState(curLang || "auto");
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Get all languages when search is empty, filtered when searching
  useEffect(() => {
    const lowerSearch = searchValue.toLowerCase().trim();

    if (!lowerSearch) {
      // Show all languages when no search
      setFilteredLanguages(
        Object.entries(language_map).filter(
          ([code]) => !(code === "auto" && fieldId === "select-to-lang")
        )
      );
      setSelectedIndex(-1);
      return;
    }

    // Filter and sort languages based on search
    const filtered = Object.entries(language_map)
      .filter(
        ([code, name]) =>
          name.toLowerCase().includes(lowerSearch) &&
          !(code === "auto" && fieldId === "select-to-lang")
      )
      .sort((a, b) => {
        const aStarts = a[1].toLowerCase().startsWith(lowerSearch);
        const bStarts = b[1].toLowerCase().startsWith(lowerSearch);
        return bStarts - aStarts || a[1].localeCompare(b[1]);
      });

    setFilteredLanguages(filtered);
    setSelectedIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleSelect = (code) => {
    setSelectedLanguage(code);
    onSelectLanguage(code);
    setIsOpen(false);
    setSearchValue("");
    setSelectedIndex(-1);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchValue("");
      setSelectedIndex(-1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredLanguages.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredLanguages.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const [code, name] = filteredLanguages[selectedIndex];
          handleSelect(code, name);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedLanguageName =
    language_map[selectedLanguage] || "Select Language";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        id={fieldId}
        className="w-full px-2 py-1.5 bg-transparent text-ellipsis border border-blue-300/40 text-slate-200 text-xs sm:text-sm rounded-lg box-border transition-all duration-300 shadow-sm focus:outline-none focus:border-blue-500 text-left flex items-center justify-between hover:border-blue-400/60"
        style={inlineStyles}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        required={isRequired}
      >
        <span
          className={selectedLanguage ? "text-slate-200" : "text-slate-400"}
        >
          {selectedLanguageName}
        </span>
        <svg
          className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full z-[1000] mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
          {/* Search Header */}
          <div className="p-1.5 sm:p-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  className="w-full p-1 sm:p-2 bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <svg
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>

          {/* Languages List */}
          <div
            className="max-h-40 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500/50 hover:scrollbar-thumb-slate-400/70 scrollbar-thumb-rounded-full"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
            }}
          >
            {filteredLanguages.length > 0 ? (
              <ul ref={listRef} className="list-none m-0 p-0" role="listbox">
                {filteredLanguages.map(([code, name], index) => (
                  <li
                    key={code}
                    id={`${fieldId}-option-${index}`}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs cursor-pointer border-b border-slate-700 last:border-b-0 text-slate-200 transition-colors duration-200 ${
                      index === selectedIndex
                        ? "bg-blue-600/80 text-white"
                        : selectedLanguage === code
                        ? "bg-slate-700 text-blue-300"
                        : "hover:bg-slate-700"
                    }`}
                    onClick={() => handleSelect(code, name)}
                    role="option"
                    aria-selected={selectedLanguage === code}
                  >
                    <div className="flex items-center justify-between">
                      <span>{name}</span>
                      {selectedLanguage === code && (
                        <svg
                          className="w-4 h-4 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 sm:px-4 sm:py-6 text-xs text-center text-slate-400">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SelectLanguage.propTypes = {
  onSelectLanguage: PropTypes.func.isRequired,
  curLang: PropTypes.string,
  inlineStyles: PropTypes.object,
  fieldId: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default SelectLanguage;
