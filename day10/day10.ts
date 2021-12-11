import { readFileSync } from "fs";

const main = (filePath: string) => {
  const file = readFileSync(filePath, "utf-8");
  const lines = file.split("\n");
  let syntaxErrorScore = 0;
  let completionScores: number[] = [];
  lines.forEach((line) => {
    const stack = new ChunkStack();
    try {
      line.split("").forEach((element) => stack.addElement(element));
      completionScores.push(stack.autoCompleteScore());
    } catch (e) {
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
  console.log(
    completionScores.sort(function (a, b) {
      return b - a;
    })[(completionScores.length - 1) / 2]
  );
};

class ChunkStack {
  stack: string[];

  constructor() {
    this.stack = [];
  }

  addElement(element: string) {
    if (["(", "[", "{", "<"].includes(element)) {
      this.stack.push(element);
    } else {
      if (
        (element === ")" && this.stack[this.stack.length - 1] === "(") ||
        (element === "]" && this.stack[this.stack.length - 1] === "[") ||
        (element === "}" && this.stack[this.stack.length - 1] === "{") ||
        (element === ">" && this.stack[this.stack.length - 1] === "<")
      ) {
        this.stack.pop();
      } else {
        throw new SyntaxError(element);
      }
    }
  }
  autoCompleteScore() {
    let score = 0;
    while (this.stack.length > 0) {
      let element = this.stack.pop();
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
  }
}
main("./day10_test1.txt");
main("./day10_input.txt");
