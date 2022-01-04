import { readFileSync } from "fs";

const main = (filePath: string) => {
  const commands = readFileSync(filePath, "utf-8").split("\n");
  let reactor = new Reactor();
  commands.forEach((command) => reactor.initExecute(command));
  console.log(reactor.onCount());
  reactor = new Reactor();
  commands.forEach((command) => reactor.fullExecute(command));
  console.log(reactor.onCount());
};

class Reactor {
  cubes: Cube[];

  constructor() {
    this.cubes = [];
  }

  onCount() {
    let onCount = 0;
    this.cubes.forEach((cube) => {
      onCount += cube.size;
    });
    return onCount;
  }

  initExecute(command: string) {
    const [state, rangeString] = command.split(" ");
    let ranges = rangeString.split(",").map((range) => {
      return range.slice(2).split("..").map(parseFloat);
    });
    if (
      ranges.some(
        (range) =>
          (range[0] < -50 && range[1] < -50) || (range[0] > 50 && range[1] > 50)
      )
    ) {
      return;
    }
    ranges = ranges.map((range) => [
      Math.max(-50, range[0]),
      Math.min(50, range[1]),
    ]);
    this.execute(state, ranges);
  }

  fullExecute(command: string) {
    const [state, rangeString] = command.split(" ");
    let ranges = rangeString.split(",").map((range) => {
      return range.slice(2).split("..").map(parseFloat);
    });
    this.execute(state, ranges);
  }

  execute(state: string, ranges: number[][]) {
    const nextCube = new Cube(
      new Range(ranges[0][0], ranges[0][1]),
      new Range(ranges[1][0], ranges[1][1]),
      new Range(ranges[2][0], ranges[2][1])
    );
    if (state === "off") {
      this.executeOff(nextCube);
    } else if (state === "on") {
      this.executeOn(nextCube);
    }
  }

  executeOn(nextCube: Cube) {
    for (let i = 0; i < this.cubes.length; i++) {
      let existingCube = this.cubes[i];
      if (nextCube.isFullyContainedByCube(existingCube)) {
        return;
      } else if (nextCube.isSplitByCubeAlongAnyAxis(existingCube)) {
        nextCube.splitSubtract(existingCube).forEach((subCube) => {
          this.executeOn(subCube);
        });
        return;
      }
    }
    this.cubes.push(nextCube);
  }

  executeOff(nextCube: Cube) {
    for (let i = 0; i < this.cubes.length; i++) {
      let existingCube = this.cubes[i];
      if (existingCube.isFullyContainedByCube(nextCube)) {
        this.cubes = [...this.cubes.slice(0, i), ...this.cubes.slice(i + 1)];
        i--;
      } else if (existingCube.isSplitByCubeAlongAnyAxis(nextCube)) {
        existingCube.splitSubtract(nextCube).forEach((subCube) => {
          this.cubes.push(subCube);
        });
        this.cubes = [...this.cubes.slice(0, i), ...this.cubes.slice(i + 1)];
        i--;
      }
    }
  }
}

class Cube {
  xRange: Range;
  yRange: Range;
  zRange: Range;
  size: number;

  constructor(xRange: Range, yRange: Range, zRange: Range) {
    this.xRange = xRange;
    this.yRange = yRange;
    this.zRange = zRange;
    this.size =
      (xRange.end - xRange.start + 1) *
      (yRange.end - yRange.start + 1) *
      (zRange.end - zRange.start + 1);
  }

  splitSubtract(other: Cube) {
    const cubes = [];
    if (this.isSplitByCubeAlongAnyAxis(other)) {
      const cubeToBeRemoved = [];
      const xs = this.axisSplitPoints(
        this.xRange,
        other.xRange,
        cubeToBeRemoved
      );
      const ys = this.axisSplitPoints(
        this.yRange,
        other.yRange,
        cubeToBeRemoved
      );
      const zs = this.axisSplitPoints(
        this.zRange,
        other.zRange,
        cubeToBeRemoved
      );
      for (let xi = 0; xi < xs.length; xi++) {
        for (let yi = 0; yi < ys.length; yi++) {
          for (let zi = 0; zi < zs.length; zi++) {
            if (
              xi !== cubeToBeRemoved[0] ||
              yi !== cubeToBeRemoved[1] ||
              zi !== cubeToBeRemoved[2]
            ) {
              cubes.push(
                new Cube(
                  new Range(xs[xi][0], xs[xi][1]),
                  new Range(ys[yi][0], ys[yi][1]),
                  new Range(zs[zi][0], zs[zi][1])
                )
              );
            }
          }
        }
      }
    }
    return cubes;
  }

  axisSplitPoints(
    thisRange: Range,
    otherRange: Range,
    xyzRemoval: number[]
  ): number[][] {
    let splitPoints = [];
    let cubeToBeRemoved: number;
    if (otherRange.startLiesWithinRange(thisRange)) {
      cubeToBeRemoved = 1;
      splitPoints.push([thisRange.start, otherRange.start - 1]);
      if (otherRange.endLiesWithinRange(thisRange)) {
        splitPoints.push([otherRange.start, otherRange.end]);
        splitPoints.push([otherRange.end + 1, thisRange.end]);
      } else {
        splitPoints.push([otherRange.start, thisRange.end]);
      }
    } else {
      cubeToBeRemoved = 0;
      if (otherRange.endLiesWithinRange(thisRange)) {
        splitPoints.push([thisRange.start, otherRange.end]);
        splitPoints.push([otherRange.end + 1, thisRange.end]);
      } else {
        splitPoints.push([thisRange.start, thisRange.end]);
      }
    }
    xyzRemoval.push(cubeToBeRemoved);
    return splitPoints;
  }

  isSplitByCubeAlongAnyAxis(other: Cube): boolean {
    return (
      !this.xRange.fallsOutsideOfRange(other.xRange) &&
      !this.yRange.fallsOutsideOfRange(other.yRange) &&
      !this.zRange.fallsOutsideOfRange(other.zRange)
    );
  }

  fullyContainsCube(other: Cube): boolean {
    return (
      this.xRange.start <= other.xRange.start &&
      other.xRange.end <= this.xRange.end &&
      this.yRange.start <= other.yRange.start &&
      other.yRange.end <= this.yRange.end &&
      this.zRange.start <= other.zRange.start &&
      other.zRange.end <= this.zRange.end
    );
  }

  isFullyContainedByCube(other: Cube): boolean {
    return other.fullyContainsCube(this);
  }
}

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  cutsRange(other: Range): boolean {
    return this.startLiesWithinRange(other) || this.endLiesWithinRange(other);
  }

  startLiesWithinRange(other: Range): boolean {
    return other.start < this.start && this.start <= other.end;
  }

  endLiesWithinRange(other: Range): boolean {
    return other.start <= this.end && this.end < other.end;
  }

  encompassesRange(other: Range): boolean {
    return this.start <= other.start && this.end >= other.end;
  }

  isEncompassedByRange(other: Range): boolean {
    return other.encompassesRange(this);
  }

  fallsOutsideOfRange(other: Range): boolean {
    return (
      (this.start <= other.start && this.end < other.start) ||
      (this.start > other.end && this.end >= other.end)
    );
  }
}

main("./day22_test1.txt");
main("./day22_test2.txt");
main("./day22_test3.txt");
main("./day22_input.txt");
