import { useState, useEffect, useCallback } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";
import { OPTIONS_CONFIG } from "../config/optionsConfig";
import type { OptionItem } from "../components/Options";

const STORAGE_KEYS = OPTIONS_CONFIG.map((o) => o.storageKey);

/**
 * Loads and persists all options from OPTIONS_CONFIG.
 * Handles side effects (e.g. notifying content script when "isActive" changes).
 * Add new options in optionsConfig; they appear here automatically.
 */
export function useOptions(): OptionItem[] {
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const opt of OPTIONS_CONFIG) {
      initial[opt.id] = opt.storageKey === "isActive" ? true : false;
    }
    return initial;
  });

  useEffect(() => {
    if (!isExtensionContext()) return;

    const keys = [...new Set(STORAGE_KEYS)];
    browserAPI.storage.local
      .get(keys)
      .then((result: Record<string, unknown>) => {
        const next: Record<string, boolean> = {};
        for (const opt of OPTIONS_CONFIG) {
          const raw = result[opt.storageKey];
          next[opt.id] =
            typeof raw === "boolean" ? raw : opt.storageKey === "isActive";
        }
        setValues(next);
      })
      .catch((err) => console.error("Error loading options:", err));
  }, []);

  const setOption = useCallback(
    async (id: string, value: boolean) => {
      const def = OPTIONS_CONFIG.find((o) => o.id === id);
      if (!def) return;

      setValues((prev) => ({ ...prev, [id]: value }));

      if (!isExtensionContext()) return;

      try {
        await browserAPI.storage.local.set({ [def.storageKey]: value });

        if (def.storageKey === "isActive") {
          const tabs = await browserAPI.tabs.query({
            url: "*://make.powerautomate.com/*",
          });
          for (const tab of tabs) {
            if (tab.id) {
              try {
                await browserAPI.tabs.sendMessage(tab.id, {
                  type: "SET_ACTIVE_STATE",
                  payload: { isActive: value },
                });
              } catch {
                // Tab may not have content script
              }
            }
          }
        }

        if (def.afterSet) {
          await def.afterSet(value);
        }
      } catch (err) {
        console.error("Error saving option:", err);
      }
    },
    []
  );

  return OPTIONS_CONFIG.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: values[opt.id] ?? (opt.storageKey === "isActive"),
    onChange: (checked: boolean) => setOption(opt.id, checked),
  }));
}
