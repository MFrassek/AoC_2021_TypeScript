import { readFileSync } from "fs";
import * as Collections from "typescript-collections";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const caveConnections = file.split("\n").map((line) => {
    return line.split("-");
  });
  let caveSystem = new CaveSystem(caveConnections);
  caveSystem.tracePaths(
    new Path(),
    "start",
    caveSystem.filterWithAllSmallCavesOnceVistiable
  );
  console.log(caveSystem.paths.length);

  caveSystem = new CaveSystem(caveConnections);
  caveSystem.tracePaths(
    new Path(),
    "start",
    caveSystem.filterWithOneSmallCaveTwiceVisitable
  );
  console.log(caveSystem.paths.length);
};

class CaveSystem {
  caves: Record<string, Cave>;
  paths: Path[];

  constructor(caveConnections: string[][]) {
    this.caves = {};
    this.paths = [];

    caveConnections.forEach((caveConnection) => {
      const cave1 = caveConnection[0];
      const cave2 = caveConnection[1];
      if (!this.caves.hasOwnProperty(cave1)) {
        this.caves[cave1] = new Cave(cave1);
      }
      if (!this.caves.hasOwnProperty(cave2)) {
        this.caves[cave2] = new Cave(cave2);
      }
      this.connectNeighbors(cave1, cave2);
    });
  }

  connectNeighbors(name1: string, name2: string) {
    this.caves[name1].addNeighbor(this.caves[name2]);
    this.caves[name2].addNeighbor(this.caves[name1]);
  }

  tracePaths(
    path: Path,
    candidateName: string,
    filterNeighbors: (neighbor: Cave, path: Path) => boolean
  ) {
    path.push(candidateName);
    if (candidateName === "end") {
      this.paths.push(path);
      return;
    }
    this.caves[candidateName].neighbors
      .toArray()
      .filter((neighbor) => {
        return filterNeighbors(neighbor, path);
      })
      .forEach((node) => {
        this.tracePaths(path.copy(), node.name, filterNeighbors);
      });
  }

  filterWithAllSmallCavesOnceVistiable(neighbor: Cave, path: Path): boolean {
    return (
      neighbor.name !== "start" &&
      (neighbor.isBig || !path.includes(neighbor.name))
    );
  }
  filterWithOneSmallCaveTwiceVisitable(neighbor: Cave, path: Path): boolean {
    return (
      neighbor.name !== "start" &&
      (neighbor.isBig ||
        !path.hasVisitedASmallCaveTwice ||
        !path.includes(neighbor.name))
    );
  }
}

class Cave {
  name: string;
  neighbors: Collections.Set<Cave>;
  isBig: boolean;

  constructor(name: string) {
    this.name = name;
    this.neighbors = new Collections.Set<Cave>();
    this.isBig = name === name.toUpperCase();
  }

  toString() {
    return this.name;
  }

  addNeighbor(neighbor: Cave) {
    if (!this.neighbors.contains(neighbor)) {
      this.neighbors.add(neighbor);
    }
  }
}

class Path {
  trace: string[];
  hasVisitedASmallCaveTwice: boolean;

  constructor(path?: Path) {
    if (path) {
      this.trace = path.trace.slice();
      this.hasVisitedASmallCaveTwice = path.hasVisitedASmallCaveTwice;
    } else {
      this.trace = [];
      this.hasVisitedASmallCaveTwice = false;
    }
  }

  push(nodeName: string) {
    if (this.includes(nodeName) && nodeName === nodeName.toLowerCase()) {
      this.hasVisitedASmallCaveTwice = true;
    }
    this.trace.push(nodeName);
  }

  includes(nodeName: string): boolean {
    return this.trace.includes(nodeName);
  }

  copy(): Path {
    return new Path(this);
  }
}

main("./day12_test1.txt");
main("./day12_test2.txt");
main("./day12_test3.txt");
main("./day12_input.txt");
