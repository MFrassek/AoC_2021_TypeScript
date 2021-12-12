"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Collections = require("typescript-collections");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var caveConnections = file.split("\n").map(function (line) {
        return line.split("-");
    });
    var caveSystem = new CaveSystem(caveConnections);
    caveSystem.tracePaths(new Path(), "start", caveSystem.filterWithAllSmallCavesOnceVistiable);
    console.log(caveSystem.paths.length);
    caveSystem = new CaveSystem(caveConnections);
    caveSystem.tracePaths(new Path(), "start", caveSystem.filterWithOneSmallCaveTwiceVisitable);
    console.log(caveSystem.paths.length);
};
var CaveSystem = /** @class */ (function () {
    function CaveSystem(caveConnections) {
        var _this = this;
        this.caves = {};
        this.paths = [];
        caveConnections.forEach(function (caveConnection) {
            var cave1 = caveConnection[0];
            var cave2 = caveConnection[1];
            if (!_this.caves.hasOwnProperty(cave1)) {
                _this.caves[cave1] = new Cave(cave1);
            }
            if (!_this.caves.hasOwnProperty(cave2)) {
                _this.caves[cave2] = new Cave(cave2);
            }
            _this.connectNeighbors(cave1, cave2);
        });
    }
    CaveSystem.prototype.connectNeighbors = function (name1, name2) {
        this.caves[name1].addNeighbor(this.caves[name2]);
        this.caves[name2].addNeighbor(this.caves[name1]);
    };
    CaveSystem.prototype.tracePaths = function (path, candidateName, filterNeighbors) {
        var _this = this;
        path.push(candidateName);
        if (candidateName === "end") {
            this.paths.push(path);
            return;
        }
        this.caves[candidateName].neighbors
            .toArray()
            .filter(function (neighbor) {
            return filterNeighbors(neighbor, path);
        })
            .forEach(function (node) {
            _this.tracePaths(path.copy(), node.name, filterNeighbors);
        });
    };
    CaveSystem.prototype.filterWithAllSmallCavesOnceVistiable = function (neighbor, path) {
        return (neighbor.name !== "start" &&
            (neighbor.isBig || !path.includes(neighbor.name)));
    };
    CaveSystem.prototype.filterWithOneSmallCaveTwiceVisitable = function (neighbor, path) {
        return (neighbor.name !== "start" &&
            (neighbor.isBig ||
                !path.hasVisitedASmallCaveTwice ||
                !path.includes(neighbor.name)));
    };
    return CaveSystem;
}());
var Cave = /** @class */ (function () {
    function Cave(name) {
        this.name = name;
        this.neighbors = new Collections.Set();
        this.isBig = name === name.toUpperCase();
    }
    Cave.prototype.toString = function () {
        return this.name;
    };
    Cave.prototype.addNeighbor = function (neighbor) {
        if (!this.neighbors.contains(neighbor)) {
            this.neighbors.add(neighbor);
        }
    };
    return Cave;
}());
var Path = /** @class */ (function () {
    function Path(path) {
        if (path) {
            this.trace = path.trace.slice();
            this.hasVisitedASmallCaveTwice = path.hasVisitedASmallCaveTwice;
        }
        else {
            this.trace = [];
            this.hasVisitedASmallCaveTwice = false;
        }
    }
    Path.prototype.push = function (nodeName) {
        if (this.includes(nodeName) && nodeName === nodeName.toLowerCase()) {
            this.hasVisitedASmallCaveTwice = true;
        }
        this.trace.push(nodeName);
    };
    Path.prototype.includes = function (nodeName) {
        return this.trace.includes(nodeName);
    };
    Path.prototype.copy = function () {
        return new Path(this);
    };
    return Path;
}());
main("./day12_test1.txt");
main("./day12_test2.txt");
main("./day12_test3.txt");
main("./day12_input.txt");
