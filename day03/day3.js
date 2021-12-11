"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var diagnosticReport = file.split("\n");
    gammaTimesEpsilon(diagnosticReport);
    oxygenTimesCo2(diagnosticReport);
};
var gammaTimesEpsilon = function (diagnosticReport) {
    var gammaRate = parseInt(mostCommonBits(diagnosticReport).join(""), 2);
    var epsilonRate = parseInt(leastCommonBits(diagnosticReport).join(""), 2);
    console.log(gammaRate * epsilonRate);
};
var oxygenTimesCo2 = function (diagnosticReport) {
    var oxygenGeneratorRating = parseInt(rowFullfillingAllBitCriteria(diagnosticReport, mostCommonBits), 2);
    var co2ScrubberRating = parseInt(rowFullfillingAllBitCriteria(diagnosticReport, leastCommonBits), 2);
    console.log(oxygenGeneratorRating * co2ScrubberRating);
};
var rowFullfillingAllBitCriteria = function (diagnosticReport, filterFunction) {
    var _loop_1 = function (index) {
        var relevantBit = filterFunction(diagnosticReport)[index];
        diagnosticReport = diagnosticReport.filter(function (row) {
            return row[index] === relevantBit;
        });
        if (diagnosticReport.length === 1) {
            return { value: diagnosticReport[0] };
        }
    };
    for (var index = 0; index < diagnosticReport[0].length; index++) {
        var state_1 = _loop_1(index);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return diagnosticReport[0];
};
var mostCommonBits = function (diagnosticReport) {
    var binaryDigits = diagnosticReport.map(function (row) { return row.split(""); });
    var transposedBinaryDigits = transpose(binaryDigits);
    return transposedBinaryDigits.map(function (row) {
        return row.filter(function (element) {
            return element === "1";
        }).length >=
            row.length / 2
            ? "1"
            : "0";
    });
};
var leastCommonBits = function (diagnosticReport) {
    return mostCommonBits(diagnosticReport).map(function (bit) {
        return bit === "1" ? "0" : "1";
    });
};
var transpose = function (array) {
    return array[0].map(function (_, colIndex) { return array.map(function (row) { return row[colIndex]; }); });
};
main("./day3_test1.txt");
main("./day3_input.txt");
