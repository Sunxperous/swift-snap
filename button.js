import Rect from "./rect.js";
import Snap from "./snap.js";

class Button {
  static forConfigAndScreen(config, screen, shortcut) {
    let height = 80;
    let width = (screen.availWidth / screen.availHeight) * height;

    let button = document.createElement("div");
    button.className = "button";
    button.style = "height: " + height + "px; width: " + width + "px;";

    let overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style =
      "top: " +
      config.top * height +
      "px; " +
      "left: " +
      config.left * width +
      "px; " +
      "width: " +
      config.width * width +
      "px; " +
      "height: " +
      config.height * height +
      "px;";

    button.appendChild(overlay);

    if (shortcut !== null) {
      let shortcutElement = document.createElement("span");
      shortcutElement.innerText = shortcut;
      shortcutElement.className = "shortcut";
      button.appendChild(shortcutElement);
    }

    button.addEventListener("click", (e) =>
      Snap.toConfig(
        config,
        new Rect(
          screen.availTop,
          screen.availLeft,
          screen.availWidth,
          screen.availHeight
        )
      )
    );
    return button;
  }
}

export default Button;
