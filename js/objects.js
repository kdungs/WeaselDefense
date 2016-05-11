function createImage(url) {
  let img = new Image();
  img.src = url;
  return img;
}

const IMAGES = {
  'detector': createImage("assets/lhcb.png"),
  'transformer': createImage("assets/transformer.png"),
  'weasel': createImage("assets/weasel.png"),
  'explosion': createImage("assets/explosion.png")
};

class GameObject {
  constructor(rect, image, hp, collisionDamage) {
    this._rect = rect;
    this._image = image;
    this._maxhp = hp;
    this._hp = hp;
    this._collisionDamage = collisionDamage;
  }
  get rect() { return this._rect; }
  get image() { return this._image; }
  get alive() { return this._hp > 0; }
  draw(ctx) {
    const {x, y} = this._rect.top_left;
    ctx.drawImage(this._image, x, y);
    this.drawHpBar(ctx);
  }
  takeDamage(dmg) {
    this._hp -= dmg;
    if (this._hp < 0) {
      this._hp = 0;
    }
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
      return '#F0F000';
    }
    return '#FF0000';
  }
  move(vec) {
    this._rect.move(vec);
  }
  update(ticks) {}

  static handleCollision(lhs, rhs) {
    lhs.takeDamage(rhs._collisionDamage);
    rhs.takeDamage(lhs._collisionDamage);
  }
  static isCollision(lhs, rhs) {
    return Rectangle.overlap(lhs.rect, rhs.rect);
  }
};

class Detector extends GameObject {
  constructor(pos) {
    super(new Rectangle(pos, 480, 263), IMAGES.detector, CONFIG.detector.hp,
          CONFIG.detector.collisionDamage);
  }
};

class Transformer extends GameObject {
  constructor(pos) {
    super(new Rectangle(pos, 48, 48), IMAGES.transformer,
          CONFIG.transformer.hp, CONFIG.transformer.collisionDamage);
    this._lightningDamage = CONFIG.transformer.lightningDamage;
    this._lightningRadius = CONFIG.transformer.lightningRadius;
  }

  get lightningDamage() { return this._lightningDamage; }
  get lightningRadius() { return this._lightningRadius; }
};

class Weasel extends GameObject {
  constructor(pos, speed) {
    super(new Rectangle(pos, 32, 32), IMAGES.weasel, CONFIG.weasel.hp,
          CONFIG.weasel.collisionDamage);
    this._dir = Directions.NORTH;
    this._speed = speed;
  }
  update(ticks) {
    const velo = Vec2d.scale(this._dir, this._speed);
    this.move(velo);
  };
};

class Explosion {
  constructor(pos) {
    this._rect = Rectangle.fromCenter(pos, 100, 87)
    this._image = IMAGES.explosion;
    this._ticks = CONFIG.explosion.duration;
  }
  get rect() { return this._rect; }
  get image() { return this._image; }
  get alive() { return this._ticks > 0; }
  draw(ctx) {
    const {x, y} = this._rect.top_left;
    ctx.drawImage(this._image, x, y);
  }
  update() {
    this._ticks -= 1;
    if (this._ticks < 0) {
      this._ticks = 0;
    }
  }
};

class WeaselFactory {
  constructor(probability, speed, probabilityIncreaseFactor, speedIncreaseFactor) {
    this._probability = probability;
    this._speed = speed;
    this._probabilityIncreaseFactor = probabilityIncreaseFactor;
    this._speedIncreaseFactor = speedIncreaseFactor;
  };
  spawn(w, h) {
    this._speed *= this._speedIncreaseFactor;
    const x = Math.random() * (w - 32);
    return new Weasel(new Vec2d(x, h + 20), this._speed);
  }
  spawnRandom(w, h) {
    if (Math.random() < this._probability) {
      this._probability *= this._probabilityIncreaseFactor;
      return this.spawn(w, h);
    }
    return undefined;
  }
  static defaultFactory() {
    return new WeaselFactory(
      CONFIG.weasel.spawnProbability,
      CONFIG.weasel.speed,
      CONFIG.weasel.spawnProbabilityIncreaseFactor,
      CONFIG.weasel.speedIncreaseFactor
    );
  }
};
