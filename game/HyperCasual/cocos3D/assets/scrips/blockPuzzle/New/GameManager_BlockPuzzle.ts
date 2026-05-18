import { _decorator, Component, Node, sp } from 'cc';
import { Singleton } from '../../Common/Singleton';
import { GameStartIntro } from '../../Common/GameStartIntro';
import { GameEndOutro } from '../../Common/GameEndOutro';
import { ResultPopup } from '../../Common/ResultPopup';
import { FlowManager_BlockPuzzle } from './FlowManager_BlockPuzzle';
import { ANIMATION_CONFIG } from '../../Common/Constants';
import { TimeManager_BlockPuzzle } from './TimeManager_BlockPuzzle';
import { ScoreManager } from '../../Common/ScoreManager';
const { ccclass, property } = _decorator;

export enum GameState {
    None,
    Start,
    Over,
    Result,
}

@ccclass('GameManager_BlockPuzzle')
export class GameManager_BlockPuzzle extends Singleton<GameManager_BlockPuzzle>() {
    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    @property(ResultPopup)
    private result: ResultPopup = null;

    @property(sp.Skeleton)
    private character: sp.Skeleton = null;

    public state: GameState = GameState.None;

    public intro() {
        this.startIntro.play();

        this.character.setAnimation(0, "intro", false);
        this.character.addAnimation(0, "idle_look_ground", true);

        this.scheduleOnce(() => {
            FlowManager_BlockPuzzle.instance.gameStart();
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    public startGame() {
        this.state = GameState.Start;
    }

    public endGame() {
        this.state = GameState.Over;
    }

    public outro() {
        this.endOutro.play();

        this.scheduleOnce(() => {
            this.result.open(ScoreManager.instance.Score);
        }, ANIMATION_CONFIG.END_FX.TIME);
    }
}

