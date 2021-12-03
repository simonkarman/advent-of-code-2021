import fs from 'fs';

export function getInput(filename: string): string[] {
  return fs.readFileSync(`./input/${filename}`)
    .toString()
    .split('\n');
}

function getMostCommonInAt(input: string[], characterIndex: number): '0' | '1' {
  let counter0 = 0;
  for (let inputIndex = 0; inputIndex < input.length; inputIndex += 1) {
    if (input[inputIndex][characterIndex] == '0') {
      counter0 += 1;
    }
  }
  return (counter0 > input.length / 2) ? '0' : '1';
}

function calculateRating(input: string[], shouldBeMostCommon: boolean) {
  let candidates = [...input];
  let characterIndex = 0;
  while (candidates.length > 1) {
    const mostCommon = getMostCommonInAt(candidates, characterIndex);
    candidates = candidates.filter(candidate => (candidate[characterIndex] === mostCommon) != shouldBeMostCommon);
    characterIndex += 1;
  }
  return Number.parseInt(candidates[0], 2);
}

export function solution03a(input: string[]): number {
  let gamma = '';
  let epsilon = '';
  for (let characterIndex = 0; characterIndex < input[0].length; characterIndex += 1) {
    let common = getMostCommonInAt(input, characterIndex);
    gamma += common;
    epsilon += common === '0' ? '1' : '0';
  }
  return Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2);
}

export function solution03b(input: string[]): number {
  const oxygenGeneratorRating = calculateRating(input, true);
  const co2ScrubberRating = calculateRating(input, false);
  return oxygenGeneratorRating * co2ScrubberRating;
}
