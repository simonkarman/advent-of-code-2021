import { ClassicDay } from './day';

export class Day01 implements ClassicDay<number> {
  transformInput(lines: string[]): number[] {
    return lines.map(st => Number.parseInt(st, 10));
  }

  getAnswers = () => ({
    exampleA: 7,
    a: 1548,
    exampleB: 5,
    b: 1589,
  })

  solutionA(input: number[]): number {
    let result = 0;
    for (let i = 1; i < input.length; i++) {
      if (input[i - 1] < input[i]) {
        result += 1;
      }
    }
    return result;
  }

  solutionB(input: number[]): number {
    let result = 0;
    for (let i = 3; i < input.length; i++) {
      if (input[i - 3] < input[i]) {
        result += 1;
      }
    }
    return result;
  }
}
