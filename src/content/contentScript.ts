// src/content/contentScript.ts
import { PanelObserver } from "../utils/panelObserver";
import { browserAPI } from "../utils/browserAPI";

const panelObserver = new PanelObserver();

browserAPI.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SET_ACTIVE_STATE") {
    const { isActive } = message.payload;

    if (isActive) {
      panelObserver.start();
      console.log("Panel observer started");
    } else {
      panelObserver.stop();
      console.log("Panel observer stopped");
    }

    sendResponse({ success: true, isRunning: panelObserver.isRunning() });
  } else if (message.type === "GET_OBSERVER_STATE") {
    sendResponse({ isRunning: panelObserver.isRunning() });
  }

  return true;
});

browserAPI.storage.local
  .get(["isActive"])
  .then((result) => {
    const isActive = result.isActive ?? true;
    if (isActive) {
      panelObserver.start();
    }
  })
  .catch((error) => {
    console.error("Error loading state:", error);
  });

console.log("Content script loaded");
