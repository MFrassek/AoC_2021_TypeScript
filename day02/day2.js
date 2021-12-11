"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (file_path) {
    var file = fs_1.readFileSync(file_path, "utf-8");
    var instructions = file.split("\n");
    var result1 = finalPositionSimple(instructions);
    console.log(result1.depth * result1.horizontalPosition);
    var result2 = finalPositionWithAim(instructions);
    console.log(result2.depth * result2.horizontalPosition);
};
var finalPositionWithAim = function (instructions) {
    var divePosition = {
        depth: 0,
        horizontalPosition: 0,
        aim: 0
    };
    instructions.forEach(function (instruction) {
        var elements = instruction.split(" ");
        var direction = elements[0];
        var distance = parseInt(elements[1]);
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
var finalPositionSimple = function (instructions) {
    var divePosition = { depth: 0, horizontalPosition: 0 };
    instructions.forEach(function (instruction) {
        var elements = instruction.split(" ");
        var direction = elements[0];
        var distance = parseInt(elements[1]);
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
