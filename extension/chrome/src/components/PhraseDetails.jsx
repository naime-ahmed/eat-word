import { useAtomValue } from "jotai";
import { useState } from "react";
import { fontSizeAtom } from "../../atoms/fontSize";
import SpeakerIcon from "./ui/SpeakerIcon";

const PhraseDetails = ({ text, result, pronunciation }) => {
  const fontSize = useAtomValue(fontSizeAtom);
  const [shrinkText, setShrinkText] = useState(true);
  const [shrinkResult, setShrinkResult] = useState(true);

  const needsTruncation = (str) => str.length > 200;

  return (
    <div className="w-full max-w-[512px] flex flex-col gap-6 mt-4">
      {/* Selected text */}
      <div className="flex gap-5 items-center">
        <SpeakerIcon text={text} classes="self-start" />
        <div
          className="text-blue-100 break-words"
          style={{ fontSize: `${fontSize}px` }}
        >
          {needsTruncation(text) ? (
            <>
              {shrinkText ? text.slice(0, 100) + "..." : text}
              <button
                onClick={() => setShrinkText(!shrinkText)}
                className="ml-2 text-blue-400 hover:underline cursor-pointer"
              >
                {shrinkText ? "see more" : "see less"}
              </button>
            </>
          ) : (
            text
          )}
        </div>
      </div>

      {/* Translated result */}
      <div className="flex gap-5 items-center">
        <SpeakerIcon text={result} classes="self-start" />
        <div className="break-words" style={{ fontSize: `${fontSize}px` }}>
          {needsTruncation(result) ? (
            <>
              {shrinkResult ? result.slice(0, 100) + "..." : result}
              <button
                onClick={() => setShrinkResult(!shrinkResult)}
                className="ml-2 text-blue-400 hover:underline cursor-pointer"
              >
                {shrinkResult ? "see more" : "see less"}
              </button>
            </>
          ) : (
            result
          )}
        </div>
      </div>
    </div>
  );
};

export default PhraseDetails;
