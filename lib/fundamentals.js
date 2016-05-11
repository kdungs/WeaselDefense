'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec2d = function () {
  function Vec2d(x, y) {
    _classCallCheck(this, Vec2d);

    this._x = x;
    this._y = y;
  }

  _createClass(Vec2d, [{
    key: 'x',
    get: function get() {
      return this._x;
    }
  }, {
    key: 'y',
    get: function get() {
      return this._y;
    }
  }], [{
    key: 'add',
    value: function add(lhs, rhs) {
      return new Vec2d(lhs.x + rhs.x, lhs.y + rhs.y);
    }
  }, {
    key: 'subtract',
    value: function subtract(lhs, rhs) {
      return new Vec2d(lhs.x - rhs.x, lhs.y - rhs.y);
    }
  }, {
    key: 'scale',
    value: function scale(vec, factor) {
      return new Vec2d(factor * vec.x, factor * vec.y);
    }
  }, {
    key: 'dot',
    value: function dot(lhs, rhs) {
      return lhs.x * rhs.x + lhs.y * rhs.y;
    }
  }, {
    key: 'distanceSquared',
    value: function distanceSquared(lhs, rhs) {
      var dx = lhs.x - rhs.x;
      var dy = lhs.y - rhs.y;
      return dx * dx + dy * dy;
    }
  }, {
    key: 'distance',
    value: function distance(lhs, rhs) {
      return Math.sqrt(Vec2d.distanceSquared(lhs, rhs));
    }
  }]);

  return Vec2d;
}();

;

var Directions = {
  'NORTH': new Vec2d(0, -1),
  'EAST': new Vec2d(1, 0),
  'SOUTH': new Vec2d(0, 1),
  'WEST': new Vec2d(-1, 0)
};

var Rectangle = function () {
  function Rectangle(top_left, width, height) {
    _classCallCheck(this, Rectangle);

    this._top_left = top_left;
    this._bottom_right = Vec2d.add(top_left, new Vec2d(width, height));
    this._width = width;
    this._height = height;
  }

  _createClass(Rectangle, [{
    key: 'move',
    value: function move(vec) {
      this._top_left = Vec2d.add(this._top_left, vec);
      this._bottom_right = Vec2d.add(this._bottom_right, vec);
    }
  }, {
    key: 'contains',
    value: function contains(vec) {
      return this.top_left.x <= vec.x && this.bottom_right.x >= vec.x && this.top_left.y <= vec.y && this.bottom_right.y >= vec.y;
    }
  }, {
    key: 'top_left',
    get: function get() {
      return this._top_left;
    }
  }, {
    key: 'bottom_right',
    get: function get() {
      return this._bottom_right;
    }
  }, {
    key: 'center',
    get: function get() {
      return Vec2d.add(this.top_left, new Vec2d(this.width / 2, this.height / 2));
    }
  }, {
    key: 'width',
    get: function get() {
      return this._width;
    }
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    }
  }], [{
    key: 'overlapH',
    value: function overlapH(lhs, rhs) {
      if (lhs.top_left.x > rhs.top_left.x) {
        return Rectangle.overlapH(rhs, lhs);
      }
      return lhs.bottom_right.x > rhs.top_left.x;
    }
  }, {
    key: 'overlapV',
    value: function overlapV(lhs, rhs) {
      if (lhs.top_left.y > rhs.top_left.y) {
        return Rectangle.overlapV(rhs, lhs);
      }
      return lhs.bottom_right.y > rhs.top_left.y;
    }
  }, {
    key: 'overlap',
    value: function overlap(lhs, rhs) {
      return Rectangle.overlapH(lhs, rhs) && Rectangle.overlapV(lhs, rhs);
    }
  }, {
    key: 'fromCenter',
    value: function fromCenter(center, width, height) {
      var tl = Vec2d.add(center, new Vec2d(-width / 2, -height / 2));
      return new Rectangle(tl, width, height);
    }
  }]);

  return Rectangle;
}();

;