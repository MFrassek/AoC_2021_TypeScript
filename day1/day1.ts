import { readFileSync } from "fs";

const main = (file_path: string) => {
  const file = readFileSync(file_path, "utf-8");
  const depths = file.split("\n").map(parseFloat);
  console.log(singleDepthIncreasesCount(depths));
  console.log(windowDepthIncreasesCount(depths));
};

const singleDepthIncreasesCount = (depths: number[]) => {
  let count = 0;
  for (let i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) {
      count++;
    }
  }
  return count;
};

const windowDepthIncreasesCount = (depths: number[]) => {
  let count = 0;
  for (let i = 0; i < depths.length - 3; i++) {
    if (
      arraySum(depths.slice(i + 1, i + 4)) > arraySum(depths.slice(i, i + 3))
    ) {
      count++;
    }
  }
  return count;
};

const arraySum = (array: number[]) => {
  return array.reduce((sum, current) => sum + current);
};

main("./day1_test1.txt");
main("./day1_input.txt");
