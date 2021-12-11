import { readFileSync } from "fs";

const main = (filePath: string): void => {
  const file = readFileSync(filePath, "utf-8");
  const timers = file.split(",").map(parseFloat);
  const population = new LanternFishPopulation(timers);
  for (let index = 0; index < 80; index++) {
    population.iterateForward();
  }
  console.log(population.size());
  for (let index = 0; index < 256 - 80; index++) {
    population.iterateForward();
  }
  console.log(population.size());
};

class LanternFishPopulation {
  daysTillSpawnCounts: Record<number, number>;

  constructor(timers: number[]) {
    this.daysTillSpawnCounts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };
    timers.forEach((countDownTimer) => {
      if (countDownTimer in this.daysTillSpawnCounts) {
        this.daysTillSpawnCounts[countDownTimer]++;
      }
    });
  }
  iterateForward() {
    this.daysTillSpawnCounts = {
      0: this.daysTillSpawnCounts[1],
      1: this.daysTillSpawnCounts[2],
      2: this.daysTillSpawnCounts[3],
      3: this.daysTillSpawnCounts[4],
      4: this.daysTillSpawnCounts[5],
      5: this.daysTillSpawnCounts[6],
      6: this.daysTillSpawnCounts[7] + this.daysTillSpawnCounts[0],
      7: this.daysTillSpawnCounts[8],
      8: this.daysTillSpawnCounts[0],
    };
  }
  size() {
    let sum = 0;
    Object.keys(this.daysTillSpawnCounts).forEach((key) => {
      sum += this.daysTillSpawnCounts[key];
    });
    return sum;
  }
}

main("./day6_test1.txt");
main("./day6_input.txt");
