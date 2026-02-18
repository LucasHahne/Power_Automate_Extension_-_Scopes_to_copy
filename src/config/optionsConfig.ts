import type { OptionDefinition } from "../types";

/**
 * Central list of options shown in the options section.
 * Add new entries here to add new options; useOptions() will sync with storage
 * and optional side effects (e.g. notifying content script) are handled in the hook.
 */
export const OPTIONS_CONFIG: OptionDefinition[] = [
  // (reserved for future simple on/off options that can be shown as standalone rows)
  // Add more options here in the future, e.g.:
  // { id: "darkMode", label: "Use dark theme", storageKey: "darkMode" },
];
