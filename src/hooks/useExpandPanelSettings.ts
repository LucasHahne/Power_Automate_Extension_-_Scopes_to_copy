import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const DEFAULT_WIDTH_PERCENT = 60;

function clampWidthPercent(value: number): number {
  const n = Number.isFinite(value) ? Math.trunc(value) : DEFAULT_WIDTH_PERCENT;
  return Math.min(100, Math.max(1, n));
}

export function useExpandPanelSettings() {
  const [isActive, setIsActive] = useState(true);
  const [widthPercent, setWidthPercentState] = useState<number>(
    DEFAULT_WIDTH_PERCENT,
  );

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get(["isActive", "panelWidthPercent"])
      .then((result: Record<string, unknown>) => {
        const storedActive =
          typeof result.isActive === "boolean" ? result.isActive : true;
        const storedWidth =
          typeof result.panelWidthPercent === "number"
            ? result.panelWidthPercent
            : DEFAULT_WIDTH_PERCENT;

        setIsActive(storedActive);
        setWidthPercentState(clampWidthPercent(storedWidth));
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
          type: "SET_ACTIVE_STATE",
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
          type: "SET_PANEL_WIDTH_PERCENT",
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
      await browserAPI.storage.local.set({ isActive: nextActive });
      await broadcastActive(nextActive);
    } catch (err) {
      console.error("Error saving active state:", err);
    }
  }, [broadcastActive, isActive]);

  const setWidthPercent = useCallback(
    async (nextWidthRaw: number) => {
      const nextWidth = clampWidthPercent(nextWidthRaw);
      setWidthPercentState(nextWidth);

      if (!isExtensionContext()) return;

      try {
        await browserAPI.storage.local.set({ panelWidthPercent: nextWidth });
        await broadcastWidthPercent(nextWidth);
      } catch (err) {
        console.error("Error saving width percent:", err);
      }
    },
    [broadcastWidthPercent],
  );

  return {
    isActive,
    toggleActive,
    widthPercent,
    setWidthPercent,
    defaultWidthPercent: DEFAULT_WIDTH_PERCENT,
  };
}

