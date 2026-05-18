// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shake')
export default class Shake extends Component {
    private maxTime: number = 0.6;
    private time: number = 0;
    private radToDeg: number = 180 / Math.PI;

    start() {

    }

    onEnable() {
        this.time = 0;
        this.updateAngle();
    }

    onDisable() {
        this.node.angle = 0;
    }

    update(dt) {
        this.time += dt;

        if (this.time >= this.maxTime) {
            this.time = this.maxTime;
            this.node.angle = 0;
            this.enabled = false;
            return;
        }

        this.updateAngle();
    }

    updateAngle() {
        const t = this.time / this.maxTime;

        if (t < 1 / 3) {
            this.node.angle = this.radToDeg * (Math.sin(t * 8) * 0.06);
        }
        else if (t < 2 / 3) {
            this.node.angle = this.radToDeg * (Math.sin(t * 8) * 0.03);
        }
        else {
            this.node.angle = this.radToDeg * (Math.sin(t * 8) * 0.01);
        }
    }
}