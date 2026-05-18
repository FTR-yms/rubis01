import { _decorator, Component, Vec2, game, director, input, Input, EventKeyboard, EventTouch, KeyCode, Label, Node, sp } from 'cc';
import Board from "./Board_2048";
import { GameState } from "../util/Config_2048";
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_2048 } from '../../Common/SoundNames';
import { ResultPopup } from '../../Common/ResultPopup';
import { ANIMATION_CONFIG } from '../../Common/Constants';
import { GameStartIntro } from '../../Common/GameStartIntro';
import { GameEndOutro } from '../../Common/GameEndOutro';

const { ccclass, property } = _decorator;

@ccclass('Game_2048')
export default class Game_2048 extends Component {
    @property(Board)
    board: Board = null!;

    @property(Label)
    scoreNode: Label = null!;

    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    @property(ResultPopup)
    result: ResultPopup = null;

    private state: GameState = GameState.loading;
    private _score: number = 0;

    set score(value: number) {
        this._score = value;
        this.scoreNode.string = this._score.toString();
    }

    get score() {
        return this._score;
    }

    private previousPointerPosition: Vec2 | null = null;

    private _pause: boolean = false;
    get pause(): boolean {
        return this._pause;
    }
    set pause(value: boolean) {
        this._pause = value;
        if (value) {
            director.pause();
        } else {
            director.resume();
        }
    }

    onLoad() {
        this.state = GameState.ready;
    }

    protected onEnable() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        this.scoreNode.string = "0";
        this.gameStart();
    }

    /** 키보드 입력 처리 */
    private onKeyDown(event: EventKeyboard) {
        if (this.state === GameState.gameOver && event.keyCode === KeyCode.SPACE) {
            this.gameStart();
            return;
        }

        if (this.state !== GameState.start) return;

        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT: this.handleMove('left'); break;
            case KeyCode.ARROW_UP: this.handleMove('top'); break;
            case KeyCode.ARROW_RIGHT: this.handleMove('right'); break;
            case KeyCode.ARROW_DOWN: this.handleMove('bottom'); break;
        }
    }

    /** 터치 스와이프 판정 */
    private onTouchStart(event: EventTouch) {
        if (this.state !== GameState.start) return;
        this.previousPointerPosition = event.getLocation();
    }

    private onTouchEnd(event: EventTouch) {
        if (this.state !== GameState.start || !this.previousPointerPosition) return;

        const currentPos = event.getLocation();
        const distance = Vec2.distance(this.previousPointerPosition, currentPos);

        if (distance >= 30) {
            const xDiff = currentPos.x - this.previousPointerPosition.x;
            const yDiff = currentPos.y - this.previousPointerPosition.y;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                xDiff < 0 ? this.handleMove('left') : this.handleMove('right');
            } else {
                yDiff < 0 ? this.handleMove('bottom') : this.handleMove('top');
            }
        }
        this.previousPointerPosition = null;
    }

    /** * 공통 이동 핸들러
     * 보드에서 객체 참조가 변경되거나 합쳐지면 즉시 다음 단계를 수행합니다.
     */
    private handleMove(dir: 'left' | 'right' | 'top' | 'bottom') {
        const res = this.board.move(dir);

        // 이동이나 합치기가 발생했다면 (데이터가 변했다면)
        if (res.result) {
            SoundManager.instance.playSfxOneShot(SfxNames_2048.Move);

            this.score += res.score;
            this.endTurn();
        }
    }

    /** 턴 종료: 즉시 블록 생성 및 상태 체크 */
    endTurn() {
        // 1. 즉시 새 블록 생성 (board.move에서 이미 map의 빈칸이 null로 확정됨)
        this.board.addBlock();

        // 2. 게임 오버 체크
        if (this.board.checkGameOver) {
            this.gameOver();
        }
    }

    gameStart() {
        this.reset();

        SoundManager.instance.playSfxOneShot(SfxNames_2048.GameStart);
        this.startIntro.play();

        this.scheduleOnce(() => {
            this.board.addBlock();
            this.board.addBlock();
            this.state = GameState.start;
            this.pause = false;
            this.score = 0;

            game.canvas?.focus();
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    reset() {
        this.board.reset();
        this._score = 0;
    }

    gameOver() {
        this.state = GameState.gameOver;
        this.board.gameOver();
        console.log("Game Over! Score:", this.score);
        this.endOutro.play();
        this.scheduleOnce(() => {
            this.result.open(this.score);
        }, ANIMATION_CONFIG.END_FX.TIME);
    }
}