import { Day, Skip } from './day';

class Grid {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly cells: number[],
  ) {}

  neighborsOf(x: number, y: number): [number, number][] {
    const result: [number, number][] = [];
    if (x + 1 < this.width) { result.push([x + 1, y]); }
    if (x - 1 >= 0) { result.push([x - 1, y]); }
    if (y + 1 < this.height) { result.push([x, y + 1]); }
    if (y - 1 >= 0) { result.push([x, y - 1]); }
    return result;
  }

  getAt(x: number, y: number): number {
    return this.cells[y * this.width + x];
  }

  expand(times: number) {
    const newGrid = [];
    const toIndexInNewGrid = (x: number, y: number): number => (y * this.width * times) + x;
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        const value = this.getAt(x, y);
        for (let xx = 0; xx < times; xx += 1) {
          for (let yy = 0; yy < times; yy += 1) {
            newGrid[toIndexInNewGrid(x + xx * this.width, y + yy * this.height)] = ((value + xx + yy - 1) % 9) + 1;
          }
        }
      }
    }
    return new Grid(this.width * times, this.height * times, newGrid);
  }

  toString(): string {
    return this.cells.join('').replace(/(.{50})/g, '$1\n');
  }
}

export class Day15 implements Day<Grid, number> {
  transformInput(lines: string[]): Grid {
    return new Grid(
      lines[0].length,
      lines.length,
      lines.join('').split('').map(value => Number.parseInt(value, 10)),
    );
  }

  getAnswers = () => ({
    exampleA: 40,
    a: 696,
    exampleB: 315,
    b: Skip, // 2952
  })

  aStar(grid: Grid): number {
    const toXY = (position: string): [number, number] => position.split(',').map(v => Number.parseInt(v, 10)) as [number, number];
    const toString = (x: number, y: number) => `${x},${y}`;

    const start = '0,0';
    const goal = toString(grid.width - 1, grid.height - 1);

    const pathLength = (cameFrom: Map<string, string>, current: string): number => {
      let length = 0;
      while (current !== start) {
        length += grid.getAt(...toXY(current));
        current = cameFrom.get(current)!;
      }
      return length;
    };

    const h = (from: string): number => {
      const [x, y] = toXY(from);
      return (Math.abs(grid.width - 1 - x) + Math.abs(grid.height - 1 - y));
    };

    const open = new Set<string>();
    open.add(start);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    gScore.set(start, 0);
    const fScore = new Map<string, number>();
    fScore.set(start, h(start));
    while (open.size > 0) {
      const current = Array.from(open.values()).sort((b, a) => fScore.get(b)! - fScore.get(a)!)[0];
      if (current === goal) {
        return pathLength(cameFrom, current);
      }
      open.delete(current);
      const neighbors = grid.neighborsOf(...toXY(current)).map(xy => toString(...xy));
      neighbors.forEach(neighbor => {
        const tentative = gScore.get(current)! + grid.getAt(...toXY(neighbor));
        if (!gScore.has(neighbor) || tentative < gScore.get(neighbor)!) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative);
          fScore.set(neighbor, tentative + h(neighbor));
          open.add(neighbor);
        }
      });
    }
    return -1;
  }

  solutionA(grid: Grid): number {
    return this.aStar(grid);
  }

  solutionB(grid: Grid): number {
    return this.aStar(grid.expand(5));
  }
}
