import Button from "./button.js";
import Rect from "./rect.js";
import WindowConfig from "./window-config.js";

let browser = chrome;
let debug = false;

let currWindow = {};
let savedConfig = [];

let removeConfig = function (config) {
  let updatedConfig = savedConfig.filter((c) => {
    return (
      c.top != config.top ||
      c.left != config.left ||
      c.width != config.width ||
      c.height != config.height
    );
  });
  browser.storage.local.set({ saved: updatedConfig }, (callback) => {
    displaySaved();
  });
};

let appendConfig = function (config, shortcut) {
  let ol = document.getElementById("saved");
  let li = document.createElement("li");

  li.appendChild(Button.forConfigAndScreen(config, window.screen, shortcut));

  let remove = document.createElement("button");
  remove.innerText = "x";
  remove.addEventListener("click", (e) => removeConfig(config));
  li.appendChild(remove);

  ol.appendChild(li);
};

let displaySaved = function () {
  let ol = document.getElementById("saved");
  ol.innerHTML = "";
  browser.commands.getAll((commands) => {
    browser.storage.local.get((data) => {
      savedConfig = data.saved ?? [];
      for (let i = 0; i < savedConfig.length; i++) {
        console.log(commands[i].shortcut);
        if (i >= 0 && i <= 3) {
          appendConfig(savedConfig[i], commands[i + 1].shortcut);
        } else {
          appendConfig(savedConfig[i]);
        }
      }
    });
  });
};

let updateDebug = function () {
  let screen = {
    availHeight: window.screen.availHeight,
    availLeft: window.screen.availLeft,
    availTop: window.screen.availTop,
    availWidth: window.screen.availWidth,
    colorDepth: window.screen.colorDepth,
    height: window.screen.height,
    orientation: window.screen.orientation,
    pixelDepth: window.screen.pixelDepth,
    width: window.screen.width,
  };

  browser.windows.getCurrent((w) => {
    currWindow = w;
    let debugInfo = { ...screen, currWindow };
    if (debug)
      document.getElementById("window-info").innerText = JSON.stringify(
        debugInfo,
        null,
        2
      );
  });
};

window.onload = function () {
  displaySaved();
  updateDebug();
};

let currentWindowConfig = function () {
  let a = new WindowConfig(
    new Rect(
      currWindow.top,
      currWindow.left,
      currWindow.width,
      currWindow.height
    ),
    new Rect(
      window.screen.availTop,
      window.screen.availLeft,
      window.screen.availWidth,
      window.screen.availHeight
    )
  );
  return a;
};

document.getElementById("save-ratio").addEventListener("click", (e) => {
  browser.storage.local.set(
    { saved: [...savedConfig, currentWindowConfig()] },
    (callback) => {
      appendConfig(currentWindowConfig());
    }
  );
});
