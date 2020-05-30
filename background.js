import Snap from "./snap.js";

let browser = chrome;

let shortcutIndex = [
  "swift-snap-down",
  "swift-snap-left",
  "swift-snap-right",
  "swift-snap-up",
];

// TODO: Map each config to different shortcut
browser.commands.onCommand.addListener((command) => {
  let index = shortcutIndex.indexOf(command) || 0;
  browser.storage.local.get((configs) => {
    if (index < configs.saved.length) {
      Snap.toConfig(configs.saved[index]);
      index = -1;
    }
  });
});
