import { _decorator, Component, Node, JsonAsset, Vec3, SpriteFrame, Sprite } from 'cc';
import store from '../Data/Store';
import { Singleton } from '../../Common/Singleton';
import { FlowManager_BlockPuzzle } from './FlowManager_BlockPuzzle';
import { BlockSetInfo, NewBlockSet } from './NewBlockSet';
import { UseAbleBlock } from './UseAbleBlock';
import { Pool } from '../../Common/Pool';
const { ccclass, property } = _decorator;


@ccclass('MyJsonHelper')
class MyJsonHelper {
    @property(JsonAsset)
    private blockSettingsData: JsonAsset[] = [];

    @property
    private targetChar = 'X';

    @property
    private blockShapeName: string = 'blockShape';

    public getString(num: number): string[] {
        return this.blockSettingsData[store.level].json[this.blockShapeName][num] as string[];
    }

    public getMaxLine(): number {
        return this.blockSettingsData[store.level].json[this.blockShapeName].length;
    }

    public IsTargetChar(targetChar: string) {
        if (targetChar === this.targetChar) {
            return true;
        }

        return false;
    }
}

@ccclass('NewBlockContainer')
export class NewBlockContainer extends Singleton<NewBlockContainer>() {

    @property
    private createNum: number = 0;

    @property
    private blockDistance : number = 126;

    @property(MyJsonHelper)
    private shapeHelper: MyJsonHelper = null;

    @property(SpriteFrame)
    private spriteFrames: SpriteFrame[] = [];

    @property(Pool)
    private blockSetPool: Pool = null;

    @property(Pool)
    private usableBlockPool: Pool = null;

    private blockSets: NewBlockSet[] = [];

    private insertSuccessNum = 0;

    private dieNum = 0;

    private checkRule = 0;
    private checkNum = 0;

    public onLoad() {
        super.onLoad();
        this.node.on("InsertSuccess", this.insertSuccess.bind(this));
        this.node.on("InsertAble", this.insertAble.bind(this));
        this.node.on("GameOverCheck", this.gameOverCheck.bind(this));
    }

    private insertAble() {
        this.dieNum++;
    }

    private gameOverCheck() {
        this.checkNum++;

        if (this.checkNum === this.checkRule) {
            this.dieCheck();
        }
    }

    private dieCheck() {
        if (this.dieNum == 0) {
            FlowManager_BlockPuzzle.instance.node.emit("GameOver");
        }

    }

    public clear() {
        this.insertSuccessNum = 0;

        for (let i = 0; i < this.blockSets.length; ++i) {
            this.blockSets[i].clear();
        }
    }

    public createBlockSet() {
        this.dieNum = 0;

        this.checkRule = this.createNum;
        this.blockSets.length = 0;

        for (let i = 0; i < this.createNum; ++i) {
            const blockSet = this.blockSetPool.get().getComponent(NewBlockSet);
            blockSet.setPool(this.blockSetPool);
            this.createBlock(blockSet.Info);
            blockSet.node.setPosition(new Vec3(this.blockDistance * i, 0, 0));
            blockSet.put();

            this.blockSets.push(blockSet);
        }
    }

    private insertSuccess() {
        this.checkNum = 0;
        this.dieNum = 0;
        this.checkRule--;

        this.insertSuccessNum++;

        for (let i = 0; i < this.blockSetPool.enableParent.children.length; ++i) {
            this.blockSetPool.enableParent.children[i].emit("checkInsert");
        }

        if (this.insertSuccessNum >= this.createNum) {
            this.insertSuccessNum = 0;
            this.createBlockSet();
        }
    }

    private createBlock(info: BlockSetInfo): void {
        let targetNum = this.getRand();

        let blockData: string[] = this.shapeHelper.getString(targetNum);

        let maxX: number = 0;
        let spriteFrame: SpriteFrame = this.getRandSprite();

        for (let y = 0; y < blockData.length; ++y) {
            for (let x = 0; x < blockData[y].length; ++x) {
                if (this.shapeHelper.IsTargetChar(blockData[y][x])) {
                    if (blockData[y].length > maxX) {
                        maxX = blockData[y].length;
                    }

                    const userBlock = this.usableBlockPool.get().getComponent(UseAbleBlock);
                    userBlock.initSettings(x, y);
                    userBlock.setPool(this.usableBlockPool);
                    userBlock.Sprite = spriteFrame;

                    info.addBlock(userBlock);
                }
            }
        }

        info.setMaxSize(maxX, blockData.length);
    }

    private getRand(): number {
        return Math.floor(Math.random() * this.shapeHelper.getMaxLine());
    }

    private getRandSprite(): SpriteFrame {
        return this.spriteFrames[Math.floor(Math.random() * this.spriteFrames.length)];
    }
}

