"use strict";

function format_passed(passed) {
  return (passed ? "✓" : "✗");
}

class TestSuite {
  constructor(name) {
    this._name = name;
    this._tests = new Map();
  }
  get name() { return this._name; }
  run() {
    console.log(`${this._name}`);
    let passed = true;
    for (const [name, test] of this._tests) {
      const result = test();
      passed = passed && result;
      console.log(`\t${name}: ${format_passed(result)}`);
    }
    console.log(`\t${format_passed(passed)}`);
    return passed;
  }
};

class TestVec2d extends TestSuite {
  constructor() {
    super("TestVec2d");
    this._tests.set("Constructor and getters", () => {
      const v = new Vec2d(1, 2);
      return v.x === 1 && v.y === 2;
    });
    this._tests.set("Addition", () => {
      const v1 = new Vec2d(1, 2);
      const v2 = new Vec2d(3, 4);
      const v3 = Vec2d.add(v1, v2);
      return v3.x === 4 && v3.y === 6;
    });
    this._tests.set("Multiplication w/ scalar", () => {
      const v1 = new Vec2d(1, 2);
      const v2 = Vec2d.scale(v1, 5);
      return v2.x === 5 && v2.y === 10;
    });
    this._tests.set("Dot product", () => {
      const v1 = new Vec2d(1, 2);
      const v2 = new Vec2d(3, 4);
      return Vec2d.dot(v1, v2) == 11;
    });
  }
};

class TestRectangle extends TestSuite {
  constructor() {
    super("TestRectangle");
    this._tests.set("Constructor and getters", () => {
      const r = new Rectangle(new Vec2d(1, 2), 10, 11);
      return r.top_left.x === 1 && r.top_left.y === 2 &&
             r.bottom_right.x === 11 && r.bottom_right.y === 13 &&
             r.width === 10 && r.height === 11;
    });
    this._tests.set("Contains point", () => {
      const r = new Rectangle(new Vec2d(1, 2), 10, 11);
      const v1 = new Vec2d(4, 4);
      const v2 = new Vec2d(12, 14);
      return r.contains(v1) && !r.contains(v2);
    });
    this._tests.set("Overlap (horizontal)", () => {
      const r1 = new Rectangle(new Vec2d(1, 2), 4, 4);
      const r2 = new Rectangle(new Vec2d(3, 4), 4, 4);
      const r3 = new Rectangle(new Vec2d(10, 10), 4, 4);

      return Rectangle.overlapH(r1, r2) && !Rectangle.overlapH(r1, r3);
    });
    this._tests.set("Overlap (vertical)", () => {
      const r1 = new Rectangle(new Vec2d(1, 2), 4, 4);
      const r2 = new Rectangle(new Vec2d(3, 4), 4, 4);
      const r3 = new Rectangle(new Vec2d(10, 10), 4, 4);

      return Rectangle.overlapV(r1, r2) && !Rectangle.overlapV(r1, r3);
    });
    this._tests.set("Overlap", () => {
      const r1 = new Rectangle(new Vec2d(1, 2), 4, 4);
      const r2 = new Rectangle(new Vec2d(3, 4), 4, 4);
      const r3 = new Rectangle(new Vec2d(10, 10), 4, 4);

      return Rectangle.overlap(r1, r2) && !Rectangle.overlap(r1, r3);
    });
    this._tests.set("Overlap (cross)", () => {
      const r1 = new Rectangle(new Vec2d(1, 2), 3, 1);
      const r2 = new Rectangle(new Vec2d(2, 1), 1, 3);

      return Rectangle.overlap(r1, r2);
    });
  }
};

const ALL_SUITES = [new TestVec2d(), new TestRectangle()];
function run_all_tests() {
  let passed = true;
  for (const suite of ALL_SUITES) {
    passed = passed && suite.run();
  }
  console.log(`---\n${format_passed(passed)}`);
};
