"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var timers = file.split(",").map(parseFloat);
    var population = new LanternFishPopulation(timers);
    for (var index = 0; index < 80; index++) {
        population.iterateForward();
    }
    console.log(population.size());
    for (var index = 0; index < 256 - 80; index++) {
        population.iterateForward();
    }
    console.log(population.size());
};
var LanternFishPopulation = /** @class */ (function () {
    function LanternFishPopulation(timers) {
        var _this = this;
        this.daysTillSpawnCounts = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0
        };
        timers.forEach(function (countDownTimer) {
            if (countDownTimer in _this.daysTillSpawnCounts) {
                _this.daysTillSpawnCounts[countDownTimer]++;
            }
        });
    }
    LanternFishPopulation.prototype.iterateForward = function () {
        this.daysTillSpawnCounts = {
            0: this.daysTillSpawnCounts[1],
            1: this.daysTillSpawnCounts[2],
            2: this.daysTillSpawnCounts[3],
            3: this.daysTillSpawnCounts[4],
            4: this.daysTillSpawnCounts[5],
            5: this.daysTillSpawnCounts[6],
            6: this.daysTillSpawnCounts[7] + this.daysTillSpawnCounts[0],
            7: this.daysTillSpawnCounts[8],
            8: this.daysTillSpawnCounts[0]
        };
    };
    LanternFishPopulation.prototype.size = function () {
        var _this = this;
        var sum = 0;
        Object.keys(this.daysTillSpawnCounts).forEach(function (key) {
            sum += _this.daysTillSpawnCounts[key];
        });
        return sum;
    };
    return LanternFishPopulation;
}());
main("./day6_test1.txt");
main("./day6_input.txt");
