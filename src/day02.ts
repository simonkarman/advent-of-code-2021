import { ClassicDay } from './day';

type Direction = 'up' | 'down' | 'forward';
interface Command {
  direction: Direction;
  amount: number;
}

export class Day02 implements ClassicDay<Command> {
  transformInput(lines: string[]): Command[] {
    return lines.map(line => {
      const splits = line.split(' ');
      return {
        direction: splits[0] as Direction,
        amount: Number.parseInt(splits[1], 10),
      };
    });
  }

  getAnswers = () => ({
    exampleA: 150,
    a: 2117664,
    exampleB: 900,
    b: 2073416724,
  })

  solutionA(commands: Command[]): number {
    let horizontal = 0, depth = 0;
    for (let i = 0; i < commands.length; i ++) {
      const command = commands[i];
      switch (command.direction) {
      case 'up':
        depth -= command.amount;
        break;
      case 'forward':
        horizontal += command.amount;
        break;
      case 'down':
        depth += command.amount;
        break;
      }
    }
    return horizontal * depth;
  }

  solutionB(commands: Command[]): number {
    let aim = 0, horizontal = 0, depth = 0;
    for (let i = 0; i < commands.length; i ++) {
      const command = commands[i];
      switch (command.direction) {
      case 'down':
        aim += command.amount;
        break;
      case 'up':
        aim -= command.amount;
        break;
      case 'forward':
        horizontal += command.amount;
        depth += aim * command.amount;
        break;
      }
    }
    return horizontal * depth;
  }
}
