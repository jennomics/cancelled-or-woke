"use client";

import { useEffect, useState } from "react";

/** useState backed by localStorage. Falls back to the initial value when storage is unavailable. */
export function useStoredState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      /* storage unavailable or corrupt: keep the initial value */
    }
  }, [key]);

  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage unavailable: value lives for this page load only */
    }
  };

  return [value, set];
}
