"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var energyLevels = file
        .split("\n")
        .map(function (line) { return line.split("").map(parseFloat); });
    var population = new OctopusPopulation(energyLevels);
    for (var i = 0; i < 100; i++) {
        population.step();
    }
    console.log(population.flashesSoFar);
    population = new OctopusPopulation(energyLevels);
    while (!population.wholePopulationJustFlashed()) {
        population.step();
    }
    console.log(population.stepsSoFar);
};
var OctopusPopulation = /** @class */ (function () {
    function OctopusPopulation(startingConfiguration) {
        this.grid = startingConfiguration.map(function (row) {
            return row.map(function (element) {
                return element;
            });
        });
        this.rowCount = this.grid.length;
        this.colCount = this.rowCount ? this.grid[0].length : 0;
        this.flashesSoFar = 0;
        this.stepsSoFar = 0;
    }
    OctopusPopulation.prototype.neighborPositions = function (position) {
        var _this = this;
        var neighborPositions = [];
        var rows = [position.row - 1, position.row, position.row + 1].forEach(function (row) {
            if (row >= 0 && row < _this.rowCount) {
                var cols = [
                    position.col - 1,
                    position.col,
                    position.col + 1,
                ].forEach(function (col) {
                    if (col >= 0 && col < _this.colCount) {
                        if (row != position.row || col != position.col) {
                            neighborPositions.push({ row: row, col: col });
                        }
                    }
                });
            }
        });
        return neighborPositions;
    };
    OctopusPopulation.prototype.step = function () {
        var _this = this;
        this.stepsSoFar++;
        this.increaseAllPositions();
        this.flashableOctopuses().forEach(function (flashableOctopus) {
            _this.flashOctopus(flashableOctopus);
        });
    };
    OctopusPopulation.prototype.increaseAllPositions = function () {
        this.grid = this.grid.map(function (row) {
            return row.map(function (element) {
                return element + 1;
            });
        });
    };
    OctopusPopulation.prototype.flashableOctopuses = function () {
        var flashableOctopuses = [];
        for (var row = 0; row < this.rowCount; row++) {
            for (var col = 0; col < this.colCount; col++) {
                if (this.grid[row][col] > 9) {
                    flashableOctopuses.push({ row: row, col: col });
                }
            }
        }
        return flashableOctopuses;
    };
    OctopusPopulation.prototype.flashOctopus = function (position) {
        var _this = this;
        if (this.grid[position.row][position.col] > 0) {
            this.grid[position.row][position.col] = 0;
            this.flashesSoFar++;
            this.neighborPositions(position).forEach(function (neighborPosition) {
                if (_this.grid[neighborPosition.row][neighborPosition.col] != 0) {
                    _this.grid[neighborPosition.row][neighborPosition.col]++;
                    if (_this.grid[neighborPosition.row][neighborPosition.col] > 9) {
                        _this.flashOctopus(neighborPosition);
                    }
                }
            });
        }
    };
    OctopusPopulation.prototype.wholePopulationJustFlashed = function () {
        return this.grid.every(function (row) {
            return row.every(function (element) {
                return element === 0;
            });
        });
    };
    return OctopusPopulation;
}());
main("./day11_test1.txt");
main("./day11_input.txt");
