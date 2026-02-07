// src/utils/browserAPI.ts

interface BrowserAPI {
  runtime: typeof chrome.runtime;
  storage: typeof chrome.storage;
  tabs: typeof chrome.tabs;
}

let cachedAPI: BrowserAPI | null = null;

const getBrowserAPI = (): BrowserAPI => {
  if (cachedAPI) {
    return cachedAPI;
  }

  if (typeof chrome !== "undefined" && chrome.runtime && chrome.storage) {
    cachedAPI = chrome as BrowserAPI;
    return cachedAPI;
  } else if (
    typeof browser !== "undefined" &&
    browser.runtime &&
    browser.storage
  ) {
    cachedAPI = browser as unknown as BrowserAPI;
    return cachedAPI;
  }
  throw new Error("No browser API available");
};

// Export a proxy object that lazily gets the API
export const browserAPI = new Proxy({} as BrowserAPI, {
  get(_target, prop) {
    const api = getBrowserAPI();
    return api[prop as keyof BrowserAPI];
  },
});

export const isExtensionContext = (): boolean => {
  try {
    getBrowserAPI();
    return true;
  } catch {
    return false;
  }
};
