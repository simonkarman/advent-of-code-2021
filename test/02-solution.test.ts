import { getInput, solution02a, solution02b } from '../solutions/02-solution';

describe('02A', () => {
  it('example', () => {
    expect(solution02a(getInput('02-input-example.txt'))).toBe(150);
  });
  it('answer', () => {
    expect(solution02a(getInput('02-input.txt'))).toBe(2117664);
  });
});

describe('02B', () => {
  it('example', () => {
    expect(solution02b(getInput('02-input-example.txt'))).toBe(900);
  });
  it('answer', () => {
    expect(solution02b(getInput('02-input.txt'))).toBe(2073416724);
  });
});
