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
};

class GameObject {
  constructor(rect, image, hp) {
    this._rect = rect;
    this._image = image;
    this._maxhp = hp;
    this._hp = hp;
  }
  get rect() { return this._rect; }
  get image() { return this._image; }
  draw(ctx) {
    const {x, y} = this._rect.top_left;
    ctx.drawImage(this._image, x, y);
    this.drawHpBar(ctx);
  }
  drawHpBar(ctx) {
    const {x, y} = Vec2d.add(this._rect.top_left, new Vec2d(0, -6));
    const factor = this._hp / this._maxhp;
    const w = this._rect.width * factor;
    ctx.fillStyle = this.getHpColor(factor);
    ctx.fillRect(x, y, w, 4);
  }
  getHpColor(factor) {
    if (factor > 0.75) {
      return '#00FF00';
    }
    if (factor > 0.25) {
      return '#FFFF00';
    }
    return '#FF0000';
  }
  move(vec) {
    this._rect.move(vec);
  }
  update(ticks) {}
};

function createImage(url) {
  let img = new Image();
  img.src = url;
  return img;
}

const IMAGES = {
  'Detector': createImage("assets/lhcb.png"),
  'Transformer': createImage("assets/transformer.png"),
  'Weasel': createImage("assets/weasel.png")
};

class Detector extends GameObject {
  constructor(pos) {
    super(new Rectangle(pos, 480, 40), IMAGES['Detector'], 1000);
  }
};

class Transformer extends GameObject {
  constructor(pos) {
    super(new Rectangle(pos, 48, 48), IMAGES['Transformer'], 100);
  }
};

class Weasel extends GameObject {
  constructor(pos, speed) {
    super(new Rectangle(pos, 32, 32), IMAGES['Weasel'], 100);
    this._dir = Directions.NORTH;
    this._speed = speed;
  }
  update(ticks) {
    // Weasels are stupid and just move upwards
    const velo = Vec2d.scale(this._dir, this._speed);
    this.move(velo);
  };
};

class WeaselFactory {
  constructor(probability, speed) {
    this._probability = probability;
    this._speed = speed;
  };
  _randomSpeed() {
    const spread = this._speed / 10;
    return Math.random() * spread + this._speed;
  }
  static _randomX() {
    return Math.random() * (480 - 32);
  }
  spawn() {
    return new Weasel(new Vec2d(WeaselFactory._randomX(), 620),
                      this._randomSpeed());
  }
  spawnRandom() {
    if (Math.random() < this._probability) {
      return this.spawn();
    }
    return undefined;
  }
};

let start = () => {
  const [W, H] = [480, 640];
  let canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  canvas.style = 'border: 1px solid black;';
  document.body.appendChild(canvas);
  let ctx = canvas.getContext('2d');

  let counter = document.createElement('p');
  counter.style = "margin: 10px; font-size: 20pt;";
  counter.innerHTML = 'Weasels: 0';
  document.body.appendChild(counter);

  let money = document.createElement('p');
  money.style = "margin: 10px; font-size: 20pt;";
  money.innerHTML = 'Money: 0';
  document.body.appendChild(money);

  let objects = [
    new Detector(new Vec2d(0, 10)),
    new Transformer(new Vec2d(0, 240))
  ];

  let wf = new WeaselFactory(0.001, 0.1);
  let ticks = 0;

  let gameloop = () => {
    ctx.clearRect(0, 0, W, H);
    for (let obj of objects) {
      obj.update(ticks);
      obj.draw(ctx);
    }
    ticks += 1;
    let w = wf.spawnRandom();
    if (w) {
      objects.push(w);
    }
    setTimeout(gameloop, 10);
  };
  gameloop();
}
start();
