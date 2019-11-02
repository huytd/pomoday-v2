import { useRef, useEffect } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  let handler = null;
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== 0) {
      handler = setInterval(tick, delay);
      return () => clearInterval(handler);
    } else {
      clearInterval(handler);
    }
  }, [delay]);
};
