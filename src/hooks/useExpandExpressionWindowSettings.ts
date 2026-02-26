import { useCallback, useEffect, useRef, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const DEFAULT_WIDTH_PERCENT = 50;
const SAVE_DEBOUNCE_MS = 400;

const STORAGE_KEY_ACTIVE = "expandExpressionWindowActive";
const STORAGE_KEY_WIDTH = "expandExpressionWindowWidthPercent";

function clampWidthPercent(value: number): number {
  const n = Number.isFinite(value) ? Math.trunc(value) : DEFAULT_WIDTH_PERCENT;
  return Math.min(100, Math.max(1, n));
}

export function useExpandExpressionWindowSettings() {
  const [isActive, setIsActive] = useState(false);
  const [widthPercent, setWidthPercentState] = useState<number>(DEFAULT_WIDTH_PERCENT);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWidthRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([
        STORAGE_KEY_ACTIVE,
        STORAGE_KEY_WIDTH,
        "expandExpressionWindowDefault",
      ])
      .then((result: Record<string, unknown>) => {
        const activeRaw = result[STORAGE_KEY_ACTIVE] ?? result.expandExpressionWindowDefault;
        const storedActive =
          typeof activeRaw === "boolean" ? activeRaw : false;
        const widthRaw = result[STORAGE_KEY_WIDTH];
        const hasValidWidth =
          typeof widthRaw === "number" && Number.isFinite(widthRaw);
        const storedWidth = hasValidWidth
          ? clampWidthPercent(widthRaw as number)
          : DEFAULT_WIDTH_PERCENT;

        setIsActive(storedActive);
        setWidthPercentState(storedWidth);

        const toSet: Record<string, unknown> = {};
        if (result[STORAGE_KEY_ACTIVE] === undefined && typeof result.expandExpressionWindowDefault === "boolean") {
          toSet[STORAGE_KEY_ACTIVE] = storedActive;
        }
        if (!hasValidWidth || result[STORAGE_KEY_WIDTH] === undefined) {
          toSet[STORAGE_KEY_WIDTH] = storedWidth;
        }
        if (Object.keys(toSet).length > 0) {
          browserAPI.storage.local.set(toSet).catch((err) =>
            console.error("Error migrating expression window storage:", err),
          );
        }
      })
      .catch((err) =>
        console.error("Error loading expand expression window setting:", err),
      );
  }, []);

  const broadcastActive = useCallback(async (nextActive: boolean) => {
    const tabs = await browserAPI.tabs.query({
      url: "*://make.powerautomate.com/*",
    });
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await browserAPI.tabs.sendMessage(tab.id, {
          type: "SET_EXPAND_EXPRESSION_WINDOW_ACTIVE",
          payload: { isActive: nextActive },
        });
      } catch {
        // ignore tabs without content script
      }
    }
  }, []);

  const broadcastWidthPercent = useCallback(async (nextWidth: number) => {
    const tabs = await browserAPI.tabs.query({
      url: "*://make.powerautomate.com/*",
    });
    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await browserAPI.tabs.sendMessage(tab.id, {
          type: "SET_EXPAND_EXPRESSION_WINDOW_WIDTH_PERCENT",
          payload: { widthPercent: nextWidth },
        });
      } catch {
        // ignore tabs without content script
      }
    }
  }, []);

  const toggleActive = useCallback(async () => {
    const nextActive = !isActive;
    setIsActive(nextActive);

    if (!isExtensionContext()) return;

    try {
      await browserAPI.storage.local.set({ [STORAGE_KEY_ACTIVE]: nextActive });
      await broadcastActive(nextActive);
    } catch (err) {
      console.error("Error saving expand expression window setting:", err);
    }
  }, [broadcastActive, isActive]);

  const flushWidthSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const next = pendingWidthRef.current;
    if (next === null || !isExtensionContext()) return;
    pendingWidthRef.current = null;
    browserAPI.storage.local
      .set({ [STORAGE_KEY_WIDTH]: next })
      .then(() => broadcastWidthPercent(next))
      .catch((err) =>
        console.error("Error saving expression window width percent:", err),
      );
  }, [broadcastWidthPercent]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (pendingWidthRef.current !== null) {
        const w = pendingWidthRef.current;
        pendingWidthRef.current = null;
        if (isExtensionContext()) {
          browserAPI.storage.local
            .set({ [STORAGE_KEY_WIDTH]: w })
            .then(() => broadcastWidthPercent(w))
            .catch((err) =>
              console.error("Error saving expression window width percent:", err),
            );
        }
      }
    };
  }, [broadcastWidthPercent]);

  const setWidthPercent = useCallback(
    (nextWidthRaw: number) => {
      const nextWidth = clampWidthPercent(nextWidthRaw);
      setWidthPercentState(nextWidth);

      if (!isExtensionContext()) return;

      pendingWidthRef.current = nextWidth;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        const toSave = pendingWidthRef.current;
        pendingWidthRef.current = null;
        if (toSave === null) return;
        browserAPI.storage.local
          .set({ [STORAGE_KEY_WIDTH]: toSave })
          .then(() => broadcastWidthPercent(toSave))
          .catch((err) =>
            console.error("Error saving expression window width percent:", err),
          );
      }, SAVE_DEBOUNCE_MS);
    },
    [broadcastWidthPercent],
  );

  return {
    isActive,
    toggleActive,
    widthPercent,
    setWidthPercent,
    flushWidthSave,
    defaultWidthPercent: DEFAULT_WIDTH_PERCENT,
  };
}
