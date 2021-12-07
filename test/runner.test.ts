import * as fs from 'fs';
import { Day } from '../src/day';
import { Day01 } from '../src/day01';
import { Day02 } from '../src/day02';
import { Day03 } from '../src/day03';
import { Day04 } from '../src/day04';
import { Day05 } from '../src/day05';
import { Day06 } from '../src/day06';

const days: Day<unknown, unknown>[] = [
  new Day01(), new Day02(), new Day03(), new Day04(),
  new Day05(), new Day06(),
];

days.map(day => {
  const loadInputFrom = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName}`).toString().split('\n'));
  };
  const loadExampleInput = () => loadInputFrom(`${day.constructor.name}example.txt`);
  const loadInput = () => loadInputFrom(`${day.constructor.name}.txt`);
  const answers = day.getAnswers();

  describe(day.constructor.name, () => {
    describe('A', () => {
      it('example', () => {
        expect(day.solutionA(loadExampleInput())).toBe(answers.exampleA);
      });
      it('answer', () => {
        expect(day.solutionA(loadInput())).toBe(answers.a);
      });
    });
    describe('B', () => {
      it('example', () => {
        expect(day.solutionB(loadExampleInput())).toBe(answers.exampleB);
      });
      it('answer', () => {
        expect(day.solutionB(loadInput())).toBe(answers.b);
      });
    });
  });
});
