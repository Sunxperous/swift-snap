let browser = chrome;

class SnapSelection {
  static toConfig(config) {
    browser.windows.getCurrent((w) => {
      browser.windows.update(
        w.id,
        {
          top: config.top,
          left: config.left,
          width: config.width,
          height: config.height,
          state: "normal",
        },
      );
    });
  }
}

export default SnapSelection;
