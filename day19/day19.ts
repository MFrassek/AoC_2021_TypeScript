import { readFileSync } from "fs";
import * as Collections from "typescript-collections";

const main = (filePath: string) => {
  const scannerInstructions = readFileSync(filePath, "utf-8")
    .split("\n\n")
    .map((block) =>
      block
        .split("\n")
        .slice(1)
        .map((line) => line.split(",").map(parseFloat))
    );
  const scannerNetwork = new ScannerNetwork(scannerInstructions);
  console.log(scannerNetwork.beacons.size());
  console.log(scannerNetwork.maxManhattenDistanceBetweenScanners());
};

class ScannerNetwork {
  scanners: Scanner[];
  beacons: Collections.Set<Vector>;

  constructor(scannerInstructions: number[][][]) {
    this.scanners = scannerInstructions.map((block) => new Scanner(block));
    this.scanners[0].canonicalOrientation = 0;
    this.scanners[0].canonicalPosition = new Vector(0, 0, 0);
    this.beacons = new Collections.Set<Vector>();
    const scannersToProcessStack = [this.scanners[0]];
    while (scannersToProcessStack.length > 0) {
      const scannerOfInterest = scannersToProcessStack.pop();
      scannerOfInterest.beacons().forEach((beacon) => this.beacons.add(beacon));
      for (let j = 0; j < this.scanners.length; j++) {
        if (this.scanners[j].canonicalOrientation === undefined) {
          scannerOfInterest.orientIfOverlaps(this.scanners[j]);
          if (this.scanners[j].canonicalOrientation !== undefined) {
            scannersToProcessStack.push(this.scanners[j]);
          }
        }
      }
    }
  }

  maxManhattenDistanceBetweenScanners() {
    const manhattenDistances = [];
    this.scanners.forEach((scannerA) => {
      this.scanners.forEach((scannerB) => {
        manhattenDistances.push(
          scannerA.canonicalPosition.manhattenDistanceTo(
            scannerB.canonicalPosition
          )
        );
      });
    });
    return Math.max(...manhattenDistances);
  }
}

class Scanner {
  baseBeacons: Vector[];
  multiOrientationVectorsBetweenBeacons: Array<Array<Collections.Set<Vector>>>;
  nonOverlappedBeaconCount: number;
  canonicalOrientation?: number;
  canonicalPosition?: Vector;

  constructor(instructionBlock: number[][]) {
    this.baseBeacons = [];
    instructionBlock.forEach((beaconCoodinates) => {
      this.baseBeacons.push(
        new Vector(
          beaconCoodinates[0],
          beaconCoodinates[1],
          beaconCoodinates[2]
        )
      );
    });
    const vectorsBetweenBeaconsMultiOrientation: Vector[][][] = [];
    for (let i = 0; i < this.baseBeacons.length; i++) {
      vectorsBetweenBeaconsMultiOrientation.push([]);
      for (let j = 0; j < this.baseBeacons.length; j++) {
        vectorsBetweenBeaconsMultiOrientation[i].push(
          this.baseBeacons[i].differenceTo(this.baseBeacons[j]).orientations()
        );
      }
    }
    this.multiOrientationVectorsBetweenBeacons = [];
    for (let o = 0; o < 24; o++) {
      this.multiOrientationVectorsBetweenBeacons.push([]);
      for (let i = 0; i < vectorsBetweenBeaconsMultiOrientation.length; i++) {
        this.multiOrientationVectorsBetweenBeacons[o].push(
          new Collections.Set<Vector>()
        );
        for (
          let j = 0;
          j < vectorsBetweenBeaconsMultiOrientation[i].length;
          j++
        ) {
          this.multiOrientationVectorsBetweenBeacons[o][i].add(
            vectorsBetweenBeaconsMultiOrientation[i][j][o]
          );
        }
      }
    }
    this.nonOverlappedBeaconCount = this.baseBeacons.length;
  }

  orientIfOverlaps(other: Scanner) {
    const thisVectorsBetweenBeacons =
      this.canonicalOrientationVectorsBetweenBeacons();
    for (let o = 0; o < 24; o++) {
      for (
        let i = 0;
        i < other.multiOrientationVectorsBetweenBeacons[o].length;
        i++
      ) {
        for (let j = 0; j < thisVectorsBetweenBeacons.length; j++) {
          const overlap = other.multiOrientationVectorsBetweenBeacons[o][i]
            .toArray()
            .filter((element) =>
              thisVectorsBetweenBeacons[j].contains(element)
            );
          if (overlap.length >= 12) {
            other.canonicalOrientation = o;
            other.canonicalPosition = this.beacons()[j].differenceTo(
              other.baseBeacons[i].orientations()[o]
            );
            return;
          }
        }
      }
    }
  }

  canonicalOrientationVectorsBetweenBeacons() {
    if (this.canonicalOrientation === undefined) {
      throw new Error("canonicalOrientation must be set.");
    }
    return this.multiOrientationVectorsBetweenBeacons[
      this.canonicalOrientation
    ];
  }

  beacons(): Vector[] {
    if (
      this.canonicalOrientation === undefined ||
      this.canonicalPosition === undefined
    ) {
      throw new Error(
        "canonicalOrientation and canonicalPosition must be set."
      );
    }
    return this.baseBeacons.map((baseBeacon) =>
      baseBeacon
        .orientations()
        [this.canonicalOrientation].offsetBy(this.canonicalPosition)
    );
  }
}

class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  differenceTo(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  offsetBy(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  manhattenDistanceTo(other: Vector): number {
    return (
      Math.abs(this.x - other.x) +
      Math.abs(this.y - other.y) +
      Math.abs(this.z - other.z)
    );
  }

  toString(): string {
    return "x: " + this.x + ", y: " + this.y + ", z: " + this.z;
  }

  orientations() {
    return [
      new Vector(this.x, this.y, this.z),
      new Vector(this.x, -this.z, this.y),
      new Vector(this.x, -this.y, -this.z),
      new Vector(this.x, this.z, -this.y),
      new Vector(-this.y, this.x, this.z),
      new Vector(this.z, this.x, this.y),
      new Vector(this.y, this.x, -this.z),
      new Vector(-this.z, this.x, -this.y),
      new Vector(-this.x, this.y, -this.z),
      new Vector(-this.x, -this.z, -this.y),
      new Vector(-this.x, -this.y, this.z),
      new Vector(-this.x, this.z, this.y),
      new Vector(-this.y, -this.x, -this.z),
      new Vector(this.z, -this.x, -this.y),
      new Vector(this.y, -this.x, this.z),
      new Vector(-this.z, -this.x, this.y),
      new Vector(-this.z, this.y, this.x),
      new Vector(-this.y, -this.z, this.x),
      new Vector(this.z, -this.y, this.x),
      new Vector(this.y, this.z, this.x),
      new Vector(this.z, this.y, -this.x),
      new Vector(-this.y, this.z, -this.x),
      new Vector(-this.z, -this.y, -this.x),
      new Vector(this.y, -this.z, -this.x),
    ];
  }
}

main("./day19_test1.txt");
main("./day19_input.txt");
