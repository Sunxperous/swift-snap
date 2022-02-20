import "chrome-extension-async";
import { readable } from "svelte/store";

const browser = chrome;

const supportedShortcuts = {
  "swift-snap-down": "",
  "swift-snap-left": "",
  "swift-snap-right": "",
  "swift-snap-up": "",
  "move-next-display": "",
  "swift-snap-xtra-1": "",
  "swift-snap-xtra-2": "",
  "swift-snap-xtra-3": "",
  "swift-snap-xtra-4": "",
  "swift-snap-xtra-5": "",
};

async function loadAndSetShortcuts(set) {
  const chromeShortcuts = await browser.commands.getAll();
  chromeShortcuts
    .filter((sc) => Object.keys(supportedShortcuts).includes(sc.name))
    .forEach((sc) => {
      supportedShortcuts[sc.name] = sc.shortcut;
    });
  set(supportedShortcuts);
}

export const shortcuts = readable({}, function start(set) {
  loadAndSetShortcuts(set);

  return function stop() {
    // Do nothing.
  };
});
