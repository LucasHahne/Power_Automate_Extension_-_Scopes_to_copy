import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY = "snippetCategoryCollapsed";

function parseCollapsedRecord(raw: unknown): Record<string, boolean> {
  if (raw == null || typeof raw !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "boolean") out[key] = value;
  }
  return out;
}

export type UsePersistedSnippetCategoryCollapseReturn = {
  getCollapsed: (categoryId: string) => boolean;
  setCollapsed: (categoryId: string, collapsed: boolean) => void;
  hydrated: boolean;
};

export function usePersistedSnippetCategoryCollapse(): UsePersistedSnippetCategoryCollapseReturn {
  const [collapsedByCategoryId, setCollapsedByCategoryId] = useState<
    Record<string, boolean>
  >({});
  const [hydrated, setHydrated] = useState(() => !isExtensionContext());

  useEffect(() => {
    if (!isExtensionContext()) {
      return;
    }

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: Record<string, unknown>) => {
        setCollapsedByCategoryId(parseCollapsedRecord(result[STORAGE_KEY]));
      })
      .catch((err) =>
        console.error("Error loading snippet category collapse state:", err),
      )
      .finally(() => setHydrated(true));
  }, []);

  const persist = useCallback((next: Record<string, boolean>) => {
    if (!isExtensionContext()) return;
    browserAPI.storage.local
      .set({ [STORAGE_KEY]: next })
      .catch((err) =>
        console.error("Error saving snippet category collapse state:", err),
      );
  }, []);

  const getCollapsed = useCallback(
    (categoryId: string) => collapsedByCategoryId[categoryId] ?? true,
    [collapsedByCategoryId],
  );

  const setCollapsed = useCallback(
    (categoryId: string, collapsed: boolean) => {
      setCollapsedByCategoryId((prev) => {
        const next = { ...prev, [categoryId]: collapsed };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { getCollapsed, setCollapsed, hydrated };
}
