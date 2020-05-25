class WindowConfig {
  constructor(window, screen) {
    this.top = (window.top - screen.top) / screen.height;
    this.left = (window.left - screen.left) / screen.width;
    this.width = window.width / screen.width;
    this.height = window.height / screen.height;
  }
}

export default WindowConfig;
