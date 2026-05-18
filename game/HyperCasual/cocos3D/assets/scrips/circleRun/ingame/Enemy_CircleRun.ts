// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, sp } from 'cc';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_CircleRun } from '../../Common/SoundNames';
const { ccclass, property } = _decorator;

@ccclass('Enemy_CircleRun')
export default class Enemy_CircleRun extends Component {
    @property(Node)
    private runAnimation: Node = null;

    @property(Node)
    private gameOverAnimation: Node = null;

    @property(sp.Skeleton) dust: sp.Skeleton = null;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.runAnimation.active = true;
        this.gameOverAnimation.active = false;

        this.dust.setCompleteListener(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Over_2);
            this.dust.node.active = false;
        });
        this.dust.node.active = false;
    }
    
    refresh() {
        this.runAnimation.active = true;
        this.gameOverAnimation.active = false;
        this.dust.node.active = false;
    }

    catch() {
        SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Over_1);
        this.dust.node.active = true;
        this.dust.setAnimation(0, 'eff_dust_01', false);

        this.scheduleOnce(() => {
            this.runAnimation.active = false;
            this.gameOverAnimation.active = true;
        }, 0.2);
    }
}