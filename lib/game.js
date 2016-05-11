'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeaselDefenseGame = function () {
  function WeaselDefenseGame() {
    var _this = this;

    _classCallCheck(this, WeaselDefenseGame);

    this.W = 480;
    this.H = 640;
    this.canvas = document.getElementById('GameCanvas');
    this.showMouse = false;
    this.mousePos = new Vec2d(-100, -100);
    this.canvas.addEventListener('click', function (evt) {
      _this.clickHandler(evt);
    });
    this.canvas.addEventListener('mousemove', function (evt) {
      var rect = _this.canvas.getBoundingClientRect();
      var x = evt.clientX - rect.left - 1;
      var y = evt.clientY - rect.top - 1;
      _this.mousePos = new Vec2d(x, y);
      //this.mousePos = new Vec2d(evt.layerX, evt.layerY);
    });
    this.canvas.addEventListener('mouseenter', function (evt) {
      _this.showMouse = true;
    });
    this.canvas.addEventListener('mouseleave', function (evt) {
      _this.showMouse = false;
    });
    this.ctx = this.canvas.getContext('2d');
    this.counters = {
      'weasels': document.getElementById('WeaselCounter'),
      'money': document.getElementById('MoneyCounter')
    };
    this.defeatImage = document.getElementById('Defeat');
    this.objects = [];
    this.detector = undefined;
    this.weaselSpawner = undefined;
    this.money = 0;
    this.weasels = 0;
    this.running = false;
  }

  _createClass(WeaselDefenseGame, [{
    key: 'clickHandler',
    value: function clickHandler(evt) {
      var x = this.mousePos.x - 24;
      var y = this.mousePos.y - 24;
      this.tryBuyTransformer(x, y);
    }
  }, {
    key: 'drawMouse',
    value: function drawMouse() {
      if (!this.showMouse) {
        return;
      }
      var _mousePos = this.mousePos;
      var x = _mousePos.x;
      var y = _mousePos.y;

      var canPlace = this.canPlaceTransformer(x - 24, y - 24);
      var color = canPlace ? '#00FF00' : '#FF0000';
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(x - 24, y - 24, 48, 48);
    }
  }, {
    key: 'canPlaceTransformer',
    value: function canPlaceTransformer(x, y) {
      if (this.money < CONFIG.transformer.cost) {
        return false;
      }
      if (y < 280) {
        return false;
      }
      if (x < 0 || x > this.W - 48) {
        return false;
      }
      var trect = new Rectangle(new Vec2d(x, y), 48, 48);
      var rectangles = this.objects.map(function (obj) {
        return obj.rect;
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = rectangles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rect = _step.value;

          if (Rectangle.overlap(rect, trect)) {
            return false;
          }
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

      return true;
    }
  }, {
    key: 'tryBuyTransformer',
    value: function tryBuyTransformer(x, y) {
      if (this.canPlaceTransformer(x, y)) {
        this.money -= CONFIG.transformer.cost;
        this.objects.push(new Transformer(new Vec2d(x, y)));
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.running = false;
      this.objects = [new Detector(new Vec2d(0, 6))];
      this.detector = this.objects[0];
      this.weaselSpawner = WeaselFactory.defaultFactory();
      this.money = CONFIG.startingMoney;
      this.weasels = 0;
      this.defeatImage.style.display = 'none';
    }
  }, {
    key: 'play',
    value: function play() {
      this.reset();
      this.running = true;
      this.gameloop();
    }
  }, {
    key: 'handleCollisions',
    value: function handleCollisions() {
      var npcs = this.objects.filter(function (obj) {
        return obj instanceof Weasel;
      });
      var pcs = this.objects.filter(function (obj) {
        return obj instanceof Transformer || obj instanceof Detector;
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = npcs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var npc = _step2.value;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = pcs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var pc = _step3.value;

              if (pc.alive && npc.alive && GameObject.isCollision(npc, pc)) {
                GameObject.handleCollision(npc, pc);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'handleLightnings',
    value: function handleLightnings() {
      var lightnings = [];
      var npcs = this.objects.filter(function (obj) {
        return obj.alive && obj instanceof Weasel;
      });

      var transformers = this.objects.filter(function (obj) {
        return obj.alive && obj instanceof Transformer;
      });

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = transformers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var transformer = _step4.value;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = npcs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var npc = _step5.value;

              var ct = transformer.rect.center;
              var cw = npc.rect.center;
              var r2 = transformer.lightningRadius * transformer.lightningRadius;
              if (Vec2d.distanceSquared(ct, cw) < r2) {
                npc.takeDamage(transformer.lightningDamage);
                lightnings.push(new Lightning(ct, cw));
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return lightnings;
    }
  }, {
    key: 'handleRewards',
    value: function handleRewards() {
      var deadWeasels = this.objects.filter(function (obj) {
        return !obj.alive && obj instanceof Weasel;
      }).length;
      this.weasels += deadWeasels;
      this.money += deadWeasels * CONFIG.moneyPerKill;

      if (!this.detector.alive) {
        this.running = false;
        this.showDefeat();
      }
    }
  }, {
    key: 'handleDeadObjects',
    value: function handleDeadObjects() {
      var deadGameObjects = this.objects.filter(function (obj) {
        return !obj.alive && obj instanceof GameObject;
      });
      this.objects = this.objects.filter(function (obj) {
        return obj.alive;
      });
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = deadGameObjects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var dgo = _step6.value;

          this.objects.push(new Explosion(dgo.rect.center));
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: 'gameloop',
    value: function gameloop() {
      var _this2 = this;

      this.ctx.clearRect(0, 0, this.W, this.H);
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.objects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var obj = _step7.value;

          obj.update();
          obj.draw(this.ctx);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var weasel = this.weaselSpawner.spawnRandom(this.W, this.H);
      if (weasel) {
        this.objects.push(weasel);
      }

      this.handleCollisions();
      var lightnings = this.handleLightnings();
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = lightnings[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var lightning = _step8.value;

          lightning.draw(this.ctx);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this.handleRewards();
      this.handleDeadObjects();
      this.updateCounters();
      this.drawMouse();
      if (this.running) {
        setTimeout(function () {
          _this2.gameloop();
        }, 10);
      }
    }
  }, {
    key: 'updateCounters',
    value: function updateCounters() {
      this.counters['money'].innerHTML = this.money;
      this.counters['weasels'].innerHTML = this.weasels;
    }
  }, {
    key: 'showDefeat',
    value: function showDefeat() {
      var url = 'https%3A%2F%2Fkdungs.github.io%2FWeaselDefense';
      var text = 'I managed to kill ' + this.weasels + ' weasels before my detector was destroyed. %23WeaselDefense';
      var href = 'https://twitter.com/share?url=' + url + '&text=' + text;
      this.defeatImage.style.display = 'block';
      document.getElementById('WeaselsKilled').innerHTML = this.weasels;
      document.getElementById('TwitterLink').href = href;
    }
  }]);

  return WeaselDefenseGame;
}();

;

document.addEventListener('readystatechange', function () {
  if (document.readyState === "interactive") {
    var game = new WeaselDefenseGame();
    game.play();
  }
});