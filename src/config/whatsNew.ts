/**
 * Single source of truth for the "What's new" release popup.
 *
 * On every version bump:
 *   1. Update `package.json` and `public/manifest.json` versions.
 *   2. Update `WHATS_NEW.version` and `WHATS_NEW.highlights` below.
 *   3. Keep the README "Version history" in sync.
 *
 * If `WHATS_NEW.version` ever falls out of sync with the manifest version,
 * the popup still shows for the manifest version and uses these highlights,
 * so a forgotten notes bump never hides the popup.
 */

/** Chrome Web Store reviews page for this extension. */
export const CHROME_STORE_REVIEWS_URL =
  "https://chromewebstore.google.com/detail/hfbdkblkbenbeeoccmbpmpgkakmckdmc/reviews";

export interface WhatsNew {
  version: string;
  highlights: string[];
}

export const WHATS_NEW: WhatsNew = {
  version: "2.1.2.0",
  highlights: [
    "New Word category: Populate Word template and save it as PDF to Sharepoint (fills a template, converts it to PDF, then cleans up the temporary Word file), and Save Word as PDF to Sharepoint (converts an existing Word document to PDF).",
  ],
};
