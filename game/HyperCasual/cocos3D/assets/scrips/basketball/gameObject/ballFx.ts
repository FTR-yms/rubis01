// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallFx')
export default class BallFx extends Component {
    @property(SpriteFrame) spriteFrames: SpriteFrame[] = [];

    private sprite: Sprite = null;

    private idx: number = 0;
    private time: number = 0;
    private maxTime: number = 0.02;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sprite = this.node.getComponent(Sprite);
    }

    start() {
        this.node.active = false;
    }

    onEnable() {
        this.time = 0;
        this.idx = 0;
        this.sprite.spriteFrame = this.spriteFrames[this.idx];
    }

    update(dt) {

        this.time += dt;
        if (this.time > this.maxTime) {
            this.idx++;

            if (this.idx >= this.spriteFrames.length) {
                this.node.active = false;
                return;
            }
            this.sprite.spriteFrame = this.spriteFrames[this.idx];
        }

    }
}
