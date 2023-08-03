import { useRef, useState, useEffect } from "react";

/**
 * Use the previous state value
 * @param {*} value Current state value
 * @param {*} defaultVal Default value of the state
 * @returns
 */
export const usePrevious = (value, defaultVal) => {
  const ref = useRef(defaultVal);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * Triggers on every useEffect after the first
 * @param {*} fn Function to call
 * @param {*} inputs Dependencies
 */
export const useDidUpdateEffect = (fn, inputs) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
};

export const useStateWithCallback = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const setValueAndCallback = (newValue, callback) => {
    setValue((prevValue) => {
      if (callback) {
        callback(prevValue, newValue);
      }
      return newValue;
    });
  };

  return [value, setValueAndCallback];
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
