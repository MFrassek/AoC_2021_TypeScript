import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const diagnosticReport = file.split("\n");
  gammaTimesEpsilon(diagnosticReport);
  oxygenTimesCo2(diagnosticReport);
};

const gammaTimesEpsilon = (diagnosticReport: string[]) => {
  const gammaRate = parseInt(mostCommonBits(diagnosticReport).join(""), 2);
  const epsilonRate = parseInt(leastCommonBits(diagnosticReport).join(""), 2);
  console.log(gammaRate * epsilonRate);
};

const oxygenTimesCo2 = (diagnosticReport: string[]) => {
  const oxygenGeneratorRating = parseInt(
    rowFullfillingAllBitCriteria(diagnosticReport, mostCommonBits),
    2
  );
  const co2ScrubberRating = parseInt(
    rowFullfillingAllBitCriteria(diagnosticReport, leastCommonBits),
    2
  );
  console.log(oxygenGeneratorRating * co2ScrubberRating);
};

const rowFullfillingAllBitCriteria = (
  diagnosticReport: string[],
  filterFunction: (diagnosticReport: string[]) => string[]
) => {
  for (let index = 0; index < diagnosticReport[0].length; index++) {
    let relevantBit = filterFunction(diagnosticReport)[index];
    diagnosticReport = diagnosticReport.filter((row) => {
      return row[index] === relevantBit;
    });
    if (diagnosticReport.length === 1) {
      return diagnosticReport[0];
    }
  }
  return diagnosticReport[0];
};

const mostCommonBits = (diagnosticReport: string[]) => {
  const binaryDigits = diagnosticReport.map((row) => row.split(""));
  const transposedBinaryDigits = transpose(binaryDigits);
  return transposedBinaryDigits.map((row) => {
    return row.filter((element) => {
      return element === "1";
    }).length >=
      row.length / 2
      ? "1"
      : "0";
  });
};

const leastCommonBits = (diagnosticReport: string[]) => {
  return mostCommonBits(diagnosticReport).map((bit) => {
    return bit === "1" ? "0" : "1";
  });
};

const transpose = (array: any[][]) => {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
};

main("./day3_test1.txt");
main("./day3_input.txt");
