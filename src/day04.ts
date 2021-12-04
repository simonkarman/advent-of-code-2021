import { Day } from './day';

interface BoardNumber {
  number: number;
  marked: boolean;
}

class Board {
  private readonly width: number = 5;
  private numbers: BoardNumber[] = [];

  public addRow(row: number[]) {
    this.numbers.push(...row.map(number => ({ number, marked: false })));
  }

  public mark(drawnNumber: number): boolean {
    const index = this.numbers.findIndex(number => number.number == drawnNumber);
    if (index == -1) {
      return false;
    }
    this.numbers[index].marked = true;
    return true;
  }

  private get(x: number, y: number): BoardNumber {
    return this.numbers[y * this.width + x];
  }

  public bingo(): boolean {
    for (let shift = 0; shift < this.width; shift += 1) {
      let canRowWin = true;
      let canColumnWin = true;
      for (let index = 0; index < this.width; index += 1) {
        canRowWin &&= this.get(index, shift).marked;
        canColumnWin &&= this.get(shift, index).marked;
        if (!canRowWin && !canColumnWin) {
          break;
        }
      }
      if (canRowWin || canColumnWin) {
        return true;
      }
    }
    return false;
  }

  public sumOfNonMarkedNumbers(): number {
    return this.numbers
      .filter(number => !number.marked)
      .map(number => number.number)
      .reduce((acc, v) => acc + v, 0);
  }
}

interface Day04Input {
  drawnNumbers: number[];
  boards: Board[];
}

export class Day04 implements Day<Day04Input, number> {
  transformInput(lines: string[]): Day04Input {
    const lineToNumberArray = (line: string, seperator: ' ' | ','): number[] => line
      .split(seperator)
      .filter(str => str.length > 0)
      .map(value => Number.parseInt(value, 10));

    const drawnNumbers = lineToNumberArray(lines[0], ',');

    let currentBoard: Board = new Board();
    const boards: Board[] = [currentBoard];
    for (let lineIndex = 2; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      if (line.replace(/\s/g, '').length == 0) {
        currentBoard = new Board();
        boards.push(currentBoard);
      } else {
        currentBoard.addRow(lineToNumberArray(line, ' '));
      }
    }

    return {
      drawnNumbers,
      boards,
    };
  }

  getAnswers = () => ({
    exampleA: 4512,
    a: 69579,
    exampleB: 1924,
    b: 14877,
  })

  solutionA(input: Day04Input): number {
    for (let drawIndex = 0; drawIndex < input.drawnNumbers.length; drawIndex += 1) {
      const drawnNumber = input.drawnNumbers[drawIndex];
      input.boards.forEach(board => board.mark(drawnNumber));
      if (drawIndex >= 5) {
        const winner = input.boards.find(board => board.bingo());
        if (winner !== undefined) {
          return winner.sumOfNonMarkedNumbers() * drawnNumber;
        }
      }
    }
    return -1;
  }

  solutionB(input: Day04Input): number {
    let boardsLeft: Board[] = input.boards;
    for (let drawIndex = 0; drawIndex < input.drawnNumbers.length; drawIndex += 1) {
      const drawnNumber = input.drawnNumbers[drawIndex];
      boardsLeft.forEach(board => board.mark(drawnNumber));
      if (drawIndex >= 5) {
        if (boardsLeft.length == 1) {
          if (boardsLeft[0].bingo()) {
            return boardsLeft[0].sumOfNonMarkedNumbers() * drawnNumber;
          }
        } else {
          boardsLeft = boardsLeft.filter(board => !board.bingo());
        }
      }
    }
    return -1;
  }
}
