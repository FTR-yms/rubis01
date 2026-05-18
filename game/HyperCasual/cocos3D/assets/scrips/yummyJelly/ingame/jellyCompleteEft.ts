import { _decorator, Component, Node, sp } from 'cc';
import Following from '../fw/Following';
import { JELLY_COLOR } from '../config';
const { ccclass, property } = _decorator;

@ccclass('jellyCompleteEft')
export class jellyCompleteEft extends Component {
    @property(sp.Skeleton)
    renderer: sp.Skeleton = null;

    following: Following = null;
    onLoad() {
        this.following = this.node.getComponent(Following);
    }
    start() {
        this.renderer.getCurrent(0).trackTime = 1;
    }
    // update(dt) {
    //     if (
    //         this.following.target != null &&
    //         Util.Math.distance({ x: this.node.position.x, y: this.node.position.y }, { x: this.following.target.position.x, y: this.following.target.position.y }) < 5
    //     ) {
    //         EventManager.Instance.node.emit('jellyEat');
    //         this.node.destroy();
    //     }
    // }
    setPosition(x: number, y: number) {
        this.node.setPosition(x, y, 0);
    }
    setTarget(target: Node, color: number) {
        // this.following = this.node.getComponent(Following);
        // this.following.target = target;

        this.renderer.setSkin(JELLY_COLOR[color]);
    }

    setComplete(color: number) {
        this.renderer.setSkin(JELLY_COLOR[color]);

        // const track = this.renderer.setAnimation(0, "complete", false);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.2);
    }

}


