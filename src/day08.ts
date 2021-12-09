import { Day } from './day';

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
interface Entry {
  signalDigits: string[];
  outputDigits: string[];
}

export class Day08 implements Day<Entry[], number> {
  transformInput(lines: string[]): Entry[] {
    return lines.map(line => {
      const [signal, output] = line.split(' | ');
      return {
        signalDigits: signal.split(' '),
        outputDigits: output.split(' '),
      };
    });
  }

  getAnswers = () => ({
    exampleA: 26,
    a: 514,
    exampleB: 61229,
    b: 1012272,
  })

  solutionA(entries: Entry[]): number {
    const uniqueLengths = [2, 3, 4, 7];
    return entries
      .flatMap(entry => entry.outputDigits)
      .filter(digit => uniqueLengths.includes(digit.length))
      .length;
  }

  private decode(entry: Entry): number {
    // Count occurrence of each segment
    const segmentOccurrences = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
    const allSignalDigits = entry.signalDigits.join('').split('') as Segment[];
    allSignalDigits.forEach(value => segmentOccurrences[value] += 1);

    // Define sorted occurrences per segment per number (see bottom of file for explanation)
    const occurrenceSequenceOfDigitsPerNumber = ['467889', '89', '47788', '77889', '6789', '67789', '467789', '889', '4677889', '677889'];

    // Map each output digit to the corresponding number and add them up
    const digitToNumber = (digit: string): number => {
      const segments = digit.split('') as Segment[];
      const occurrenceSequenceOfDigit = segments.map(segment => segmentOccurrences[segment]).sort().join('');
      return occurrenceSequenceOfDigitsPerNumber.indexOf(occurrenceSequenceOfDigit);
    };
    return Number.parseInt(entry.outputDigits.map(digitToNumber).join(''));
  }

  solutionB(entries: Entry[]): number {
    return entries.map(this.decode).reduce((acc, v) => acc + v, 0);
  }
}

// Numbers to Segments (length)
// 0: [a, b, c, e, f, g] (6)
// 1: [c, f] (2)
// 2: [a, c, d, e, g] (5)
// 3: [a, c, d, f, g] (5)
// 4: [b, c, d, f] (4)
// 5: [a, b, d, f, g] (5)
// 6: [a, b, d, e, f, g] (6)
// 7: [a, c, f] (3)
// 8: [a, b, c, d, e, f, g] (7)
// 9: [a, b, c, d, f, g] (6)

// Occurrences of segments
// a: 8
// b: 6
// c: 8
// d: 7
// e: 4
// f: 9
// g: 7

// Occurrences per digit (sorted)
// 0: [8, 6, 8, 4, 9, 7] -> 467889
// 1: [8, 9] -> 89
// 2: [8, 8, 7, 4, 7] -> 47788
// 3: [8, 8, 7, 9, 7] -> 77889
// 4: [6, 8, 7, 9] -> 6789
// 5: [8, 6, 7, 9, 7] -> 67789
// 6: [8, 6, 7, 4, 9, 7] -> 467789
// 7: [8, 8, 9] -> 889
// 8: [8, 6, 8, 7, 4, 9, 7] -> 4677889
// 9: [8, 6, 8, 7, 9, 7] -> 677889
