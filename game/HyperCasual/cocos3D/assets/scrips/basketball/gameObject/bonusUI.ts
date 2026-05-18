// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, lerp, sp, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";
import store from "../data/store";
import Mathf from '../../Common/Mathf';

@ccclass('BonusUI')
export default class BonusUI extends Component {

    static Instance: BonusUI = null;
    @property(Sprite) private gauge: Sprite = null;
    @property(sp.Skeleton) private on: sp.Skeleton = null;

    private maxWidth: number = 484;

    private time: number = 0;
    private maxTime: number = 0.2;
    private isAction: boolean = false;
    private startValue: number = 0;
    private endValue: number = 0;
    private prevValue: number = 0;

    onLoad() {
        BonusUI.Instance = this;
    }

    start() {
        GameMnager.Instance.node.on('updateFireball', this.onUpdateFireball.bind(this));
    }

    onUpdateFireball() {
        this.setValue(store.currentFireBallCount, store.config.fireBallCount);
    }

    setValue(crt: number, max: number) {
        const t = crt / max;
        this.on.setAnimation(0, 'idle', true);
        // this.startValue = this.gauge.spriteFrame.width;
        // this.endValue = this.maxWidth * t;
        // if (this.startValue > this.endValue) {
        //     this.startValue = 0;
        // }
        this.time = 0;
        this.isAction = true;
        this.prevValue = this.startValue;
        this.startValue = crt;
        this.endValue = max;
    }

    update(dt) {
        if (this.isAction) {
            this.time += dt;
            let t = this.time / this.maxTime;
            if (t >= 1) {
                this.isAction = false;
                if (this.endValue === this.maxWidth) {
                    // this.on.node.active = true;
                    this.on.setAnimation(0, 'full', true);
                }
            }

            this.gauge.fillRange = (lerp(this.prevValue / this.endValue, this.startValue / this.endValue, t));
        }
    }
}
