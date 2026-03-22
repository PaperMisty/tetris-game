import { useEffect, useRef } from 'react';

// Thanks to Dan Abramov for this custom hook!
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
