// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Sprite, CCInteger, Mask, UITransform, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

export const SPRITE_ANIMATION_FRAME_TIME = 0.16;
export enum SPRITE_ANIMATION_STATE {
    play,
    end
}

@ccclass('SpriteAnimation')
export default class SpriteAnimation extends Component {
    @property(Sprite)
    private sprite: Sprite = null;
    @property
    private spriteWidth: number = 0;
    @property
    private spriteHeight: number = 0;
    @property
    private spriteRow: number = 0;
    @property
    private spriteColumn: number = 0;
    @property({type : CCInteger})
    public animationFrames : number[] = [];
    @property
    private defaultAnimation: number = 0;
    @property
    private loop: boolean = true;

    private mask: Mask | null = null;
    spriteNum: number = 0;
    playTime: number = 0;
    playAnimationNum: number = -1;
    animationStartPoint: number = -1;
    state: SPRITE_ANIMATION_STATE = SPRITE_ANIMATION_STATE.play;
    uiTransform: UITransform = null;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.playAnimation(this.defaultAnimation, this.loop);
        this.uiTransform = this.sprite.node.getComponent(UITransform);
        this.mask = this.node.addComponent(Mask);
    }
    start() {

    }
    update(dt) {
        if (this.state === SPRITE_ANIMATION_STATE.play) {
            this.playTime += dt;

            if (this.playTime > this.animationFrames[this.playAnimationNum] * SPRITE_ANIMATION_FRAME_TIME) {
                this.playTime -= this.animationFrames[this.playAnimationNum] * SPRITE_ANIMATION_FRAME_TIME;
                if (!this.loop) {
                    this.state = SPRITE_ANIMATION_STATE.end;
                }
            }
        }

        if (this.state === SPRITE_ANIMATION_STATE.play) {
            this.spriteNum = Math.floor(this.playTime / SPRITE_ANIMATION_FRAME_TIME);
            const x = -((this.spriteNum + this.animationStartPoint) % this.spriteRow * this.spriteWidth + this.spriteWidth / 2) + this.uiTransform.width / 2;
            const y = Math.floor((this.spriteNum + this.animationStartPoint) / this.spriteRow) * this.spriteHeight - this.spriteHeight * (this.spriteColumn - 1) / 2;
            this.sprite.node.setPosition(x, y);
        }
    }
    playAnimation(animationNumber: number, isLoop: boolean) {
        if (this.playAnimationNum === animationNumber && this.loop === isLoop) {
            return;
        }
        this.state = SPRITE_ANIMATION_STATE.play;
        this.loop = isLoop;
        this.playAnimationNum = animationNumber;
        this.playTime = 0;
        this.animationStartPoint = this.animationFrames.filter((_, idx) => idx < animationNumber).reduce((sum, frame) => sum + frame, 0);
    }
}