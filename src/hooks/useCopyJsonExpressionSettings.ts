import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY_ACTIVE = "copyJsonExpressionActive";

export function useCopyJsonExpressionSettings() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([STORAGE_KEY_ACTIVE])
      .then((result: Record<string, unknown>) => {
        const raw = result[STORAGE_KEY_ACTIVE];
        setIsActive(typeof raw === "boolean" ? raw : true);
      })
      .catch((err) =>
        console.error("Error loading copy JSON expression setting:", err),
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
          type: "SET_COPY_JSON_EXPRESSION_ACTIVE",
          payload: { isActive: nextActive },
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
      console.error("Error saving copy JSON expression setting:", err);
    }
  }, [broadcastActive, isActive]);

  return { isActive, toggleActive };
}
