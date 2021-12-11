"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var lines = file.split("\n");
    var map = new heightMap(lines);
    console.log(map.totalRiskLevel());
    var basinSizes = map.basinSizes();
    console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);
};
var heightMap = /** @class */ (function () {
    function heightMap(rows) {
        this.heights = rows.map(function (row) {
            return row.split("").map(parseFloat);
        });
        this.rowCount = this.heights.length;
        this.columnCount = this.rowCount > 0 ? this.heights[0].length : 0;
    }
    heightMap.prototype.basinSizes = function () {
        var _this = this;
        var visited = this.heights.map(function (row) {
            return row.map(function (element) {
                return false;
            });
        });
        var clusterSizes = this.lowPointPositions().map(function (lowPoint) {
            var toVisit = [lowPoint];
            visited[lowPoint.row][lowPoint.column] = true;
            var clusterSize = 0;
            while (toVisit.length > 0) {
                var nextPositionToVisit = toVisit.pop();
                clusterSize++;
                _this.neighborPositions(nextPositionToVisit).forEach(function (neighborPosition) {
                    if (!visited[neighborPosition.row][neighborPosition.column] &&
                        _this.height(neighborPosition) !== 9) {
                        toVisit.push(neighborPosition);
                        visited[neighborPosition.row][neighborPosition.column] = true;
                    }
                });
            }
            return clusterSize;
        });
        return clusterSizes.sort(function (a, b) {
            return b - a;
        });
    };
    heightMap.prototype.totalRiskLevel = function () {
        var _this = this;
        var totalRiskLevel = 0;
        this.lowPointPositions().forEach(function (lowPoint) {
            totalRiskLevel += _this.riskLevel(lowPoint);
        });
        return totalRiskLevel;
    };
    heightMap.prototype.lowPointPositions = function () {
        var lowPointPositions = [];
        for (var row = 0; row < this.rowCount; row++) {
            for (var col = 0; col < this.columnCount; col++) {
                if (this.isLowPoint({ row: row, column: col })) {
                    lowPointPositions.push({ row: row, column: col });
                }
            }
        }
        return lowPointPositions;
    };
    heightMap.prototype.isLowPoint = function (gridPositionOfInterest) {
        var positionHeight = this.height(gridPositionOfInterest);
        return this.neighborHeights(gridPositionOfInterest).every(function (neighborHeight) {
            return positionHeight < neighborHeight;
        });
    };
    heightMap.prototype.riskLevel = function (gridPositionOfInterest) {
        return this.height(gridPositionOfInterest) + 1;
    };
    heightMap.prototype.height = function (gridPositionOfInterest) {
        return this.heights[gridPositionOfInterest.row][gridPositionOfInterest.column];
    };
    heightMap.prototype.neighborHeights = function (gridPositionOfInterest) {
        var _this = this;
        return this.neighborPositions(gridPositionOfInterest).map(function (position) {
            return _this.heights[position.row][position.column];
        });
    };
    heightMap.prototype.neighborPositions = function (gridPositionOfInterest) {
        var neighborPositions = [];
        if (gridPositionOfInterest.row > 0) {
            neighborPositions.push({
                row: gridPositionOfInterest.row - 1,
                column: gridPositionOfInterest.column
            });
        }
        if (gridPositionOfInterest.row < this.rowCount - 1) {
            neighborPositions.push({
                row: gridPositionOfInterest.row + 1,
                column: gridPositionOfInterest.column
            });
        }
        if (gridPositionOfInterest.column > 0) {
            neighborPositions.push({
                row: gridPositionOfInterest.row,
                column: gridPositionOfInterest.column - 1
            });
        }
        if (gridPositionOfInterest.column < this.columnCount - 1) {
            neighborPositions.push({
                row: gridPositionOfInterest.row,
                column: gridPositionOfInterest.column + 1
            });
        }
        return neighborPositions;
    };
    return heightMap;
}());
main("./day9_test1.txt");
main("./day9_input.txt");
