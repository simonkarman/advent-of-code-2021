import { ClassicDay } from './day';

export class Day03 implements ClassicDay<string> {
  transformInput(lines: string[]): string[] {
    return lines;
  }

  getAnswers = () => ({
    exampleA: 198,
    a: 2498354,
    exampleB: 230,
    b: 3277956,
  })

  private static getMostCommonInAt(input: string[], characterIndex: number): '0' | '1' {
    let counter0 = 0;
    for (let inputIndex = 0; inputIndex < input.length; inputIndex += 1) {
      if (input[inputIndex][characterIndex] == '0') {
        counter0 += 1;
      }
    }
    return (counter0 > input.length / 2) ? '0' : '1';
  }

  private static calculateRating(input: string[], shouldBeMostCommon: boolean) {
    let candidates = [...input];
    let characterIndex = 0;
    while (candidates.length > 1) {
      const mostCommon = Day03.getMostCommonInAt(candidates, characterIndex);
      candidates = candidates.filter(candidate => (candidate[characterIndex] === mostCommon) != shouldBeMostCommon);
      characterIndex += 1;
    }
    return Number.parseInt(candidates[0], 2);
  }

  solutionA(input: string[]): number {
    let gamma = '';
    let epsilon = '';
    for (let characterIndex = 0; characterIndex < input[0].length; characterIndex += 1) {
      let common = Day03.getMostCommonInAt(input, characterIndex);
      gamma += common;
      epsilon += common === '0' ? '1' : '0';
    }
    return Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2);
  }

  solutionB(input: string[]): number {
    const oxygenGeneratorRating = Day03.calculateRating(input, true);
    const co2ScrubberRating = Day03.calculateRating(input, false);
    return oxygenGeneratorRating * co2ScrubberRating;
  }
}
