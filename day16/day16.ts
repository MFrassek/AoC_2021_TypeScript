import { readFileSync } from "fs";

const main = (filePath: string) => {
  const hexCode = readFileSync(filePath, "utf-8");
  let binCode = { code: "", start: 0, packageNumbers: [] };
  hexCode.split("").forEach((char) => {
    binCode.code += parseInt(char, 16).toString(2).padStart(4, "0");
  });
  const finalValue = parse(binCode);
  console.log(
    "Version sum: " +
      binCode.packageNumbers.reduce((soFar, next) => soFar + next)
  );
  console.log("Value: " + finalValue);
};

const parse = (binCode: binCode) => {
  const version = parseInt(
    binCode.code.slice(binCode.start, binCode.start + 3),
    2
  );
  binCode.packageNumbers.push(version);
  binCode.start += 3;
  const type = parseInt(
    binCode.code.slice(binCode.start, binCode.start + 3),
    2
  );
  binCode.start += 3;
  if (type === 4) {
    let literalValue = "";
    while (binCode.code[binCode.start] === "1") {
      binCode.start += 1;
      literalValue += binCode.code.slice(binCode.start, binCode.start + 4);
      binCode.start += 4;
    }
    binCode.start += 1;
    literalValue += binCode.code.slice(binCode.start, binCode.start + 4);
    binCode.start += 4;
    return parseInt(literalValue, 2);
  } else {
    const lengthId: boolean = JSON.parse(
      binCode.code.slice(binCode.start, binCode.start + 1)
    );
    binCode.start += 1;
    const subPackages = [];
    if (lengthId) {
      let subPackageCount = parseInt(
        binCode.code.slice(binCode.start, binCode.start + 11),
        2
      );
      binCode.start += 11;
      for (let i = 0; i < subPackageCount; i++) {
        subPackages.push(parse(binCode));
      }
    } else {
      let subPackageLength = parseInt(
        binCode.code.slice(binCode.start, binCode.start + 15),
        2
      );
      binCode.start += 15;
      let subPackageEnd = binCode.start + subPackageLength;
      while (binCode.start < subPackageEnd) {
        subPackages.push(parse(binCode));
      }
    }
    return operate(subPackages, type);
  }
};

const operate = (subPackages: number[], operatorCode: number) => {
  if (operatorCode === 0) {
    return subPackages.reduce((sum, next) => sum + next);
  } else if (operatorCode === 1) {
    return subPackages.reduce((product, next) => product * next);
  } else if (operatorCode === 2) {
    return Math.min(...subPackages);
  } else if (operatorCode === 3) {
    return Math.max(...subPackages);
  } else if (operatorCode === 5) {
    return subPackages[0] > subPackages[1] ? 1 : 0;
  } else if (operatorCode === 6) {
    return subPackages[0] < subPackages[1] ? 1 : 0;
  } else if (operatorCode === 7) {
    return subPackages[0] === subPackages[1] ? 1 : 0;
  }
};

interface binCode {
  code: string;
  start: number;
  packageNumbers: number[];
}

main("./day16_test0.txt");
main("./day16_test1.txt");
main("./day16_test2.txt");
main("./day16_test3.txt");
main("./day16_test4.txt");
main("./day16_test5.txt");
main("./day16_test6.txt");
main("./day16_test7.txt");
main("./day16_test8.txt");
main("./day16_test9.txt");
main("./day16_test10.txt");
main("./day16_test11.txt");
main("./day16_test12.txt");
main("./day16_test13.txt");
main("./day16_test14.txt");
main("./day16_input.txt");
