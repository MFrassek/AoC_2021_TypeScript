"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var lines = file.split("\n");
    var drawnNumbers = lines[0].split(",").map(parseFloat);
    var gridCount = lines.length - 2 / 6;
    var grids = [];
    for (var gridIndex = 0; gridIndex < gridCount; gridIndex++) {
        grids.push(grid(lines, 2 + gridIndex * 6));
    }
    var numbersToGridPositionsOfGrids = grids.map(function (grid) {
        return numbersToGridPositions(grid);
    });
    var bingoedBoards = [];
    var finishingNumbers = [];
    for (var drawIndex = 0; drawIndex < drawnNumbers.length; drawIndex++) {
        var drawnNumber = drawnNumbers[drawIndex];
        for (var index = 0; index < grids.length; index++) {
            if (!bingoedBoards.includes(index)) {
                var grid_1 = grids[index];
                var numbersToGridPositions_1 = numbersToGridPositionsOfGrids[index];
                if (drawnNumber in numbersToGridPositions_1) {
                    markNumberInGrid(grid_1, drawnNumber, numbersToGridPositions_1);
                    if (hasBingo(grid_1)) {
                        bingoedBoards.push(index);
                        finishingNumbers.push(drawnNumber);
                    }
                }
            }
        }
    }
    if (bingoedBoards.length > 0) {
        console.log(bingoScore(grids[bingoedBoards[0]]) * finishingNumbers[0]);
        console.log(bingoScore(grids[bingoedBoards.pop()]) * finishingNumbers.pop());
    }
};
var grid = function (lines, startRow) {
    return lines.slice(startRow, startRow + 5).map(function (line) {
        return line.match(/.{1,3}/g).map(parseFloat);
    });
};
var numbersToGridPositions = function (grid) {
    var result = {};
    for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[row].length; col++) {
            var number = grid[row][col];
            result[number] = { row: row, column: col };
        }
    }
    return result;
};
var markNumberInGrid = function (grid, number, numbersToGridPositions) {
    grid[numbersToGridPositions[number].row][numbersToGridPositions[number].column] = -1;
};
var hasBingo = function (grid) {
    return hasBingoRow(grid) || hasBingoRow(transpose(grid));
};
var hasBingoRow = function (grid) {
    if (grid
        .map(function (row) {
        return row.filter(function (number) {
            return number !== -1;
        }).length === 0
            ? true
            : false;
    })
        .includes(true)) {
        return true;
    }
    return false;
};
var bingoScore = function (grid) {
    var sum = 0;
    grid.forEach(function (row) {
        row.forEach(function (element) {
            if (element > 0) {
                sum += element;
            }
        });
    });
    return sum;
};
var transpose = function (array) {
    return array[0].map(function (_, colIndex) { return array.map(function (row) { return row[colIndex]; }); });
};
main("./day4_test1.txt");
main("./day4_input.txt");
