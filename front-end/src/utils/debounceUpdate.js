export function debounceUpdate(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      try {
        await func(...args);
      } catch (error) {
        console.error("Error in debounced function:", error);
      }
    }, delay);
  };
}
