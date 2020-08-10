const decimalPlaces = 4;

class Rect {
  static fromObj(w) {
    return new Rect(w.top, w.left, w.width, w.height);
  }

  static forRatio(w, screen) {
    return new Rect(
      ((w.top - screen.top) / screen.height).toFixed(decimalPlaces),
      ((w.left - screen.left) / screen.width).toFixed(decimalPlaces),
      (w.width / screen.width).toFixed(decimalPlaces),
      (w.height / screen.height).toFixed(decimalPlaces)
    );
  }

  static calculateWindow(layout, screen) {
    return new Rect(
      Math.round(layout.top * screen.height + screen.top),
      Math.round(layout.left * screen.width + screen.left),
      Math.round(layout.width * screen.width),
      Math.round(layout.height * screen.height)
    );
  }

  constructor(top, left, width, height) {
    this.top = top || 0;
    this.left = left || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  equals(other) {
    return (
      other !== undefined &&
      this.top === other.top &&
      this.left === other.left &&
      this.width === other.width &&
      this.height === other.height
    );
  }
}

export { Rect };
