'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lightning = function () {
  function Lightning(source, target) {
    _classCallCheck(this, Lightning);

    this._source = source;
    this._target = target;
    this._dist = Vec2d.distance(source, target);
    var v = Vec2d.subtract(target, source);
    this._pointsAlongTheLine = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6].map(function (factor) {
      return Vec2d.add(source, Vec2d.scale(v, factor));
    });
    this._color = '#98C9E8';
  }

  _createClass(Lightning, [{
    key: 'randomOffset',
    value: function randomOffset() {
      var magnitute = this._dist / 10;
      var gen = function gen() {
        return 2 * Math.random() * magnitute - magnitute;
      };
      return new Vec2d(gen(), gen());
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      var _this = this;

      var points = this._pointsAlongTheLine.map(function (v) {
        return Vec2d.add(v, _this.randomOffset());
      });
      points.push(this._target);
      var _source = this._source;
      var x = _source.x;
      var y = _source.y;

      ctx.strokeStyle = this._color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value;
          var _x = _step$value.x;
          var _y = _step$value.y;

          ctx.lineTo(_x, _y);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ctx.stroke();
    }
  }]);

  return Lightning;
}();

;