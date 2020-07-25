import "chrome-extension-async";
import { readable } from "svelte/store";

const browser = chrome;

const supportedShortcuts = {
  "swift-snap-down": "",
  "swift-snap-left": "",
  "swift-snap-right": "",
  "swift-snap-up": "",
};

export const shortcuts = readable({}, async function start(set) {
  const chromeShortcuts = await browser.commands.getAll();
  chromeShortcuts
    .filter((sc) => Object.keys(supportedShortcuts).includes(sc.name))
    .forEach((sc) => {
      supportedShortcuts[sc.name] = sc.shortcut;
    });
  set(supportedShortcuts);

  return function stop() {
    // Do nothing.
  };
});
