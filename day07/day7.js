"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var positions = file.split(",").map(parseFloat);
    var crabFleet = new CrabFleet(positions);
    console.log(crabFleet.basicMinimumNumberMoves());
    console.log(crabFleet.increasingMinimumNumberMoves());
};
var CrabFleet = /** @class */ (function () {
    function CrabFleet(positions) {
        var _this = this;
        this.minPosition = Math.min.apply(null, positions);
        this.maxPosition = Math.max.apply(null, positions);
        this.fleetSize = positions.length;
        this.positionCounts = {};
        for (var index = this.minPosition; index <= this.maxPosition; index++) {
            this.positionCounts[index] = 0;
        }
        positions.forEach(function (position) {
            _this.positionCounts[position]++;
        });
    }
    CrabFleet.prototype.increasingMinimumNumberMoves = function () {
        var _this = this;
        var movesToPivot = this.increasingMovesNeededToMinPosition();
        var minimumNumberMoves = movesToPivot;
        var _loop_1 = function (pivot) {
            Object.keys(this_1.positionCounts).forEach(function (key) {
                if (parseInt(key) > pivot) {
                    movesToPivot += (pivot - parseInt(key)) * _this.positionCounts[key];
                }
                else {
                    movesToPivot +=
                        (pivot + 1 - parseInt(key)) * _this.positionCounts[key];
                }
            });
            if (movesToPivot < minimumNumberMoves) {
                minimumNumberMoves = movesToPivot;
            }
        };
        var this_1 = this;
        for (var pivot = this.minPosition; pivot <= this.maxPosition; pivot++) {
            _loop_1(pivot);
        }
        return minimumNumberMoves;
    };
    CrabFleet.prototype.increasingMovesNeededToMinPosition = function () {
        var _this = this;
        var movesNeeded = 0;
        Object.keys(this.positionCounts).forEach(function (key) {
            movesNeeded +=
                _this.increasingMoveFuelConsumption(parseInt(key)) *
                    _this.positionCounts[key];
        });
        return movesNeeded;
    };
    CrabFleet.prototype.increasingMoveFuelConsumption = function (distance) {
        return (distance * (distance + 1)) / 2;
    };
    CrabFleet.prototype.basicMinimumNumberMoves = function () {
        var movesToPivot = this.basicMovesNeededToMinPosition();
        var minimumNumberMoves = movesToPivot;
        for (var pivot = this.minPosition, fleetSizeBelowPivot = 0, fleetSizeAbovePivot = this.fleetSize - this.positionCounts[pivot]; pivot <= this.maxPosition; pivot++,
            fleetSizeBelowPivot += this.positionCounts[pivot - 1],
            fleetSizeAbovePivot -= this.positionCounts[pivot]) {
            movesToPivot +=
                this.positionCounts[pivot] + fleetSizeBelowPivot - fleetSizeAbovePivot;
            if (movesToPivot < minimumNumberMoves) {
                minimumNumberMoves = movesToPivot;
            }
        }
        return minimumNumberMoves;
    };
    CrabFleet.prototype.basicMovesNeededToMinPosition = function () {
        var _this = this;
        var movesNeeded = 0;
        Object.keys(this.positionCounts).forEach(function (key) {
            movesNeeded += parseInt(key) * _this.positionCounts[key];
        });
        return movesNeeded;
    };
    return CrabFleet;
}());
main("./day7_test1.txt");
main("./day7_input.txt");
