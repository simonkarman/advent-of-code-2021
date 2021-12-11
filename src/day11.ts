import { Day, Skip } from './day';

interface Point { x: number, y: number }
class Grid {
  public readonly width: number;
  public readonly height: number;
  private octopuses: number[];

  constructor(lines: string[]) {
    this.width = lines[0].length;
    this.height = lines.length;
    this.octopuses = lines.join('').split('').map(value => Number.parseInt(value, 10));
  }

  all(): Point[] {
    const all: Point[] = [];
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        all.push({ x, y });
      }
    }
    return all;
  }

  get(point: Point): number {
    return this.octopuses[point.y * this.width + point.x];
  }

  increase(point: Point): number {
    const index = point.y * this.width + point.x;
    this.octopuses[index] += 1;
    return this.octopuses[index];
  }

  clean() {
    this.octopuses = this.octopuses.map((n) => n > 9 ? 0 : n);
  }

  neighbors(point: Point, max: number): Point[] {
    const neighbors: Point[] = [];
    const minX = Math.max(0, point.x - 1);
    const maxX = Math.min(this.width - 1, point.x + 1);
    const minY = Math.max(0, point.y - 1);
    const maxY = Math.min(this.height - 1, point.y + 1);
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const neighbor = { x, y };
        if (x == point.x && y == point.y || this.get(neighbor) > max) {
          continue;
        }
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }

  toString(): string {
    return this.octopuses.join('').replace(/(.{10})/g, '$1\n');
  }
}

export class Day11 implements Day<Grid, number> {
  transformInput(lines: string[]): Grid {
    return new Grid(lines);
  }

  getAnswers = () => ({
    exampleA: 1656,
    a: 1723,
    exampleB: 195,
    b: 327,
  })

  private simulate(grid: Grid): number {
    let flashes = 0;
    const all = grid.all();
    while (all.length > 0) {
      const point = all.pop()!;
      const result = grid.increase(point);
      if (result == 10) {
        flashes += 1;
        all.push(...grid.neighbors(point, 9));
      }
    }
    grid.clean();
    return flashes;
  }

  solutionA(grid: Grid): number {
    let flashes = 0;
    for (let step = 0; step < 100; step += 1) {
      flashes += this.simulate(grid);
    }
    return flashes;
  }

  solutionB(grid: Grid): number {
    const count = grid.width * grid.height;
    let stepIndex = 0;
    while (true) {
      stepIndex += 1;
      if (this.simulate(grid) == count) {
        return stepIndex;
      }
    }
  }
}
