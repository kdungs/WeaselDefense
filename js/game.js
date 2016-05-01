class WeaselDefenseGame {
  constructor() {
    this.W = 480;
    this.H = 640;
    this.canvas = document.getElementById('GameCanvas');
    this.showMouse = false;
    this.mousePos = new Vec2d(-100, -100);
    this.canvas.addEventListener('click', (evt) => { this.clickHandler(evt); });
    this.canvas.addEventListener('mousemove', (evt) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = evt.clientX - rect.left - 1;
      const y = evt.clientY - rect.top - 1;
      this.mousePos = new Vec2d(x, y);
      //this.mousePos = new Vec2d(evt.layerX, evt.layerY);
    });
    this.canvas.addEventListener('mouseenter', (evt) => {
      this.showMouse = true;
    });
    this.canvas.addEventListener('mouseleave', (evt) => {
      this.showMouse = false;
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

  clickHandler(evt) {
    const x = this.mousePos.x - 24;
    const y = this.mousePos.y - 24;
    this.tryBuyTransformer(x, y);
  }

  drawMouse() {
    if (!this.showMouse) {
      return;
    }
    const {x, y} = this.mousePos;
    const canPlace = this.canPlaceTransformer(x - 24, y - 24);
    const color = canPlace ? '#00FF00' : '#FF0000';
    this.ctx.strokeStyle = color;
    this.ctx.strokeRect(x - 24, y - 24, 48, 48);
  }

  canPlaceTransformer(x, y) {
    if (this.money < CONFIG.transformer.cost) { return false; }
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
    if (this.canPlaceTransformer(x, y)) {
      this.money -= CONFIG.transformer.cost;
      this.objects.push(new Transformer(new Vec2d(x, y)));
    }
  }

  reset() {
    this.running = false;
    this.objects = [
      new Detector(new Vec2d(0, 6))
    ];
    this.detector = this.objects[0];
    this.weaselSpawner = WeaselFactory.defaultFactory();
    this.money = CONFIG.startingMoney;
    this.weasels = 0;
    this.defeatImage.style.display = 'none';
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
    this.drawMouse();
    if (this.running) {
      setTimeout(() => {this.gameloop(); }, 10);
    }
  }

  updateCounters() {
    this.counters['money'].innerHTML = this.money;
    this.counters['weasels'].innerHTML = this.weasels;
  }

  showDefeat() {
    const url = 'https%3A%2F%2Fkdungs.github.io%2FWeaselDefense';
    const text = `I managed to kill ${this.weasels} weasels before my detector was destroyed. %23WeaselDefense`;
    const href = `https://twitter.com/share?url=${url}&text=${text}`;
    this.defeatImage.style.display = 'block';
    document.getElementById('WeaselsKilled').innerHTML = this.weasels;
    document.getElementById('TwitterLink').href = href;
  }
};


document.addEventListener('readystatechange', () => {
  if (document.readyState === "interactive") {
    let game = new WeaselDefenseGame();
    game.play();
  }
});
