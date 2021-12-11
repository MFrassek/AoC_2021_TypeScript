"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var main = function (filePath) {
    var file = fs_1.readFileSync(filePath, "utf-8");
    var lines = file.split("\n");
    var syntaxErrorScore = 0;
    var completionScores = [];
    lines.forEach(function (line) {
        var stack = new ChunkStack();
        try {
            line.split("").forEach(function (element) { return stack.addElement(element); });
            completionScores.push(stack.autoCompleteScore());
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                switch (e.message) {
                    case ")": {
                        syntaxErrorScore += 3;
                        break;
                    }
                    case "]": {
                        syntaxErrorScore += 57;
                        break;
                    }
                    case "}": {
                        syntaxErrorScore += 1197;
                        break;
                    }
                    case ">": {
                        syntaxErrorScore += 25137;
                        break;
                    }
                }
            }
        }
    });
    console.log(syntaxErrorScore);
    console.log(completionScores.sort(function (a, b) {
        return b - a;
    })[(completionScores.length - 1) / 2]);
};
var ChunkStack = /** @class */ (function () {
    function ChunkStack() {
        this.stack = [];
    }
    ChunkStack.prototype.addElement = function (element) {
        if (["(", "[", "{", "<"].includes(element)) {
            this.stack.push(element);
        }
        else {
            if ((element === ")" && this.stack[this.stack.length - 1] === "(") ||
                (element === "]" && this.stack[this.stack.length - 1] === "[") ||
                (element === "}" && this.stack[this.stack.length - 1] === "{") ||
                (element === ">" && this.stack[this.stack.length - 1] === "<")) {
                this.stack.pop();
            }
            else {
                throw new SyntaxError(element);
            }
        }
    };
    ChunkStack.prototype.autoCompleteScore = function () {
        var score = 0;
        while (this.stack.length > 0) {
            var element = this.stack.pop();
            score *= 5;
            switch (element) {
                case "(": {
                    score += 1;
                    break;
                }
                case "[": {
                    score += 2;
                    break;
                }
                case "{": {
                    score += 3;
                    break;
                }
                case "<": {
                    score += 4;
                    break;
                }
            }
        }
        return score;
    };
    return ChunkStack;
}());
main("./day10_test1.txt");
main("./day10_input.txt");
