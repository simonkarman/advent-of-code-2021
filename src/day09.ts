import { Day } from './day';

class Grid {
  public readonly width: number;
  public readonly height: number;
  public readonly cells: number[];

  constructor(lines: string[]) {
    this.width = lines[0].length;
    this.height = lines.length;
    this.cells = lines.join('').split('').map(value => Number.parseInt(value, 10));
  }

  public getXY(index: number): [number, number] {
    return [
      index % this.width,
      Math.floor(index / this.width),
    ];
  }

  public getCellAt(x: number, y: number): number | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.cells[this.width * y + x];
  }

  public setCellAt(x: number, y: number, value: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error('Cannot set cell out of bounds...');
    }
    this.cells[this.width * y + x] = value;
  }

  public getNeighboursOf(x: number, y: number) {
    return [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 },
    ].filter(n => this.getCellAt(n.x, n.y) !== undefined);
  }
}

export class Day09 implements Day<Grid, number> {
  transformInput(lines: string[]): Grid {
    return new Grid(lines);
  }

  getAnswers = () => ({
    exampleA: 15,
    a: 528,
    exampleB: 1134,
    b: 920448,
  })

  private isLowPoint (grid: Grid, x: number, y: number) {
    const neighbours = grid.getNeighboursOf(x, y).map(n => grid.getCellAt(n.x, n.y)!);
    return grid.getCellAt(x, y)! < Math.min(...neighbours);
  };

  solutionA(grid: Grid): number {
    return grid.cells
      .filter((_, index) => this.isLowPoint(grid, ...grid.getXY(index)))
      .reduce((acc, v) => acc + v + 1, 0);
  }

  private floodBasin(grid: Grid, startX: number, startY: number): number {
    grid.setCellAt(startX, startY, 9);
    const open = [{ x: startX, y: startY }];
    let basinSize = 0;
    while (open.length > 0) {
      // Add the next cell of the open list to the basin
      const { x, y } = open.pop()!;
      basinSize += 1;

      // Add all neighbors that are not 9, to the open list, and set them to 9
      const toAdd = grid.getNeighboursOf(x, y).filter(position => grid.getCellAt(position.x, position.y)! < 9);
      toAdd.forEach(({ x, y }) => grid.setCellAt(x, y, 9));
      open.push(...toAdd);
    }
    return basinSize;
  }

  solutionB(grid: Grid): number {
    return grid.cells
      .map((_, index) => index)
      .filter((index) => this.isLowPoint(grid, ...grid.getXY(index)))
      .map(index => this.floodBasin(grid, ...grid.getXY(index)))
      .sort((a, b) => a - b)
      .slice(-3)
      .reduce((acc, v) => acc * v, 1);
  }
}
