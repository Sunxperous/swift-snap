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
        let activeIndex = layouts.findIndex((l) => layout.equals(l));
        let i = activeIndex + 1;
        if (i >= layouts.length) {
          i = 0;
        }
        while (i < layouts.length || i !== activeIndex) {
          if (layouts[i].shortcut === command) {
            snap(layouts[i]);
            return;
          }
          if (i === layouts.length - 1) {
            i = 0;
          } else {
            i++;
          }
        }
      });
    });
  });
});
