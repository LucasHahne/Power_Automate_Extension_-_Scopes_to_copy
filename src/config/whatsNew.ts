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
  version: "2.1.1.0",
  highlights: [
    "New error handlers that email an HTML table of failed actions (full and condensed). Recommendation is the condensed version due to its simplicty. In case you are using the long version, you have to add a single space in the first part of the filter expression. That's due to a parsing issue in PowerAutomate itself.",
    "The mail-only and terminate-only basic handlers are gone, so the error-handling list stays focused on the scopes you actually use.",
    "Click the info icon next to the version number in the footer anytime to reopen these release notes.",
  ],
};
