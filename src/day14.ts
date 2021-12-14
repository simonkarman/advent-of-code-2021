import { Day } from './day';

type Rules = Map<string, string>;
interface Instructions {
  template: string;
  rules: Rules;
}

export class Day14 implements Day<Instructions, bigint> {
  transformInput(lines: string[]): Instructions {
    const template = lines[0];
    const rules = new Map<string, string>();
    lines.slice(2).forEach(line => {
      const [input, output] = line.split(' -> ');
      rules.set(input, output);
    });
    return { template, rules };
  }

  getAnswers = () => ({
    exampleA: 1588n,
    a: 2010n,
    exampleB: 2188189693529n,
    b: 2437698971143n,
  })

  naiveRecursive(instructions: Instructions, steps: number): bigint {
    const increment = (val: bigint, key: string, map: Map<string, bigint>) => {
      map.set(key, (map.get(key) ?? 0n) + val);
    };
    const mergeInto = (one: Map<string, bigint>, two: Map<string, bigint>) => {
      two.forEach((val, key) => increment(val, key, one));
      return one;
    };
    const stepInto = (depth: number, left: string, right: string): Map<string, bigint> => {
      const inBetween = instructions.rules.get(`${left}${right}`);
      if (depth >= steps || inBetween === undefined) {
        return new Map([[right, 1n]]);
      }
      const onLeft = stepInto(depth + 1, left, inBetween);
      const onRight = stepInto(depth + 1, inBetween, right);
      return mergeInto(onLeft, onRight);
    };
    const counts = new Map<string, bigint>();
    increment(1n, instructions.template[0], counts);
    for (let templateIndex = 1; templateIndex < instructions.template.length; templateIndex += 1) {
      mergeInto(counts, stepInto(0, instructions.template[templateIndex - 1], instructions.template[templateIndex]));
    }
    const sorted = Array.from(counts.values()).sort((a, b) => a > b ? 1 : -1);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return max - min;
  }

  sophisticated(instructions: Instructions, steps: number): bigint {
    const emptyPairs = () => Array.from({ length: 26 * 26 }, () => 0n);
    const pairToIndex = (pair: string) => {
      const from = pair.charCodeAt(0) - 65;
      const to = pair.charCodeAt(1) - 65;
      return from * 26 + to;
    };

    let pairs = emptyPairs();
    for (let templateIndex = 1; templateIndex < instructions.template.length; templateIndex += 1) {
      pairs[pairToIndex(instructions.template.substr(templateIndex - 1, 2))] += 1n;
    }

    for (let stepIndex = 0; stepIndex < steps; stepIndex += 1) {
      let newPairs = emptyPairs();
      instructions.rules.forEach((insert, pair) => {
        const pairA = pairToIndex(`${pair[0]}${insert}`);
        const pairB = pairToIndex(`${insert}${pair[1]}`);
        const occurrences = pairs[pairToIndex(pair)];
        newPairs[pairA] += occurrences;
        newPairs[pairB] += occurrences;
      });
      pairs = newPairs;
    }
    const letterCounts = Array.from({ length: 26 }, () => 0n);
    letterCounts[instructions.template.charCodeAt(0) - 65] = 1n;
    pairs.forEach((occurrences, pairIndex) => {
      letterCounts[pairIndex % 26] += occurrences;
    });
    const sortedLetterCounts = letterCounts.filter(v => v > 0n).sort((a, b) => a < b ? -1 : 1);
    return sortedLetterCounts[sortedLetterCounts.length - 1] - sortedLetterCounts[0];
  }

  solutionA(instructions: Instructions): bigint {
    return this.naiveRecursive(instructions, 10);
  }

  solutionB(instructions: Instructions): bigint {
    return this.sophisticated(instructions, 40);
  }
}
