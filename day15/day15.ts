import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const chitons = file.split("\n").map((line) => {
    return line.split("").map(parseFloat);
  });
  logRiskOfOptimalPath(new ChitonGrid(chitons));
  logRiskOfOptimalPath(new ChitonMegaGrid(chitons));
};

const logRiskOfOptimalPath = (chitonGrid: ChitonGrid | ChitonMegaGrid) => {
  const queue = new PriorityQueue<Node>();
  const startNode = chitonGrid.nodes[0][0];
  chitonGrid.nodes[chitonGrid.nodes.length - 1][
    chitonGrid.nodes[0].length - 1
  ].isDestination = true;
  startNode.wasVisited = true;
  startNode.risk = 0;
  queue.push(startNode, startNode.chitons);
  while (!queue.isEmpty()) {
    let currentNode = queue.pop();
    currentNode.neighbors.forEach((neighbor) => {
      if (!neighbor.wasVisited) {
        neighbor.wasVisited = true;
        neighbor.risk = currentNode.risk + neighbor.chitons;
        queue.push(neighbor, neighbor.risk);
      }
      if (neighbor.isDestination) {
        console.log(neighbor.risk);
        queue.emptyQueue();
      }
    });
  }
};

interface Node {
  chitons: number;
  neighbors: Node[];
  wasVisited: boolean;
  risk?: number;
  isDestination?: boolean;
}

class ChitonGrid {
  nodes: Node[][];
  constructor(chitons: number[][]) {
    this.nodes = [];
    for (let row = 0; row < chitons.length; row++) {
      this.nodes.push([]);
      for (let col = 0; col < chitons.length; col++) {
        this.nodes[row].push({
          chitons: chitons[row][col],
          neighbors: [],
          wasVisited: false,
        });
      }
    }
    for (let row = 0; row < chitons.length; row++) {
      for (let col = 0; col < chitons.length; col++) {
        if (row - 1 >= 0) {
          this.nodes[row][col].neighbors.push(this.nodes[row - 1][col]);
        }
        if (row + 1 < chitons.length) {
          this.nodes[row][col].neighbors.push(this.nodes[row + 1][col]);
        }
        if (col - 1 >= 0) {
          this.nodes[row][col].neighbors.push(this.nodes[row][col - 1]);
        }
        if (col + 1 < chitons[0].length) {
          this.nodes[row][col].neighbors.push(this.nodes[row][col + 1]);
        }
      }
    }
  }
}
class ChitonMegaGrid {
  nodes: Node[][];
  constructor(chitons: number[][]) {
    this.nodes = [];
    for (let row = 0; row < chitons.length * 5; row++) {
      this.nodes.push([]);
      for (let col = 0; col < chitons[0].length * 5; col++) {
        let temp =
          chitons[row % chitons.length][col % chitons[0].length] +
          Math.floor(row / chitons.length) +
          Math.floor(col / chitons[0].length);

        this.nodes[row].push({
          chitons: temp > 9 ? temp - 9 : temp,
          neighbors: [],
          wasVisited: false,
        });
      }
    }
    for (let row = 0; row < chitons.length * 5; row++) {
      for (let col = 0; col < chitons[0].length * 5; col++) {
        if (row - 1 >= 0) {
          this.nodes[row][col].neighbors.push(this.nodes[row - 1][col]);
        }
        if (row + 1 < chitons.length * 5) {
          this.nodes[row][col].neighbors.push(this.nodes[row + 1][col]);
        }
        if (col - 1 >= 0) {
          this.nodes[row][col].neighbors.push(this.nodes[row][col - 1]);
        }
        if (col + 1 < chitons[0].length * 5) {
          this.nodes[row][col].neighbors.push(this.nodes[row][col + 1]);
        }
      }
    }
  }
}

class PriorityQueue<T> {
  data: [number, T][];

  constructor() {
    this.data = [];
  }

  push(element: T, priority: number) {
    this.data.push([priority, element]);
  }

  pop(): T {
    this.data.sort(function (a, b) {
      return b[0] - a[0];
    });
    return this.data.pop()[1];
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  emptyQueue() {
    this.data = [];
  }
}

main("./day15_test1.txt");
main("./day15_input.txt");
