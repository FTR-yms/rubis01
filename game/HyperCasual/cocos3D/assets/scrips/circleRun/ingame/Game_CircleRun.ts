// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, director, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

import {
    FeverFirstScore,
    FeverNeedScore,
    FeverSpeed,
    FeverTime,
    GameEvent,
    GameId,
    GameState,
    MaxSpeed,
    ResultSceneLoadTime
} from "../utilScript/Config_CircleRun";
import Store from "../utilScript/Store_CircleRun";
import Board from "./Board_CircleRun";
import { EventManager } from "../../Common/EventManager";
import ImageFont from '../../Common/ImageFont';
import { ResultPopup } from '../../Common/ResultPopup';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_CircleRun } from '../../Common/SoundNames';

@ccclass('Game_CircleRun')
export default class Game_CircleRun extends Component {
    @property(Board)
    private board: Board = null;
    @property(ImageFont)
    private scoreLabel: ImageFont = null;
    @property(Node)
    private blockInput: Node = null;
    @property(sp.Skeleton)
    private gameEffect: sp.Skeleton = null;
    @property(ResultPopup)
    private result: ResultPopup = null;

    private _score: number = 0;
    set score(score: number) {
        this._score = score;

        this.scoreLabel.setText(this._score.toString());

        // if (!Store.isFever && this._score > this.feverCheckScore) {
        //     this.feverStart();
        // }
    }
    get score() {
        return this._score;
    }
    feverCheckScore: number = 0;
    feverTime: number = 0;
    isApiEnd: boolean = false;
    isDelayEnd: boolean = false;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {


        this.gameEffect.setCompleteListener((entry) => {
            const animationName = entry.animation.name;

            if (animationName === '01_ready_start') {
                this.gameStart();
            }
        });
    }
    start() {
        EventManager.instance.on(GameEvent.gameStart, () => {
            this.gameReady();
        });

        EventManager.instance?.on(GameEvent.scoreUp, (score: number) => {
            this.score += score;
        });

        EventManager.instance?.on(GameEvent.gameOver, () => {
            this.gameOver();
        });

        EventManager.instance.on(GameEvent.feverStart, () => {
            this.feverStart();
        });

        EventManager.instance.emit(GameEvent.gameStart);
    }
    update(dt) {
        if (Store.isFever) {
            this.feverTime += dt;

            if (this.feverTime > FeverTime) {
                this.feverEnd();
            }
        }
    }

    gameReady() {
        Store.gameState = GameState.ready;

        SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Start_1);
        this.scheduleOnce(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Start_1);
        }, 1);
        this.scheduleOnce(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Start_1);
        }, 2);

        this.scheduleOnce(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Start_2);
        }, 3);

        this.blockInput.active = true;
        this.board.refresh();

        this.gameEffect.node.active = true;
        this.gameEffect.setAnimation(0, '01_ready_start', false);
    }

    gameStart() {
        Store.gameState = GameState.start;

        // Http.get('/start', { game_id: GameId, user_id: Store.user_id }, (result) => {
        //     if (result.isError) {
        //         return;
        //     }

        //     Store.token = result.token;
        // });

        this.score = 0;
        this.scoreLabel.node.active = true;
        this.board.gameStart();

        this.feverCheckScore = FeverFirstScore;
        this.feverTime = 0;

        this.gameEffect.node.active = false;
        this.blockInput.active = false;
    }

    gameRestart() {
        this.result.close();
        EventManager.instance.emit(GameEvent.gameStart);
    }

    gameOver() {
        Store.gameState = GameState.end;
        Store.lastScore = this.score;
        this.scoreLabel.node.active = false;
        this.blockInput.active = true;

        this.gameEffect.node.active = true;
        const track = this.gameEffect.setAnimation(0, '02_gameover', false);
        this.board.gameOver();
        this.scheduleOnce(() => {
            this.delayEnd();
        }, track.animationEnd);
    }
    feverStart() {
        Store.isFever = true;
        Store.speed = FeverSpeed;
        Store.feverCount += 1;
        this.board.feverStart();
        this.feverTime = 0;
        SoundManager.instance.playSfx(SfxNames_CircleRun.Fever);
        SoundManager.instance.pauseBgm();
    }
    feverEnd() {
        this.feverCheckScore = this.score + FeverNeedScore;
        Store.isFever = false;
        Store.speed = MaxSpeed;
        this.board.feverEnd();
        SoundManager.instance.stopSfx(SfxNames_CircleRun.Fever);
        SoundManager.instance.playBgm();
    }
    apiEnd() {
        this.isApiEnd = true;
        if (this.isDelayEnd) {
            Store.isPlaying = false;
            director.loadScene('result');
        }
    }
    delayEnd() {
        this.isDelayEnd = true;
        Store.isPlaying = false;
        this.gameEffect.node.active = false;
        this.result.open(this.score);
        // director.loadScene('result');
    }
}