// src/types/browser.d.ts
declare namespace browser {
  const runtime: typeof chrome.runtime;
  const storage: typeof chrome.storage;
  const tabs: typeof chrome.tabs;
}
