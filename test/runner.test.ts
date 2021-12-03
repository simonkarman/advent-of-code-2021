import * as fs from 'fs';
import { Day } from '../src/day';
import { Day01 } from '../src/day01';
import { Day02 } from '../src/day02';
import { Day03 } from '../src/day03';

const days: Day<unknown, unknown>[] = [new Day01(), new Day02(), new Day03()];

days.map(day => {
  const loadInput = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName}`).toString().split('\n'));
  };
  const exampleInput = loadInput(`${day.constructor.name}example.txt`);
  const input = loadInput(`${day.constructor.name}.txt`);
  const answers = day.getAnswers();

  describe(day.constructor.name, () => {
    describe('A', () => {
      it('example', () => {
        expect(day.solutionA(exampleInput)).toBe(answers.exampleA);
      });
      it('answer', () => {
        expect(day.solutionA(input)).toBe(answers.a);
      });
    });
    describe('B', () => {
      it('example', () => {
        expect(day.solutionB(exampleInput)).toBe(answers.exampleB);
      });
      it('answer', () => {
        expect(day.solutionB(input)).toBe(answers.b);
      });
    });
  });
});
