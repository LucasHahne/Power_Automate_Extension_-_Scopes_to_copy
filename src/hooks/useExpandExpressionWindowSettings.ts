import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY = "expandExpressionWindowDefault";

export function useExpandExpressionWindowSettings() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: Record<string, unknown>) => {
        const stored =
          typeof result[STORAGE_KEY] === "boolean" ? result[STORAGE_KEY] : false;
        setIsActive(stored);
      })
      .catch((err) =>
        console.error("Error loading expand expression window setting:", err),
      );
  }, []);

  const broadcast = useCallback(async (nextActive: boolean) => {
    const tabs = await browserAPI.tabs.query({
      url: "*://make.powerautomate.com/*",
    });

    for (const tab of tabs) {
      if (!tab.id) continue;
      try {
        await browserAPI.tabs.sendMessage(tab.id, {
          type: "SET_EXPAND_EXPRESSION_WINDOW_DEFAULT",
          payload: { expandExpressionWindowDefault: nextActive },
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
      await browserAPI.storage.local.set({ [STORAGE_KEY]: nextActive });
      await broadcast(nextActive);
    } catch (err) {
      console.error("Error saving expand expression window setting:", err);
    }
  }, [broadcast, isActive]);

  return { isActive, toggleActive };
}
