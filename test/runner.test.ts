import * as fs from 'fs';
import { Day, Skip } from '../src/day';
import { Day00 } from '../src/day00';
import { Day01 } from '../src/day01';
import { Day02 } from '../src/day02';
import { Day03 } from '../src/day03';
import { Day04 } from '../src/day04';
import { Day05 } from '../src/day05';
import { Day06 } from '../src/day06';
import { Day07 } from '../src/day07';
import { Day08 } from '../src/day08';
import { Day09 } from '../src/day09';
import { Day10 } from '../src/day10';
import { Day11 } from '../src/day11';
import { Day12 } from '../src/day12';
import { Day13 } from '../src/day13';
import { Day14 } from '../src/day14';
import { Day15 } from '../src/day15';
import { Day16 } from '../src/day16';
import { Day18 } from '../src/day18';

const days: Day<unknown, unknown>[] = [
  new Day00(), new Day01(), new Day02(), new Day03(), new Day04(),
  new Day05(), new Day06(), new Day07(), new Day08(), new Day09(),
  new Day10(), new Day11(), new Day12(), new Day13(), new Day14(),
  new Day15(), new Day16(), new Day18(),
];

const runner = (shouldSkip: boolean) => shouldSkip ? test.skip : test;

days.map(day => {
  const loadInputFrom = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName.toLowerCase()}`).toString().split('\n'));
  };
  const loadExampleInput = () => loadInputFrom(`${day.constructor.name}example.txt`);
  const loadInput = () => loadInputFrom(`${day.constructor.name}.txt`);
  const answers = day.getAnswers();

  describe(day.constructor.name, () => {
    describe('A', () => {
      runner(answers.exampleA === Skip)('example', () => {
        expect(day.solutionA(loadExampleInput())).toBe(answers.exampleA);
      });
      runner(answers.a === Skip)('answer', () => {
        expect(day.solutionA(loadInput())).toBe(answers.a);
      });
    });
    describe('B', () => {
      runner(answers.exampleB === Skip)('example', () => {
        expect(day.solutionB(loadExampleInput())).toBe(answers.exampleB);
      });
      runner(answers.b === Skip)('answer', () => {
        expect(day.solutionB(loadInput())).toBe(answers.b);
      });
    });
  });
});
