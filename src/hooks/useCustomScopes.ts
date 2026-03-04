import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";
import type { CustomScope } from "../types";

const STORAGE_KEY = "customScopes";

function generateId(): string {
  return crypto.randomUUID?.() ?? `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useCustomScopes() {
  const [customScopes, setCustomScopes] = useState<CustomScope[]>([]);

  useEffect(() => {
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: Record<string, unknown>) => {
        const raw = result[STORAGE_KEY];
        if (Array.isArray(raw)) {
          const parsed = raw.filter(
            (item): item is CustomScope =>
              item != null &&
              typeof item === "object" &&
              typeof (item as CustomScope).id === "string" &&
              typeof (item as CustomScope).name === "string" &&
              typeof (item as CustomScope).data === "string",
          );
          setCustomScopes(parsed);
        }
      })
      .catch((err) => console.error("Error loading custom scopes:", err));
  }, []);

  const persist = useCallback((scopes: CustomScope[]) => {
    if (!isExtensionContext()) return;
    browserAPI.storage.local
      .set({ [STORAGE_KEY]: scopes })
      .catch((err) => console.error("Error saving custom scopes:", err));
  }, []);

  const addScope = useCallback(
    (name: string, data: string): boolean => {
      let normalized: string;
      try {
        normalized = JSON.stringify(JSON.parse(data));
      } catch {
        return false;
      }
      const newScope: CustomScope = {
        id: generateId(),
        name: name.trim(),
        data: normalized,
      };
      setCustomScopes((prev) => {
        const next = [...prev, newScope];
        persist(next);
        return next;
      });
      return true;
    },
    [persist],
  );

  const removeScope = useCallback(
    (id: string) => {
      setCustomScopes((prev) => {
        const next = prev.filter((s) => s.id !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { customScopes, addScope, removeScope };
}
