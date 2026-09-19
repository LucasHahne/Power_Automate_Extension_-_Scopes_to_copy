import { useCallback, useEffect, useState } from "react";
import { browserAPI, isExtensionContext } from "../utils/browserAPI";

const STORAGE_KEY = "lastSeenWhatsNewVersion";

function getManifestVersion(): string {
  if (!isExtensionContext()) return "unknown";
  try {
    const manifest = browserAPI.runtime.getManifest() as { version?: string };
    return manifest?.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Tracks whether the "What's new" popup should be shown for the current
 * release. Compares the manifest version to the last version the user has
 * already acknowledged (persisted in chrome.storage.local). `open` reopens
 * the same popup on demand (e.g. from the footer version control).
 */
export function useWhatsNew() {
  const currentVersion = getManifestVersion();
  const [shouldShow, setShouldShow] = useState(false);
  const [hydrated, setHydrated] = useState(() => !isExtensionContext());

  useEffect(() => {
    // Outside an extension context `hydrated` already initializes to true.
    if (!isExtensionContext()) return;

    browserAPI.storage.local
      .get([STORAGE_KEY])
      .then((result: Record<string, unknown>) => {
        const lastSeen = result[STORAGE_KEY];
        // Keep an already-opened dialog visible if storage resolves later.
        setShouldShow((prev) => prev || lastSeen !== currentVersion);
      })
      .catch((err) => {
        console.error("Error loading what's-new state:", err);
      })
      .finally(() => setHydrated(true));
  }, [currentVersion]);

  const open = useCallback(() => {
    setShouldShow(true);
  }, []);

  const dismiss = useCallback(() => {
    setShouldShow(false);
    if (!isExtensionContext()) return;
    browserAPI.storage.local
      .set({ [STORAGE_KEY]: currentVersion })
      .catch((err) => console.error("Error saving what's-new state:", err));
  }, [currentVersion]);

  return { shouldShow, hydrated, dismiss, open, currentVersion };
}
