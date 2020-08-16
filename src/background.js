import "chrome-extension-async";
import { determineScreenOfWindow, snap } from "./snap.js";
import { Rect } from "./rect.js";

const browser = chrome;

browser.commands.onCommand.addListener((command) => {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    const screen = determineScreenOfWindow(currWindow, displays);
    const layouts = (await browser.storage.local.get()).saved;
    let firstMatch = -1;
    let matchesCurrentLayout = false;
    for (let i = 0; i < layouts.length; ++i) {
      if (layouts[i].shortcut === command) {
        if (matchesCurrentLayout) {
          snap(layouts[i]);
          return;
        }
        if (Rect.calculateWindow(layouts[i], screen).equals(currWindow)) {
          matchesCurrentLayout = true;
        }
        if (firstMatch === -1) {
          firstMatch = i;
        }
      }
    }
    if (firstMatch > -1) {
      snap(layouts[firstMatch]);
    }
  });
});

const defaults = [
  {
    top: 0,
    left: 0,
    width: 0.5,
    height: 1.0,
    shortcut: "swift-snap-left",
  },
  {
    top: 0,
    left: 0.5,
    width: 0.5,
    height: 1.0,
    shortcut: "swift-snap-right",
  },
  {
    top: 0,
    left: 0,
    width: 0.667,
    height: 1.0,
    shortcut: "swift-snap-left",
  },
  {
    top: 0,
    left: 0.333,
    width: 0.667,
    height: 1.0,
    shortcut: "swift-snap-right",
  },
  {
    top: 0,
    left: 0,
    width: 0.333,
    height: 1.0,
    shortcut: "swift-snap-left",
  },
  {
    top: 0,
    left: 0.667,
    width: 0.333,
    height: 1.0,
    shortcut: "swift-snap-right",
  },
  {
    top: 0,
    left: 0,
    width: 1.0,
    height: 0.5,
    shortcut: "swift-snap-up",
  },
  {
    top: 0.5,
    left: 0,
    width: 1.0,
    height: 0.5,
    shortcut: "swift-snap-down",
  },
  {
    top: 0,
    left: 0,
    width: 1.0,
    height: 1.0,
    shortcut: "swift-snap-up",
  },
];

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message !== "reset") {
    return false;
  }
  browser.storage.local.set({ saved: defaults }, () => {
    sendResponse("done");
  });
  return true;
});

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.storage.local.set({ saved: defaults });
  }
});
