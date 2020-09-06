import "chrome-extension-async";
import {
  determineScreenOfWindow,
  isScreenInDisplay,
  snapToScreen,
} from "./snap.js";
import { Rect } from "./rect.js";

const browser = chrome;

async function moveToNextDisplay() {
  browser.system.display.getInfo(async (displays) => {
    if (displays.length < 2) {
      return;
    }
    const currWindow = await browser.windows.getCurrent();
    const layouts = (await browser.storage.local.get()).saved;
    const screen = determineScreenOfWindow(currWindow, displays);

    const currentLayout = layouts.filter((layout) =>
      Rect.calculateWindow(layout, screen).equals(currWindow)
    );
    const nextScreenIndex =
      (displays.findIndex((display) => isScreenInDisplay(currWindow, display)) +
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
  });
}

export { moveToNextDisplay };
