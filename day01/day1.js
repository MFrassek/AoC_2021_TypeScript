"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (file_path) {
    var file = fs_1.readFileSync(file_path, "utf-8");
    var depths = file.split("\n").map(parseFloat);
    console.log(singleDepthIncreasesCount(depths));
    console.log(windowDepthIncreasesCount(depths));
};
var singleDepthIncreasesCount = function (depths) {
    var count = 0;
    for (var i = 1; i < depths.length; i++) {
        if (depths[i] > depths[i - 1]) {
            count++;
        }
    }
    return count;
};
var windowDepthIncreasesCount = function (depths) {
    var count = 0;
    for (var i = 0; i < depths.length - 3; i++) {
        if (arraySum(depths.slice(i + 1, i + 4)) > arraySum(depths.slice(i, i + 3))) {
            count++;
        }
    }
    return count;
};
var arraySum = function (array) {
    return array.reduce(function (sum, current) { return sum + current; });
};
main("./day1_test1.txt");
main("./day1_input.txt");
