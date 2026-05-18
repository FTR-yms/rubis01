import { _decorator, Component, Node, UITransform } from "cc";
import { GameState, } from "../data/const";

import store from "../data/store";

const { ccclass, property } = _decorator;

@ccclass
export default class Gauge extends Component {

    @property(Node) private gauge: Node = null;
    @property(Node) private freeze: Node = null;
    @property(Node) private fx: Node = null;

    private time: number = 0;
    private maxTime: number = 0.5;

    private uiTransform: UITransform = null;

    start() {
        this.uiTransform = this.gauge.getComponent(UITransform);
    }

    reset() {
        this.uiTransform.width = 0;
        this.freeze.active = false;
        this.fx.active = false;
    }

    onIntro() {
        this.maxTime = store.config.introGaugeTime;
        this.time = 0;
    }

    onUp() {
        this.fx.active = true;
    }

    update(dt) {
        if (store.state === GameState.none || store.state === GameState.gameover) {
            return;
        }
        else if (store.state === GameState.intro) {
            this.time += dt;
            if (this.time <= this.maxTime) {
                this.uiTransform.width = 360 * (this.time / this.maxTime);
            }
            else {
                this.uiTransform.width = 360;
            }
        }
        else {
            this.uiTransform.width = 360 * (store.gauge / store.config.maxCurseGauge);
        }

        this.freeze.active = store.freezeTime > 0;
    }
}
