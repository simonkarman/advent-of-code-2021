import { ClassicDay } from './day';

export class Day07 implements ClassicDay<number> {
  transformInput(lines: string[]): number[] {
    return lines[0].split(',').map(st => Number.parseInt(st, 10));
  }

  getAnswers = () => ({
    exampleA: 37,
    a: 347509,
    exampleB: 168,
    b: 98257206,
  })

  loopThroughAllPossibleOptions(positions: number[], fuelComputer: (steps: number) => number) {
    const min = Math.min(...positions);
    const max = Math.max(...positions);
    let lowestFuelCost = Number.POSITIVE_INFINITY;
    for (let target = min; target <= max; target += 1) {
      let fuelCost = 0;
      for (let positionIndex = 0; positionIndex < positions.length; positionIndex += 1) {
        fuelCost += fuelComputer(Math.abs(positions[positionIndex] - target));
      }
      if (lowestFuelCost > fuelCost) {
        lowestFuelCost = fuelCost;
      }
    }
    return lowestFuelCost;
  }

  solutionA(positions: number[]): number {
    return this.loopThroughAllPossibleOptions(positions, steps => steps);
  }

  solutionB(positions: number[]): number {
    const stepsToFuelTable: number[] = [0];
    const maxNumberOfSteps = Math.max(...positions) - Math.min(...positions);
    for (let steps = 1; steps <= maxNumberOfSteps; steps += 1) {
      stepsToFuelTable[steps] = stepsToFuelTable[steps - 1] + steps;
    }
    console.info(stepsToFuelTable);
    return this.loopThroughAllPossibleOptions(positions, (steps: number) => stepsToFuelTable[steps]);
  }
}
