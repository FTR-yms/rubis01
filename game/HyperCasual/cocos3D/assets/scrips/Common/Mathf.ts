import { lerp } from "cc";

class Mathf {
  static randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
    // return cc..randomRangeInt ( min, max );
  }

  static randomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static randomBoolean(): boolean {
    const r = Mathf.randomInt(0, 2);
    return r === 0;
  }

  static lerp(start: number, end: number, t: number) {
    return lerp(start, end, t);
  }

  static distance(
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): number {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }

  static clamp(v: number, min: number, max: number): number {
    return v < min ? min : v > max ? max : v;
  }

  static localizeTime(date) {
    return (
      date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000
    );
  }

  static intersectLines(
    point1,
    point2,
    point3,
    point4,
    x3?,
    y3?,
    x4?,
    y4?
  ): number {
    if (x3) {
      point1 = { x: point1, y: point2 };
      point2 = { x: point3, y: point4 };
      point3 = { x: x3, y: y4 };
      point4 = { x: x4, y: y4 };
    }

    const den =
      (point4.y - point3.y) * (point2.x - point1.x) -
      (point4.x - point3.x) * (point2.y - point1.y);
    if (den === 0) {
      return 0;
    }

    const ua =
      ((point4.x - point3.x) * (point1.y - point3.y) -
        (point4.y - point3.y) * (point1.x - point3.x)) /
      den;
    const ub =
      ((point2.x - point1.x) * (point1.y - point3.y) -
        (point2.y - point1.y) * (point1.x - point3.x)) /
      den;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return den;
    } else return 0;
  }
}

export default Mathf;