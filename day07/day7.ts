import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const positions = file.split(",").map(parseFloat);
  const crabFleet = new CrabFleet(positions);
  console.log(crabFleet.basicMinimumNumberMoves());
  console.log(crabFleet.increasingMinimumNumberMoves());
};

class CrabFleet {
  minPosition: number;
  maxPosition: number;
  fleetSize: number;
  positionCounts: Record<number, number>;

  constructor(positions: number[]) {
    this.minPosition = Math.min.apply(null, positions);
    this.maxPosition = Math.max.apply(null, positions);
    this.fleetSize = positions.length;
    this.positionCounts = {};
    for (let index = this.minPosition; index <= this.maxPosition; index++) {
      this.positionCounts[index] = 0;
    }
    positions.forEach((position) => {
      this.positionCounts[position]++;
    });
  }

  increasingMinimumNumberMoves() {
    let movesToPivot = this.increasingMovesNeededToMinPosition();
    let minimumNumberMoves = movesToPivot;
    for (let pivot = this.minPosition; pivot <= this.maxPosition; pivot++) {
      Object.keys(this.positionCounts).forEach((key) => {
        if (parseInt(key) > pivot) {
          movesToPivot += (pivot - parseInt(key)) * this.positionCounts[key];
        } else {
          movesToPivot +=
            (pivot + 1 - parseInt(key)) * this.positionCounts[key];
        }
      });
      if (movesToPivot < minimumNumberMoves) {
        minimumNumberMoves = movesToPivot;
      }
    }
    return minimumNumberMoves;
  }

  increasingMovesNeededToMinPosition(): number {
    let movesNeeded = 0;
    Object.keys(this.positionCounts).forEach((key) => {
      movesNeeded +=
        this.increasingMoveFuelConsumption(parseInt(key)) *
        this.positionCounts[key];
    });
    return movesNeeded;
  }

  increasingMoveFuelConsumption(distance: number): number {
    return (distance * (distance + 1)) / 2;
  }

  basicMinimumNumberMoves(): number {
    let movesToPivot = this.basicMovesNeededToMinPosition();
    let minimumNumberMoves = movesToPivot;
    for (
      let pivot = this.minPosition,
        fleetSizeBelowPivot = 0,
        fleetSizeAbovePivot = this.fleetSize - this.positionCounts[pivot];
      pivot <= this.maxPosition;
      pivot++,
        fleetSizeBelowPivot += this.positionCounts[pivot - 1],
        fleetSizeAbovePivot -= this.positionCounts[pivot]
    ) {
      movesToPivot +=
        this.positionCounts[pivot] + fleetSizeBelowPivot - fleetSizeAbovePivot;
      if (movesToPivot < minimumNumberMoves) {
        minimumNumberMoves = movesToPivot;
      }
    }
    return minimumNumberMoves;
  }

  basicMovesNeededToMinPosition(): number {
    let movesNeeded = 0;
    Object.keys(this.positionCounts).forEach((key) => {
      movesNeeded += parseInt(key) * this.positionCounts[key];
    });
    return movesNeeded;
  }
}

main("./day7_test1.txt");
main("./day7_input.txt");
