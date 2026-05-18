import Mathf from "../../Common/Mathf";
import store from "./store";

export default class Turn {

    turn: number = 0;
    isGoal: boolean = false;
    isStartShot: boolean = false;
    isShot: boolean = false;
    isOut: boolean = false;

    clear() {
        this.turn = 0;
        this.isGoal = false;
        this.isStartShot = false;
        this.isShot = false;
        this.isOut = false;
    }

    startTurn() {
        this.isStartShot = false;
        this.isShot = false;
        this.isOut = false;
        this.isGoal = false;

        this.turn++;

        const range = store.level.getRandomLevel(this.turn);
        store.minX = range.minX;
        store.maxX = range.maxX;
        store.minY = range.minY;
        store.maxY = range.maxY;

        const wlevel = store.level.getRandomWLevel(this.turn);
        const dir = Mathf.randomInt(0, 2) === 0 ? 1 : -1;
        store.wind = wlevel * dir;

        store.isPerfect = true;
    }
}