import { getInput, solution01a, solution01b } from '../solutions/01-solution';

describe('01A', () => {
  it('example', () => {
    expect(solution01a(getInput('01-input-example.txt'))).toBe(7);
  });
  it('answer', () => {
    expect(solution01a(getInput('01-input.txt'))).toBe(1548);
  });
});

describe('01B', () => {
  it('example', () => {
    expect(solution01b(getInput('01-input-example.txt'))).toBe(5);
  });
  it('answer', () => {
    expect(solution01b(getInput('01-input.txt'))).toBe(1589);
  });
});
