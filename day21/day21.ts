import { readFileSync } from "fs";

const main = (filePath: string) => {
  const lines = readFileSync(filePath, "utf-8").split("\n");
  let [playerOneStartingPosition, playerTwoStartingPosition] = lines.map(
    (line) => parseInt(line.slice(28))
  );
  playSimpleGame(playerOneStartingPosition, playerTwoStartingPosition);
  playComplexGame(playerOneStartingPosition, playerTwoStartingPosition);
};

const playComplexGame = (
  playerOneStartingPosition: number,
  playerTwoStartingPosition: number
) => {
  const game = new DiracDieGame();
  const playerOneMoves =
    game.scoreSoFarToPositionToStepsUntilVictoryToCount[0][
      playerOneStartingPosition
    ];
  const playerTwoMoves =
    game.scoreSoFarToPositionToStepsUntilVictoryToCount[0][
      playerTwoStartingPosition
    ];
  const playerOneNotWins = {};
  let notWinningUniverses = 1;
  for (let i = 1; i < 12; i++) {
    notWinningUniverses *= 27;
    notWinningUniverses -=
      playerOneMoves[i] === undefined ? 0 : playerOneMoves[i];
    playerOneNotWins[i] = notWinningUniverses;
  }
  const playerTwoNotWins = {};
  notWinningUniverses = 1;
  for (let i = 1; i < 12; i++) {
    notWinningUniverses *= 27;
    notWinningUniverses -=
      playerTwoMoves[i] === undefined ? 0 : playerTwoMoves[i];
    playerTwoNotWins[i] = notWinningUniverses;
  }
  let playerOneWins = 0;
  let playerTwoWins = 0;
  Object.keys(playerOneMoves).forEach((playerOneStepCount) => {
    playerOneWins +=
      playerOneMoves[playerOneStepCount] *
      playerTwoNotWins[parseFloat(playerOneStepCount) - 1];
  });
  Object.keys(playerTwoMoves).forEach((playerTwoStepCount) => {
    playerTwoWins +=
      playerTwoMoves[playerTwoStepCount] *
      playerOneNotWins[parseFloat(playerTwoStepCount)];
  });
  console.log(playerOneWins > playerTwoWins ? playerOneWins : playerTwoWins);
};

class DiracDieGame {
  scoreSoFarToPositionToStepsUntilVictoryToCount: Record<
    number,
    Record<number, Record<number, number>>
  >;

  constructor() {
    this.scoreSoFarToPositionToStepsUntilVictoryToCount = {};
    this.scoreSoFarToPositionToStepsUntilVictoryToCount[21] = {};
    this.scoreSoFarToPositionToStepsUntilVictoryToCount[20] = {};
    const positions = Array.from(Array(11).keys()).slice(1);
    const dieResultToWorldCount: Record<number, number> = {};
    // dieResultToWorldCount[1] = 1;
    // dieResultToWorldCount[2] = 2;
    dieResultToWorldCount[3] = 1;
    dieResultToWorldCount[4] = 3;
    dieResultToWorldCount[5] = 6;
    dieResultToWorldCount[6] = 7;
    dieResultToWorldCount[7] = 6;
    dieResultToWorldCount[8] = 3;
    dieResultToWorldCount[9] = 1;
    positions.forEach((position) => {
      this.scoreSoFarToPositionToStepsUntilVictoryToCount[21][position] = {};
      this.scoreSoFarToPositionToStepsUntilVictoryToCount[21][position][0] = 1;
      this.scoreSoFarToPositionToStepsUntilVictoryToCount[20][position] = {};
      this.scoreSoFarToPositionToStepsUntilVictoryToCount[20][position][1] = 27;
    });
    Array.from(Array(20).keys())
      .reverse()
      .forEach((score) => {
        this.scoreSoFarToPositionToStepsUntilVictoryToCount[score] = {};
        positions.forEach((position) => {
          this.scoreSoFarToPositionToStepsUntilVictoryToCount[score][position] =
            {};
          Object.keys(dieResultToWorldCount).forEach((totalRoll) => {
            const newPosition = this.positionAfterRoll(
              position,
              parseFloat(totalRoll)
            );
            const newScore =
              score + newPosition > 21 ? 21 : score + newPosition;
            const worldCount = dieResultToWorldCount[totalRoll];
            Object.keys(
              this.scoreSoFarToPositionToStepsUntilVictoryToCount[newScore][
                newPosition
              ]
            ).forEach((stepCount) => {
              if (
                this.scoreSoFarToPositionToStepsUntilVictoryToCount[score][
                  position
                ][parseFloat(stepCount) + 1] === undefined
              ) {
                this.scoreSoFarToPositionToStepsUntilVictoryToCount[score][
                  position
                ][parseFloat(stepCount) + 1] = 0;
              }
              this.scoreSoFarToPositionToStepsUntilVictoryToCount[score][
                position
              ][parseFloat(stepCount) + 1] +=
                worldCount *
                this.scoreSoFarToPositionToStepsUntilVictoryToCount[newScore][
                  newPosition
                ][stepCount];
            });
          });
        });
      });
  }
  positionAfterRoll(position: number, totalRoll: number): number {
    return (position + totalRoll) % 10 === 0 ? 10 : (position + totalRoll) % 10;
  }
}

const playSimpleGame = (
  playerOneStartingPosition: number,
  playerTwoStartingPosition: number
) => {
  const game = new Game(
    playerOneStartingPosition,
    playerTwoStartingPosition,
    new DeterministicDie()
  );
  console.log(game.play());
};

class Game {
  playerOne: Player;
  playerTwo: Player;
  die: Die;
  currentPlayer: number;

  constructor(
    playerOneStartingPosition: number,
    playerTwoStartingPosition: number,
    die: Die
  ) {
    this.playerOne = new Player(playerOneStartingPosition);
    this.playerTwo = new Player(playerTwoStartingPosition);
    this.die = die;
    this.currentPlayer = 1;
  }

  play() {
    while (!this.hasWinner()) {
      this.step();
    }
    return this.gameValue();
  }

  step() {
    if (this.currentPlayer === 1) {
      this.playerOne.move(this.die);
      this.currentPlayer = 2;
    } else if (this.currentPlayer === 2) {
      this.playerTwo.move(this.die);
      this.currentPlayer = 1;
    }
  }

  hasWinner(): boolean {
    return this.playerOne.score >= 1000 || this.playerTwo.score >= 1000;
  }

  winner(): 1 | 2 {
    if (this.playerOne.score >= 1000) {
      return 1;
    } else if (this.playerTwo.score >= 1000) {
      return 2;
    } else {
      throw Error;
    }
  }

  gameValue(): number {
    const winner = this.winner();
    if (winner === 1) {
      return this.playerTwo.score * this.die.rolls;
    } else if (winner === 2) {
      return this.playerOne.score * this.die.rolls;
    }
  }
}

class Player {
  position: number;
  score: number;

  constructor(startPosition: number) {
    this.position = startPosition;
    this.score = 0;
  }

  move(die: Die) {
    this.position = this.position + die.tripleRoll();
    this.position = this.position % 10 === 0 ? 10 : this.position % 10;
    this.score += this.position;
  }
}

abstract class Die {
  rolls: number;

  constructor() {
    this.rolls = 0;
  }

  tripleRoll(): number {
    return this.roll() + this.roll() + this.roll();
  }
  abstract roll(): number;
}

class DeterministicDie extends Die {
  constructor() {
    super();
  }

  roll(): number {
    this.rolls++;
    return this.rolls % 100 === 0 ? 100 : this.rolls % 100;
  }
}

main("./day21_test1.txt");
main("./day21_input.txt");
