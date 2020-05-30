let browser = chrome;

function determineScreenOfWindow(currWindow, displays) {
  let windowCenterX = currWindow.left + currWindow.width / 2;
  let windowCenterY = currWindow.top + currWindow.height / 2;
  for (let display of displays) {
    let displayLeft = display.bounds.left;
    let displayRight = display.bounds.left + display.bounds.width;
    let displayTop = display.bounds.top;
    let displayBottom = display.bounds.top + display.bounds.height;
    if (
      windowCenterX >= displayLeft &&
      windowCenterX <= displayRight &&
      windowCenterY >= displayTop &&
      windowCenterY <= displayBottom
    ) {
      return display.bounds;
    }
  }
  return display[0].bounds;
}

class Snap {
  static toConfig(config) {
    browser.system.display.getInfo((displays) => {
      browser.windows.getCurrent((currWindow) => {
        screen = determineScreenOfWindow(currWindow, displays);
        browser.windows.update(currWindow.id, {
          top: Math.round(config.top * screen.height + screen.top),
          left: Math.round(config.left * screen.width + screen.left),
          width: Math.round(config.width * screen.width),
          height: Math.round(config.height * screen.height),
          state: "normal",
        });
      });
    });
  }
}

export default Snap;
