import { Day } from './day';

class Node {
  public readonly isSmall: boolean;
  public readonly neighbors: Node[] = [];

  constructor(public readonly name: string) {
    this.isSmall = name.toLowerCase() === name;
  }

  public connect(node: Node): void {
    this.neighbors.push(node);
    node.neighbors.push(this);
  }
}

export class Day12 implements Day<Node, number> {
  transformInput(lines: string[]): Node {
    const nodes = new Map<string, Node>();
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const lineNodes = lines[lineIndex]
        .split('-')
        .map(name => {
          let node = nodes.get(name);
          if (node === undefined) {
            node = new Node(name);
            nodes.set(name, node);
          }
          return node;
        });
      lineNodes[0].connect((lineNodes[1]));
    }
    return nodes.get('start')!;
  }

  getAnswers = () => ({
    exampleA: 10,
    a: 3708,
    exampleB: 36,
    b: 93858,
  })

  private countPaths(path: Set<string>, current: Node, canVisitSmallTwice: boolean): number {
    if (current.name === 'end') {
      return 1;
    }
    let count = 0;
    for (let neighborIndex = 0; neighborIndex < current.neighbors.length; neighborIndex += 1) {
      const neighbor = current.neighbors[neighborIndex];
      const visited = path.has(neighbor.name);
      const canVisit = neighbor.name !== 'start' && (!neighbor.isSmall || canVisitSmallTwice || (neighbor.isSmall && !visited));
      if (canVisit) {
        let nextCanVisitSmallTwice = canVisitSmallTwice;
        let neighborName = neighbor.name;
        if (neighbor.isSmall && visited) {
          neighborName += '-2';
          nextCanVisitSmallTwice = false;
        }
        count += this.countPaths(new Set(path).add(neighborName), neighbor, nextCanVisitSmallTwice);
      }
    }
    return count;
  }

  solutionA(start: Node): number {
    return this.countPaths(new Set([start.name]), start, false);
  }

  solutionB(start: Node): number {
    return this.countPaths(new Set([start.name]), start, true);
  }
}
