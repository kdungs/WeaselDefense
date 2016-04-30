"use strict";

class Lightning {
  constructor(source, target) {
    this._source = source;
    this._target = target;
    this._dist = Vec2d.distance(source, target);
    const v = Vec2d.subtract(target, source);
    this._pointsAlongTheLine = [1/6, 2/6, 3/6, 4/6, 5/6].map((factor) => {
      return Vec2d.add(source, Vec2d.scale(v, factor));
    });
    this._color = '#98C9E8';
  }
  randomOffset() {
    const magnitute = this._dist / 10;
    const gen = () => { return 2 * Math.random() * magnitute - magnitute; };
    return new Vec2d(gen(), gen());
  }
  draw(ctx) {
    let points = this._pointsAlongTheLine.map((v) => {
      return Vec2d.add(v, this.randomOffset());
    });
    points.push(this._target);
    const {x, y} = this._source;
    ctx.strokeStyle = this._color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (const {x, y} of points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};
