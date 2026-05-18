import { _decorator, clamp, Component, Label, lerp, Node, Sprite, SpriteFrame, UITransform, Animation } from 'cc';
import { ActionWarningTime, MaxActionTime } from '../config';
import { EventManager } from '../../Common/EventManager';
import { Singleton } from '../../Common/Singleton';
const { ccclass, property } = _decorator;

@ccclass('TimeGauge')
export class TimeGauge extends Singleton<TimeGauge>() {

    @property(Animation)
    private animation: Animation = null;

    @property(Label)
    private label: Label = null;

    private actionTimer: number = 0;

    private warning: boolean = false;

    private gameOver: boolean = false;
    private isStarted: boolean = false;

    private timeRule: number[] = [10, 5, 0];


    public get ActionTimerValue(): number {
        for (let i = 0; i < this.timeRule.length; ++i) {
            if (this.actionTimer > this.timeRule[i]) {
                return i;
            }
        }

        return -1;
    }


    protected start(): void {
        this.actionTimer = MaxActionTime;
    }

    protected update(dt: number): void {

        if (!this.isStarted || this.gameOver) {
            return;
        }

        this.gameOverCheck();
        this.chooseGraphics();

        this.actionTimer -= dt;

        this.label.string = Math.round(this.actionTimer).toString();

    }

    public gameStart() {
        this.isStarted = true;
        this.gameOver = false;
    }

    public gameOverCheck() {
        if (!this.gameOver && this.actionTimer <= 0) {
            this.isStarted = false;
            this.gameOver = true;
            EventManager.instance.node.emit('gameOver');
        }
    }

    public changeEnd() {
        this.animation.play('idle');
    }

    public reset() {
        this.actionTimer = MaxActionTime;
        this.label.string = Math.round(this.actionTimer).toString();
        this.chooseGraphics();
    }

    private chooseGraphics() {
        if (this.actionTimer < ActionWarningTime) {
            if (this.warning == false) {
                this.animation.play("change");
                // this.gaugeRenderer.spriteFrame = this.sprites[1];
                this.warning = true;
            }
        }
        else {
            if (this.warning == true) {
                this.animation.play("return");
                // this.gaugeRenderer.spriteFrame = this.sprites[0];
                this.warning = false;
            }
        }
    }
}


