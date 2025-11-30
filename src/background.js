console.log("Service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
