import { readable } from "svelte/store";

let browser = chrome;

const supportedShortcuts = {
  "swift-snap-down": "",
  "swift-snap-left": "",
  "swift-snap-right": "",
  "swift-snap-up": "",
};

export const shortcuts = readable({}, function start(set) {
  browser.commands.getAll((chromeShortcuts) => {
    chromeShortcuts
      .filter((sc) => Object.keys(supportedShortcuts).includes(sc.name))
      .forEach((sc) => {
        supportedShortcuts[sc.name] = sc.shortcut;
      });
    set(supportedShortcuts);
  });

  return function stop() {
    // Do nothing.
  };
});
