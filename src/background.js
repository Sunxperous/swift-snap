import "chrome-extension-async";
import {
  determineScreenOfWindow,
  isScreenInDisplay,
  snap,
  snapToScreen,
} from "./snap.js";
import { Rect } from "./rect.js";

const browser = chrome;

browser.commands.onCommand.addListener((command) => {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    const layouts = (await browser.storage.local.get()).saved;
    const screen = determineScreenOfWindow(currWindow, displays);

    if (command === "switch-next-display") {
      const currentLayout = layouts.filter((layout) =>
        Rect.calculateWindow(layout, screen).equals(currWindow)
      );
      const nextScreenIndex =
        (displays.findIndex((display) =>
          isScreenInDisplay(currWindow, display)
        ) +
          1) %
        displays.length;
      if (currentLayout.length > 0) {
        snapToScreen(currentLayout[0], displays[nextScreenIndex]);
      } else {
        const topDiff = currWindow.top - screen.top;
        const leftDiff = currWindow.left - screen.left;
        const newDisplay = displays[nextScreenIndex];
        if (
          topDiff <= newDisplay.workArea.height &&
          leftDiff <= newDisplay.workArea.width &&
          currWindow.width <= newDisplay.workArea.width &&
          currWindow.height <= newDisplay.workArea.height
        ) {
          const newWindow = new Rect(
            newDisplay.workArea.top + topDiff,
            newDisplay.workArea.left + leftDiff,
            currWindow.width,
            currWindow.height
          );
          await browser.windows.update(currWindow.id, newWindow);
        } else {
          snapToScreen(
            Rect.forRatio(Rect.fromObj(currWindow), Rect.fromObj(screen)),
            displays[nextScreenIndex]
          );
        }
        return;
      }
    }

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
