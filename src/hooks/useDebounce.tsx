import { useEffect, useState } from "react";

export default function useDebounce(
  callback: () => void,
  delay: number,
  deps: any[]
) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      callback();
      setTimeoutId(null);
    }, delay);
    setTimeoutId(id);

    return () => (timeoutId ? clearTimeout(timeoutId) : undefined);
  }, [...deps]);

  return !!timeoutId;
}
