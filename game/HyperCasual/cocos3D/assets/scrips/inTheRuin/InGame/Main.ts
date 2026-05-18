import { _decorator, Component, Node, tween, Vec3, Tween, Label, instantiate, Prefab, TextAsset, director, AudioSource } from 'cc';
import { CANVAS_SIZE, DEFAULT_STAIR_POSITION, DEFAULT_STARTPOINT_POSITION, GameState, ITEM_DISTANCE, STAIR_MAX_POINT, STAIR_SIZE } from '../FrameWork/Config';
import { EventManager } from '../../Common/EventManager';
import { Gauge } from './Gauge';
import { Item } from './Item';
import { Pool, PoolKey } from '../FrameWork/Pool';
import { Stair } from './Stair';
import Store from '../FrameWork/Store';
import { SpotLight } from './SpotLight';
import { ScoreManager } from '../../Common/ScoreManager';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_InTheRuin } from '../../Common/SoundNames';
import { ResultPopup } from '../../Common/ResultPopup';
import { GameStartIntro } from '../../Common/GameStartIntro';
import { GameEndOutro } from '../../Common/GameEndOutro';
import { ANIMATION_CONFIG } from '../../Common/Constants';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property({ type: TextAsset })
    textData: TextAsset = null;

    @property(Node)
    gauge: Node = null;

    @property(SpotLight)
    spotLight: SpotLight = null;

    @property(ResultPopup)
    result: ResultPopup = null;

    @property(GameStartIntro)
    private startIntro: GameStartIntro = null;

    @property(GameEndOutro)
    private endOutro: GameEndOutro = null;

    private stair: Node[] = [];
    private isStair: boolean = true;
    private background: Node[][] = [];
    private item: Node[] = [];

    private moveX: number = 0;
    private moveY: number = 0;
    private player: Node = null;
    private score: number = 0;

    private itemCycle: number = 0;
    private passStair: number = 0;

    private minCoolTime: number = 0;
    private maxCount: number = 0;
    private passCount: number = 0;

    onLoad() {
        console.log('load');
        EventManager.instance.on("CreatePlayer", () => { this.createPlayer() });
        EventManager.instance.on("StepUp", (step: number) => { this.stepUp(step) });
        EventManager.instance.on("GameOver", () => { this.gameover() });
        EventManager.instance.on("ReStart", () => { this.restart() });

        this.loadData();
    }

    start() {
        this.itemCycle = Math.floor(Math.random() * this.maxCount) + this.minCoolTime;
        this.preLoad();
        this.intro();
    }

    intro() {
        this.startIntro.play();
        this.scheduleOnce(() => {
            this.createPlayer();
            Store.gameState = GameState.PLAY;
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    update(deltaTime: number) {
        for (let i = 0; i < this.item.length;) {
            if (this.item[i].getComponent(Item).Dead) {
                this.item[i].getComponent(Item).returnItem();
                this.item.splice(i, 1);
            }
            else {
                ++i;
            }
        }
    }

    loadData() {
        let Data = this.textData.text.split('\r\n', this.countString(this.textData.text));

        this.minCoolTime = parseFloat(Data[0].slice(Data[0].search(',') + 1, Data[0].length));
        this.maxCount = parseFloat(Data[1].slice(Data[1].search(',') + 1, Data[1].length));
    }

    countString(text: string): number {
        let length = text.length;
        let counting = 0;
        for (let i = 0; i < length; ++i) {
            if (text.charAt(i) == '\n')
                ++counting;
        }
        return counting;
    }

    checkBackGround() {
        if (this.moveY > CANVAS_SIZE.height * 2) {
            let array = this.background.shift();
            for (let i = 0; i < array.length; ++i) {
                Tween.stopAllByTarget(array[i]);
                let pos = this.background[this.background.length - 1][i].position;
                array[i].setPosition(pos.x, pos.y + CANVAS_SIZE.height);
            }
            this.background.push(array);

            this.moveY = this.moveY - CANVAS_SIZE.height;
        }

        if (this.moveX > CANVAS_SIZE.width * 2) {
            for (let i = 0; i < this.background.length; ++i) {
                let node = this.background[i].shift();
                Tween.stopAllByTarget(node);
                let pos = this.background[i][this.background[i].length - 1].position;
                node.setPosition(pos.x + CANVAS_SIZE.width, pos.y);
                this.background[i].push(node);
            }

            this.moveX = this.moveX - CANVAS_SIZE.width;
        }
    }

    createStair(length: number = 0) {
        let rand = Math.floor(Math.random() * 2);
        if (!this.isStair || (rand == 1)) {
            if (0 === length) {
                length = this.stair.length - 1;
            }

            let obj = Pool.Instance.getObject(PoolKey.stair);

            let x = DEFAULT_STAIR_POSITION.x + STAIR_SIZE.x * length;
            let y = DEFAULT_STAIR_POSITION.y + STAIR_SIZE.y / 2 * length;

            obj.setPosition(x, y, 0);
            let item = this.createItem();
            if (item) {
                item.setParent(this.node.getChildByName("item"));
                item.setPosition(obj.position.x, obj.position.y + ITEM_DISTANCE);
            }
            this.stair.push(obj);
            this.isStair = true;
        }
        else {
            this.isStair = false;
        }
    }

    resetStair() {
        while (this.stair.length != 0) {
            let index = 0;
            if (this.stair[index].name == PoolKey.stair) {
                this.stair[index].getComponent(Stair).Pass = false;
            }
            Pool.Instance.returnObject(this.stair[index].name, this.stair.shift());
        }

        let start = Pool.Instance.getObject(PoolKey.startpoint);
        start.setPosition(DEFAULT_STARTPOINT_POSITION.x, DEFAULT_STARTPOINT_POSITION.y, 0);

        this.stair.push(start);

        for (let i = 0; i < STAIR_MAX_POINT; ++i) {
            this.createStair(i);
        }
    }

    preLoad() {
        //background default setting
        for (let i = 0; i < 4; ++i) {
            this.background.push(new Array());
            for (let j = 0; j < 4; ++j) {
                let background = Pool.Instance.getObject(PoolKey.background);
                background.setPosition(-70 + CANVAS_SIZE.width * j, CANVAS_SIZE.height * i);
                this.background[i].push(background);
            }
        }

        //startpoint default setting
        let start = Pool.Instance.getObject(PoolKey.startpoint);
        start.setPosition(DEFAULT_STARTPOINT_POSITION.x, DEFAULT_STARTPOINT_POSITION.y, 0);
        this.stair.push(start);

        //stair default setting
        for (let i = 0; i < STAIR_MAX_POINT; ++i) {
            this.createStair(i);
        }
    }

    stepUp(step: number = 1) {
        this.passCount = 0;
        SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.MOVE);
        //SoundManager.Instance.playSound(soundList.CLICK);

        this.moveX += STAIR_SIZE.x * step;
        this.moveY += STAIR_SIZE.y / 2 * step;

        let pos: Vec3 = new Vec3();

        for (let i = 0; i < step; ++i) {
            this.createStair(STAIR_MAX_POINT + i);
        }

        for (let i = 0; i < this.stair.length;) {
            pos.x = this.stair[i].position.x - STAIR_SIZE.x * step;
            pos.y = this.stair[i].position.y - STAIR_SIZE.y / 2 * step;

            let t = tween(this.stair[i]).to(0.2, { position: pos }).start();
            if (this.stair[i].name == PoolKey.stair) {
                this.addScore(this.stair[i], step);
            }

            if (pos.x + STAIR_SIZE.x * STAIR_MAX_POINT < -(CANVAS_SIZE.width / 2)) {
                t.stop();
                this.stair[i].setPosition(DEFAULT_STAIR_POSITION.x, DEFAULT_STAIR_POSITION.y);
                if (this.stair[i].name == PoolKey.stair) {
                    this.stair[i].getComponent(Stair).Pass = false;
                }
                Pool.Instance.returnObject(this.stair[i].name, this.stair[i]);
                this.stair.shift();
                ++this.passStair;
            }
            else {
                ++i;
            }
        }

        EventManager.instance.emit("upItem", step);

        this.checkBackGround();

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                pos.x = this.background[i][j].position.x - STAIR_SIZE.x * step;
                pos.y = this.background[i][j].position.y - STAIR_SIZE.y / 2 * step;

                tween(this.background[i][j]).to(0.2, { position: pos }).start();
            }
        }
    }

    addScore(stair: Node, step: number) {
        if (this.player.position.x + STAIR_SIZE.x * step >= stair.position.x && !stair.getComponent(Stair).Pass) {
            if (step == 2 && this.passCount == 0) {
                this.score += 100;
                ++this.passCount;
            }
            else if (step == 2 && this.passCount == 1) {
                this.score += 0;
            }
            else {
                this.score += 50;
            }

            stair.getComponent(Stair).Pass = true;

            ScoreManager.instance.setScore(this.score);
            //console.log(this.score);
        }
    }

    createPlayer() {
        this.player = Pool.Instance.getObject(Store.charactor);
        this.player.setParent(this.node.getChildByName("player"));
        this.spotLight.node.active = true;
        this.spotLight.Target = this.player;
    }

    createItem(): Node {
        let obj: Node = null;
        if (this.passStair > this.itemCycle) {
            this.itemCycle = Math.floor(Math.random() * this.maxCount) + this.minCoolTime;
            this.passStair = 0;

            this.item.push(obj = Pool.Instance.getObject(PoolKey.item));
        }
        return obj;
    }

    destoryPlayer() {
        this.player.destroy();
        this.player = null;
        this.spotLight.Target = this.player;
    }

    gameover() {
        this.destoryPlayer();
        this.spotLight.node.setPosition(new Vec3(0, 0, 0));
        this.spotLight.node.active = false;

        ScoreManager.instance.setScore(this.score);

        // this.result.getChildByName("result_score").getComponent(Label).string = this.score.toString();

        while (this.item.length) {
            let item = this.item.shift();
            item.getComponent(Item).returnItem();
        }

        this.passStair = 0;
        this.itemCycle = Math.floor(Math.random() * this.maxCount) + this.minCoolTime;
        // IFrame.Instance.gameOver(this.score);

        this.endOutro.play();
        this.scheduleOnce(() => {
            this.result.open(this.score);
        }, ANIMATION_CONFIG.END_FX.TIME);
    }

    restart() {
        ScoreManager.instance.setScore(0);

        this.gauge.getComponent(Gauge).reset();
        this.resetStair();
        this.score = 0;

        this.startIntro.play();
        this.scheduleOnce(() => {
            this.createPlayer();
            Store.gameState = GameState.PLAY;
        }, ANIMATION_CONFIG.START_FX.TIME);
    }

    gameCountinue() {
        if (Store.gameState = GameState.FALL) {
            this.passCount = 0;
            SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.MOVE);
            //SoundManager.Instance.playSound(soundList.CLICK);

            this.moveX += STAIR_SIZE.x * 1;
            this.moveY += STAIR_SIZE.y / 2 * 1;

            let pos: Vec3 = new Vec3();

            for (let i = 0; i < 1; ++i) {
                this.createStair(STAIR_MAX_POINT + i);
            }

            for (let i = 0; i < this.stair.length;) {
                pos.x = this.stair[i].position.x - STAIR_SIZE.x * 1;
                pos.y = this.stair[i].position.y - STAIR_SIZE.y / 2 * 1;

                let t = tween(this.stair[i]).to(0, { position: pos }).start();

                if (pos.x + STAIR_SIZE.x * STAIR_MAX_POINT < -(CANVAS_SIZE.width / 2)) {
                    t.stop();
                    this.stair[i].setPosition(DEFAULT_STAIR_POSITION.x, DEFAULT_STAIR_POSITION.y);
                    if (this.stair[i].name == PoolKey.stair) {
                        this.stair[i].getComponent(Stair).Pass = false;
                    }
                    Pool.Instance.returnObject(this.stair[i].name, this.stair[i]);
                    this.stair.shift();
                    ++this.passStair;
                }
                else {
                    ++i;
                }
            }

            EventManager.instance.emit("upItem", 1);

            this.checkBackGround();

            for (let i = 0; i < 4; ++i) {
                for (let j = 0; j < 4; ++j) {
                    pos.x = this.background[i][j].position.x - STAIR_SIZE.x * 1;
                    pos.y = this.background[i][j].position.y - STAIR_SIZE.y / 2 * 1;

                    tween(this.background[i][j]).to(0, { position: pos }).start();
                }
            }
        }
        this.gauge.getComponent(Gauge).reset();
        this.spotLight.node.active = true;
        Store.gameState = GameState.PLAY;
        EventManager.instance.emit("CreatePlayer");
    }
}