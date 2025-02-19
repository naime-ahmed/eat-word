import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useScrollRestoration = (resetOnRefresh = false) => {
  const location = useLocation();
  const isManualScroll = useRef(false);

  // Disable the browser's automatic scroll restoration.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position on scroll events (debounced).
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;
      clearTimeout(handleScroll.timeout);
      handleScroll.timeout = setTimeout(() => {
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        const safePosition = Math.min(window.scrollY, docHeight - window.innerHeight);
        sessionStorage.setItem(`scrollPos-${location.pathname}`, safePosition.toString());
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(handleScroll.timeout);
    };
  }, [location.pathname]);

  // Restore scroll position on navigation.
  useLayoutEffect(() => {
    isManualScroll.current = true;

    const savedPosStr = sessionStorage.getItem(`scrollPos-${location.pathname}`);
    if (savedPosStr !== null) {
      const savedPos = parseInt(savedPosStr, 10);
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const maxValid = docHeight - window.innerHeight;
      window.scrollTo({ top: Math.min(savedPos, maxValid), behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // Allow scroll events after a short timeout.
    const timer = setTimeout(() => {
      isManualScroll.current = false;
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // remove the scroll position on refresh if demand.
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (resetOnRefresh) {
        sessionStorage.removeItem(`scrollPos-${location.pathname}`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname, resetOnRefresh]);
};
