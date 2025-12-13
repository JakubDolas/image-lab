import { useCallback, useState } from "react";

export function useHistory(ptr: number) {
  const [historyItems, setHistoryItems] = useState<string[]>([]);

  const addHistory = useCallback(
    (label: string, dedupeLast = false) => {
      setHistoryItems((prev) => {
        const base = prev.slice(0, ptr + 1);
        if (dedupeLast && base.at(-1) === label) return base;
        return [...base, label];
      });
    },
    [ptr]
  );

  return { historyItems, setHistoryItems, addHistory };
}
