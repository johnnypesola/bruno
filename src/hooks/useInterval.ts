import { useEffect, useRef } from "react";

type RefType = () => any | undefined;

const useInterval = (callback: () => any, delay: number) => {
    const savedCallback = useRef<RefType>();
  
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      const tick = () => savedCallback.current && savedCallback.current();
  
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

export default useInterval;