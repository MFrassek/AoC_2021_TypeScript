import { readFileSync } from "fs";

interface divePosition {
  depth: number;
  horizontalPosition: number;
}

interface aimingDivePosition extends divePosition {
  aim: number;
}

const main = (file_path: string) => {
  const file = readFileSync(file_path, "utf-8");
  const instructions = file.split("\n");
  const result1 = finalPositionSimple(instructions);
  console.log(result1.depth * result1.horizontalPosition);
  const result2 = finalPositionWithAim(instructions);
  console.log(result2.depth * result2.horizontalPosition);
};

const finalPositionWithAim = (instructions: string[]): aimingDivePosition => {
  let divePosition: aimingDivePosition = {
    depth: 0,
    horizontalPosition: 0,
    aim: 0,
  };
  instructions.forEach((instruction) => {
    const elements = instruction.split(" ");
    const direction = elements[0];
    const distance = parseInt(elements[1]);
    switch (direction) {
      case "forward": {
        divePosition.horizontalPosition += distance;
        divePosition.depth += divePosition.aim * distance;
        break;
      }
      case "up": {
        divePosition.aim -= distance;
        break;
      }
      case "down": {
        divePosition.aim += distance;
        break;
      }
    }
  });
  return divePosition;
};

const finalPositionSimple = (instructions: string[]): divePosition => {
  let divePosition: divePosition = { depth: 0, horizontalPosition: 0 };
  instructions.forEach((instruction) => {
    const elements = instruction.split(" ");
    const direction = elements[0];
    const distance = parseInt(elements[1]);
    switch (direction) {
      case "forward": {
        divePosition.horizontalPosition += distance;
        break;
      }
      case "up": {
        divePosition.depth -= distance;
        break;
      }
      case "down": {
        divePosition.depth += distance;
        break;
      }
    }
  });
  return divePosition;
};

main("./day2_test1.txt");
main("./day2_input.txt");
