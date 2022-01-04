import { readFileSync } from "fs";

const main = (filePath: string) => {
  const [algorithm, baseImage] = readFileSync(filePath, "utf-8").split("\n\n");
  const imageLines = baseImage.split("\n");
  const image = new ScannerImage(algorithm, imageLines);
  for (let i = 0; i < 50; i++) {
    image.enhance();
    if (i == 1) {
      console.log(image.activePixels());
    }
  }
  console.log(image.activePixels());
};

class ScannerImage {
  enhancementAlgorithm: string;
  grid: string[][];
  rowCount: number;
  colCount: number;
  step: number;

  constructor(enhancementAlgorithm: string, image: string[]) {
    this.enhancementAlgorithm = enhancementAlgorithm;
    this.grid = image.map((row) => row.split(""));
    this.rowCount = this.grid.length;
    this.colCount = this.rowCount > 0 ? this.grid[0].length : 0;
    this.step = 0;
  }
  activePixels() {
    let count = 0;
    this.grid.forEach((row) => {
      row.forEach((element) => {
        if (element === "#") {
          count++;
        }
      });
    });
    return count;
  }
  enhance() {
    const newGrid = [];
    for (let row = -1, i = 0; row < this.rowCount + 1; row++, i++) {
      newGrid.push([]);
      for (let col = -1; col < this.colCount + 1; col++) {
        newGrid[i].push(this.enhancedPixel(row, col));
      }
    }
    this.grid = newGrid;
    this.rowCount += 2;
    this.colCount += 2;
    this.step++;
  }

  enhancedPixel(row: number, col: number): string {
    return this.enhancementAlgorithm[this.neighborhoodNumber(row, col)];
  }

  neighborhoodNumber(row: number, col: number): number {
    const neighborhoddBinary = this.neighborhoodString(row, col)
      .split("")
      .map((char) => (char === "#" ? "1" : "0"))
      .join("");
    return parseInt(neighborhoddBinary, 2);
  }

  neighborhoodString(row: number, col: number): string {
    const neighbors = [];
    [-1, 0, 1].forEach((r) => {
      [-1, 0, 1].forEach((c) => {
        neighbors.push(
          this.grid[row + r] === undefined ||
            this.grid[row + r][col + c] === undefined
            ? this.enhancementAlgorithm[0] === "#" &&
              this.enhancementAlgorithm[511] === "." &&
              this.step % 2 === 1
              ? "#"
              : "."
            : this.grid[row + r][col + c]
        );
      });
    });
    return neighbors.join("");
  }

  print() {
    this.grid.forEach((row) => {
      console.log(row.join(""));
    });
  }
}

main("./day20_test1.txt");
main("./day20_input.txt");
