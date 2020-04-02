/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

type RefType = () => any | undefined;

const useInterval = (callback: () => any, delay: number): void => {
  const savedCallback = useRef<RefType>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = (): void => savedCallback.current && savedCallback.current();

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
