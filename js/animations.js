"use strict";

class Lightning {
  constructor(source, target) {
    this._source = source;
    this._target = target;
    this._color = '#98C9E8';
  }
  draw(ctx) {
    const {x:x1, y:y1} = this._source;
    const {x:x2, y:y2} = this._target;
    ctx.strokeStyle = this._color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};
