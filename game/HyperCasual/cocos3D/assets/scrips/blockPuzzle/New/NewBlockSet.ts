import { _decorator, Component, Node, Vec2, FogInfo, input, Input, EventTouch, Vec3, EventHandler, sys } from 'cc';
import { BlockManager_BlockPuzzle } from './BlockManager_BlockPuzzle';
import store from '../Data/Store';
import Util from '../../Common/Util';
import { NewBlockContainer } from './NewBlockContainer';
import { UseAbleBlock } from './UseAbleBlock';
import { GameManager_BlockPuzzle, GameState } from './GameManager_BlockPuzzle';
import { FlowManager_BlockPuzzle } from './FlowManager_BlockPuzzle';
import { Pool } from '../../Common/Pool';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_BlockPuzzle } from '../../Common/SoundNames';
const { ccclass, property } = _decorator;

@ccclass('BlockSetInfo')
export class BlockSetInfo {
    @property(Node)
    private centerNode: Node = null;

    private myVecs: Vec2[] = [];
    private myBlocks: UseAbleBlock[] = [];

    private maxSize: Vec2 = new Vec2(0, 0);

    public checkInsertAble(): boolean {
        return BlockManager_BlockPuzzle.instance.checkInsertAble(this.myVecs);
    }

    public addBlock(block: UseAbleBlock): void {
        this.myVecs.push(block.Vec);
        this.myBlocks.push(block);

        this.centerNode.addChild(block.node);
    }

    public setMaxSize(width: number, height: number): void {
        this.maxSize.x = width;
        this.maxSize.y = height;
    }

    public setMatchPos(calcPos: Vec2, padding: number = 0) {
        for (let i = 0; i < this.myBlocks.length; ++i) {
            this.myBlocks[i].setMatchPos(calcPos, this.centerNode.worldPosition, padding);
        }

        this.centerNode.setPosition((this.maxSize.x - 1) * - calcPos.x / 2, (this.maxSize.y - 1) * calcPos.y / 2);
    }

    public setAni(aniName: string) {
        for (let i = 0; i < this.myBlocks.length; ++i) {
            this.myBlocks[i].setAni(aniName);
        }
    }

    public checkTile() {
        if (!BlockManager_BlockPuzzle.instance.checkTilePos(this.myBlocks[0].node.getWorldPosition())) {
            return;
        }

        BlockManager_BlockPuzzle.instance.checkSubTileVec(this.myVecs);
    }

    public insertFail(node: Node, createPos: Vec3) {
        node.setPosition(createPos);

        this.setMatchPos(store.ShowBlockSize);
        this.setAni("default");

        return false;
    }

    public clear(node: Node) {
        // PoolManager.Instance.coolObject(PoolName.BlockSet, node);

        this.myBlocks.forEach((block) => {
            block.Cool();
        });

        this.myBlocks.length = 0;
        this.myVecs.length = 0;
    }


    public insert(node: Node, createPos: Vec3): boolean {
        if (!BlockManager_BlockPuzzle.instance.checkTilePos(this.myBlocks[0].node.getWorldPosition())) {
            this.insertFail(node, createPos);
            return false;
        }

        BlockManager_BlockPuzzle.instance.checkSubTileVec(this.myVecs);

        if (BlockManager_BlockPuzzle.instance.insertBlock(this.myVecs, this.myBlocks[0].Sprite)) {
            this.clear(node);
            return true;
        }
        else {
            this.insertFail(node, createPos);

            return false;
        }
    }
}

@ccclass('MouseUser')
class MouseUser {
    @property(EventHandler)
    private startEvent: EventHandler[] = [];

    @property(EventHandler)
    private moveEvent: EventHandler[] = [];

    @property(EventHandler)
    private endEvent: EventHandler[] = [];

    @property(Node)
    private currentNode: Node = null;

    @property(Vec2)
    private upVec: Vec2 = new Vec2(0, 100);

    private isClicked: boolean = false;

    private isClickAble: boolean = true;

    public set IsClickAble(able: boolean) {
        this.isClickAble = able
    }

    public init() {
        this.currentNode.on(Node.EventType.TOUCH_START, this.clicked.bind(this));
        // input.on(Input.EventType.TOUCH_MOVE, this.move.bind(this));
        this.currentNode.on(Node.EventType.TOUCH_MOVE, this.move.bind(this));
        this.currentNode.on(Node.EventType.TOUCH_END, this.clickEnd.bind(this));
    }

    private clicked(): void {
        if (!this.isClickAble || GameManager_BlockPuzzle.instance.state === GameState.Over) {
            return;
        }

        SoundManager.instance.playSfxOneShot(SfxNames_BlockPuzzle.Click);

        this.isClicked = true;

        Util.callEventHandlers(this.startEvent);
    }

    private move(event: EventTouch) {
        if (!this.isClicked || GameManager_BlockPuzzle.instance.state === GameState.Over) {
            return;
        }

        this.matchMousePos(event.getUILocation());

        Util.callEventHandlers(this.moveEvent);
    }

    private clickEnd() {
        if (!this.isClicked || GameManager_BlockPuzzle.instance.state === GameState.Over) {
            return;
        }

        this.isClicked = false;

        Util.callEventHandlers(this.endEvent);
    }

    private matchMousePos(pos: Vec2) {
        if (sys.isMobile) {
            this.currentNode.setWorldPosition(new Vec3(pos.x, pos.y + this.upVec.y, 0));
        }
        else {
            this.currentNode.setWorldPosition(new Vec3(pos.x, pos.y, 0));
        }
    }
}

@ccclass('NewBlockSet')
export class NewBlockSet extends Component {
    @property(BlockSetInfo)
    private info: BlockSetInfo = new BlockSetInfo();

    @property(MouseUser)
    private mouseUser: MouseUser = new MouseUser();

    private createPos: Vec3 = Vec3.ZERO;

    private isEventRegister: boolean = false;

    public pool: Pool = null;

    public get Info(): BlockSetInfo {
        return this.info;
    }

    private eventRegister() {
        if (!this.isEventRegister) {
            this.isEventRegister = true;
            this.mouseUser.init();

            this.node.on("checkInsert", this.checkInsert.bind(this));

            FlowManager_BlockPuzzle.instance.node.on(FlowManager_BlockPuzzle.gameOverStr, () => {
                this.info.insertFail(this.node, this.createPos);
                this.info.setAni("noclick");
            })
        }
    }

    private checkInsert() {
        if (this.info.checkInsertAble()) {
            this.info.setAni("default");
            this.mouseUser.IsClickAble = true;

            NewBlockContainer.instance.node.emit("InsertAble");
        }
        else {
            this.info.setAni("noclick");
            this.mouseUser.IsClickAble = false;
        }

        NewBlockContainer.instance.node.emit("GameOverCheck");
    }

    public setPool(pool: Pool) {
        this.pool = pool;
    }

    public clear() {
        this.info.clear(this.node);
        this.pool.return(this.node);
    }

    public click() {
        this.node.setSiblingIndex(2);
    }

    public put() {
        this.eventRegister();

        this.info.setMatchPos(store.ShowBlockSize);
        this.info.setAni("default");
        this.createPos = this.node.getPosition();

        this.checkInsert();
    }

    public blockClicked() {
        this.info.setMatchPos(store.ClickBlockSize, store.ClickBlockPadding);
        this.info.setAni("click");
    }

    public checkTile() {
        this.info.checkTile();
    }

    public clickEnd() {
        SoundManager.instance.playSfxOneShot(SfxNames_BlockPuzzle.Drop);
        if (this.info.insert(this.node, this.createPos)) {
            this.pool.return(this.node);
            NewBlockContainer.instance.node.emit("InsertSuccess");
        }
    }
}

