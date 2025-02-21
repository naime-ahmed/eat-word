import { useEffect, useRef, useState } from "react";

export const useTurnstile = (options = {}) => {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);

  // Default options
  const {
    sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY,
    theme = "auto",
    action,
    cData,
    execution = "render",
    appearance = "always",
    language,
    tabIndex = 0,
  } = options;

  // Initialize Turnstile
  useEffect(() => {
    const initialize = () => {
      if (!window.turnstile || !containerRef.current) return;

      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey,
        theme,
        action,
        cData,
        execution,
        appearance,
        language,
        tabIndex,
        callback: (t) => {
          setToken(t);
          options.onVerify?.(t);
        },
        "error-callback": (error) => {
          options.onError?.(error);
          reset();
        },
        "expired-callback": () => {
          options.onExpire?.();
          reset();
        },
      });

      setIsReady(true);
    };

    if (window.turnstile) {
      initialize();
    } else {
      window.addEventListener("load", initialize);
    }

    return () => {
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
      }
      window.removeEventListener("load", initialize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    if (widgetId.current) {
      window.turnstile?.reset(widgetId.current);
      setToken("");
    }
  };

  return {
    containerRef,
    token,
    reset,
    isReady,
    widgetId: widgetId.current,
  };
};
