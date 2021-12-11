import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const displayLines = file.split("\n");
  let totalOneFourSevenEightCount = 0;
  let totalDisplayedNumbers = 0;
  displayLines.forEach((line) => {
    let displayedNumber = numberCountOnDisplay(line);
    totalOneFourSevenEightCount += displayedNumber
      .toString()
      .split("")
      .filter((digit) => {
        return digit === "1" || digit === "4" || digit === "7" || digit === "8";
      }).length;
    totalDisplayedNumbers += displayedNumber;
  });
  console.log(totalOneFourSevenEightCount);
  console.log(totalDisplayedNumbers);
};
const numberCountOnDisplay = (line: string): number => {
  const patternsAndDisplayValue = line.split(" | ").map((subline) => {
    return subline.split(" ");
  });
  const patterns = metaSort(
    patternsAndDisplayValue[0].map((pattern) => {
      return pattern.split("").sort();
    })
  );

  const displayValue = patternsAndDisplayValue[1].map((pattern) => {
    return pattern.split("").sort();
  });
  const one = patterns[0];
  const seven = patterns[1];
  const four = patterns[2];
  const eight = patterns[9];
  const six = patterns.slice(6, 9).filter((pattern) => {
    return !(pattern.includes(one[0]) && pattern.includes(one[1]));
  })[0];
  const zero = patterns.slice(6, 9).filter((pattern) => {
    return !four.every((segment) => {
      return one.includes(segment) || pattern.includes(segment);
    });
  })[0];
  const nine = patterns.slice(6, 9).filter((pattern) => {
    return !isSame(pattern, six) && !isSame(pattern, zero);
  })[0];
  const top = seven.filter((segment) => {
    return !one.includes(segment);
  })[0];
  const topRight = one.filter((segment) => {
    return !six.includes(segment);
  })[0];
  const bottomRight = one.filter((segment) => {
    return segment !== topRight;
  })[0];
  const center = four.filter((segment) => {
    return !zero.includes(segment);
  })[0];
  const bottomLeft = six.filter((segment) => {
    return !nine.includes(segment);
  })[0];
  const topLeft = four.filter((segment) => {
    return (
      segment !== center && segment !== topRight && segment !== bottomRight
    );
  })[0];
  const bottom = zero.filter((segment) => {
    return (
      segment !== top &&
      segment !== topRight &&
      segment !== topLeft &&
      segment !== center &&
      segment !== bottomRight &&
      segment !== bottomLeft
    );
  })[0];
  const five = patterns.slice(3, 6).filter((pattern) => {
    return [top, topLeft, center, bottomRight, bottom].every((segment) => {
      return pattern.includes(segment);
    });
  })[0];
  const two = patterns.slice(3, 6).filter((pattern) => {
    return [top, topRight, center, bottomLeft, bottom].every((segment) => {
      return pattern.includes(segment);
    });
  })[0];
  const three = patterns.slice(3, 6).filter((pattern) => {
    return [top, topRight, center, bottomRight, bottom].every((segment) => {
      return pattern.includes(segment);
    });
  })[0];
  let oneFoursSevensAndEights = 0;
  displayValue.forEach((digit) => {
    if (
      isSame(one, digit) ||
      isSame(four, digit) ||
      isSame(seven, digit) ||
      isSame(eight, digit)
    ) {
      oneFoursSevensAndEights++;
    }
  });
  let outputValue = 0;
  displayValue.forEach((digit) => {
    if (isSame(digit, one)) {
      outputValue += 1;
    } else if (isSame(digit, two)) {
      outputValue += 2;
    } else if (isSame(digit, three)) {
      outputValue += 3;
    } else if (isSame(digit, four)) {
      outputValue += 4;
    } else if (isSame(digit, five)) {
      outputValue += 5;
    } else if (isSame(digit, six)) {
      outputValue += 6;
    } else if (isSame(digit, seven)) {
      outputValue += 7;
    } else if (isSame(digit, eight)) {
      outputValue += 8;
    } else if (isSame(digit, nine)) {
      outputValue += 9;
    } else if (isSame(digit, zero)) {
      outputValue += 0;
    }
    outputValue *= 10;
  });
  return outputValue / 10;
  return oneFoursSevensAndEights;
};

const metaSort = (array: string[][]): string[][] => {
  return array.sort((a, b) => {
    if (a.length > b.length) {
      return 1;
    } else if (a.length === b.length) {
      if (a > b) {
        return 1;
      } else if (a === b) {
        return 0;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  });
};

const isSame = (pattern: string[], digit: string[]): boolean => {
  return pattern.join("") === digit.join("");
};

main("./day8_test1.txt");
main("./day8_input.txt");
