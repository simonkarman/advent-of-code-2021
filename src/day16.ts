import { Day } from './day';

type Sequence = string;
interface Packet {
  version: number;
  type: number;
}
interface ValuePacket extends Packet {
  value: number;
}
interface OperatorPacket extends Packet {
  subPackets: Packet[];
  lengthType: number;
}

export class Day16 implements Day<Sequence, number> {
  transformInput(lines: string[]): Sequence {
    return lines[0].split('').map(hex => {
      const binary = Number.parseInt(hex, 16).toString(2);
      return ('0000' + binary).substr(-4);
    }).join('');
  }

  getAnswers = () => ({
    exampleA: 31,
    a: 883,
    exampleB: 54,
    b: 1675198555015,
  })

  parsePacket(sequence: Sequence): [number, Packet] {
    let pointer = 0;
    const parseString = (length: number): string => {
      const result = sequence.slice(pointer, pointer + length);
      pointer += length;
      return result;
    };
    const parseNumber = (length: number): number => {
      return Number.parseInt(parseString(length), 2);
    };
    const version = parseNumber(3);
    const type = parseNumber(3);
    if (type === 4) {
      let literal = '';
      while (true) {
        const group = parseString(5);
        literal += group.substr(1);
        if (group.startsWith('0')) {
          break;
        }
      }
      const value = Number.parseInt(literal, 2);
      const valuePacket: ValuePacket = { version, type, value };
      return [pointer, valuePacket];
    }
    const lengthType = parseNumber(1);
    const subPackets: Packet[] = [];
    if (lengthType === 0) {
      let numberOfBits = parseNumber(15);
      while (numberOfBits > 0) {
        const [bitsRead, subPacket] = this.parsePacket(sequence.substr(pointer));
        pointer += bitsRead;
        numberOfBits -= bitsRead;
        subPackets.push(subPacket);
      }
    } else {
      let numberOfPackets = parseNumber(11);
      while (numberOfPackets > 0) {
        const [bitsRead, subPacket] = this.parsePacket(sequence.substr(pointer));
        pointer += bitsRead;
        numberOfPackets -= 1;
        subPackets.push(subPacket);
      }
    }
    const operatorPacket: OperatorPacket = { version, type, lengthType, subPackets };
    return [pointer, operatorPacket];
  }

  isOperatorPacket(packet: Packet): packet is OperatorPacket {
    return (packet as OperatorPacket).subPackets !== undefined;
  }

  isValuePacket(packet: Packet): packet is ValuePacket {
    return (packet as ValuePacket).value !== undefined;
  }

  sumVersionsOf(packet: Packet): number {
    let versionSum = packet.version;
    if (this.isOperatorPacket(packet)) {
      packet.subPackets.map(subPacket => this.sumVersionsOf(subPacket))
        .forEach(subVersionSum => versionSum += subVersionSum);
    }
    return versionSum;
  }

  solutionA(sequence: Sequence): number {
    const [, packet] = this.parsePacket(sequence);
    return this.sumVersionsOf(packet);
  }

  expressionValueOf(packet: Packet): number {
    if (this.isValuePacket(packet)) {
      return packet.value;
    }
    if (this.isOperatorPacket(packet)) {
      const values = packet.subPackets.map(subPacket => this.expressionValueOf(subPacket));
      if (packet.type === 0) {
        return values.reduce((acc, v) => acc + v, 0);
      } else if (packet.type === 1) {
        return values.reduce((acc, v) => acc * v, 1);
      } else if (packet.type === 2) {
        return Math.min(...values);
      } else if (packet.type === 3) {
        return Math.max(...values);
      } else if (packet.type === 5) {
        return values[0] > values[1] ? 1 : 0;
      } else if (packet.type === 6) {
        return values[0] < values[1] ? 1 : 0;
      } else if (packet.type === 7) {
        return values[0] === values[1] ? 1 : 0;
      }
    }
    throw new Error('Packet must be a value of operator packet');
  }

  solutionB(sequence: Sequence): number {
    const [, packet] = this.parsePacket(sequence);
    return this.expressionValueOf(packet);
  }
}
