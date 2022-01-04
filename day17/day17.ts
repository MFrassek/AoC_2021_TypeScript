import { readFileSync } from "fs";

const main = (filePath: string) => {
  const [[xStart, xEnd], [yStart, yEnd]] = readFileSync(filePath, "utf-8")
    .slice(13)
    .split(", ")
    .map((axis) => axis.slice(2).split("..").map(parseFloat));
  trickShot(xStart, xEnd, yStart, yEnd);
};

const trickShot = (xStart, xEnd, yStart, yEnd) => {
  let maxHeight = 0;
  let count = 0;
  for (let xV = 1; xV <= xEnd; xV++) {
    for (let yV = yStart; yV < 1000; yV++) {
      const height = new Probe(xV, yV, {
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd,
      }).launch();
      if (height !== yStart - 1) {
        count++;
      }
      if (height > maxHeight) {
        maxHeight = height;
      }
    }
  }
  console.log(maxHeight);
  console.log(count);
};

class Probe {
  xPos: number;
  yPos: number;
  xVel: number;
  yVel: number;
  target: TargetBox;
  maxHeight: number;

  constructor(xVel: number, yVel: number, target: TargetBox) {
    this.xPos = 0;
    this.yPos = 0;
    this.xVel = xVel;
    this.yVel = yVel;
    this.target = target;
    this.maxHeight = 0;
  }

  launch() {
    while (!this.hasSurpassedTarget()) {
      this.step();
      if (this.isInTarget()) {
        return this.maxHeight;
      }
    }
    return this.target.yStart - 1;
  }

  step() {
    this.xPos += this.xVel;
    this.yPos += this.yVel;
    this.xVel = this.xVel > 0 ? this.xVel - 1 : 0;
    this.yVel = this.yVel - 1;
    this.maxHeight = this.yPos > this.maxHeight ? this.yPos : this.maxHeight;
  }

  isInTarget(): boolean {
    if (
      this.target.xStart <= this.xPos &&
      this.xPos <= this.target.xEnd &&
      this.target.yStart <= this.yPos &&
      this.yPos <= this.target.yEnd
    ) {
      return true;
    } else {
      return false;
    }
  }
  hasSurpassedTarget(): boolean {
    if (this.xPos > this.target.xEnd || this.yPos < this.target.yStart) {
      return true;
    } else {
      return false;
    }
  }
}

interface TargetBox {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

main("./day17_test1.txt");
main("./day17_input.txt");
