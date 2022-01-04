import { readFileSync } from "fs";

const main = (filePath: string) => {
  const [template, instructions] = readFileSync(filePath, "utf-8").split(
    "\n\n"
  );
  console.log(mostCommonMinusLeastCommonCount(template, instructions, 10));
  console.log(mostCommonMinusLeastCommonCount(template, instructions, 40));
};

const mostCommonMinusLeastCommonCount = (
  template: string,
  instructions: string,
  steps: number
): number => {
  const poly = new Polymer(template, instructions.split("\n"));
  for (let index = 0; index < steps; index++) {
    poly.step();
  }

  const atomCounts = poly.atomCounts();
  const atoms = Object.keys(atomCounts);
  let maxAtoms = atomCounts[atoms[0]];
  let minAtoms = atomCounts[atoms[0]];
  atoms.forEach((atom) => {
    if (atomCounts[atom] > maxAtoms) {
      maxAtoms = atomCounts[atom];
    }
    if (atomCounts[atom] < minAtoms) {
      minAtoms = atomCounts[atom];
    }
  });
  return maxAtoms - minAtoms;
};

class Polymer {
  insertionRules: Record<string, string[]>;
  pairCounts: Record<string, number>;
  firstAtom: string;
  lastAtom: string;

  constructor(template: string, insertionInstructions: string[]) {
    this.insertionRules = {};
    this.pairCounts = {};
    this.firstAtom = template.slice(0, 1);
    this.lastAtom = template.slice(-1);
    insertionInstructions.forEach((instruction) => {
      const [source, insert] = instruction.split(" -> ");
      this.insertionRules[source] = [source[0] + insert, insert + source[1]];
      this.pairCounts[source] = 0;
    });
    for (let i = 0; i < template.length - 1; i++) {
      this.pairCounts[template.slice(i, i + 2)]++;
    }
  }

  step() {
    const currentPairCounts = { ...this.pairCounts };
    Object.keys(currentPairCounts).forEach((insertionSource) => {
      this.pairCounts[insertionSource] -= currentPairCounts[insertionSource];
      this.insertionRules[insertionSource].forEach((insertionProduct) => {
        this.pairCounts[insertionProduct] += currentPairCounts[insertionSource];
      });
    });
  }

  atomCounts(): Record<string, number> {
    const atomCounts = {};
    Object.keys(this.pairCounts).forEach((pair) => {
      const [firstLetter, secondLetter] = pair.split("");
      if (atomCounts[firstLetter]) {
        atomCounts[firstLetter] += this.pairCounts[pair] / 2;
      } else {
        atomCounts[firstLetter] = this.pairCounts[pair] / 2;
      }
      if (atomCounts[secondLetter]) {
        atomCounts[secondLetter] += this.pairCounts[pair] / 2;
      } else {
        atomCounts[secondLetter] = this.pairCounts[pair] / 2;
      }
    });
    atomCounts[this.firstAtom] += 0.5;
    atomCounts[this.lastAtom] += 0.5;
    return atomCounts;
  }
}

main("./day14_test1.txt");
main("./day14_input.txt");
