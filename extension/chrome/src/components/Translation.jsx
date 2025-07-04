import { useAtomValue, useSetAtom } from "jotai";
import propTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { langAtom } from "../../atoms/language";
import { translationAtom } from "../../atoms/translation";
import useFetch from "../hooks/useFetch";
import { processWordData } from "../utils/processWordData";
import PhraseDetails from "./PhraseDetails";
import PhraseSkeleton from "./ui/PhraseSkeleton";
import WordSkeleton from "./ui/WordSkeleton";
import WordDetails from "./WordDetails";

const Translate = ({ text }) => {
  const lang = useAtomValue(langAtom);
  const setTranslation = useSetAtom(translationAtom);

  const isPhrase = useMemo(() => {
    if (!text || text.trim() === "") {
      return false;
    }
    const trimmedText = text.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    return wordCount > 1;
  }, [text]);

  const textType = isPhrase ? "phrase" : "word";

  // Build API URL
  const apiUrl = useMemo(() => {
    console.log("building api url");
    if (!text || text.trim() === "") return null;

    const baseUrl = "https://t.song.work/api";
    const params = new URLSearchParams();

    params.append("text", text.trim());

    if (lang?.selected && lang.selected !== "") {
      params.append("from", lang.selected);
    }

    const targetLang = lang?.translateTo || "en";
    params.append("to", targetLang);

    if (textType === "phrase") {
      params.append("lite", "true");
    }

    return `${baseUrl}?${params.toString()}`;
  }, [text, lang?.selected, lang?.translateTo, textType]);
  console.log(apiUrl);
  // Fetch translation data
  const { data, loading, error, retry } = useFetch(apiUrl);

  console.log("translation data: ", data);
  // set translated text to state
  useEffect(() => {
    if (data) {
      setTranslation(data);
    }
  }, [data, setTranslation]);

  const processPhraseData = (phraseData) => {
    return {
      text: text,
      result: phraseData.result || "",
      pronunciation: phraseData.pronunciation || "",
    };
  };

  if (loading) {
    return textType === "word" ? <WordSkeleton /> : <PhraseSkeleton />;
  }

  if (error) {
    console.log("translation error: ", error);
    return (
      <div>
        Error loading translation, {error?.body?.message}
        <button
          onClick={retry}
          style={{ marginLeft: "10px", cursor: "pointer" }}
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!text || text.trim() === "") {
    return null;
  }

  if (!data) {
    return null;
  }

  if (textType === "phrase") {
    const phraseData = processPhraseData(data);
    return <PhraseDetails {...phraseData} />;
  } else if (textType === "word") {
    const wordData = processWordData(data, text);
    return <WordDetails {...wordData} />;
  }

  return null;
};

Translate.propTypes = {
  text: propTypes.string,
};

export default Translate;
