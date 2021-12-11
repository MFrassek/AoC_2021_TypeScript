"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var lines = file.split("\n");
    var ventLines = lines.map(function (line) {
        var coordinates = line.split(" -> ");
        var start = coordinates[0].split(",").map(parseFloat);
        var end = coordinates[1].split(",").map(parseFloat);
        return {
            start: { x: start[0], y: start[1] },
            end: { x: end[0], y: end[1] }
        };
    });
    console.log(doublyCoveredPositionCount(verticalOrHorizontalVentLines(ventLines)));
    console.log(doublyCoveredPositionCount(ventLines));
};
var verticalOrHorizontalVentLines = function (ventLines) {
    return ventLines.filter(function (ventLine) {
        return isVerticalOrHorizontal(ventLine);
    });
};
var isVerticalOrHorizontal = function (ventLine) {
    return (ventLine.start.x === ventLine.end.x || ventLine.start.y === ventLine.end.y);
};
var doublyCoveredPositionCount = function (ventLines) {
    var positionMegaSet = new Set();
    var positionDuplicateSet = new Set();
    ventLines.forEach(function (ventLine) {
        coveredPositions(ventLine).forEach(function (position) {
            if (positionMegaSet.has(position.x.toString() + "," + position.y.toString())) {
                positionDuplicateSet.add(position.x.toString() + "," + position.y.toString());
            }
            else {
                positionMegaSet.add(position.x.toString() + "," + position.y.toString());
            }
        });
    });
    return positionDuplicateSet.size;
};
var coveredPositions = function (ventLine) {
    var positions = new Set();
    if (ventLine.start.x === ventLine.end.x) {
        for (var y = ventLine.start.y; ventLine.start.y < ventLine.end.y
            ? y <= ventLine.end.y
            : y >= ventLine.end.y; y += ventLine.start.y < ventLine.end.y ? 1 : -1) {
            positions.add({ x: ventLine.start.x, y: y });
        }
    }
    else if (ventLine.start.y === ventLine.end.y) {
        for (var x = ventLine.start.x; ventLine.start.x < ventLine.end.x
            ? x <= ventLine.end.x
            : x >= ventLine.end.x; x += ventLine.start.x < ventLine.end.x ? 1 : -1) {
            positions.add({ x: x, y: ventLine.start.y });
        }
    }
    else {
        for (var x = ventLine.start.x, y = ventLine.start.y; ventLine.start.x < ventLine.end.x
            ? x <= ventLine.end.x
            : x >= ventLine.end.x; x += ventLine.start.x < ventLine.end.x ? 1 : -1,
            y += ventLine.start.y < ventLine.end.y ? 1 : -1) {
            positions.add({ x: x, y: y });
        }
    }
    return positions;
};
main("./day5_test1.txt");
main("./day5_input.txt");
