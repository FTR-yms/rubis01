import { _decorator, Color, Component, sp, Sprite } from "cc";
import { GameState } from "../data/const";

import store from "../data/store";

const { ccclass, property } = _decorator;

@ccclass
export default class Player extends Component {

    @property(sp.Skeleton) spine: sp.Skeleton = null;
    @property(Sprite) curse: Sprite = null;

    reset() {
        this.node.setScale(-1, this.node.scale.y);
        this.spine.setAnimation(0, 'start', false);
        this.spine.addAnimation(0, 'idle', true);
    }

    hit(dir: number) {
        this.node.setScale(dir, this.node.scale.y);
        this.spine.setAnimation(0, 'attack', false);
        this.spine.addAnimation(0, 'idle', true);
    }

    timeOut() {
        this.spine.setAnimation(0, 'die', false);
    }

    miss() {
        this.spine.setAnimation(0, 'die', false);
    }

    update(dt) {
        const color = this.curse.color;
        if (store.state === GameState.wait || store.state === GameState.action) {
            this.curse.color = new Color(color.r, color.g, color.b, 255 - 255 * (store.gauge / store.config.maxCurseGauge));
        }
        else {
            this.curse.color = new Color(color.r, color.g, color.b, 0);
        }
    }
}
