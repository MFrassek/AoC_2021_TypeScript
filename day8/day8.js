"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var displayLines = file.split("\n");
    var totalOneFourSevenEightCount = 0;
    var totalDisplayedNumbers = 0;
    displayLines.forEach(function (line) {
        var displayedNumber = numberCountOnDisplay(line);
        totalOneFourSevenEightCount += displayedNumber
            .toString()
            .split("")
            .filter(function (digit) {
            return digit === "1" || digit === "4" || digit === "7" || digit === "8";
        }).length;
        totalDisplayedNumbers += displayedNumber;
    });
    console.log(totalOneFourSevenEightCount);
    console.log(totalDisplayedNumbers);
};
var numberCountOnDisplay = function (line) {
    var patternsAndDisplayValue = line.split(" | ").map(function (subline) {
        return subline.split(" ");
    });
    var patterns = metaSort(patternsAndDisplayValue[0].map(function (pattern) {
        return pattern.split("").sort();
    }));
    var displayValue = patternsAndDisplayValue[1].map(function (pattern) {
        return pattern.split("").sort();
    });
    var one = patterns[0];
    var seven = patterns[1];
    var four = patterns[2];
    var eight = patterns[9];
    var six = patterns.slice(6, 9).filter(function (pattern) {
        return !(pattern.includes(one[0]) && pattern.includes(one[1]));
    })[0];
    var zero = patterns.slice(6, 9).filter(function (pattern) {
        return !four.every(function (segment) {
            return one.includes(segment) || pattern.includes(segment);
        });
    })[0];
    var nine = patterns.slice(6, 9).filter(function (pattern) {
        return !isSame(pattern, six) && !isSame(pattern, zero);
    })[0];
    var top = seven.filter(function (segment) {
        return !one.includes(segment);
    })[0];
    var topRight = one.filter(function (segment) {
        return !six.includes(segment);
    })[0];
    var bottomRight = one.filter(function (segment) {
        return segment !== topRight;
    })[0];
    var center = four.filter(function (segment) {
        return !zero.includes(segment);
    })[0];
    var bottomLeft = six.filter(function (segment) {
        return !nine.includes(segment);
    })[0];
    var topLeft = four.filter(function (segment) {
        return (segment !== center && segment !== topRight && segment !== bottomRight);
    })[0];
    var bottom = zero.filter(function (segment) {
        return (segment !== top &&
            segment !== topRight &&
            segment !== topLeft &&
            segment !== center &&
            segment !== bottomRight &&
            segment !== bottomLeft);
    })[0];
    var five = patterns.slice(3, 6).filter(function (pattern) {
        return [top, topLeft, center, bottomRight, bottom].every(function (segment) {
            return pattern.includes(segment);
        });
    })[0];
    var two = patterns.slice(3, 6).filter(function (pattern) {
        return [top, topRight, center, bottomLeft, bottom].every(function (segment) {
            return pattern.includes(segment);
        });
    })[0];
    var three = patterns.slice(3, 6).filter(function (pattern) {
        return [top, topRight, center, bottomRight, bottom].every(function (segment) {
            return pattern.includes(segment);
        });
    })[0];
    var oneFoursSevensAndEights = 0;
    displayValue.forEach(function (digit) {
        if (isSame(one, digit) ||
            isSame(four, digit) ||
            isSame(seven, digit) ||
            isSame(eight, digit)) {
            oneFoursSevensAndEights++;
        }
    });
    var outputValue = 0;
    displayValue.forEach(function (digit) {
        if (isSame(digit, one)) {
            outputValue += 1;
        }
        else if (isSame(digit, two)) {
            outputValue += 2;
        }
        else if (isSame(digit, three)) {
            outputValue += 3;
        }
        else if (isSame(digit, four)) {
            outputValue += 4;
        }
        else if (isSame(digit, five)) {
            outputValue += 5;
        }
        else if (isSame(digit, six)) {
            outputValue += 6;
        }
        else if (isSame(digit, seven)) {
            outputValue += 7;
        }
        else if (isSame(digit, eight)) {
            outputValue += 8;
        }
        else if (isSame(digit, nine)) {
            outputValue += 9;
        }
        else if (isSame(digit, zero)) {
            outputValue += 0;
        }
        outputValue *= 10;
    });
    return outputValue / 10;
    return oneFoursSevensAndEights;
};
var metaSort = function (array) {
    return array.sort(function (a, b) {
        if (a.length > b.length) {
            return 1;
        }
        else if (a.length === b.length) {
            if (a > b) {
                return 1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return -1;
            }
        }
        else {
            return -1;
        }
    });
};
var isSame = function (pattern, digit) {
    return pattern.join("") === digit.join("");
};
main("./day8_test1.txt");
main("./day8_input.txt");
