import { _decorator, Component, Node, Button, EventHandler } from 'cc';
import { Singleton } from '../../Common/Singleton';
import Util from '../../Common/Util';
const { ccclass, property } = _decorator;

@ccclass('FlowManager_BlockPuzzle')
export class FlowManager_BlockPuzzle extends Singleton<FlowManager_BlockPuzzle>() {

    @property(EventHandler)
    private gameIntroEvent: EventHandler[] = [];

    @property(EventHandler)
    private gameStartEvent: EventHandler[] = [];

    @property(EventHandler)
    private overEvent: EventHandler[] = [];

    @property(EventHandler)
    private resultEvent: EventHandler[] = [];

    @property(EventHandler)
    private gameRestartEvent: EventHandler[] = [];

    public static readonly gameIntroStr: string = "gameIntro";
    public static readonly gameStartStr: string = "GameStart";
    public static readonly gameOverStr: string = "GameOver";
    public static readonly gameResultStr: string = "Result";
    public static readonly gameReStartStr: string = "GameRestart";

    public onLoad() {
        super.onLoad();

        this.node.on(FlowManager_BlockPuzzle.gameStartStr, this.gameStart.bind(this));
        this.node.on(FlowManager_BlockPuzzle.gameOverStr, this.gameOver.bind(this));
        this.node.on(FlowManager_BlockPuzzle.gameResultStr, this.gameResult.bind(this));
        this.node.on(FlowManager_BlockPuzzle.gameReStartStr, this.gameRestart.bind(this));
    }

    protected start() {
        this.gameIntro();
    }

    public gameIntro() {
        Util.callEventHandlers(this.gameIntroEvent);
    }

    public gameStart() {
        Util.callEventHandlers(this.gameStartEvent);
    }

    public gameOver() {
        Util.callEventHandlers(this.overEvent);
    }

    public gameResult() {
        Util.callEventHandlers(this.resultEvent);
    }

    private gameRestart() {
        Util.callEventHandlers(this.gameRestartEvent);
    }
}

