// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Graphics, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import Rim from "../gameObject/rim";
import Ball from "../gameObject/ball";
import Player from "../gameObject/player";
import Parabola, { IParabolaData } from "../data/parabola";
import store from "../data/store";
import InputManager from "../../Common/InputManager";
import physics from "./physics";
import GameMnager from "./gameManager";
import Util from "../../Common/Util";
import Score from "../gameObject/score";
import Perfect from "../gameObject/perfect";
import GuideLine from "../gameObject/guideLine";
import { SoundManager } from "../../Common/SoundManager";
import Mathf from '../../Common/Mathf';
import { SfxNames_Basketball } from '../../Common/SoundNames';
import { TimeManager_Basketball } from './TimeManager_Basketball';

@ccclass('GameCtrl')
export default class GameCtrl extends Component {
    @property(Rim) rim: Rim = null;
    @property(Ball) ball: Ball = null;
    @property(GuideLine) guideLine: GuideLine = null;
    @property(Player) player: Player = null;

    private isDown: boolean = false;
    private startPos: Vec2 = new Vec2();
    private parabola: Parabola = new Parabola();

    private parabolaData: IParabolaData;

    // private isPerfect : boolean = false;

    private outBounds: {
        minX: number,
        maxX: number,
        minY: number,
        maxY: number
    } = {
            minX: -740 / 2 + 100,
            maxX: 740 / 2 + 100,
            minY: -960 / 2,
            maxY: 960 / 2
        }


    onLoad() {
        this.startPos.x = store.config.startPosX;
        this.startPos.y = store.config.startPosY;

        this.ball.node.on('collisionStart', (e) => {

            this.ball.onBounce(e.otherBody.label);

            if (e.otherBody.label === 'rim') {
                store.isPerfect = false;
                this.ball.onBounceRim();
                this.rim.shake();
            }
            else if (e.otherBody.label === 'wall') {
                GameMnager.Instance.out();
                SoundManager.instance.playSfxOneShot(SfxNames_Basketball.Ball);
            }
        });

        this.player.node.on('shoot', this.shoot.bind(this));

        GameMnager.Instance.node.on('startGame', this.startGame.bind(this));
        GameMnager.Instance.node.on('gameOver', this.gameOver.bind(this));
        

    }

    start() {
        // this.rim.setPosition( 0, 200 );
        // this.rim.shake();

    }

    startGame() {
        this.ball.node.active = false;
    }

    gameOver() {
        this.guideLine.node.active = false;
    }

    checkGoal() {
        if (!store.isActiveBall || this.ball.getIsCheck()) return;
        const rimLine = this.rim.getLine();
        const ballLine = this.ball.getLine();
        if (Mathf.intersectLines(rimLine[0], rimLine[1], ballLine[0], ballLine[1]) < 0) {
            this.onGoal();
        }
    }

    onGoal() {

        //1초 기다리고 턴증가
        let s = store.isPerfect ? 3 : 1;
        let t = store.isPerfect ? 6 : 3

        if (store.isFireBall) {
            s *= store.config.fireBallBonus;
            // this.setFireGauge( 0 );
            store.isFireBall = false;
        }


        this.ball.setIsCheck(false);

        Score.Instance.addScore(this.rim.node.position.x, this.rim.node.position.y, s);
        GameMnager.Instance.addScore(s);
        GameMnager.Instance.addTime(t);

        //사운드
        if (store.isPerfect) {
            Perfect.Instance.init(this.rim.node.position.x, this.rim.node.position.y);
            SoundManager.instance.playSfxOneShot(SfxNames_Basketball.PerfectGoal);
        } else {
            SoundManager.instance.playSfxOneShot(SfxNames_Basketball.Goal);
        }

        GameMnager.Instance.goal();
        GameMnager.Instance.updatefireball();
    }

    checkOut() {
        const ballPos = this.ball.node.position;
        if (this.outBounds.minX > ballPos.x
            || this.outBounds.maxX < ballPos.x
            || this.outBounds.minY > ballPos.y) {
            //아웃
            // this.turn.onOut();
            this.ball.node.active = false;
            GameMnager.Instance.out();
        }
    }

    update(dt) {
        this.checkGoal();
        this.checkOut();
        this.updateInput();
    }

    updateInput() {
        if (!GameMnager.Instance.isInput() || store.isGameOver) {
            return;
        }

        if (InputManager.instance.getPointerDown()) {
            this.isDown = true;
        }
        else if (InputManager.instance.getPointerStay()) {

            if (this.isDown) {
                const pos = InputManager.instance.getPointerPosition();

                const data = this.parabola.getParabola(this.startPos.x, this.startPos.y, pos.x, pos.y);

                this.guideLine.draw(this.startPos.x, this.startPos.y, data);

            }
        }
        else if (InputManager.instance.getPointerUp()) {

            if (this.isDown) {
                this.isDown = false;
                const pos = InputManager.instance.getPointerPosition();

                this.parabolaData = this.parabola.getParabola(this.startPos.x, this.startPos.y, pos.x, pos.y);
                this.guideLine.node.active = false;

                this.player.shot();
                GameMnager.Instance.startShot();
            }
        }
    }

    shoot() {
        GameMnager.Instance.shot();
        this.ball.shot(this.startPos.x, this.startPos.y, this.parabolaData.vx, this.parabolaData.vy);
    }

}