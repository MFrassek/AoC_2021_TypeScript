import { readFileSync } from "fs";

const main = (filePath: string) => {
  const grid = readFileSync(filePath, "utf-8")
    .split("\n")
    .map((line) => line.split(""));
  const field = new SeaCucumberField(grid);
  while (!field.didNotChangeInLastStep()) {
    field.step();
  }
  console.log(field.stepCount);
};

class SeaCucumberField {
  grid: string[][];
  rowCount: number;
  colCount: number;
  previousGrid: string[][];
  stepCount: number;

  constructor(grid: string[][]) {
    this.grid = grid.map((row) => row.map((element) => element));
    this.rowCount = this.grid.length;
    this.colCount = this.rowCount === 0 ? 0 : this.grid[0].length;
    this.previousGrid = this.grid.map((row) => row.map((element) => "."));
    this.stepCount = 0;
  }

  step() {
    this.previousGrid = this.grid;
    this.eastStep();
    this.southStep();
    this.stepCount++;
  }

  eastStep() {
    const tempGrid = this.grid.map((row) => row.map((element) => "."));
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.colCount; col++) {
        if (this.grid[row][col] === ">") {
          if (this.grid[row][(col + 1) % this.colCount] === ".") {
            tempGrid[row][(col + 1) % this.colCount] = ">";
          } else {
            tempGrid[row][col] = ">";
          }
        } else if (this.grid[row][col] === "v") {
          tempGrid[row][col] = "v";
        }
      }
    }
    this.grid = tempGrid;
  }

  southStep() {
    const tempGrid = this.grid.map((row) => row.map((element) => "."));
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.colCount; col++) {
        if (this.grid[row][col] === "v") {
          if (this.grid[(row + 1) % this.rowCount][col] === ".") {
            tempGrid[(row + 1) % this.rowCount][col] = "v";
          } else {
            tempGrid[row][col] = "v";
          }
        } else if (this.grid[row][col] === ">") {
          tempGrid[row][col] = ">";
        }
      }
    }
    this.grid = tempGrid;
  }

  didNotChangeInLastStep(): boolean {
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.colCount; col++) {
        if (this.grid[row][col] !== this.previousGrid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
}

main("./day25_test1.txt");
main("./day25_input.txt");
