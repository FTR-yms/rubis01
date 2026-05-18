import { _decorator, Component, Label, Node, sp } from 'cc';
import { JELLY_COLOR } from '../config';
const { ccclass, property } = _decorator;

@ccclass('Mission')
export class Mission extends Component {
    @property(sp.Skeleton) missionRenderer: sp.Skeleton = null;
    @property(Label) needCount: Label = null;

    gameStart() {
        this.missionRenderer.node.active = true;
        this.missionRenderer.setAnimation(0, "idle", true);
    }
    
    setInfo(color: number, count: number) {
        this.missionRenderer.setSkin(JELLY_COLOR[color]);
        this.setCount(count);
    }

    reset() {
        this.needCount.string = "0";
        this.missionRenderer.node.active = false;
    }

    setCount(count: number) {
        this.needCount.string = count.toString();

        if (count > 0) {
            this.hit();
        }
    }

    private hit() {
        this.missionRenderer.setAnimation(0, "get", false);
        this.missionRenderer.addAnimation(0, "idle", true);

    }

    public complete(color: number, count: number) {
        let i = this.missionRenderer.setAnimation(0, "complete", false);

        this.scheduleOnce(() => {
            this.setInfo(color, count);
            this.missionRenderer.addAnimation(0, "idle", true);
        }, i.animationEnd);
    }
}