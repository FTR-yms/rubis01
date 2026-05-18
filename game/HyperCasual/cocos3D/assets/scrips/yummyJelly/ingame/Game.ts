import { _decorator, Component, director, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

import { EventManager } from "../..//Common/EventManager";
import { BONUS_SHOT, GAME_STATE, gameState, setGameState } from "../config";
import Shot from "./Shot";
import Score from "./Score";
import Board from "./Board";
import Points from "./Points";
import { Missions } from './Missions';
import { ResultPopup } from '../../Common/ResultPopup';
import { GameStartIntro } from '../../Common/GameStartIntro';
import { GameEndOutro } from '../../Common/GameEndOutro';
import { ANIMATION_CONFIG } from '../../Common/Constants';
import { TimeGauge } from './TimeGauge';

@ccclass('Game')
export default class Game extends Component {
    // @property(Fire) fires: Fire[] = [];
    // @property(Magician) magician: Magician = null;
    @property(Score) score: Score = null;
    @property({ type: Shot }) shot: Shot = null;
    @property({ type: Board }) board: Board = null;
    @property(TimeGauge)
    private timeGauge: TimeGauge = null;
    @property(Missions) missions: Missions = null;

    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    @property(ResultPopup)
    private result: ResultPopup = null;

    em: EventManager;
    private static _instance: Game = null;
    static get Instance(): Game {
        if (!Game._instance) {
            console.log('Game을 찾을 수 없음');
        }
        return Game._instance;
    }
    onLoad() {
        Game._instance = this;
    }
    start() {
        this.em = EventManager.instance;
        this.em.on('gameOver', () => {
            this.gameOver();
        });

        this.intro();
    }
    update(dt) {

    }

    gameRetry() {
        director.loadScene('gameScene');
    }

    reset() {
        setGameState(GAME_STATE.ready)
        this.score.reset();
        // this.shot.reset();
        this.board.reset();
        this.missions.reset();
        this.timeGauge.reset();
    }

    intro() {
        this.startIntro.play();
        this.reset();

        this.scheduleOnce(() => {
            this.gameStart();
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    gameStart() {
        setGameState(GAME_STATE.start)
        console.log('gameStart');
        this.missions.gameStart();
        this.timeGauge.gameStart();
        this.board.gameStart();
        this.score.score = 0;
    }
    gameOver() {
        setGameState(GAME_STATE.end)
        console.log('gameOver');

        this.board.gameOver();

        this.endOutro.play();
        this.scheduleOnce(() => {
            this.result.open(this.score.score);
        }, ANIMATION_CONFIG.END_FX.TIME);

    }
    useShotCount() {
        this.shot.shot -= 1;
    }

    bonusAttack() {
        this.shot.shot += BONUS_SHOT;
    }

    public gameOverCheck() {
        console.log(this.shot.shot);
        if (this.shot.shot == 0) {
            // this.gameOver();
        }
    }
}
