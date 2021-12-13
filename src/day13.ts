import { Day } from './day';

interface Point { x: number, y: number }
interface Bounds { min: Point, max: Point }
interface Fold { direction: 'x' | 'y', distance: number }
interface Instructions {
  points: Point[];
  folds: Fold[];
}

class Paper {
  private readonly points: ReadonlyMap<string, Point>;

  constructor(points: Point[]) {
    this.points = new Map<string, Point>(points.map(point => [`${point.x},${point.y}`, point]));
  }

  public fold(fold: Fold): Paper {
    const doFold = (n: number, distance: number) => n > distance ? distance - (n - distance) : n;
    const points: Point[] = [];
    this.points.forEach(point => {
      const x = (fold.direction === 'x') ? doFold(point.x, fold.distance) : point.x;
      const y = (fold.direction === 'y') ? doFold(point.y, fold.distance) : point.y;
      points.push({ x, y });
    });
    return new Paper(points);
  }

  public getNumberOfPoints(): number {
    return this.points.size;
  }

  public toString(): string {
    const bounds: Bounds = Array.from(this.points.values()).reduce((bounds, point): Bounds => {
      return {
        min: {
          x: Math.min(bounds.min.x, point.x),
          y: Math.min(bounds.min.y, point.y),
        },
        max: {
          x: Math.max(bounds.max.x, point.x),
          y: Math.max(bounds.max.y, point.y),
        },
      };
    }, { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } } as Bounds);
    let result = '';
    for (let y = bounds.min.y; y <= bounds.max.y; y += 1) {
      for (let x = bounds.min.x; x <= bounds.max.x; x += 1) {
        result += this.points.has(`${x},${y}`) ? '#' : '.';
      }
      result += '\n';
    }
    return result;
  }
}

export class Day13 implements Day<Instructions, number> {
  private static FoldPrefix = 'fold along ';
  transformInput(lines: string[]): Instructions {
    const points: Point[] = [];
    const folds: Fold[] = [];
    lines.forEach(line => {
      if (line.startsWith(Day13.FoldPrefix)) {
        const [dir, dis] = line.substr(Day13.FoldPrefix.length).split('=');
        folds.push({
          direction: dir as 'x' | 'y',
          distance: Number.parseInt(dis, 10),
        });
      }
      if (line.includes(',')) {
        const [x, y] = line.split(',');
        points.push({
          x: Number.parseInt(x, 10),
          y: Number.parseInt(y, 10),
        });
      }
    });
    return { points: points, folds };
  }

  getAnswers = () => ({
    exampleA: 17,
    a: 631,
    exampleB: 0, // prints: O
    b: 0, // prints: EFLFJGRF
  })

  solutionA(instructions: Instructions): number {
    return new Paper(instructions.points).fold(instructions.folds[0]).getNumberOfPoints();
  }

  solutionB(instructions: Instructions): number {
    let paper = new Paper(instructions.points);
    instructions.folds.forEach(fold => {
      paper = paper.fold(fold);
    });
    console.info(paper.toString());
    return 0;
  }
}
