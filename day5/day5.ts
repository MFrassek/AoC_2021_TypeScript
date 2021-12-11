import { readFileSync } from "fs";

interface ventLine {
  start: position;
  end: position;
}

interface position {
  x: number;
  y: number;
}

const main = (filePath: string): void => {
  const file = readFileSync(filePath, "utf-8");
  const lines = file.split("\n");
  const ventLines = lines.map((line): ventLine => {
    const coordinates = line.split(" -> ");
    const start = coordinates[0].split(",").map(parseFloat);
    const end = coordinates[1].split(",").map(parseFloat);
    return {
      start: { x: start[0], y: start[1] },
      end: { x: end[0], y: end[1] },
    };
  });
  console.log(
    doublyCoveredPositionCount(verticalOrHorizontalVentLines(ventLines))
  );
  console.log(doublyCoveredPositionCount(ventLines));
};

const verticalOrHorizontalVentLines = (ventLines: ventLine[]): ventLine[] => {
  return ventLines.filter((ventLine) => {
    return isVerticalOrHorizontal(ventLine);
  });
};

const isVerticalOrHorizontal = (ventLine: ventLine): boolean => {
  return (
    ventLine.start.x === ventLine.end.x || ventLine.start.y === ventLine.end.y
  );
};

const doublyCoveredPositionCount = (ventLines: ventLine[]): number => {
  const positionMegaSet = new Set<string>();
  const positionDuplicateSet = new Set<string>();
  ventLines.forEach((ventLine) => {
    coveredPositions(ventLine).forEach((position) => {
      if (
        positionMegaSet.has(position.x.toString() + "," + position.y.toString())
      ) {
        positionDuplicateSet.add(
          position.x.toString() + "," + position.y.toString()
        );
      } else {
        positionMegaSet.add(
          position.x.toString() + "," + position.y.toString()
        );
      }
    });
  });
  return positionDuplicateSet.size;
};

const coveredPositions = (ventLine: ventLine): Set<position> => {
  const positions = new Set<position>();
  if (ventLine.start.x === ventLine.end.x) {
    for (
      let y = ventLine.start.y;
      ventLine.start.y < ventLine.end.y
        ? y <= ventLine.end.y
        : y >= ventLine.end.y;
      y += ventLine.start.y < ventLine.end.y ? 1 : -1
    ) {
      positions.add({ x: ventLine.start.x, y: y });
    }
  } else if (ventLine.start.y === ventLine.end.y) {
    for (
      let x = ventLine.start.x;
      ventLine.start.x < ventLine.end.x
        ? x <= ventLine.end.x
        : x >= ventLine.end.x;
      x += ventLine.start.x < ventLine.end.x ? 1 : -1
    ) {
      positions.add({ x: x, y: ventLine.start.y });
    }
  } else {
    for (
      let x = ventLine.start.x, y = ventLine.start.y;
      ventLine.start.x < ventLine.end.x
        ? x <= ventLine.end.x
        : x >= ventLine.end.x;
      x += ventLine.start.x < ventLine.end.x ? 1 : -1,
        y += ventLine.start.y < ventLine.end.y ? 1 : -1
    ) {
      positions.add({ x: x, y: y });
    }
  }

  return positions;
};

main("./day5_test1.txt");
main("./day5_input.txt");
