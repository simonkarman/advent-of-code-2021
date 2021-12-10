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

const days: Day<unknown, unknown>[] = [
  new Day00(), new Day01(), new Day02(), new Day03(), new Day04(),
  new Day05(), new Day06(), new Day07(), new Day08(), new Day09(),
];

days.map(day => {
  const loadInputFrom = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName.toLowerCase()}`).toString().split('\n'));
  };
  const loadExampleInput = () => loadInputFrom(`${day.constructor.name}example.txt`);
  const loadInput = () => loadInputFrom(`${day.constructor.name}.txt`);
  const answers = day.getAnswers();

  describe(day.constructor.name, () => {
    describe('A', () => {
      it('example', () => {
        if (answers.exampleA === Skip) {
          return;
        }
        expect(day.solutionA(loadExampleInput())).toBe(answers.exampleA);
      });
      it('answer', () => {
        if (answers.a === Skip) {
          return;
        }
        expect(day.solutionA(loadInput())).toBe(answers.a);
      });
    });
    describe('B', () => {
      it('example', () => {
        if (answers.exampleB === Skip) {
          return;
        }
        expect(day.solutionB(loadExampleInput())).toBe(answers.exampleB);
      });
      it('answer', () => {
        if (answers.b === Skip) {
          return;
        }
        expect(day.solutionB(loadInput())).toBe(answers.b);
      });
    });
  });
});
