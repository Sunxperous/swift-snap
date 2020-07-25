import "chrome-extension-async";

let browser = chrome;

function determineScreenOfWindow(currWindow, displays) {
  let windowCenterX = currWindow.left + currWindow.width / 2;
  let windowCenterY = currWindow.top + currWindow.height / 2;
  for (let display of displays) {
    let displayLeft = display.workArea.left;
    let displayRight = display.workArea.left + display.workArea.width;
    let displayTop = display.workArea.top;
    let displayBottom = display.workArea.top + display.workArea.height;
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

function snap(layout) {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    screen = determineScreenOfWindow(currWindow, displays);
    browser.windows.update(currWindow.id, {
      top: Math.round(layout.top * screen.height + screen.top),
      left: Math.round(layout.left * screen.width + screen.left),
      width: Math.round(layout.width * screen.width),
      height: Math.round(layout.height * screen.height),
      state: "normal",
    });
  });
}

export { determineScreenOfWindow, snap };
