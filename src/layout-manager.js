import { writable } from "svelte/store";
import { Rect } from "../public/rect.js";
import { determineScreenOfWindow, snap } from "../public/snap.js";

let browser = chrome;

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
    updateShortcut: (layout, shortcut) => {
      browser.storage.local.get({ saved: [] }, (storedData) => {
        for (const c of storedData.saved) {
          if (Rect.fromObj(c).equals(layout)) {
            if (!shortcut) {
              delete c.shortcut;
            } else {
              c.shortcut = shortcut;
            }
          }
        }
        browser.storage.local.set({ saved: storedData.saved }, () => {
          set(storedData.saved);
        });
      });
    },
    clear: () => {
      browser.storage.local.clear(() => set([]));
    },
    snap: (layout) => snap(layout),
  };

  browser.storage.local.get({ saved: [] }, (data) => {
    set(data.saved);
  });

  return layoutsStore;
}

export const layouts = createLayoutsManager();
