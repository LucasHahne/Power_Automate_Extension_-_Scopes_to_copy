// src/content/contentScript.ts
import { PanelObserver } from "../utils/panelObserver";
import { ExpressionWindowObserver } from "../utils/expressionWindowObserver";
import { browserAPI } from "../utils/browserAPI";

const panelObserver = new PanelObserver();
const expressionWindowObserver = new ExpressionWindowObserver();

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
  } else if (message.type === "SET_EXPAND_EXPRESSION_WINDOW_DEFAULT") {
    const { expandExpressionWindowDefault } = message.payload ?? {};
    expressionWindowObserver.setActive(!!expandExpressionWindowDefault);
    sendResponse({ success: true, expandExpressionWindowDefault: !!expandExpressionWindowDefault });
  } else if (message.type === "GET_OBSERVER_STATE") {
    sendResponse({ isRunning: panelObserver.isRunning() });
  }

  return true;
});

browserAPI.storage.local
  .get(["isActive", "panelWidthPercent", "expandExpressionWindowDefault"])
  .then((result) => {
    const rawActive = result.isActive;
    const isActive = rawActive ?? true;
    const widthPercentRaw = result.panelWidthPercent;
    const widthPercent =
      typeof widthPercentRaw === "number" ? widthPercentRaw : 60;
    const expandExpressionWindowDefault =
      result.expandExpressionWindowDefault === true;
    panelObserver.setWidthPercent(widthPercent);
    expressionWindowObserver.setActive(expandExpressionWindowDefault);
    if (isActive) {
      panelObserver.start();
    }
  })
  .catch((error) => {
    console.error("Error loading state:", error);
  });

console.log("Content script loaded");
