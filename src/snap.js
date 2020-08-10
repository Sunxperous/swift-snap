import "chrome-extension-async";

import { Rect } from "./rect.js";

const browser = chrome;

function determineScreenOfWindow(currWindow, displays) {
  const windowCenterX = currWindow.left + currWindow.width / 2;
  const windowCenterY = currWindow.top + currWindow.height / 2;
  for (let display of displays) {
    const displayLeft = display.workArea.left;
    const displayRight = display.workArea.left + display.workArea.width;
    const displayTop = display.workArea.top;
    const displayBottom = display.workArea.top + display.workArea.height;
    if (
      windowCenterX >= displayLeft &&
      windowCenterX <= displayRight &&
      windowCenterY >= displayTop &&
      windowCenterY <= displayBottom
    ) {
      return display.workArea;
    }
  }
  return display[0].workArea;
}

function snap(layout, callback) {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    const screen = determineScreenOfWindow(currWindow, displays);
    const newWindowSize = Rect.calculateWindow(layout, screen);
    newWindowSize.state = "normal";
    await browser.windows.update(currWindow.id, newWindowSize);
    const port = browser.runtime.connect({name: 'snap-shortcut'});
    port.postMessage("snap");
    port.disconnect();
    if (callback) callback();
  });
}

export { determineScreenOfWindow, snap };
