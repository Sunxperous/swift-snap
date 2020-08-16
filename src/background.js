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
