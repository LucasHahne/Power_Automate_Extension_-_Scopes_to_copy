import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY = "scopeMode";
export type ScopeMode = "prebuilt" | "custom";
const DEFAULT_MODE: ScopeMode = "prebuilt";

function isScopeMode(value: unknown): value is ScopeMode {
  return value === "prebuilt" || value === "custom";
}

export function useScopeMode() {
  const [mode, setModeState] = useState<ScopeMode>(DEFAULT_MODE);

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: Record<string, unknown>) => {
        const stored = result[STORAGE_KEY];
        setModeState(isScopeMode(stored) ? stored : DEFAULT_MODE);
      })
      .catch((err) => console.error("Error loading scope mode:", err));
  }, []);

  const setMode = useCallback((next: ScopeMode) => {
    setModeState(next);
    if (!isExtensionContext()) return;
    browserAPI.storage.local
      .set({ [STORAGE_KEY]: next })
      .catch((err) => console.error("Error saving scope mode:", err));
  }, []);

  return { mode, setMode };
}
