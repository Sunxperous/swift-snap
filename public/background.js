import { determineScreenOfWindow, snap } from "./snap.js";
import { Rect } from "./rect.js";

let browser = chrome;

browser.commands.onCommand.addListener((command) => {
  browser.system.display.getInfo((displays) => {
    browser.windows.getCurrent((currWindow) => {
      screen = determineScreenOfWindow(currWindow, displays);
      let layout = Rect.forRatio(
        Rect.fromObj(currWindow),
        Rect.fromObj(screen)
      );
      browser.storage.local.get((data) => {
        let layouts = data.saved;
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
  });
});
