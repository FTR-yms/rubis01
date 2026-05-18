import { _decorator, Component, Node } from 'cc';
import { FormatLabel } from '../../Common/FormatLabel';
import Mathf from '../../Common/Mathf';
import store from '../data/store';
import { Singleton } from '../../Common/Singleton';
import GameMnager from './gameManager';
const { ccclass, property } = _decorator;

@ccclass('TimeManager_Basketball')
export class TimeManager_Basketball extends Singleton<TimeManager_Basketball>() {
    @property(FormatLabel)
    timeLabel: FormatLabel = null;

    maxTime: number = 99;
    private _time: number = 0;
    public get time() {
        return this._time;
    }
    private set time(value) {
        this._time = Mathf.clamp(Math.floor(value), 0, 99);

        if (value <= 0) {
            store.isTimeOver = true;
        } else {
            store.isTimeOver = false;
        }

        const timeString =
            this._time < 10 ? "0" + this._time.toString() : this._time.toString();

        this.timeLabel.setFormat(timeString);
    }

    start() {
        GameMnager.Instance.node.on("readyGame", this.clear.bind(this));
        GameMnager.Instance.node.on("startGame", this.gameStart.bind(this));
        GameMnager.Instance.node.on("gameOver", this.gameOver.bind(this));
        GameMnager.Instance.node.on("addTime", this.addTime.bind(this));

        this.maxTime = store.config.maxTime;
    }
    addTime(time: number) {
        this.time += time;
    }
    
    setInitTime() {
        if (store.isTimeOver == true) {
            return;
        }

        this.time -= 1;
    }

    clear() {
        this.time = store.config.startTime;
    }

    gameStart() {
        this.unscheduleAllCallbacks();
        this.schedule(this.setInitTime, 1);
    }

    gameOver() {
        this.unscheduleAllCallbacks();
    }
}


