import { Component, _decorator, Node } from "cc";
import Config from "../data/config";
import { GameState } from "../data/const";
import store from "../data/store";

import BlockNode from "./BlockNode";
import GameManager from "./GameManager";
import Mathf from "../../Common/Mathf";
import { Pool } from "../../Common/Pool";

const { ccclass, property } = _decorator;

@ccclass
export default class BlockManager extends Component {
    @property(Node) blockContainer: Node = null;

    @property(Pool)
    private pool: Pool = null;

    private count: number = 10;
    private blockNodes: BlockNode[] = [];
    private frontIdx: number = 0;
    private blockIdxs: number[] = [];

    private time: number = 0;
    private maxTime: number = 0.2;

    start() {
        for (let i = 0; i < 20; i++) {
            const blockNode = this.pool.get().getComponent(BlockNode);
            this.blockNodes.push(blockNode);
        }
    }

    getBlockIdx() {
        if (this.blockIdxs.length === 0) {
            const arr1 = store.generateTotemInfo[Mathf.randomInt(0, (store.grade % store.generateTotemInfo.length) + 1)];
            const arr2 = arr1[Mathf.randomInt(0, store.generateTotemInfo.length)];
            for (let i = 0; i < arr2.length; i++) {
                this.blockIdxs.push(arr2[i]);
            }
            store.grade++;
        }

        return this.blockIdxs.shift() - 1;
    }

    clear() {
        for (let i = 0; i < this.blockNodes.length; i++) {
            this.blockNodes[i].node.active = false;
        }
        this.frontIdx = 0;
        this.blockIdxs.length = 0;
    }

    introDown() {
        this.clear();
        // this.blockIdxs.push( 1 );

        let y = store.config.introY;
        for (let i = 0; i < this.count; i++) {
            const blockNode = this.blockNodes[i];
            blockNode.node.active = true;
            blockNode.node.setPosition(0, y);

            const blockIdx = this.getBlockIdx();
            const data = store.tileData[blockIdx];
            blockNode.init(blockIdx, data.direction, data.hp, data);

            blockNode.down(i * store.config.blockHeight);
            y += store.config.blockHeight + Mathf.randomInt(5, 100);
        }
    }

    hit(dir: number) {
        const block = this.blockNodes[this.frontIdx];
        const blockDir = -block.getDir();

        if (blockDir === dir) {
            this.time = this.maxTime;
            GameManager.instance.miss();
            return null;
        }

        block.hit();
        if (block.getHp() <= 0) {
            block.braek(dir);

            this.frontIdx = (this.frontIdx + 1) % this.blockNodes.length;
            this.node.children.sort((a, b) => b.position.y - a.position.y);
            this.down();

            const nextBlock = this.blockNodes[this.frontIdx];
            const nextDir = -nextBlock.getDir();
            if (dir === nextDir) {
                this.time = this.maxTime;
                GameManager.instance.miss();
                return null;
            }
            return block.getData();
        }
        return null;
    }

    down() {
        store.state = GameState.action;
        for (let i = 0; i < this.count; i++) {
            const idx = (this.frontIdx + i) % this.blockNodes.length;
            const blockNode = this.blockNodes[idx];
            const y = store.config.blockHeight * i;
            blockNode.down(y);
            if (i === this.count - 1) {
                blockNode.node.active = false;
                blockNode.node.active = true;
                const blockIdx = this.getBlockIdx();
                const data = store.tileData[blockIdx];
                blockNode.init(blockIdx, data.direction, data.hp, data);
                blockNode.node.setPosition(blockNode.node.position.x, store.config.introY);
            }
        }
    }

    isDown() {
        for (let i = 0; i < this.blockNodes.length; i++) {
            if (this.blockNodes[i].isDown()) {
                return true;
            }
        }
        return false;
    }

    update(dt) {
        if (this.time > 0) {
            this.time -= dt;
            this.blockContainer.angle = Mathf.randomFloat(-1, 2);
            if (this.time <= 0) {
                this.time = 0;
                this.blockContainer.angle = 0;
            }
        }
    }
}
