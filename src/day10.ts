import { ClassicDay } from './day';

type OpenCharacter = '(' | '[' | '{' | '<';
type CloseCharacter = ')' | ']' | '}' | '>';
type Character = OpenCharacter | CloseCharacter;
type Line = Character[];

const OpenCharacters: OpenCharacter[] = ['(', '[', '{', '<'];
const CloseCharacters: CloseCharacter[] = [')', ']', '}', '>'];

export class Day10 implements ClassicDay<Line> {
  transformInput(lines: string[]): Line[] {
    return lines.map(line => line.split('') as Character[]);
  }
  getAnswers = () => ({
    exampleA: 26397,
    a: 193275,
    exampleB: 288957,
    b: 2429644557,
  })

  private isOpen(character: Character): character is OpenCharacter {
    return ['(', '{', '[', '<'].includes(character);
  }

  private matches(open: OpenCharacter, close: CloseCharacter) {
    return OpenCharacters.indexOf(open) == CloseCharacters.indexOf(close);
  }

  private findFailure(line: Line): CloseCharacter | undefined {
    const stack: OpenCharacter[] = [];
    for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
      const character = line[characterIndex];
      if (this.isOpen(character)) {
        stack.push(character);
      } else {
        const open = stack.pop();
        if (open === undefined || !this.matches(open, character)) {
          return character;
        }
      }
    }
    return undefined;
  };

  private toFailurePoints(character: CloseCharacter): number {
    return { ')': 3, ']': 57, '}': 1197, '>': 25137 }[character];
  }

  solutionA(lines: Line[]): number {
    return lines
      .map(line => this.findFailure(line))
      .map(failure => failure === undefined ? 0 : this.toFailurePoints(failure))
      .reduce((acc, v) => acc + v, 0);
  }

  private toClose(open: OpenCharacter): CloseCharacter {
    return CloseCharacters[OpenCharacters.indexOf(open)];
  }

  private findIncomplete(line: Line): CloseCharacter[] | undefined {
    const stack: OpenCharacter[] = [];
    for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
      const character = line[characterIndex];
      if (this.isOpen(character)) {
        stack.push(character);
      } else {
        stack.pop();
      }
    }
    return stack.length === 0 ? undefined : stack.map(this.toClose).reverse();
  };

  private toMissingPoints(character: CloseCharacter): number {
    return CloseCharacters.indexOf(character) + 1;
  }

  solutionB(lines: Line[]): number {
    const scores = lines
      .filter(line => this.findFailure(line) === undefined)
      .map(line => this.findIncomplete(line))
      .map(inc => inc === undefined
        ? 0
        : inc.reduce((acc: number, v: CloseCharacter) => (5 * acc) + this.toMissingPoints(v), 0),
      ).sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
  }
}
