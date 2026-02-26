// src/content/contentScript.ts
import { PanelObserver } from "../utils/panelObserver";
import { ExpressionWindowObserver } from "../utils/expressionWindowObserver";
import { browserAPI } from "../utils/browserAPI";

const DEFAULT_PANEL_WIDTH_PERCENT = 60;

const panelObserver = new PanelObserver();
const expressionWindowObserver = new ExpressionWindowObserver();

browserAPI.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SET_EXPAND_PANEL_ACTIVE") {
    const { isActive } = message.payload;

    if (isActive) {
      panelObserver.start();
    } else {
      panelObserver.stop();
    }

    sendResponse({ success: true, isRunning: panelObserver.isRunning() });
  } else if (message.type === "SET_EXPAND_PANEL_WIDTH_PERCENT") {
    const { widthPercent } = message.payload ?? {};
    panelObserver.setWidthPercent(widthPercent);
    sendResponse({ success: true, widthPercent });
  } else if (message.type === "SET_EXPAND_EXPRESSION_WINDOW_ACTIVE") {
    const { isActive } = message.payload ?? {};
    expressionWindowObserver.setActive(!!isActive);
    sendResponse({ success: true, isActive: !!isActive });
  } else if (message.type === "SET_EXPAND_EXPRESSION_WINDOW_WIDTH_PERCENT") {
    const { widthPercent } = message.payload ?? {};
    expressionWindowObserver.setWidthPercent(widthPercent);
    sendResponse({ success: true, widthPercent });
  } else if (message.type === "GET_OBSERVER_STATE") {
    sendResponse({ isRunning: panelObserver.isRunning() });
  }

  return true;
});

// Retrieve panel and expression window settings from extension storage when content script loads.
// Keys: expandPanel* = output/input panel, expandExpressionWindow* = expression dialog.
// Migration: if new keys missing, read from old keys (isActive, panelWidthPercent, expandExpressionWindowDefault) and persist to new keys.
const DEFAULT_EXPRESSION_WINDOW_WIDTH_PERCENT = 50;
browserAPI.storage.local
  .get([
    "expandPanelActive",
    "expandPanelWidthPercent",
    "expandExpressionWindowActive",
    "expandExpressionWindowWidthPercent",
    "isActive",
    "panelWidthPercent",
    "expandExpressionWindowDefault",
  ])
  .then((result) => {
    const panelActiveRaw = result.expandPanelActive ?? result.isActive;
    const expandPanelActive =
      typeof panelActiveRaw === "boolean" ? panelActiveRaw : true;
    const panelWidthRaw = result.expandPanelWidthPercent ?? result.panelWidthPercent;
    const hasValidPanelWidth =
      typeof panelWidthRaw === "number" && Number.isFinite(panelWidthRaw);
    const expandPanelWidthPercent = hasValidPanelWidth
      ? Math.min(100, Math.max(1, Math.trunc(panelWidthRaw as number)))
      : DEFAULT_PANEL_WIDTH_PERCENT;

    const expressionActiveRaw = result.expandExpressionWindowActive ?? result.expandExpressionWindowDefault;
    const expandExpressionWindowActive =
      typeof expressionActiveRaw === "boolean" ? expressionActiveRaw : false;
    const expressionWidthRaw = result.expandExpressionWindowWidthPercent;
    const hasValidExpressionWidth =
      typeof expressionWidthRaw === "number" && Number.isFinite(expressionWidthRaw);
    const expandExpressionWindowWidthPercent = hasValidExpressionWidth
      ? Math.min(100, Math.max(1, Math.trunc(expressionWidthRaw as number)))
      : DEFAULT_EXPRESSION_WINDOW_WIDTH_PERCENT;

    const toSet: Record<string, number | boolean> = {};
    if (result.expandPanelActive === undefined && typeof result.isActive === "boolean") {
      toSet.expandPanelActive = expandPanelActive;
    }
    if (!hasValidPanelWidth || result.expandPanelWidthPercent === undefined) {
      toSet.expandPanelWidthPercent = expandPanelWidthPercent;
    }
    if (result.expandExpressionWindowActive === undefined && typeof result.expandExpressionWindowDefault === "boolean") {
      toSet.expandExpressionWindowActive = expandExpressionWindowActive;
    }
    if (!hasValidExpressionWidth || result.expandExpressionWindowWidthPercent === undefined) {
      toSet.expandExpressionWindowWidthPercent = expandExpressionWindowWidthPercent;
    }
    if (Object.keys(toSet).length > 0) {
      browserAPI.storage.local.set(toSet).catch((err) =>
        console.error("Error migrating storage:", err),
      );
    }

    panelObserver.setWidthPercent(expandPanelWidthPercent);
    expressionWindowObserver.setWidthPercent(expandExpressionWindowWidthPercent);
    expressionWindowObserver.setActive(expandExpressionWindowActive);
    if (expandPanelActive) {
      panelObserver.start();
    } else {
      panelObserver.stop();
    }
  })
  .catch((error) => {
    console.error("Error loading state:", error);
  });
