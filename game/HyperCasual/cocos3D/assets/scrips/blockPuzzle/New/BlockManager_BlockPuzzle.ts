import { _decorator, Component, Node, Vec2, Vec3, SpriteFrame, tween, Tween } from 'cc';
import { NormalBlock } from '../Block/NormalBlock';
import { BlockCheckHelper, GameRules } from './BlockCheckHelper';
import store from '../Data/Store';
import { Singleton } from '../../Common/Singleton';
import { FlowManager_BlockPuzzle } from '../New/FlowManager_BlockPuzzle';
import { TimeManager_BlockPuzzle } from '../New/TimeManager_BlockPuzzle';
import { PreviewContainer } from './PreviewContainer';
import { ScoreEft } from '../New/ScoreEft';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_BlockPuzzle } from '../../Common/SoundNames';
import { ScoreManager } from '../../Common/ScoreManager';
const { ccclass, property } = _decorator;


export enum BlockMatchEft {
    None,
    Normal,
    Double,
}

@ccclass('BlockManager_BlockPuzzle')
export class BlockManager_BlockPuzzle extends Singleton<BlockManager_BlockPuzzle>() {

    @property
    private tileWidth: number = 0;

    @property
    private tileHeight: number = 0;

    @property(Vec2)
    private centerSize: Vec2 = new Vec2(0, 0);

    @property(Node)
    private map: Node = null;

    @property(BlockCheckHelper)
    private blockCheckHelper: BlockCheckHelper = null;

    @property(ScoreEft)
    private scoreEft: ScoreEft = null;

    private blockMatchEft: BlockMatchEft = BlockMatchEft.None;

    private tileDatas: Array<NormalBlock> = null;

    private curVec: Vec2 = new Vec2(0, 0);

    private fixVec: Vec3 = new Vec3(22.5, 22.5, 0);

    private renderVec: Vec2 = new Vec2(0, 0);

    private insertAble: boolean = false;

    private matchLine: number = 0;

    private overY: number = 0;
    private eftPos: Vec3 = new Vec3(0, 0, 0);

    private tweenRepeat = tween(this.node).call(this.test.bind(this)).delay(0.15)

    @property(SpriteFrame)
    private testSprite: SpriteFrame = null;

    private Testing() {
        for (let y = 0; y < 6; ++y) {
            for (let x = 0; x < 3; ++x) {
                if (y == 2 && x == 0) {
                    continue;
                }

                if (y == 3 && x == 0) {
                    continue;
                }
                this.TestCreate(x, y);
            }
        }

        for (let x = 3; x < 9; ++x) {
            this.TestCreate(x, 3);
        }
    }

    private TestCreate(checkX, checkY) {
        this.blockCheckHelper.insertData(checkX, checkY);

        let block: Node = PreviewContainer.instance.getInsertBlock(this.testSprite);
        block.setWorldPosition(this.map.worldPosition.x + checkX * store.InsertBlockSize.x + store.InsertBlockSize.x / 2, this.map.worldPosition.y + checkY * store.InsertBlockSize.y + store.InsertBlockSize.y / 2, 0);

        let tileNum = checkY * this.tileHeight + checkX;
        this.tileDatas[tileNum] = block.getComponent(NormalBlock);
    }

    public onLoad() {
        super.onLoad();

        this.createTileData();
        this.blockCheckHelper.initSetting(this.tileWidth, this.tileHeight, this.centerSize);

    }

    // public start(): void {
    //     this.Testing();
    // }

    public reStart() {
        store.level = 0;
        this.matchLine = 0;

        this.createTileData();
        this.blockCheckHelper.initSetting(this.tileWidth, this.tileHeight, this.centerSize);
    }

    public checkInsertAble(vecs: Vec2[]): boolean {
        for (let y = 0; y < this.tileHeight; ++y) {
            for (let x = 0; x < this.tileWidth; ++x) {
                if (this.tileDatas[y * this.tileWidth + x] == null) {
                    if (this.checkEnableInsert(vecs, x, y)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private test() {
        for (let x = 0; x < this.tileWidth; ++x) {
            this.tileDatas[this.overY * this.tileWidth + x]?.gameOver();
        }

        this.overY--;
    }

    public blockGameOver() {
        this.overY = this.tileWidth - 1;

        tween(this.node)
            .repeat(this.tileWidth, this.tweenRepeat)
            .start();

        tween(this.node)
            .delay(0.75)
            .call(() => { FlowManager_BlockPuzzle.instance.gameResult() })
            .start();
    }

    private createTileData(): void {
        if (this.tileDatas != null) {
            this.tileDatas.length = 0;
        }

        this.tileDatas = new Array<NormalBlock>(this.tileWidth * this.tileHeight);
    }

    public checkTilePos(pos: Vec3): boolean {
        let minusPos = pos.subtract(this.map.worldPosition).add(this.fixVec);

        this.curVec.x = Math.round(minusPos.x / store.InsertBlockSize.x) - 1;
        this.curVec.y = Math.round(minusPos.y / store.InsertBlockSize.y) - 1;


        if (this.curVec.x < 0 || this.curVec.y < 0 || this.curVec.x >= this.tileWidth || this.curVec.y >= this.tileHeight) {
            this.insertFail();
            return false;
        }

        return true;
    }

    private checkEnableInsert(vecs: Vec2[], curX: number, curY: number): boolean {
        let standardBlock: Vec2 = vecs[0];

        for (let i = 0; i < vecs.length; ++i) {
            let checkX: number = 0;
            let checkY: number = 0;

            checkX = curX + vecs[i].x - standardBlock.x;
            checkY = curY - vecs[i].y - standardBlock.y;

            if (checkX < 0 || checkY < 0 || checkX >= this.tileWidth || checkY >= this.tileHeight) {
                return false;
            }

            if (this.tileDatas[checkY * this.tileHeight + checkX] != null) {
                return false;
            }
        }

        return true;
    }

    public checkSubTileVec(vecs: Vec2[]): boolean {
        let standardBlock: Vec2 = vecs[0];

        for (let i = 0; i < vecs.length; ++i) {
            let checkX: number = 0;
            let checkY: number = 0;

            checkX = this.curVec.x + vecs[i].x - standardBlock.x;
            checkY = this.curVec.y - vecs[i].y - standardBlock.y;

            if (checkX < 0 || checkY < 0 || checkX >= this.tileWidth || checkY >= this.tileHeight) {
                this.insertFail();
                return false;
            }

            if (this.tileDatas[checkY * this.tileHeight + checkX] != null) {
                this.insertFail();
                return false;
            }
        }

        this.drawPreview(vecs);

        return true;
    }

    public drawPreview(vecs: Vec2[]) {
        if (this.renderVec == this.curVec) {
            return;
        }

        this.insertFail();

        let standardBlock: Vec2 = vecs[0];

        for (let i = 0; i < vecs.length; ++i) {
            let checkX = this.curVec.x + vecs[i].x - standardBlock.x;
            let checkY = this.curVec.y - vecs[i].y - standardBlock.y;

            this.insertAble = true;

            let block = PreviewContainer.instance.getPreViewBlock();
            block.setWorldPosition(this.map.worldPosition.x + checkX * store.InsertBlockSize.x + store.InsertBlockSize.x / 2, this.map.worldPosition.y + checkY * store.InsertBlockSize.y + store.InsertBlockSize.y / 2, 0);

            this.renderVec.set(this.curVec.x, this.curVec.y);
        }
    }

    private insertFail() {
        PreviewContainer.instance.previewClear();
        this.insertAble = false;
    }

    public insertBlock(vecs: Vec2[], spriteFrame: SpriteFrame): boolean {
        if (!this.insertAble) {
            return false;
        }

        PreviewContainer.instance.previewClear();

        let standardBlock: Vec2 = vecs[0];

        for (let i = 0; i < vecs.length; ++i) {
            let checkX = this.curVec.x + vecs[i].x - standardBlock.x;
            let checkY = this.curVec.y - vecs[i].y - standardBlock.y;

            this.blockCheckHelper.insertData(checkX, checkY);

            let block: Node = PreviewContainer.instance.getInsertBlock(spriteFrame);
            block.setWorldPosition(this.map.worldPosition.x + checkX * store.InsertBlockSize.x + store.InsertBlockSize.x / 2, this.map.worldPosition.y + checkY * store.InsertBlockSize.y + store.InsertBlockSize.y / 2, 0);

            let tileNum = checkY * this.tileHeight + checkX;
            this.tileDatas[tileNum] = block.getComponent(NormalBlock);
        }

        this.curVec.x = 0;
        this.curVec.y = 0;

        this.lineCheck();

        return true;
    }

    private lineMathRule(currentLineMacthCount: number) {
        if (currentLineMacthCount >= 2) {
            TimeManager_BlockPuzzle.instance.addTime(15);
            this.blockMatchEft = BlockMatchEft.Double;
        }
        else {
            TimeManager_BlockPuzzle.instance.addTime(5);
            this.blockMatchEft = BlockMatchEft.Normal;
        }

        ScoreManager.instance.addScore(store.timeScore * currentLineMacthCount);
    }

    private levelUpRule() {
        if (store.level < store.levelRule.length) {
            if (store.levelRule[store.level] < this.matchLine) {
                store.level++;
            }
        }
    }

    public eftCheck(gameRule: GameRules) {
        for (let y = 0; y < gameRule.rows.length; ++y) {
            this.eftPos = this.tileDatas[gameRule.rows[y] * this.tileWidth + Math.floor(this.tileWidth / 2)].node.getWorldPosition();
        }

        for (let x = 0; x < gameRule.cols.length; ++x) {
            this.eftPos = this.tileDatas[Math.floor(this.tileHeight / 2) * this.tileWidth + gameRule.cols[x]].node.getWorldPosition();
        }

        for (let x = 0; x < gameRule.center.length; ++x) {
            for (let i = 0; i < this.centerSize.x; ++i) {
                for (let j = 0; j < this.centerSize.y; ++j) {
                    let calc = this.tileWidth * (Math.floor(gameRule.center[x] / this.centerSize.x) * this.centerSize.y) + this.tileWidth * i + j + (Math.floor(gameRule.center[x] % this.centerSize.x) * this.centerSize.y);

                    if (Math.floor(this.centerSize.x / 2) == i && Math.floor(this.centerSize.y / 2) == j) {
                        this.eftPos = this.tileDatas[calc].node.getWorldPosition();
                    }
                }
            }
        }

        this.scoreEft.show(this.blockMatchEft, this.eftPos);

    }

    public lineCheck() {
        let gameRule: GameRules = this.blockCheckHelper.ruleCheck();

        if (gameRule != null) {
            let currentLineMacthCount = gameRule.rows.length + gameRule.cols.length + gameRule.center.length;
            this.lineMathRule(currentLineMacthCount);
            this.eftCheck(gameRule);

            for (let y = 0; y < gameRule.rows.length; ++y) {
                for (let x = 0; x < this.tileWidth; ++x) {
                    this.CoolObject(x, gameRule.rows[y]);
                }

            }

            for (let x = 0; x < gameRule.cols.length; ++x) {
                for (let y = 0; y < this.tileHeight; ++y) {
                    this.CoolObject(gameRule.cols[x], y);
                }
            }

            for (let x = 0; x < gameRule.center.length; ++x) {
                for (let i = 0; i < this.centerSize.x; ++i) {
                    for (let j = 0; j < this.centerSize.y; ++j) {
                        let calc = this.tileWidth * (Math.floor(gameRule.center[x] / this.centerSize.x) * this.centerSize.y) + this.tileWidth * i + j + (Math.floor(gameRule.center[x] % this.centerSize.x) * this.centerSize.y);
                        this.CoolObjectValue(calc);
                        this.tileDatas[calc] = null;
                    }
                }
            }

            SoundManager.instance.playSfxOneShot(SfxNames_BlockPuzzle.Item);



            this.matchLine += currentLineMacthCount;
            this.levelUpRule();
        }
    }

    private CoolObject(x: number, y: number): void {
        let tileNum = y * this.tileHeight + x;
        let obj = this.tileDatas[tileNum];

        if (obj == null) {
            return;
        }

        obj.match();
        this.tileDatas[tileNum] = null;
    }

    private CoolObjectValue(value: number) {
        let obj = this.tileDatas[value];

        if (obj == null) {
            return;
        }

        obj.match();
        this.tileDatas[value] = null;
    }
}