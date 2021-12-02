import fs from 'fs';

type Direction = 'up' | 'down' | 'forward';
interface Command {
  direction: Direction;
  amount: number;
};

export function getInput(filename: string): Command[] {
  return fs.readFileSync(`./input/${filename}`)
    .toString()
    .split('\n')
    .map(line => {
      const splits = line.split(' ');
      return {
        direction: splits[0] as Direction,
        amount: Number.parseInt(splits[1], 10),
      };
    });
}

export function solution02a(commands: Command[]): number {
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

export function solution02b(commands: Command[]): number {
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
