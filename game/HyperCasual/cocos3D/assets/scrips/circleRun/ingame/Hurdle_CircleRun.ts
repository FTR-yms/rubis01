// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

import { HurdleAnimation, HurdleHitTime } from "../utilScript/Config_CircleRun";
import SpriteAnimation, { SPRITE_ANIMATION_STATE } from "../framework/SpriteAnimation";

@ccclass('Hurdle_CircleRun')
export default class Hurdle_CircleRun extends Component {
    @property(sp.Skeleton) 
    crash: sp.Skeleton = null;

    @property(SpriteAnimation)
    spriteAnimation: SpriteAnimation = null;

    isHit: boolean = false;
    hitTime: number = 0;
    angle: number = 0;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.crash.setCompleteListener(() => {
            this.crash.node.active = false;
        });
    }
    start() {
        this.reset();
    }
    update(dt) {
        if (this.isHit) {
            if (this.spriteAnimation.state === SPRITE_ANIMATION_STATE.end) {
                this.hitEnd();
            }
        }
    }
    reset() {
        this.idle();

        this.crash.node.active = false;

        this.isHit = false;
        this.hitTime = 0;
    }
    idle() {
        this.spriteAnimation.playAnimation(HurdleAnimation.idle, true);
    }
    hit() {
        this.isHit = true;
        this.hitTime = 0;

        this.spriteAnimation.playAnimation(HurdleAnimation.hit, false);

        this.crash.node.active = true;
        this.crash.setAnimation(0, "hit", false);
    }
    hitEnd() {
        this.node.active = false;
    }
}