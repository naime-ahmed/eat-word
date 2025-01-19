export function debounceUpdate(func, delay) {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  //cancel method to clear the timeout
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}