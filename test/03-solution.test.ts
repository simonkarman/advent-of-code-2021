import { getInput, solution03a, solution03b } from '../solutions/03-solution';

describe('03A', () => {
  it('example', () => {
    expect(solution03a(getInput('03-input-example.txt'))).toBe(198);
  });
  it('answer', () => {
    expect(solution03a(getInput('03-input.txt'))).toBe(2498354);
  });
});

describe('03B', () => {
  it('example', () => {
    expect(solution03b(getInput('03-input-example.txt'))).toBe(230);
  });
  it('answer', () => {
    expect(solution03b(getInput('03-input.txt'))).toBe(3277956);
  });
});
