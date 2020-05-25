import Snap from "./snap.js";

let browser = chrome;

let shortcutIndex = [
  "swift-snap-down",
  "swift-snap-left",
  "swift-snap-right",
  "swift-snap-up",
];

let index = -1;

browser.commands.onCommand.addListener((command) => {
  index = shortcutIndex.indexOf(command) || 0;
  console.log(index);
  browser.tabs.executeScript({
    code:
      "chrome.runtime.sendMessage({top: window.screen.availTop, left: window.screen.availLeft, width: window.screen.availWidth, height: window.screen.availHeight});",
  });
});

browser.runtime.onMessage.addListener((req) => {
  browser.storage.local.get((configs) => {
    if (index < configs.saved.length) {
      Snap.toConfig(configs.saved[index], req);
      index = -1;
    }
  });
});
