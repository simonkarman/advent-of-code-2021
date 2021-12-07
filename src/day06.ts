import { ClassicDay } from './day';

export class Day06 implements ClassicDay<number> {
  transformInput(lines: string[]): number[] {
    return lines[0].split(',').map(st => Number.parseInt(st, 10));
  }

  getAnswers = () => ({
    exampleA: 5934,
    a: 360268,
    exampleB: 26984457539,
    b: 1632146183902,
  })

  solutionA(fish: number[]): number {
    for (let dayIndex = 0; dayIndex < 80; dayIndex += 1) {
      const numberOfFish = fish.length;
      for (let fishIndex = 0; fishIndex < numberOfFish; fishIndex += 1) {
        if (fish[fishIndex] == 0) {
          fish[fishIndex] = 6;
          fish.push(8);
        } else {
          fish[fishIndex] -= 1;
        }
      }
    }
    return fish.length;
  }

  solutionB(fish: number[]): number {
    const numberOfFishByAge: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let fishIndex = 0; fishIndex < fish.length; fishIndex += 1) {
      const fishAge = fish[fishIndex];
      numberOfFishByAge[fishAge] += 1;
    }
    for (let dayIndex = 0; dayIndex < 256; dayIndex += 1) {
      const numberOfSpawns = numberOfFishByAge.shift()!;
      numberOfFishByAge[6] += numberOfSpawns;
      numberOfFishByAge.push(numberOfSpawns);
    }
    return numberOfFishByAge.reduce((acc, v) => acc + v, 0);
  }
}
