import { Vec2 } from "cc";

export interface IParabolaData {
    vx: number;
    vy: number;
    v: number;
    a: number;
    g: number;
    t: number;
}

export default class Parabola {

    private data: IParabolaData = {
        vx: 0,
        vy: 0,
        v: 0,
        a: 0,
        g: 0,
        t: 0
    }

    private minY: number = 50;
    private g: number = 100;
    private h: number = 200;
    private startVector: Vec2 = new Vec2();
    private dirVector: Vec2 = new Vec2();

    constructor() {
    }

    getParabola(x1: number, y1: number, x2: number, y2: number): IParabolaData {

        this.startVector.x = x1;
        this.startVector.y = y1;
        this.dirVector.x = x2 - this.startVector.x;
        this.dirVector.y = y2 - this.startVector.y;
        // this.dirVector.subtract(this.startVector);

        const g = this.g;
        let h = this.dirVector.y + this.h;
        if (h < this.minY) h = this.minY;
        const w = this.dirVector.x;

        const v0y = Math.sqrt(2 * g * h);
        const t = v0y / g;
        const v0x = (w / t);
        const v = Math.sqrt(v0x * v0x + v0y * v0y);
        const cosA = w / (v * t);
        const a = Math.acos(cosA);

        const correct = 0.0535;  //1
        const vx = v0x * correct;
        const vy = v0y * correct;

        this.data.vx = vx;
        this.data.vy = vy;
        this.data.v = v;
        this.data.a = a;
        this.data.g = g;
        this.data.t = t;

        return this.data;
    }
}