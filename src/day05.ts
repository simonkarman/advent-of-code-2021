import { ClassicDay } from './day';

class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  toString(): string {
    return `${this.x},${this.y}`;
  }

  static parse(input: string): Point {
    const splits = input
      .split(',')
      .map(value => Number.parseInt(value, 10));
    return new Point(splits[0], splits[1]);
  }
}

class Bounds {
  constructor(
    public readonly min: Point,
    public readonly max: Point,
  ) {}

  static findOverlap(boundA: Bounds, boundB: Bounds): Bounds | undefined {
    if (boundA.min.x > boundB.max.x || boundA.max.x < boundB.min.x) {
      return undefined;
    }
    if (boundA.min.y > boundB.max.y || boundA.max.y < boundB.min.y) {
      return undefined;
    }
    return new Bounds(
      new Point(
        Math.max(boundA.min.x, boundB.min.x),
        Math.max(boundA.min.y, boundB.min.y),
      ),
      new Point(
        Math.min(boundA.max.x, boundB.max.x),
        Math.min(boundA.max.y, boundB.max.y),
      ),
    );
  }

  toPointArray(): Point[] {
    const result: Point[] = [];
    for (let x = this.min.x; x <= this.max.x; x += 1) {
      for (let y = this.min.y; y <= this.max.y; y += 1) {
        result.push(new Point(x, y));
      }
    }
    return result;
  }
}

class Line {
  private readonly bounds: Bounds;
  constructor(public readonly from: Point, public readonly to: Point) {
    this.bounds = new Bounds(
      new Point(Math.min(from.x, to.x), Math.min(from.y, to.y)),
      new Point(Math.max(from.x, to.x), Math.max(from.y, to.y)),
    );
  }

  static findIntersections(lineA: Line, lineB: Line): Point[] {
    const overlap = Bounds.findOverlap(lineA.bounds, lineB.bounds);
    if (overlap === undefined) {
      return [];
    }
    if (!lineA.isDiagonal() && !lineB.isDiagonal()) {
      return overlap.toPointArray();
    } else {
      const pointsA = lineA.toPointArray().map(point => point.toString());
      const pointsB = lineB.toPointArray().map(point => point.toString());
      return pointsA.filter(pointA => pointsB.includes(pointA)).map(Point.parse);
    }
  }

  isDiagonal(): boolean {
    return this.from.x !== this.to.x && this.from.y != this.to.y;
  }

  private toPointArrayCache: Point[] | undefined;
  toPointArray(): Point[] {
    if (this.toPointArrayCache === undefined) {
      if (this.isDiagonal()) {
        this.toPointArrayCache = [];
        const xDirection = this.from.x < this.to.x ? 1 : -1;
        const yDirection = this.from.y < this.to.y ? 1 : -1;
        const width = this.bounds.max.x - this.bounds.min.x;
        for (let step = 0; step <= width; step += 1) {
          this.toPointArrayCache.push(new Point(this.from.x + xDirection * step, this.from.y + yDirection * step));
        }
      } else {
        this.toPointArrayCache = this.bounds.toPointArray();
      }
    }
    return this.toPointArrayCache;
  }
}

export class Day05 implements ClassicDay<Line> {
  transformInput(lines: string[]): Line[] {
    return lines.map(line => {
      const points = line.split(' -> ').map(Point.parse);
      return new Line(points[0], points[1]);
    });
  }

  getAnswers = () => ({
    exampleA: 5,
    a: 4421,
    exampleB: 12,
    b: 18674,
  })

  static findIntersections(lines: Line[]): Point[] {
    const intersections = new Map<string, Point>();
    for (let lineAIndex = 0; lineAIndex < lines.length; lineAIndex += 1) {
      for (let lineBIndex = lineAIndex + 1; lineBIndex < lines.length; lineBIndex += 1) {
        Line.findIntersections(lines[lineAIndex], lines[lineBIndex])
          .forEach(intersection => intersections.set(intersection.toString(), intersection));
      }
    }
    return Array.from(intersections.values());
  }

  solutionA(input: Line[]): number {
    const lines = input.filter(line => !line.isDiagonal());
    return Day05.findIntersections(lines).length;
  }

  solutionB(lines: Line[]): number {
    return Day05.findIntersections(lines).length;
  }
}
