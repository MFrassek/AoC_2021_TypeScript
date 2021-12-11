import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const lines = file.split("\n");
  const map = new heightMap(lines);
  console.log(map.totalRiskLevel());
  const basinSizes = map.basinSizes();
  console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);
};

class heightMap {
  heights: number[][];
  rowCount: number;
  columnCount: number;

  constructor(rows: string[]) {
    this.heights = rows.map((row) => {
      return row.split("").map(parseFloat);
    });
    this.rowCount = this.heights.length;
    this.columnCount = this.rowCount > 0 ? this.heights[0].length : 0;
  }

  basinSizes(): number[] {
    const visited: boolean[][] = this.heights.map((row) => {
      return row.map((element) => {
        return false;
      });
    });
    const clusterSizes = this.lowPointPositions().map((lowPoint) => {
      const toVisit: gridPosition[] = [lowPoint];
      visited[lowPoint.row][lowPoint.column] = true;
      let clusterSize = 0;
      while (toVisit.length > 0) {
        const nextPositionToVisit = toVisit.pop();
        clusterSize++;
        this.neighborPositions(nextPositionToVisit).forEach(
          (neighborPosition) => {
            if (
              !visited[neighborPosition.row][neighborPosition.column] &&
              this.height(neighborPosition) !== 9
            ) {
              toVisit.push(neighborPosition);
              visited[neighborPosition.row][neighborPosition.column] = true;
            }
          }
        );
      }
      return clusterSize;
    });
    return clusterSizes.sort(function (a, b) {
      return b - a;
    });
  }

  totalRiskLevel(): number {
    let totalRiskLevel = 0;
    this.lowPointPositions().forEach((lowPoint) => {
      totalRiskLevel += this.riskLevel(lowPoint);
    });
    return totalRiskLevel;
  }

  lowPointPositions(): gridPosition[] {
    const lowPointPositions = [];
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.columnCount; col++) {
        if (this.isLowPoint({ row: row, column: col })) {
          lowPointPositions.push({ row: row, column: col });
        }
      }
    }
    return lowPointPositions;
  }

  isLowPoint(gridPositionOfInterest: gridPosition): boolean {
    const positionHeight = this.height(gridPositionOfInterest);
    return this.neighborHeights(gridPositionOfInterest).every(
      (neighborHeight) => {
        return positionHeight < neighborHeight;
      }
    );
  }

  riskLevel(gridPositionOfInterest: gridPosition): number {
    return this.height(gridPositionOfInterest) + 1;
  }

  height(gridPositionOfInterest: gridPosition): number {
    return this.heights[gridPositionOfInterest.row][
      gridPositionOfInterest.column
    ];
  }

  neighborHeights(gridPositionOfInterest: gridPosition): number[] {
    return this.neighborPositions(gridPositionOfInterest).map((position) => {
      return this.heights[position.row][position.column];
    });
  }

  neighborPositions(gridPositionOfInterest: gridPosition): gridPosition[] {
    const neighborPositions = [];
    if (gridPositionOfInterest.row > 0) {
      neighborPositions.push({
        row: gridPositionOfInterest.row - 1,
        column: gridPositionOfInterest.column,
      });
    }
    if (gridPositionOfInterest.row < this.rowCount - 1) {
      neighborPositions.push({
        row: gridPositionOfInterest.row + 1,
        column: gridPositionOfInterest.column,
      });
    }
    if (gridPositionOfInterest.column > 0) {
      neighborPositions.push({
        row: gridPositionOfInterest.row,
        column: gridPositionOfInterest.column - 1,
      });
    }
    if (gridPositionOfInterest.column < this.columnCount - 1) {
      neighborPositions.push({
        row: gridPositionOfInterest.row,
        column: gridPositionOfInterest.column + 1,
      });
    }
    return neighborPositions;
  }
}

interface gridPosition {
  row: number;
  column: number;
}

main("./day9_test1.txt");
main("./day9_input.txt");
