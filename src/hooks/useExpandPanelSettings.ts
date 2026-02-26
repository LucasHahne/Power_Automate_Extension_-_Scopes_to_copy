import { useCallback, useEffect, useRef, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const DEFAULT_WIDTH_PERCENT = 60;
const SAVE_DEBOUNCE_MS = 400;

function clampWidthPercent(value: number): number {
  const n = Number.isFinite(value) ? Math.trunc(value) : DEFAULT_WIDTH_PERCENT;
  return Math.min(100, Math.max(1, n));
}

export function useExpandPanelSettings() {
  const [isActive, setIsActive] = useState(true);
  const [widthPercent, setWidthPercentState] = useState<number>(
    DEFAULT_WIDTH_PERCENT,
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWidthRef = useRef<number | null>(null);

  // Retrieve panel width (and active state) from extension storage on mount.
  // Migration: if new keys missing, read from old keys (isActive, panelWidthPercent) and persist to new keys.
  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get(["expandPanelActive", "expandPanelWidthPercent", "isActive", "panelWidthPercent"])
      .then((result: Record<string, unknown>) => {
        const storedActive =
          typeof result.expandPanelActive === "boolean"
            ? result.expandPanelActive
            : typeof result.isActive === "boolean"
              ? result.isActive
              : true;
        const widthRaw = result.expandPanelWidthPercent ?? result.panelWidthPercent;
        const hasValidWidth =
          typeof widthRaw === "number" && Number.isFinite(widthRaw);
        const storedWidth = hasValidWidth
          ? clampWidthPercent(widthRaw as number)
          : DEFAULT_WIDTH_PERCENT;

        setIsActive(storedActive);
        setWidthPercentState(storedWidth);

        const toSet: Record<string, unknown> = {};
        if (result.expandPanelActive === undefined && typeof result.isActive === "boolean") {
          toSet.expandPanelActive = storedActive;
        }
        if (!hasValidWidth || result.expandPanelWidthPercent === undefined) {
          toSet.expandPanelWidthPercent = storedWidth;
        }
        if (Object.keys(toSet).length > 0) {
          browserAPI.storage.local.set(toSet).catch((err) =>
            console.error("Error migrating panel storage:", err),
          );
        }
      })
      .catch((err) => console.error("Error loading expand settings:", err));
  }, []);

  const broadcastActive = useCallback(async (nextActive: boolean) => {
    const tabs = await browserAPI.tabs.query({
      url: "*://make.powerautomate.com/*",
    });

    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await browserAPI.tabs.sendMessage(tab.id, {
          type: "SET_EXPAND_PANEL_ACTIVE",
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
          type: "SET_EXPAND_PANEL_WIDTH_PERCENT",
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
      await browserAPI.storage.local.set({ expandPanelActive: nextActive });
      await broadcastActive(nextActive);
    } catch (err) {
      console.error("Error saving active state:", err);
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
      .set({ expandPanelWidthPercent: next })
      .then(() => broadcastWidthPercent(next))
      .catch((err) => console.error("Error saving width percent:", err));
  }, [broadcastWidthPercent]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (pendingWidthRef.current !== null) {
        const w = pendingWidthRef.current;
        pendingWidthRef.current = null;
        if (isExtensionContext()) {
          browserAPI.storage.local
            .set({ expandPanelWidthPercent: w })
            .then(() => broadcastWidthPercent(w))
            .catch((err) => console.error("Error saving width percent:", err));
        }
      }
    };
  }, [broadcastWidthPercent]);

  // Persist panel width to storage and broadcast after debounce so only the last value is saved.
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
          .set({ expandPanelWidthPercent: toSave })
          .then(() => broadcastWidthPercent(toSave))
          .catch((err) => console.error("Error saving width percent:", err));
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

