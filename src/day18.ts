import { ClassicDay, Skip } from './day';

type InParent = 'left' | 'right' | 'root';
interface SnailfishNumber {
  parent?: SnailfishNumber,
  inParent: InParent;
  left: SnailfishNumber | number;
  right: SnailfishNumber | number;
}

export class Day18 implements ClassicDay<SnailfishNumber> {
  private static parseSnailfishNumber(text: string, inParent: InParent, parent?: SnailfishNumber): SnailfishNumber {
    let depth = 0;
    let separatorIndex = -1;
    for (let characterIndex = 0; characterIndex < text.length; characterIndex += 1) {
      const character = text[characterIndex];
      if (character === '[') {
        depth += 1;
      } else if (character == ']') {
        depth -= 1;
      } else if (depth == 1 && character === ',') {
        separatorIndex = characterIndex;
        break;
      }
    }
    const snailfishNumber: Partial<SnailfishNumber> = {
      parent,
      inParent,
    };
    const to = (sideText: string, inParent: InParent): SnailfishNumber | number => {
      if (sideText.length === 1) {
        return Number.parseInt(sideText, 10);
      }
      return Day18.parseSnailfishNumber(sideText, inParent, snailfishNumber as SnailfishNumber);
    };
    snailfishNumber.left = to(text.slice(1, separatorIndex), 'left');
    snailfishNumber.right = to(text.slice(separatorIndex + 1, text.length - 1), 'right');
    return snailfishNumber as SnailfishNumber;
  };

  transformInput(lines: string[]): SnailfishNumber[] {
    return lines.map(line => Day18.parseSnailfishNumber(line, 'root'));
  }

  getAnswers = () => ({
    exampleA: 4126, //4140??
    a: 4176,
    exampleB: 3958, //3993??
    b: 4633,
  })

  tryExplode(snailfishNumber: SnailfishNumber, depth: number): boolean {
    function addToLeftMostIn(root: SnailfishNumber, value: number) {
      while (typeof root.left !== 'number') {
        root = root.left;
      }
      root.left += value;
    }
    function addToRightMostIn(root: SnailfishNumber, value: number) {
      while (typeof root.right !== 'number') {
        root = root.right;
      }
      root.right += value;
    }
    if (depth > 4 && (typeof snailfishNumber.left === 'number') && (typeof snailfishNumber.right === 'number')) {
      if (snailfishNumber.parent === undefined) {
        throw new Error('Data inconsistency found. At depth larger than 4, a snailfishNumber MUST have a parent.');
      }
      const { left: leftValue, right: rightValue } = snailfishNumber;
      if (snailfishNumber.inParent === 'left') {
        // Explode
        snailfishNumber.parent.left = 0;

        // Distribute right value
        if (typeof snailfishNumber.parent.right === 'number') {
          snailfishNumber.parent.right += rightValue;
        } else {
          addToLeftMostIn(snailfishNumber.parent.right, rightValue);
        }

        // Distribute left value
        let tracer: SnailfishNumber | undefined = snailfishNumber.parent;
        while (tracer !== undefined && tracer.inParent !== 'right') {
          tracer = tracer.parent;
        }
        if (tracer !== undefined) {
          if (typeof tracer.parent!.left === 'number') {
            tracer.parent!.left += leftValue;
          } else {
            addToRightMostIn(tracer.parent!.left, leftValue);
          }
        }
      }
      if (snailfishNumber.inParent === 'right') {
        // Explode
        snailfishNumber.parent.right = 0;

        // Distribute left value
        if (typeof snailfishNumber.parent.left === 'number') {
          snailfishNumber.parent.left += leftValue;
        } else {
          addToRightMostIn(snailfishNumber.parent.left, leftValue);
        }

        // Distribute right value
        let tracer: SnailfishNumber | undefined = snailfishNumber.parent;
        while (tracer !== undefined && tracer.inParent !== 'left') {
          tracer = tracer.parent;
        }
        if (tracer !== undefined) {
          if (typeof tracer.parent!.right === 'number') {
            tracer.parent!.right += rightValue;
          } else {
            addToLeftMostIn(tracer.parent!.right, rightValue);
          }
        }
      }
      return true;
    }
    return (typeof snailfishNumber.left !== 'number' && this.tryExplode(snailfishNumber.left, depth + 1))
      || (typeof snailfishNumber.right !== 'number' && this.tryExplode(snailfishNumber.right, depth + 1));
  }

  trySplit(snailfishNumber: SnailfishNumber): boolean {
    if (typeof snailfishNumber.left === 'number' && snailfishNumber.left >= 10) {
      const half = Math.floor(snailfishNumber.left / 2);
      snailfishNumber.left = {
        parent: snailfishNumber,
        inParent: 'left',
        left: half,
        right: snailfishNumber.left - half,
      };
      return true;
    }
    if (typeof snailfishNumber.right === 'number' && snailfishNumber.right >= 10) {
      const half = Math.floor(snailfishNumber.right / 2);
      snailfishNumber.right = {
        parent: snailfishNumber,
        inParent: 'right',
        left: half,
        right: snailfishNumber.right - half,
      };
      return true;
    }
    return (typeof snailfishNumber.left !== 'number' && this.trySplit(snailfishNumber.left))
      || (typeof snailfishNumber.right !== 'number' && this.trySplit(snailfishNumber.right));
  }

  reduce(snailfishNumber: SnailfishNumber): void {
    while(true) {
      if (this.tryExplode(snailfishNumber, 1)) {
        continue;
      }
      if (this.trySplit(snailfishNumber)) {
        continue;
      }
      break;
    }
  }

  computeMagnitude(snailfishNumber: SnailfishNumber): number {
    const left = typeof snailfishNumber.left === 'number'
      ? snailfishNumber.left
      : this.computeMagnitude(snailfishNumber.left);
    const right = typeof snailfishNumber.right === 'number'
      ? snailfishNumber.right
      : this.computeMagnitude(snailfishNumber.right);
    return left * 3 + right * 2;
  }

  format(snailfishNumber: SnailfishNumber): string {
    const left = typeof snailfishNumber.left === 'number'
      ? snailfishNumber.left.toString()
      : this.format(snailfishNumber.left);
    const right = typeof snailfishNumber.right === 'number'
      ? snailfishNumber.right.toString()
      : this.format(snailfishNumber.right);
    return `[${left},${right}]`;
  }

  combine(left: SnailfishNumber, right: SnailfishNumber): SnailfishNumber {
    const value = {
      parent: undefined,
      inParent: 'root' as 'root',
      left,
      right,
    };
    value.left.parent = value;
    value.left.inParent = 'left';
    value.right.parent = value;
    value.right.inParent = 'right';
    return value;
  }

  solutionA(snailfishNumbers: SnailfishNumber[]): number {
    let acc: SnailfishNumber = snailfishNumbers[0];
    for (let index = 1; index < snailfishNumbers.length; index += 1) {
      const value = this.combine(acc, snailfishNumbers[index]);
      this.reduce(value);
      acc = value;
    }
    return this.computeMagnitude(acc);
  }

  solutionB(snailfishNumbers: SnailfishNumber[]): number {
    let largest = 0;
    for (let leftIndex = 1; leftIndex < snailfishNumbers.length; leftIndex += 1) {
      for (let rightIndex = 1; rightIndex < snailfishNumbers.length; rightIndex += 1) {
        if (leftIndex === rightIndex) {
          continue;
        }
        const left = Day18.parseSnailfishNumber(this.format(snailfishNumbers[leftIndex]), 'root');
        const right = Day18.parseSnailfishNumber(this.format(snailfishNumbers[rightIndex]), 'root');
        const outcome = this.combine(left, right);
        this.reduce(outcome);
        const magnitude = this.computeMagnitude(outcome);
        if (magnitude > largest) {
          largest = magnitude;
        }
      }
    }
    return largest;
  }
}
