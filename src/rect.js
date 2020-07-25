class Rect {
  static fromObj(w) {
    return new Rect(w.top, w.left, w.width, w.height);
  }

  static forRatio(w, screen) {
    return new Rect(
      (w.top - screen.top) / screen.height,
      (w.left - screen.left) / screen.width,
      w.width / screen.width,
      w.height / screen.height
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
      this.top === other.top &&
      this.left === other.left &&
      this.width === other.width &&
      this.height === other.height
    );
  }
}

export { Rect };
