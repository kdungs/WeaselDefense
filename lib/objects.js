'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createImage(url) {
  var img = new Image();
  img.src = url;
  return img;
}

var IMAGES = {
  'detector': createImage("assets/lhcb.png"),
  'transformer': createImage("assets/transformer.png"),
  'weasel': createImage("assets/weasel.png"),
  'explosion': createImage("assets/explosion.png")
};

var GameObject = function () {
  function GameObject(rect, image, hp, collisionDamage) {
    _classCallCheck(this, GameObject);

    this._rect = rect;
    this._image = image;
    this._maxhp = hp;
    this._hp = hp;
    this._collisionDamage = collisionDamage;
  }

  _createClass(GameObject, [{
    key: 'draw',
    value: function draw(ctx) {
      var _rect$top_left = this._rect.top_left;
      var x = _rect$top_left.x;
      var y = _rect$top_left.y;

      ctx.drawImage(this._image, x, y);
      this.drawHpBar(ctx);
    }
  }, {
    key: 'takeDamage',
    value: function takeDamage(dmg) {
      this._hp -= dmg;
      if (this._hp < 0) {
        this._hp = 0;
      }
    }
  }, {
    key: 'drawHpBar',
    value: function drawHpBar(ctx) {
      var _Vec2d$add = Vec2d.add(this._rect.top_left, new Vec2d(0, -6));

      var x = _Vec2d$add.x;
      var y = _Vec2d$add.y;

      var factor = this._hp / this._maxhp;
      var w = this._rect.width * factor;
      ctx.fillStyle = this.getHpColor(factor);
      ctx.fillRect(x, y, w, 4);
    }
  }, {
    key: 'getHpColor',
    value: function getHpColor(factor) {
      if (factor > 0.75) {
        return '#00FF00';
      }
      if (factor > 0.25) {
        return '#F0F000';
      }
      return '#FF0000';
    }
  }, {
    key: 'move',
    value: function move(vec) {
      this._rect.move(vec);
    }
  }, {
    key: 'update',
    value: function update(ticks) {}
  }, {
    key: 'rect',
    get: function get() {
      return this._rect;
    }
  }, {
    key: 'image',
    get: function get() {
      return this._image;
    }
  }, {
    key: 'alive',
    get: function get() {
      return this._hp > 0;
    }
  }], [{
    key: 'handleCollision',
    value: function handleCollision(lhs, rhs) {
      lhs.takeDamage(rhs._collisionDamage);
      rhs.takeDamage(lhs._collisionDamage);
    }
  }, {
    key: 'isCollision',
    value: function isCollision(lhs, rhs) {
      return Rectangle.overlap(lhs.rect, rhs.rect);
    }
  }]);

  return GameObject;
}();

;

var Detector = function (_GameObject) {
  _inherits(Detector, _GameObject);

  function Detector(pos) {
    _classCallCheck(this, Detector);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Detector).call(this, new Rectangle(pos, 480, 263), IMAGES.detector, CONFIG.detector.hp, CONFIG.detector.collisionDamage));
  }

  return Detector;
}(GameObject);

;

var Transformer = function (_GameObject2) {
  _inherits(Transformer, _GameObject2);

  function Transformer(pos) {
    _classCallCheck(this, Transformer);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, new Rectangle(pos, 48, 48), IMAGES.transformer, CONFIG.transformer.hp, CONFIG.transformer.collisionDamage));

    _this2._lightningDamage = CONFIG.transformer.lightningDamage;
    _this2._lightningRadius = CONFIG.transformer.lightningRadius;
    return _this2;
  }

  _createClass(Transformer, [{
    key: 'lightningDamage',
    get: function get() {
      return this._lightningDamage;
    }
  }, {
    key: 'lightningRadius',
    get: function get() {
      return this._lightningRadius;
    }
  }]);

  return Transformer;
}(GameObject);

;

var Weasel = function (_GameObject3) {
  _inherits(Weasel, _GameObject3);

  function Weasel(pos, speed) {
    _classCallCheck(this, Weasel);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Weasel).call(this, new Rectangle(pos, 32, 32), IMAGES.weasel, CONFIG.weasel.hp, CONFIG.weasel.collisionDamage));

    _this3._dir = Directions.NORTH;
    _this3._speed = speed;
    return _this3;
  }

  _createClass(Weasel, [{
    key: 'update',
    value: function update(ticks) {
      var velo = Vec2d.scale(this._dir, this._speed);
      this.move(velo);
    }
  }]);

  return Weasel;
}(GameObject);

;

var Explosion = function () {
  function Explosion(pos) {
    _classCallCheck(this, Explosion);

    this._rect = Rectangle.fromCenter(pos, 100, 87);
    this._image = IMAGES.explosion;
    this._ticks = CONFIG.explosion.duration;
  }

  _createClass(Explosion, [{
    key: 'draw',
    value: function draw(ctx) {
      var _rect$top_left2 = this._rect.top_left;
      var x = _rect$top_left2.x;
      var y = _rect$top_left2.y;

      ctx.drawImage(this._image, x, y);
    }
  }, {
    key: 'update',
    value: function update() {
      this._ticks -= 1;
      if (this._ticks < 0) {
        this._ticks = 0;
      }
    }
  }, {
    key: 'rect',
    get: function get() {
      return this._rect;
    }
  }, {
    key: 'image',
    get: function get() {
      return this._image;
    }
  }, {
    key: 'alive',
    get: function get() {
      return this._ticks > 0;
    }
  }]);

  return Explosion;
}();

;

var WeaselFactory = function () {
  function WeaselFactory(probability, speed, probabilityIncreaseFactor, speedIncreaseFactor) {
    _classCallCheck(this, WeaselFactory);

    this._probability = probability;
    this._speed = speed;
    this._probabilityIncreaseFactor = probabilityIncreaseFactor;
    this._speedIncreaseFactor = speedIncreaseFactor;
  }

  _createClass(WeaselFactory, [{
    key: 'spawn',
    value: function spawn(w, h) {
      this._speed *= this._speedIncreaseFactor;
      var x = Math.random() * (w - 32);
      return new Weasel(new Vec2d(x, h + 20), this._speed);
    }
  }, {
    key: 'spawnRandom',
    value: function spawnRandom(w, h) {
      if (Math.random() < this._probability) {
        this._probability *= this._probabilityIncreaseFactor;
        return this.spawn(w, h);
      }
      return undefined;
    }
  }], [{
    key: 'defaultFactory',
    value: function defaultFactory() {
      return new WeaselFactory(CONFIG.weasel.spawnProbability, CONFIG.weasel.speed, CONFIG.weasel.spawnProbabilityIncreaseFactor, CONFIG.weasel.speedIncreaseFactor);
    }
  }]);

  return WeaselFactory;
}();

;