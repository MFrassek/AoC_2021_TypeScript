import { readFileSync } from "fs";

const main = (filePath: string) => {
  const [positionLines, foldLines] = readFileSync(filePath, "utf-8")
    .split("\n\n")
    .map((instructionBulk) => instructionBulk.split("\n"));
  const positions = positionLines.map((instruction) =>
    instruction.split(",").map(parseFloat)
  );
  const foldInstructions = foldLines.map((line) => {
    const [axis, linePosition] = line.slice(11).split("=");
    if (axis === "x" || axis === "y") {
      const axisNarrowed: "x" | "y" = axis;
      return { axis: axisNarrowed, linePosition: parseInt(linePosition) };
    } else {
      throw new TypeError();
    }
  });

  const manual = new Manual(positions);
  manual.fold(foldInstructions[0]);
  console.log(manual.dotCount());
  foldInstructions.slice(1).forEach((foldInstruction) => {
    manual.fold(foldInstruction);
  });
  console.log(manual.toString());
};

interface FoldInstruction {
  axis: "x" | "y";
  linePosition: number;
}

class Manual {
  grid: boolean[][];
  xs: number;
  ys: number;

  constructor(positions: number[][]) {
    this.grid = [];
    this.xs = 0;
    this.ys = 0;
    positions.forEach((position) => {
      if (position[0] >= this.xs) {
        this.xs = position[0] + 1;
      }
      if (position[1] >= this.ys) {
        this.ys = position[1] + 1;
      }
    });
    this.grid = Array.from(Array(this.ys).keys()).map((y) => {
      return Array.from(Array(this.xs).keys()).map((x) => {
        return false;
      });
    });
    positions.forEach((position) => {
      this.grid[position[1]][position[0]] = true;
    });
  }

  fold(foldInstruction: FoldInstruction) {
    let axis = foldInstruction.axis;
    let linePosition = foldInstruction.linePosition;
    if (axis === "x") {
      this.grid = Array.from(Array(this.ys).keys()).map((y) => {
        return Array.from(Array(linePosition).keys()).map((x) => {
          return (
            this.grid[y][x] || this.grid[y][linePosition + (linePosition - x)]
          );
        });
      });
      this.xs = linePosition;
    } else {
      this.grid = Array.from(Array(linePosition).keys()).map((y) => {
        return Array.from(Array(this.xs).keys()).map((x) => {
          return (
            this.grid[y][x] ||
            (this.grid[linePosition + (linePosition - y)] === undefined
              ? false
              : this.grid[linePosition + (linePosition - y)][x])
          );
        });
      });
      this.ys = linePosition;
    }
  }

  toString() {
    return (
      "\n" +
      Array.from(Array(this.ys).keys())
        .map((y) => {
          return Array.from(Array(this.xs).keys())
            .map((x) => {
              return this.grid[y][x] === true ? "#" : ".";
            })
            .join("");
        })
        .join("\n") +
      "\n"
    );
  }

  dotCount() {
    return this.grid
      .map((row) => {
        return row.filter((val) => val).length;
      })
      .reduce((sumSoFar, rowCount) => {
        return sumSoFar + rowCount;
      });
  }
}

main("./day13_test1.txt");
main("./day13_input.txt");
