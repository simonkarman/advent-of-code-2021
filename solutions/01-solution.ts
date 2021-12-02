import fs from 'fs';

export function getInput(filename: string): number[] {
  return fs.readFileSync(`./input/${filename}`)
    .toString()
    .split('\n')
    .map(st => Number.parseInt(st, 10));
}

export function solution01a(input: number[]): number {
  let result = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i - 1] < input[i]) {
      result += 1;
    }
  }
  return result;
}

export function solution01b(input: number[]): number {
  let result = 0;
  for (let i = 3; i < input.length; i++) {
    if (input[i - 3] < input[i]) {
      result += 1;
    }
  }
  return result;
}
