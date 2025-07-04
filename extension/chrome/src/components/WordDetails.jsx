import { useAtomValue } from "jotai";
import { useState } from "react";
import { fontSizeAtom } from "../../atoms/fontSize.js";
import SpeakerIcon from "./ui/SpeakerIcon.jsx";

const WordDetails = ({
  text,
  result,
  pronunciation,
  example,
  definitions,
  translations,
}) => {
  const fontSize = useAtomValue(fontSizeAtom);
  const [activeTranslationTab, setActiveTranslationTab] = useState(0);
  const [activeDefinitionTab, setActiveDefinitionTab] = useState(0);

  // Get prioritized types (max 3)
  const translationTypes = getPrioritizedTypes(Object.keys(translations || {}));

  const definitionTypes = getPrioritizedTypes(Object.keys(definitions || {}));

  // Get sorted and limited translations for the active tab
  const getDisplayTranslations = () => {
    if (!translationTypes[activeTranslationTab]) return [];

    const activeTranslations =
      translations[translationTypes[activeTranslationTab]] || [];

    const sortedTranslations = [...activeTranslations].sort((a, b) => {
      if (a.frequency === "common" && b.frequency !== "common") return -1;
      if (a.frequency !== "common" && b.frequency === "common") return 1;
      return 0;
    });

    return sortedTranslations.slice(0, 5);
  };

  // Tab component for reusability
  const TabButton = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
        isActive
          ? "border border-blue-500 text-white shadow-md"
          : "border border-slate-600 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );

  // Frequency badge component
  const FrequencyBadge = ({ frequency }) => {
    const getFrequencyColor = (freq) => {
      switch (freq) {
        case "common":
          return "bg-blue-100 text-blue-400 dark:bg-blue-800/20 dark:text-blue-500";
        case "rare":
          return "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white";
      }
    };

    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getFrequencyColor(
          frequency
        )}`}
      >
        {frequency}
      </span>
    );
  };

  return (
    <div className="w-full max-w-[512px] pr-1">
      {/* Header Section - Result and Pronunciation */}
      <div className="flex justify-between items-start">
        <div className="flex-1 flex gap-3 sm:gap-5 items-center relative">
          <SpeakerIcon text={text} />
          <h1
            className="font-medium text-blue-100 break-words pt-0.5"
            style={{ fontSize: `${fontSize + 6}px` }}
          >
            {text}
          </h1>
        </div>

        <div className="ml-4 text-right">
          <div
            className="text-blue-400 font-medium"
            style={{ fontSize: `${fontSize + 6}px` }}
          >
            {result}
          </div>
          {pronunciation && (
            <div
              className="text-slate-500 font-mono"
              style={{ fontSize: `${fontSize - 2}px` }}
            >
              /{pronunciation}/
            </div>
          )}
        </div>
      </div>

      {/* Translations Section */}
      {translationTypes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-400 border-b border-slate-500 pb-1">
            Translations
          </h2>

          {/* Translation Tabs */}
          <div className="flex flex-wrap gap-2">
            {translationTypes.map((type, index) => (
              <TabButton
                key={type}
                isActive={activeTranslationTab === index}
                onClick={() => setActiveTranslationTab(index)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabButton>
            ))}
          </div>

          {/* Translation Content */}
          <div className="">
            {translationTypes[activeTranslationTab] && (
              <div className="space-y-3">
                {getDisplayTranslations().map((trans, index) => (
                  <div key={index} className="border-l-3 border-blue-400 pl-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-medium text-slate-200"
                        style={{ fontSize: fontSize }}
                      >
                        {trans.translation}
                      </span>
                      {trans.frequency && (
                        <FrequencyBadge frequency={trans.frequency} />
                      )}
                    </div>
                    {trans.reversedTranslations &&
                      trans.reversedTranslations.length > 0 && (
                        <div
                          className="text-slate-500"
                          style={{ fontSize: `${fontSize - 2}px` }}
                        >
                          {trans.reversedTranslations.slice(0, 4).join(", ")}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Definitions Section */}
      {definitionTypes.length > 0 && (
        <div className="space-y-3 mt-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-400 border-b border-slate-500 pb-1">
            Definitions
          </h2>

          {/* Definition Tabs */}
          <div className="flex flex-wrap gap-2">
            {definitionTypes.map((type, index) => (
              <TabButton
                key={type}
                isActive={activeDefinitionTab === index}
                onClick={() => setActiveDefinitionTab(index)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabButton>
            ))}
          </div>

          {/* Definition Content */}
          <div className="">
            {definitionTypes[activeDefinitionTab] && (
              <div className="space-y-4">
                {definitions[definitionTypes[activeDefinitionTab]] && (
                  <div>
                    {/* Main Definition */}
                    <div className="mb-3">
                      <p
                        className="text-slate-400 leading-relaxed"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {
                          definitions[definitionTypes[activeDefinitionTab]]
                            .definition
                        }
                      </p>
                    </div>

                    {/* Definition Example */}
                    {definitions[definitionTypes[activeDefinitionTab]]
                      .example && (
                      <div className="text-slate-200 bg-slate-700/60 transition-all duration-200 p-2 rounded-lg">
                        <div
                          className="font-medium text-blue-400 mb-1"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          EXAMPLE
                        </div>
                        <p
                          className="text-slate-400 italic"
                          style={{ fontSize: `${fontSize - 2}px` }}
                        >
                          {
                            definitions[definitionTypes[activeDefinitionTab]]
                              .example
                          }
                        </p>
                      </div>
                    )}

                    {/* Synonyms */}
                    {/* {definitions[definitionTypes[activeDefinitionTab]]
                      .synonyms &&
                      definitions[definitionTypes[activeDefinitionTab]].synonyms
                        .length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-blue-700 mb-2">
                            Synonyms
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {definitions[
                              definitionTypes[activeDefinitionTab]
                            ].synonyms.map((synonym, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                              >
                                {synonym}
                              </span>
                            ))}
                          </div>
                        </div>
                      )} */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* General Example Section */}
      {example && (
        <div className="space-y-2 mt-4">
          <h2
            className="font-semibold text-slate-400 border-b border-slate-500 pb-1"
            style={{ fontSize: `${fontSize + 2}px` }}
          >
            General Example Usage
          </h2>
          <div className="text-slate-200 bg-slate-700/60 transition-all duration-200  rounded-lg p-3 sm:p-4">
            <p
              className="text-slate-100 leading-relaxed"
              style={{ fontSize: `${fontSize + 1}px` }}
            >
              {example}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get prioritized types
const getPrioritizedTypes = (types) => {
  const priorityOrder = ["noun", "adjective", "verb"];

  // Separate into prioritized and other types
  const prioritized = [];
  const others = [];

  types.forEach((type) => {
    if (priorityOrder.includes(type)) {
      prioritized.push(type);
    } else {
      others.push(type);
    }
  });

  // Sort prioritized types according to priorityOrder
  const sortedPrioritized = priorityOrder.filter((type) =>
    prioritized.includes(type)
  );

  // Combine and return max 3 types
  return [...sortedPrioritized, ...others].slice(0, 3);
};

export default WordDetails;
