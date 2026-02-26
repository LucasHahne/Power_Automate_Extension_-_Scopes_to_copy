// src/hooks/useExtensionState.ts
import { useState, useEffect } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY = "expandPanelActive";
const MESSAGE_TYPE = "SET_EXPAND_PANEL_ACTIVE";

export function useExtensionState() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isExtensionContext()) {
      console.warn("Not in extension context, using local state only");
      return;
    }

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: { [STORAGE_KEY]?: boolean }) => {
        const storedState = result[STORAGE_KEY] ?? true;
        setIsActive(storedState);
      })
      .catch((error) => {
        console.error("Error loading state:", error);
      });
  }, []);

  const toggleActive = async () => {
    const newState = !isActive;
    setIsActive(newState);

    if (!isExtensionContext()) {
      console.warn("Not in extension context, state change is local only");
      return;
    }

    try {
      await browserAPI.storage.local.set({ [STORAGE_KEY]: newState });

      const tabs = await browserAPI.tabs.query({
        url: "*://make.powerautomate.com/*",
      });

      for (const tab of tabs) {
        if (tab.id) {
          try {
            await browserAPI.tabs.sendMessage(tab.id, {
              type: MESSAGE_TYPE,
              payload: { isActive: newState },
            });
          } catch (error) {
            console.error("Error sending message to tab:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };

  return { isActive, toggleActive };
}
