"use strict";

class Vec2d {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  get x() { return this._x; }
  get y() { return this._y; }
  static add(lhs, rhs) {
    return new Vec2d(lhs.x + rhs.x, lhs.y + rhs.y);
  }
  static scale(vec, factor) {
    return new Vec2d(factor * vec.x, factor * vec.y);
  }
  static dot(lhs, rhs) {
    return lhs.x * rhs.x + lhs.y * rhs.y;
  }
  static distanceSquared(lhs, rhs) {
    const dx = lhs.x - rhs.x;
    const dy = lhs.y - rhs.y;
    return dx * dx + dy  * dy;
  }
  static distance(lhs, rhs) {
    return Math.sqrt(Vec2d.distanceSquared(lhs, rhs));
  }
};

const Directions = {
  'NORTH': new Vec2d(0, -1),
  'EAST': new Vec2d(1, 0),
  'SOUTH': new Vec2d(0, 1),
  'WEST': new Vec2d(-1, 0)
};

class Rectangle {
  constructor(top_left, width, height) {
    this._top_left = top_left;
    this._bottom_right = Vec2d.add(top_left, new Vec2d(width, height));
    this._width = width;
    this._height = height;
  }
  get top_left() { return this._top_left; }
  get bottom_right() { return this._bottom_right; }
  get center() {
    return Vec2d.add(this.top_left, new Vec2d(this.width / 2, this.height / 2));
  }
  get width() { return this._width; }
  get height() { return this._height; }
  move(vec) {
    this._top_left = Vec2d.add(this._top_left, vec);
    this._bottom_right = Vec2d.add(this._bottom_right, vec);
  }
  contains(vec) {
    return this.top_left.x <= vec.x && this.bottom_right.x >= vec.x &&
           this.top_left.y <= vec.y && this.bottom_right.y >= vec.y;
  }
  static overlapH(lhs, rhs) {
    if (lhs.top_left.x > rhs.top_left.x) {
      return Rectangle.overlapH(rhs, lhs);
    }
    return lhs.bottom_right.x > rhs.top_left.x;
  }
  static overlapV(lhs, rhs) {
    if (lhs.top_left.y > rhs.top_left.y) {
      return Rectangle.overlapV(rhs, lhs);
    }
    return lhs.bottom_right.y > rhs.top_left.y;
  }
  static overlap(lhs, rhs) {
    return Rectangle.overlapH(lhs, rhs) && Rectangle.overlapV(lhs, rhs);
  }
  static fromCenter(center, width, height) {
    const tl = Vec2d.add(center, new Vec2d(-width / 2, -height / 2));
    return new Rectangle(tl, width, height);
  }
};
