import "chrome-extension-async";

import { writable } from "svelte/store";
import { Rect } from "./rect.js";
import { determineScreenOfWindow, snap } from "./snap.js";

const browser = chrome;

function createLayoutsManager() {
  const { subscribe, set } = writable([]);

  const layoutsStore = {
    subscribe,
    add: () => {
      browser.system.display.getInfo(async (displays) => {
        const currWindow = await browser.windows.getCurrent();
        const screen = determineScreenOfWindow(currWindow, displays);
        const saved = (await browser.storage.local.get({ saved: [] })).saved;
        if (
          saved.some((c) => Rect.calculateWindow(c, screen).equals(currWindow))
        ) {
          set(saved);
          return;
        }
        const layout = Rect.forRatio(
          Rect.fromObj(currWindow),
          Rect.fromObj(screen)
        );
        const newStore = [...saved, layout];
        await browser.storage.local.set({ saved: newStore });
        set(newStore);
      });
    },
    remove: async (layout) => {
      const saved = (await browser.storage.local.get({ saved: [] })).saved;
      const updatedData = saved.filter((c) => !Rect.fromObj(c).equals(layout));
      await browser.storage.local.set({ saved: updatedData });
      set(updatedData);
    },
    updateShortcut: async (layout, shortcut) => {
      const saved = (await browser.storage.local.get({ saved: [] })).saved;
      for (const c of saved) {
        if (Rect.fromObj(c).equals(layout)) {
          if (!shortcut) {
            delete c.shortcut;
          } else {
            c.shortcut = shortcut;
          }
        }
      }
      await browser.storage.local.set({ saved: saved });
      set(saved);
    },
    reset: async () => {
      await browser.runtime.sendMessage('reset');
      const updated = await browser.storage.local.get({ saved: [] });
      set(updated.saved);
    },
    snap: (layout, callback) => snap(layout, callback),
  };

  browser.storage.local.get({ saved: [] }, (data) => {
    set(data.saved);
  });

  return layoutsStore;
}

export const layouts = createLayoutsManager();
