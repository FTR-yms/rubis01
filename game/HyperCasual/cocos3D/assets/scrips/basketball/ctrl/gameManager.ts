// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import store from "../data/store";
import Turn from "../data/turn";
import physics from "./physics";

@ccclass('GameManager')
export default class GameMnager extends Component {
    static Instance: GameMnager = null;

    private turn: Turn = new Turn();

    onLoad() {
        GameMnager.Instance = this;
    }

    start() {

    }

    claer() {
        store.clear();
        this.turn.clear();
        this.node.emit('updateScore', store.score);
        this.node.emit('updateFireball');
    }

    readyGame() {
        this.claer();
        this.node.emit('readyGame');
        store.isGameStart = false;
    }

    startGame() {
        this.claer();
        this.node.emit('startGame');
        store.isGameStart = true;
        this.startTurn();
    }

    addScore(score: number) {
        store.score += score;
        this.node.emit('updateScore', store.score);
    }

    addTime(time: number) {
        this.node.emit('addTime', time);
    }

    startTurn() {
        this.turn.startTurn();
        this.node.emit('startTurn');
        physics.world.gravity.x = store.wind * store.config.windPower;
    }

    gameOver() {
        store.isGameOver = true;
        this.node.emit('gameOver', store.score);
    }

    updatefireball() {
        if (store.isPerfect) {
            store.currentFireBallCount++;
            if (store.currentFireBallCount > store.config.fireBallCount) {
                store.currentFireBallCount %= store.config.fireBallCount;
            }

            if (store.currentFireBallCount >= store.config.fireBallCount) {
                store.isFireBall = true;
            }
        }
        else {
            store.currentFireBallCount = 0;
        }

        this.node.emit('updateFireball');
    }

    isInput() {
        return !this.turn.isStartShot;
    }

    startShot() {
        this.turn.isStartShot = true;
    }

    shot() {
        this.turn.isShot = true;
    }

    out() {

        if (!this.turn.isShot || this.turn.isOut) {
            return;
        }

        this.turn.isOut = true;

        this.turn.isOut = true;
        if (!this.turn.isGoal && !store.isGameOver) {
            this.turn.clear();
            store.isPerfect = false;
            this.updatefireball();
            this.node.emit('out');
        }
    }

    goal() {
        this.turn.isGoal = true;
        this.node.emit('goal');
    }

    protected update(dt: number) {
        if (this.turn.isShot == false
            && this.turn.isStartShot == false
            && store.isTimeOver == true
            && store.isGameOver == false) {
            this.gameOver();
        }
    }
}