// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Color, Component, Graphics, UIOpacity, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import InputManager from "../../Common/InputManager";
import Mathf from '../../Common/Mathf';

@ccclass('Tail')
export default class Tail extends Component {
    @property(Graphics) private graphics: Graphics = null;
    @property(UIOpacity)
    private ballOpacity: UIOpacity = null;
    private maxCount: number = 20;
    private points: Vec2[] = [];
    private count: number = 0;
    private idx: number = 0;

    private v1: Vec2 = new Vec2();
    private v2: Vec2 = new Vec2();
    private v3: Vec2 = new Vec2();

    private t: number = 0;


    onLoad() {
        for (let i = 0; i < this.maxCount; i++) {
            this.points[i] = new Vec2();
        }
    }

    onEnable() {
        this.idx = 0;
        this.count = 0;
        this.clear();

        // const pos = this.node.position;
        // this.points[this.count].x = pos.x;
        // this.points[this.count].y = pos.y;
        // this.count++;
    }

    onDisable() {
        this.clear();
    }

    clear() {
        this.graphics.clear();
    }


    lateUpdate(dt) {
        this.t += dt;
        if (this.t < 0.01) return;
        this.clear();
        this.t = 0;

        if (this.count < this.maxCount) {
            const pos = this.node.position;
            this.points[this.count].x = pos.x;
            this.points[this.count].y = pos.y;
            this.count++;
        }
        else {
            const pos = this.node.position;
            this.points[this.idx].x = pos.x;
            this.points[this.idx].y = pos.y;
            this.idx = (this.idx + 1) % this.maxCount;
        }

        let prevPos: Vec2 = new Vec2();
        let vertexs: number[] = [];

        for (let i = 0; i < this.count; i++) {
            const idx = ((this.idx - 1) + this.count - i) % this.count;
            const pos = this.points[idx];
            if (i > 0) {
                this.v1 = this.v1.set(pos);
                this.v1 = this.v1.subtract(prevPos);
                this.v1 = this.v1.normalize();

                if (this.v1.x === 0 && this.v1.y === 0) {

                }
                else {
                    this.left(this.v1, this.v2);
                    this.right(this.v1, this.v3);

                    this.v2 = this.v2.multiplyScalar(20 - (i * 2) * 0.3);
                    this.v3 = this.v3.multiplyScalar(20 - (i * 2 - 1) * 0.3);

                    this.v2 = this.v2.add(pos);
                    this.v3 = this.v3.add(pos);

                    vertexs.push(this.v2.x);
                    vertexs.push(this.v2.y);

                    vertexs.push(this.v3.x);
                    vertexs.push(this.v3.y);
                }
            }
            if (prevPos.x !== pos.x || prevPos.y !== pos.y) {
                prevPos.set(pos);
            }
        }

        for (let i = 0; i < vertexs.length - 4; i += 4) {
            const x = vertexs[i];
            const y = vertexs[i + 1];
            const x2 = vertexs[i + 2];
            const y2 = vertexs[i + 3];
            const x3 = vertexs[i + 4];
            const y3 = vertexs[i + 5];
            const x4 = vertexs[i + 6];
            const y4 = vertexs[i + 7];

            const opacity = Mathf.clamp((255 * (1 - i / vertexs.length)) * this.ballOpacity.opacity / 255, 0, 255);

            this.graphics.fillColor = new Color(255, 255, 255, opacity);
            this.graphics.moveTo(x, y);
            this.graphics.lineTo(x2, y2);
            this.graphics.lineTo(x4, y4);
            this.graphics.lineTo(x3, y3);
            this.graphics.lineTo(x, y);
            this.graphics.fill();

        }
    }

    left(vec: Vec2, target: Vec2) {
        target.x = -vec.y;
        target.y = vec.x;
    }

    right(vec: Vec2, target: Vec2) {
        target.x = vec.y;
        target.y = -vec.x;
    }
}