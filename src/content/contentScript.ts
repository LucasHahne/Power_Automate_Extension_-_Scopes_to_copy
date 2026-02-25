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
  } else if (message.type === "SET_PANEL_WIDTH_PERCENT") {
    const { widthPercent } = message.payload ?? {};
    panelObserver.setWidthPercent(widthPercent);
    sendResponse({ success: true, widthPercent });
  } else if (message.type === "GET_OBSERVER_STATE") {
    sendResponse({ isRunning: panelObserver.isRunning() });
  }

  return true;
});

// #region agent log
const _log = (msg: string, d: Record<string, unknown>) => {
  fetch("http://127.0.0.1:7244/ingest/95e32b20-4201-4420-b55f-b8b70e73c946", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "9f5981" },
    body: JSON.stringify({
      sessionId: "9f5981",
      location: "contentScript.ts",
      message: msg,
      data: d,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};
// #endregion
browserAPI.storage.local
  .get(["isActive", "panelWidthPercent"])
  .then((result) => {
    const rawActive = result.isActive;
    const isActive = rawActive ?? true;
    const widthPercentRaw = result.panelWidthPercent;
    const widthPercent =
      typeof widthPercentRaw === "number" ? widthPercentRaw : 60;
    // #region agent log
    _log("Storage loaded on init", {
      hypothesisId: "H1",
      rawIsActive: rawActive,
      resolvedIsActive: isActive,
      willCallStart: isActive,
    });
    // #endregion
    panelObserver.setWidthPercent(widthPercent);
    if (isActive) {
      // #region agent log
      _log("Calling panelObserver.start() on load", { hypothesisId: "H2" });
      // #endregion
      panelObserver.start();
    }
  })
  .catch((error) => {
    console.error("Error loading state:", error);
  });

console.log("Content script loaded");
