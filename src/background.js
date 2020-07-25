import "chrome-extension-async";
import { determineScreenOfWindow, snap } from "./snap.js";
import { Rect } from "./rect.js";

const browser = chrome;

browser.commands.onCommand.addListener((command) => {
  browser.system.display.getInfo(async (displays) => {
    const currWindow = await browser.windows.getCurrent();
    screen = determineScreenOfWindow(currWindow, displays);
    const layout = Rect.forRatio(
      Rect.fromObj(currWindow),
      Rect.fromObj(screen)
    );
    const layouts = (await browser.storage.local.get()).saved;
    let firstMatch = -1;
    let matchesCurrentLayout = false;
    for (let i = 0; i < layouts.length; ++i) {
      if (layouts[i].shortcut === command) {
        if (matchesCurrentLayout) {
          snap(layouts[i]);
          return;
        }
        if (layout.equals(layouts[i])) {
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
