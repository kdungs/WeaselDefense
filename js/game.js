"use strict";

class WeaselDefenseGame {
  constructor() {
    this.W = 480;
    this.H = 640;
    this.canvas = document.getElementById('GameCanvas');
    this.canvas.addEventListener('click', (evt) => { this.clickHandler(evt); });
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

  clickHandler(evt) {
    const x = evt.layerX - 24;
    const y = evt.layerY - 24;
    this.tryBuyTransformer(x, y);
  }

  canPlaceTransformer(x, y) {
    if (y < 280) { return false; }
    if (x < 0 || x > this.W - 48) { return false; }
    const trect = new Rectangle(new Vec2d(x, y), 48, 48);
    const rectangles = this.objects.map((obj) => { return obj.rect; });
    for (const rect of rectangles) {
      if (Rectangle.overlap(rect, trect)) {
        return false;
      }
    }
    return true;
  }

  tryBuyTransformer(x, y) {
    const cost = CONFIG.transformer.cost;
    if (this.money >= cost && this.canPlaceTransformer(x, y)) {
      this.money -= cost;
      this.objects.push(new Transformer(new Vec2d(x, y)));
    }
  }

  reset() {
    this.running = false;
    this.objects = [
      new Detector(new Vec2d(0, 6))
    ];
    this.detector = this.objects[0];
    this.weaselSpawner = new WeaselFactory(CONFIG.weasel.spawnProbability,
                                           CONFIG.weasel.averageSpeed);
    this.money = CONFIG.startingMoney;
    this.weasels = 0;
    this.defeatImage.style = 'display: none;';
  }

  play() {
    this.reset();
    this.running = true;
    this.gameloop();
  }

  handleCollisions() {
    let npcs = this.objects.filter((obj) => {
      return (obj instanceof Weasel);
    });
    let pcs = this.objects.filter((obj) => {
      return (obj instanceof Transformer) || (obj instanceof Detector);
    });

    for (let npc of npcs) {
      for (let pc of pcs) {
        if (pc.alive && npc.alive && GameObject.isCollision(npc, pc)) {
          GameObject.handleCollision(npc, pc);
        }
      }
    }
  }

  handleLightnings() {
    let lightnings = [];
    let npcs = this.objects.filter((obj) => {
      return obj.alive && (obj instanceof Weasel);
    });

    let transformers = this.objects.filter((obj) => {
      return obj.alive && (obj instanceof Transformer);
    });

    for (let transformer of transformers) {
      for (let npc of npcs) {
        const ct = transformer.rect.center;
        const cw = npc.rect.center;
        const r2 = transformer.lightningRadius * transformer.lightningRadius;
        if (Vec2d.distanceSquared(ct, cw) < r2) {
          npc.takeDamage(transformer.lightningDamage);
          lightnings.push(new Lightning(ct, cw));
        }
      }
    }
    return lightnings;
  }

  handleRewards() {
    const deadWeasels = this.objects.filter((obj) => {
      return !obj.alive && (obj instanceof Weasel);
    }).length;
    this.weasels += deadWeasels;
    this.money += deadWeasels * CONFIG.moneyPerKill;

    if (!this.detector.alive) {
      this.running = false;
      this.showDefeat();
    }
  }

  handleDeadObjects() {
    const deadGameObjects = this.objects.filter((obj) => {
      return !obj.alive && (obj instanceof GameObject);
    });
    this.objects = this.objects.filter((obj) => { return obj.alive; });
    for (const dgo of deadGameObjects) {
      this.objects.push(new Explosion(dgo.rect.center));
    }
  }

  gameloop() {
    this.ctx.clearRect(0, 0, this.W, this.H);
    for (let obj of this.objects) {
      obj.update();
      obj.draw(this.ctx);
    }
    let weasel = this.weaselSpawner.spawnRandom(this.W, this.H);
    if (weasel) {
      this.objects.push(weasel);
    }

    this.handleCollisions();
    let lightnings = this.handleLightnings();
    for (const lightning of lightnings) {
      lightning.draw(this.ctx);
    }
    this.handleRewards();
    this.handleDeadObjects();
    this.updateCounters();
    if (this.running) {
      setTimeout(() => {this.gameloop(); }, 10);
    }
  }

  updateCounters() {
    this.counters['money'].innerHTML = this.money;
    this.counters['weasels'].innerHTML = this.weasels;
  }

  showDefeat() {
    this.defeatImage.style = 'display: block;';
  }
};
