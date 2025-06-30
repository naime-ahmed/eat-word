import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { selectedTextAtom } from "../atoms/text";
import { userAtom } from "../atoms/user";
import Header from "./components/Header/Header";
import Translation from "./components/Translation";

/*
 API source:
 code: https://github.com/Songkeys/Translateer
 web: https://t.song.work/
 api-end: https://t.song.work/api?text=love&from=en&to=bn
*/

function App() {
  const [text, setText] = useAtom(selectedTextAtom);
  const setUser = useSetAtom(userAtom);
  const appRef = useRef(null);

  useEffect(() => {
    const appElement = appRef.current;
    if (!appElement) return;

    // The function that sends the resize message
    const sendHeight = () => {
      const height = appElement.scrollHeight;
      window.parent.postMessage(
        {
          type: "resize-eatword-panel",
          height: height,
        },
        "*"
      );
    };

    // Use a ResizeObserver to automatically detect content size changes
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(appElement);

    // Send the initial height immediately
    sendHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // check user authenticity
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      console.warn("Not in a Chrome extension context. Auth check skipped.");
      setUser((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    chrome.runtime.sendMessage({ action: "CHECK_AUTH" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Auth check failed:", chrome.runtime.lastError.message);
      } else if (response && response.isAuthenticated) {
        setUser((prev) => ({
          ...prev,
          isAuthenticated: true,
          userData: response.user,
        }));
      }
      setUser((prev) => ({ ...prev, isLoading: false }));
    });
  }, [setUser]);

  // listen for live authentication state changes
  useEffect(() => {
    const handleAuthChange = (message) => {
      if (message.action === "AUTH_STATE_CHANGED") {
        console.log("Auth state changed message received by UI:", message);
        setUser((prev) => ({
          ...prev,
          isAuthenticated: message.isAuthenticated,
          userData: message.isAuthenticated ? message.user : {},
          isLoading: false,
        }));
      }
    };

    chrome.runtime.onMessage.addListener(handleAuthChange);

    return () => {
      chrome.runtime.onMessage.removeListener(handleAuthChange);
    };
  }, [setUser]);

  // extract the selected text
  useEffect(() => {
    // Get selected text from the iframe's URL
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get("text") || "";

    if (selectedText) {
      setText(selectedText);
    } else {
      console.log("no text selected");
    }
  }, [setText]);

  return (
    <div ref={appRef} className="flex flex-col h-full  bg-slate-900 text-white">
      <div className="relative p-4 h-full flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0">
          <Header />
        </header>
        {/* Content */}
        <main
          className="flex-grow max-h-60 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-slate-500/50 hover:scrollbar-thumb-slate-400/70 scrollbar-thumb-rounded-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
          }}
        >
          <Translation text={text} />
        </main>
      </div>
    </div>
  );
}

export default App;
