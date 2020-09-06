import "chrome-extension-async";

import { Rect } from "./rect.js";

const browser = chrome;

function isScreenInDisplay(currWindow, display) {
  const windowCenterX = currWindow.left + currWindow.width / 2;
  const windowCenterY = currWindow.top + currWindow.height / 2;
  const displayLeft = display.workArea.left;
  const displayRight = display.workArea.left + display.workArea.width;
  const displayTop = display.workArea.top;
  const displayBottom = display.workArea.top + display.workArea.height;
  return (
    windowCenterX >= displayLeft &&
    windowCenterX <= displayRight &&
    windowCenterY >= displayTop &&
    windowCenterY <= displayBottom
  );
}

function displayOf(currWindow, displays) {
  for (let display of displays) {
    if (isScreenInDisplay(currWindow, display)) {
      return display;
    }
  }
  return displays[0];
}

function determineScreenOfWindow(currWindow, displays) {
  return displayOf(currWindow, displays).workArea;
}

function snap(layout, callback) {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    const display = displayOf(currWindow, displays);
    await snapToScreen(layout, display, callback);
  });
}

async function snapToScreen(layout, display, callback) {
  const currWindow = await browser.windows.getCurrent();
  const newWindowSize = Rect.calculateWindow(layout, display.workArea);
  newWindowSize.state = "normal";
  await browser.windows.update(currWindow.id, newWindowSize);
  const port = browser.runtime.connect({ name: "snap-shortcut" });
  port.postMessage("snap");
  port.disconnect();
  if (callback) callback();
}

export { determineScreenOfWindow, isScreenInDisplay, snap, snapToScreen };
