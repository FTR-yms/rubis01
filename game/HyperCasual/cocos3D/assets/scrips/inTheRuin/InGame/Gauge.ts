import { _decorator, Component, Node, Label, UITransform, SpriteFrame, Sprite, Animation, TextAsset, Vec3, sp } from 'cc';
import { GameState, } from '../FrameWork/Config';
import Store from '../FrameWork/Store';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_InTheRuin } from '../../Common/SoundNames';
import { EventManager } from '../../Common/EventManager';
const { ccclass, property } = _decorator;

@ccclass('Gauge')
export class Gauge extends Component {

    @property({ type: TextAsset })
    textData: TextAsset = null;

    @property(Label)
    timer: Label = null;

    @property(Node)
    gague: Node = null;

    @property(SpriteFrame)
    warning: SpriteFrame = null;

    @property(SpriteFrame)
    normal: SpriteFrame = null;

    @property(Node)
    fire: Node = null;

    @property(Node)
    spotLight: Node = null;

    isWarning: boolean = false;
    curTime: number = 0;
    gaugeSize: { x: number, y: number } = { x: 0, y: 0 };

    maxTime: number = 0;
    warningTime: number = 0;
    extraTime: number = 0;

    onLoad() {
        this.loadData();
    }

    start() {
        EventManager.instance.on("addTime", () => { this.addTime() })
        
        this.curTime = this.maxTime;
        this.gaugeSize.x = this.getComponent(UITransform).contentSize.width;
        this.gaugeSize.y = this.getComponent(UITransform).contentSize.height
    }

    loadData() {
        let Data = this.textData.text.split('\r\n', this.countString(this.textData.text));

        this.maxTime = parseFloat(Data[2].slice(Data[2].search(',') + 1, Data[2].length));
        this.warningTime = parseFloat(Data[3].slice(Data[3].search(',') + 1, Data[3].length));
        this.extraTime = parseFloat(Data[4].slice(Data[4].search(',') + 1, Data[4].length));
    }

    countString(text: string): number {
        let length = text.length;
        let counting = 1;
        for (let i = 0; i < length; ++i) {
            if (text.charAt(i) == '\n')
                ++counting;
        }
        return counting;
    }

    update(deltaTime: number) {
        if (Store.gameState == GameState.PLAY) {
            if (this.curTime <= 0) {
                SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.TIMEOVER);
                Store.gameState = GameState.TIMEOVER;
                //this.fire.getComponent(Animation).play("out");
                this.fire.getComponent(sp.Skeleton).setAnimation(0, "fire_out", false);

                //this.fire.getComponent(sp.Skeleton).loop = false;
                //this.fire.getComponent(sp.Skeleton).animation = "fire_out";
                this.curTime = 0;
                //this.spotLight.setPosition(new Vec3(0,0,0));
                //this.spotLight.active = false;
                return;
            }

            this.curTime -= deltaTime;
            this.timer.string = Math.round(this.curTime).toString();
            this.getComponent(UITransform).setContentSize(this.gaugeSize.x * this.curTime / this.maxTime, this.gaugeSize.y);
            if (this.curTime < this.warningTime) {
                if (!this.isWarning) {
                    SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.WARNING);
                    this.gague.getComponent(Sprite).spriteFrame = this.warning;
                    //this.fire.getComponent(Animation).play("warning");
                    this.fire.getComponent(sp.Skeleton).setAnimation(0, "fire_warning", true);
                    //this.fire.getComponent(sp.Skeleton).loop = true;
                    //this.fire.getComponent(sp.Skeleton).animation = "fire_warning";
                    this.isWarning = true;
                }
            }
            else {
                if (this.isWarning) {
                    this.gague.getComponent(Sprite).spriteFrame = this.normal;
                    //this.fire.getComponent(Animation).play("normal");
                    this.fire.getComponent(sp.Skeleton).setAnimation(0, "fire_normal", true);
                    // this.fire.getComponent(sp.Skeleton).loop = true;
                    // this.fire.getComponent(sp.Skeleton).animation = "fire_normal";
                    this.isWarning = false;
                }
            }
        }
    }

    reset() {
        //this.fire.getComponent(Animation).play("normal");
        this.fire.getComponent(sp.Skeleton).setAnimation(0, "fire_normal", true);
        // this.fire.getComponent(sp.Skeleton).loop = true;
        // this.fire.getComponent(sp.Skeleton).animation = "fire_normal";
        this.gague.getComponent(Sprite).spriteFrame = this.normal;
        this.isWarning = false;
        this.curTime = this.maxTime;
        this.timer.string = Math.round(this.curTime).toString();
        this.getComponent(UITransform).setContentSize(this.gaugeSize.x * this.curTime / this.maxTime, this.gaugeSize.y);
    }

    addTime() {
        this.curTime += this.extraTime;
        if (this.curTime > this.maxTime) {
            this.curTime = this.maxTime;
        }
    }
}


