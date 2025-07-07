import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timeoutIdRef = useRef(null);
  const MAX_RETRIES = 1;
  const RETRY_DELAY = 4000;

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      setLoading(false);
      const errorMessage =
        "Cannot call chrome.runtime.sendMessage. This must be run in a Chrome extension.";
      console.error(errorMessage);
      // To allow local development, we are sending mock data
     return;
    }

    setLoading(true);
    setError(null);

    try {
      if (options?.includeToken) {
        const { accessToken } = await chrome.storage.local.get("accessToken");

        if (!accessToken) {
          throw new Error(
            "Authentication token not found for a private request."
          );
        }

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        delete options.includeToken;
      }

      const response = await chrome.runtime.sendMessage({
        type: "api-request",
        url,
        options,
      });

      if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
      }

      if (response && response.error) {
        if (response.status >= 500) {
          // Preserve full error object for retries
          throw response;
        } else {
          // Non-retryable errors
          setError(response);
          setLoading(false);
          return;
        }
      }

      // On success, update data and stop loading
      setData(response);
      setLoading(false);
    } catch (err) {
      console.log("fetch error:", err);
      if (attempt < MAX_RETRIES && err?.status >= 500) {
        // Retry server errors
        timeoutIdRef.current = setTimeout(() => {
          setAttempt((prev) => prev + 1);
        }, RETRY_DELAY);
      } else {
        // Final error handling
        setError(
          err.status
            ? err
            : {
                message: err.message || "Unknown error",
              }
        );
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, attempt]);

  // This effect triggers the fetch when the url or attempt count changes
  useEffect(() => {
    fetchData();
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [fetchData]);

  // This effect resets the entire fetch cycle when the URL changes
  useEffect(() => {
    setData(null);
    setError(null);
    setAttempt(0);
  }, [url]);

  // Expose a function to allow the UI to trigger a manual retry
  const retry = useCallback(() => {
    setData(null);
    setError(null);
    setAttempt(0);
  }, []);

  return { data, loading, error, retry };
};

export default useFetch;
