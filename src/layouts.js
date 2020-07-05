import { writable } from "svelte/store";
import { Rect } from "./layout.js";

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

function createLayoutsManager() {
  const { subscribe, set } = writable([]);

  const layoutsStore = {
    subscribe,
    add: () => {
      browser.system.display.getInfo((displays) => {
        browser.windows.getCurrent((currWindow) => {
          screen = determineScreenOfWindow(currWindow, displays);
          let layout = Rect.forRatio(
            Rect.fromObj(currWindow),
            Rect.fromObj(screen)
          );
          browser.storage.local.get({ saved: [] }, (storedData) => {
            if (storedData.saved.some((c) => Rect.fromObj(c).equals(layout))) {
              set(storedData.saved);
              return;
            }
            const newStore = [...storedData.saved, layout];
            browser.storage.local.set({ saved: newStore }, () => set(newStore));
          });
        });
      });
    },
    remove: (layout) => {
      browser.storage.local.get({ saved: [] }, (storedData) => {
        let updatedData = storedData.saved.filter(
          (c) => !Rect.fromObj(c).equals(layout)
        );
        browser.storage.local.set({ saved: updatedData }, () => {
          set(updatedData);
        });
      });
    },
    clear: () => {
      browser.storage.local.clear(() => set([]));
    },
    snap: (layout) => {
      browser.system.display.getInfo((displays) => {
        browser.windows.getCurrent((currWindow) => {
          screen = determineScreenOfWindow(currWindow, displays);
          browser.windows.update(currWindow.id, {
            top: Math.round(layout.top * screen.height + screen.top),
            left: Math.round(layout.left * screen.width + screen.left),
            width: Math.round(layout.width * screen.width),
            height: Math.round(layout.height * screen.height),
            state: "normal",
          });
        });
      });
    },
  };

  browser.storage.local.get({ saved: [] }, (data) => {
    set(data.saved);
  });

  return layoutsStore;
}

export const layouts = createLayoutsManager();
