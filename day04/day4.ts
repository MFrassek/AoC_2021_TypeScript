import { readFileSync } from "fs";

const main = (filePath: string): void => {
  const file = readFileSync(filePath, "utf-8");
  const lines = file.split("\n");
  const drawnNumbers = lines[0].split(",").map(parseFloat);
  const gridCount = lines.length - 2 / 6;
  const grids: number[][][] = [];
  for (let gridIndex = 0; gridIndex < gridCount; gridIndex++) {
    grids.push(grid(lines, 2 + gridIndex * 6));
  }
  const numbersToGridPositionsOfGrids = grids.map((grid) =>
    numbersToGridPositions(grid)
  );
  const bingoedBoards: number[] = [];
  const finishingNumbers: number[] = [];
  for (let drawIndex = 0; drawIndex < drawnNumbers.length; drawIndex++) {
    const drawnNumber = drawnNumbers[drawIndex];
    for (let index = 0; index < grids.length; index++) {
      if (!bingoedBoards.includes(index)) {
        const grid = grids[index];
        const numbersToGridPositions = numbersToGridPositionsOfGrids[index];
        if (drawnNumber in numbersToGridPositions) {
          markNumberInGrid(grid, drawnNumber, numbersToGridPositions);
          if (hasBingo(grid)) {
            bingoedBoards.push(index);
            finishingNumbers.push(drawnNumber);
          }
        }
      }
    }
  }
  if (bingoedBoards.length > 0) {
    console.log(bingoScore(grids[bingoedBoards[0]]) * finishingNumbers[0]);
    console.log(
      bingoScore(grids[bingoedBoards.pop()]) * finishingNumbers.pop()
    );
  }
};

const grid = (lines: string[], startRow: number) => {
  return lines.slice(startRow, startRow + 5).map((line) => {
    return line.match(/.{1,3}/g).map(parseFloat);
  });
};

interface gridPosition {
  row: number;
  column: number;
}

const numbersToGridPositions = (
  grid: number[][]
): Record<number, gridPosition> => {
  let result: Record<number, gridPosition> = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      let number = grid[row][col];
      result[number] = { row: row, column: col };
    }
  }
  return result;
};

const markNumberInGrid = (
  grid: number[][],
  number: number,
  numbersToGridPositions: Record<number, gridPosition>
) => {
  grid[numbersToGridPositions[number].row][
    numbersToGridPositions[number].column
  ] = -1;
};

const hasBingo = (grid: number[][]): boolean => {
  return hasBingoRow(grid) || hasBingoRow(transpose(grid));
};

const hasBingoRow = (grid: number[][]) => {
  if (
    grid
      .map((row) => {
        return row.filter((number) => {
          return number !== -1;
        }).length === 0
          ? true
          : false;
      })
      .includes(true)
  ) {
    return true;
  }
  return false;
};

const bingoScore = (grid: number[][]): number => {
  let sum = 0;
  grid.forEach((row) => {
    row.forEach((element) => {
      if (element > 0) {
        sum += element;
      }
    });
  });
  return sum;
};

const transpose = (array: any[][]) => {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
};

main("./day4_test1.txt");
main("./day4_input.txt");
