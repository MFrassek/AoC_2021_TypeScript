import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const energyLevels = file
    .split("\n")
    .map((line) => line.split("").map(parseFloat));
  let population = new OctopusPopulation(energyLevels);
  for (let i = 0; i < 100; i++) {
    population.step();
  }
  console.log(population.flashesSoFar);
  population = new OctopusPopulation(energyLevels);
  while (!population.wholePopulationJustFlashed()) {
    population.step();
  }
  console.log(population.stepsSoFar);
};

class OctopusPopulation {
  grid: number[][];
  rowCount: number;
  colCount: number;
  flashesSoFar: number;
  stepsSoFar: number;

  constructor(startingConfiguration: number[][]) {
    this.grid = startingConfiguration.map((row) => {
      return row.map((element) => {
        return element;
      });
    });
    this.rowCount = this.grid.length;
    this.colCount = this.rowCount ? this.grid[0].length : 0;
    this.flashesSoFar = 0;
    this.stepsSoFar = 0;
  }

  neighborPositions(position: gridPosition): gridPosition[] {
    const neighborPositions = [];
    const rows = [position.row - 1, position.row, position.row + 1].forEach(
      (row) => {
        if (row >= 0 && row < this.rowCount) {
          const cols = [
            position.col - 1,
            position.col,
            position.col + 1,
          ].forEach((col) => {
            if (col >= 0 && col < this.colCount) {
              if (row != position.row || col != position.col) {
                neighborPositions.push({ row: row, col: col });
              }
            }
          });
        }
      }
    );
    return neighborPositions;
  }

  step() {
    this.stepsSoFar++;
    this.increaseAllPositions();
    this.flashableOctopuses().forEach((flashableOctopus) => {
      this.flashOctopus(flashableOctopus);
    });
  }

  increaseAllPositions() {
    this.grid = this.grid.map((row) => {
      return row.map((element) => {
        return element + 1;
      });
    });
  }

  flashableOctopuses(): gridPosition[] {
    const flashableOctopuses = [];
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.colCount; col++) {
        if (this.grid[row][col] > 9) {
          flashableOctopuses.push({ row: row, col: col });
        }
      }
    }
    return flashableOctopuses;
  }

  flashOctopus(position: gridPosition) {
    if (this.grid[position.row][position.col] > 0) {
      this.grid[position.row][position.col] = 0;
      this.flashesSoFar++;
      this.neighborPositions(position).forEach((neighborPosition) => {
        if (this.grid[neighborPosition.row][neighborPosition.col] != 0) {
          this.grid[neighborPosition.row][neighborPosition.col]++;
          if (this.grid[neighborPosition.row][neighborPosition.col] > 9) {
            this.flashOctopus(neighborPosition);
          }
        }
      });
    }
  }

  wholePopulationJustFlashed() {
    return this.grid.every((row) => {
      return row.every((element) => {
        return element === 0;
      });
    });
  }
}

interface gridPosition {
  row: number;
  col: number;
}

main("./day11_test1.txt");
main("./day11_input.txt");
