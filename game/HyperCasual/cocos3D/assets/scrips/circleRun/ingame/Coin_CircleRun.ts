// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

import { EventManager } from "../../Common/EventManager";
import SpriteAnimation from "../framework/SpriteAnimation";
import { GameEvent, IdCoinRatio } from "../utilScript/Config_CircleRun";
import Store from "../utilScript/Store_CircleRun";

@ccclass('Coin_CircleRun')
export default class Coin_CircleRun extends Component {
    @property(sp.Skeleton) coinEffect: sp.Skeleton = null;
    @property(SpriteAnimation) coinSpriteAnimation: SpriteAnimation = null;
    isFever: boolean = false;
    angle: number = 0;
    distanceLevel: number = 0;
    isId: boolean = false;
    isPoped: boolean = false;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.coinEffect.setCompleteListener(() => {
            this.coinEffect.node.active = false;
            EventManager.instance?.emit(GameEvent.coinPooling, this);
        });

        this.coinSpriteAnimation.animationFrames[2] = 1;
    }
    start() {
        this.reset(Store.isFever);
    }
    //    // update (dt) {}
    reset(isFever: boolean) {
        this.coinEffect.node.active = false;
        this.coinSpriteAnimation.node.active = true;
        this.isPoped = false;
        this.isId = false;

        this.isFever = isFever;
        if (isFever) {
            // this.coinSpriteAnimation.playAnimation( 1, true );
            this.coinSpriteAnimation.playAnimation(0, true);
        }
        else {
            if (Store.idCoinSpawnable && Math.random() < IdCoinRatio) {
                this.coinSpriteAnimation.playAnimation(2, true);
                this.isId = true;
                Store.idCoinSpawnable = false;
            }
            else {
                this.coinSpriteAnimation.playAnimation(0, true);
            }
        }
    }
    pop() {
        this.isPoped = true;
        this.coinEffect.node.active = true;
        this.coinSpriteAnimation.node.active = false;
        if (this.isId) {
            Store.idCoinCount += 1;
            this.coinEffect.setAnimation(0, 'coin_bonus_02', false);
        }
        else {
            Store.goldCoinCount += 1;

            this.coinEffect.setAnimation(0, 'coin_bonus_01', false);
        }
    }
}