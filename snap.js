let browser = chrome;

class Snap {
  static toConfig(config, screen) {
    browser.windows.getCurrent((w) => {
      browser.windows.update(
        w.id,
        {
          top: Math.round(config.top * screen.height + screen.top),
          left: Math.round(config.left * screen.width + screen.left),
          width: Math.round(config.width * screen.width),
          height: Math.round(config.height * screen.height),
          state: "normal",
        },
      );
    });
  }
}

export default Snap;
