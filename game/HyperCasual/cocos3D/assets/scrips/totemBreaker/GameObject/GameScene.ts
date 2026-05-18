import { Component, _decorator, Node, JsonAsset, Tween, tween, KeyCode, input, Input, EventKeyboard, game } from "cc";
import { GameState } from "../data/const";
import store from "../data/store";
import BlockManager from "../GameObject/BlockManager";
import GameManager from "../GameObject/GameManager";
import Gauge from "../GameObject/Gauge";
import Player from "../GameObject/Player";
import InputManager from "../../Common/InputManager";
import { ScoreManager } from "../../Common/ScoreManager";
import { ResultPopup } from "../../Common/ResultPopup";
import { GameStartIntro } from "../../Common/GameStartIntro";
import { GameEndOutro } from "../../Common/GameEndOutro";
import { ANIMATION_CONFIG } from "../../Common/Constants";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_TotemBreaker } from "../../Common/SoundNames";

const { ccclass, property } = _decorator

@ccclass
export default class GaemScene extends Component {

    @property(Player) private player: Player = null;
    @property(Gauge) private guage: Gauge = null;
    @property(Node) private guide: Node = null;
    @property(Node) private item: Node = null;
    @property(BlockManager) private blockManager: BlockManager = null;
    @property(JsonAsset) private tileDataJson: JsonAsset = null;
    @property(JsonAsset) private gradeToIndexJson: JsonAsset = null;
    @property(JsonAsset) private generateTotemInfoJson: JsonAsset = null;

    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    @property(ResultPopup)
    private result: ResultPopup = null;

    private dirs: number[] = [];
    private tween: Tween<Node> = null;

    onLoad() {
        store.tileData = this.tileDataJson.json;
        store.gradeToIndex = this.gradeToIndexJson.json;
        store.generateTotemInfo = this.generateTotemInfoJson.json;
    }

    start() {
        GameManager.instance.node.on('gameOver', this.onGameOver.bind(this));
        GameManager.instance.node.on('miss', this.onMiss.bind(this));
        GameManager.instance.node.on('timeout', this.onTimeout.bind(this));
        GameManager.instance.node.on('item', this.onItem.bind(this));

        input.on(Input.EventType.KEY_DOWN, this.down, this);
    }

    private down(event: EventKeyboard) {

        if (store.state === GameState.wait || store.state === GameState.action) {
            if (event.keyCode == KeyCode.ARROW_LEFT) {
                this.dirs.push(1);
            }

            if (event.keyCode == KeyCode.ARROW_RIGHT) {
                this.dirs.push(-1);
            }
        }
    }

    onStartGame() {
        store.clear();

        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }

        game.canvas.focus();
        this.dirs.length = 0;

        ScoreManager.instance.setScore(0);
        this.blockManager.clear();
        this.player.reset();
        this.guage.reset();

        this.startIntro.play();

        this.scheduleOnce(() => {
            store.state = GameState.intro;
            this.blockManager.introDown();
            this.guage.onIntro();
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    onGameOver(score: number) {
        this.endOutro.play();
        this.scheduleOnce(() => {
            this.result.open(ScoreManager.instance.Score);
        }, ANIMATION_CONFIG.END_FX.TIME);
    }

    onMiss() {
        this.player.miss();
        store.state = GameState.gameover;
        SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Die);
        GameManager.instance.gameOver();
    }

    onTimeout() {
        this.player.timeOut();
        store.state = GameState.gameover;
        SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Die);
        GameManager.instance.gameOver();
    }


    update(dt) {
        this.updateInput();
        this.updateDir();
        this.updateState();

        if (store.state === GameState.wait || store.state === GameState.action) {

            if (store.freezeTime > 0) {
                store.freezeTime -= dt;
                if (store.freezeTime <= 0) {
                    store.freezeTime = 0;
                }
            }
            else {
                store.gauge -= dt * store.config.minusGaugePerSecond;
                if (store.gauge <= 0) {
                    store.gauge = 0;
                    GameManager.instance.timeout();
                }
            }
        }

    }

    updateInput() {
        if (store.state === GameState.wait || store.state === GameState.action) {
            if (InputManager.instance.getPointerDown()) {
                const pos = InputManager.instance.getPointerPosition();

                const dir = pos.x > InputManager.instance.ScreenWidthHalf() ? -1 : 1;
                this.dirs.push(dir);
            }

        }
    }

    updateDir() {
        if (store.state === GameState.wait && this.dirs.length) {
            if (this.guide.active) {
                this.guide.active = false;
            }

            const dir = this.dirs.shift();
            this.player.hit(-dir);
            const data = this.blockManager.hit(dir);
            if (data) {
                this.guage.onUp();
            }
        }
    }

    updateState() {
        switch (store.state) {
            case GameState.intro: {
                if (!this.blockManager.isDown()) {
                    store.state = GameState.wait;
                    this.guide.active = true;
                }
                break;
            }
            case GameState.action: {
                if (!this.blockManager.isDown()) {
                    store.state = GameState.wait;
                }
                break;
            }
        }
    }

    onItem() {
        this.item.active = true;
    }
}
