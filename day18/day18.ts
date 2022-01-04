import { readFileSync } from "fs";

const main = (filePath: string) => {
  const lines = readFileSync(filePath, "utf-8").split("\n");
  let snailfishNumber = new SnailfischNumber(lines[0]);
  lines.slice(1).forEach((line) => {
    snailfishNumber.add(new SnailfischNumber(line));
    snailfishNumber.reduce();
  });
  console.log(snailfishNumber.magnitude());
  let maxMagnitude = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i !== j) {
        snailfishNumber = new SnailfischNumber(lines[i]);
        snailfishNumber.add(new SnailfischNumber(lines[j]));
        snailfishNumber.reduce();
        let magnitude = snailfishNumber.magnitude();
        if (magnitude > maxMagnitude) {
          maxMagnitude = magnitude;
        }
      }
    }
  }
  console.log(maxMagnitude);
};

class SnailfischNumber {
  head: Node;
  tail: Node;

  constructor(snailfischNumber: string) {
    let nestedness = -1;
    snailfischNumber.split("").forEach((char) => {
      if (char === "[") {
        nestedness++;
      } else if (char === "]") {
        nestedness--;
      } else if (char === ",") {
      } else {
        let node = new Node(parseInt(char), nestedness);
        if (this.head === undefined) {
          this.head = node;
        }
        if (this.tail) {
          this.linkNeighbors(this.tail, node);
        }
        this.tail = node;
      }
    });
  }

  linkNeighbors(leftNode: Node, rightNode: Node) {
    leftNode.rightNeighbor = rightNode;
    rightNode.leftNeighbor = leftNode;
  }

  reduce() {
    while (this.isExplodable() || this.isSplittable()) {
      if (this.isExplodable()) {
        this.explode();
        continue;
      }
      if (this.isSplittable()) {
        this.split();
        continue;
      }
    }
  }

  isExplodable(): boolean {
    let node = this.head;
    while (node !== undefined) {
      if (node.nestedness >= 4) {
        return true;
      }
      node = node.rightNeighbor;
    }
    return false;
  }

  explode() {
    let node = this.head;
    while (node !== undefined) {
      if (node.nestedness >= 4) {
        let leftPart = node;
        let rightPart = node.rightNeighbor;
        let leftNeighbor = leftPart.leftNeighbor;
        let rightNeighbor = rightPart.rightNeighbor;
        let newNode = new Node(0, 3);
        if (leftPart === this.head) {
          this.head = newNode;
        } else {
          leftNeighbor.number += leftPart.number;
          this.linkNeighbors(leftNeighbor, newNode);
        }
        if (rightPart === this.tail) {
          this.tail = newNode;
        } else {
          rightNeighbor.number += rightPart.number;
          this.linkNeighbors(newNode, rightNeighbor);
        }
        return;
      }
      node = node.rightNeighbor;
    }
  }

  isSplittable(): boolean {
    let node = this.head;
    while (node !== undefined) {
      if (node.number > 9) {
        return true;
      }
      node = node.rightNeighbor;
    }
    return false;
  }

  split() {
    let node = this.head;
    while (node !== undefined) {
      if (node.number > 9) {
        let newLeftPart = new Node(
          Math.floor(node.number / 2),
          node.nestedness + 1
        );
        let newRightPart = new Node(
          Math.ceil(node.number / 2),
          node.nestedness + 1
        );
        this.linkNeighbors(newLeftPart, newRightPart);
        if (node === this.head) {
          this.head = newLeftPart;
        } else {
          this.linkNeighbors(node.leftNeighbor, newLeftPart);
        }
        if (node === this.tail) {
          this.tail = newRightPart;
        } else {
          this.linkNeighbors(newRightPart, node.rightNeighbor);
        }
        return;
      }
      node = node.rightNeighbor;
    }
  }

  add(other: SnailfischNumber) {
    let node = this.head;
    while (node !== undefined) {
      node.nestedness++;
      node = node.rightNeighbor;
    }
    node = other.head;
    while (node !== undefined) {
      node.nestedness++;
      node = node.rightNeighbor;
    }
    this.linkNeighbors(this.tail, other.head);
    this.tail = other.tail;
  }

  magnitude(): number {
    this.condense(3);
    this.condense(2);
    this.condense(1);
    this.condense(0);
    return this.head.number;
  }

  condense(level: number) {
    let node = this.head;
    while (node !== undefined) {
      if (node.nestedness === level) {
        let leftPart = node;
        let rightPart = node.rightNeighbor;
        let newNode = new Node(
          3 * leftPart.number + 2 * rightPart.number,
          node.nestedness - 1
        );
        if (leftPart === this.head) {
          this.head = newNode;
        } else {
          this.linkNeighbors(leftPart.leftNeighbor, newNode);
        }
        if (rightPart === this.tail) {
          this.tail = newNode;
        } else {
          this.linkNeighbors(newNode, rightPart.rightNeighbor);
        }
        node = newNode;
      }
      node = node.rightNeighbor;
    }
  }
  print() {
    let node = this.head;
    while (node !== undefined) {
      console.log(node.number, node.nestedness);
      node = node.rightNeighbor;
    }
    console.log();
  }
}

class Node {
  number: number;
  nestedness: number;
  leftNeighbor?: Node;
  rightNeighbor?: Node;

  constructor(
    number: number,
    nestedness: number,
    leftNeighbor?: Node,
    rightNeighbor?: Node
  ) {
    this.number = number;
    this.nestedness = nestedness;
    if (leftNeighbor) {
      this.leftNeighbor = leftNeighbor;
    }
    if (rightNeighbor) {
      this.rightNeighbor = rightNeighbor;
    }
  }
}
main("./day18_test3.txt");
main("./day18_input.txt");
