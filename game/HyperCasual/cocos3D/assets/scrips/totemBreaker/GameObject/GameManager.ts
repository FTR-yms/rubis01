import { _decorator, Component, Game, tween, Vec3 } from "cc";
import store from "../data/store";
import { Singleton } from "../../Common/Singleton";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_TotemBreaker } from "../../Common/SoundNames";

const { ccclass, property } = _decorator;

@ccclass
export default class GameManager extends Singleton<GameManager>() {

    gameOver() {
        this.node.emit('gameOver', store.score);
    }

    addGauge(gauge: number) {
        store.gauge += gauge;
        if (store.gauge >= store.config.maxCurseGauge) {
            store.gauge = store.config.maxCurseGauge;
        }
    }

    addItem(freezeTime: number) {
        store.freezeTime += freezeTime;
        SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Item);
        this.node.emit('item');
    }

    miss() {
        this.node.emit('miss');
    }

    timeout() {
        this.node.emit('timeout');
    }
}
