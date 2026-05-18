import { _decorator, Component, Node, Vec3 } from "cc";
import store from "../data/store";

import Block from "./Block";
import GameManager from "./GameManager";
import { ScoreManager } from "../../Common/ScoreManager";
import { SoundManager } from "../../Common/SoundManager";
import { SfxNames_TotemBreaker } from "../../Common/SoundNames";

const { ccclass, property } = _decorator;

enum State {
    none,
    break,
    down,
}


@ccclass
export default class BlockNode extends Component {

    @property(Block) private blocks: Block[] = [];

    private blockIdx: number = 0;

    private state: State = State.none;
    private hitCount: number = 0;
    private hp: number = 0;

    private dir: number = 0;
    private dstY: number = 0;
    private speed: number = 0;

    private data: {
        score: number,
        rewardGauge: number,
        freezingTime: number
        hitSound: string
    } = null;

    //dir : 장애물 위치
    init(idx: number, dir: string, hp: number, data) {
        this.data = data;
        this.blockIdx = idx;

        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].node.active = idx === i;
        }

        const block = this.blocks[this.blockIdx];

        this.dir = dir === 'Center' ? 0 :
            dir === 'Left' ? 1 : -1;
        this.hp = hp;
        block.setDir(this.dir);
        this.hitCount = 0;
    }

    reset() {
        this.hitCount = 0;
    }

    getDir() {
        return this.dir;
    }

    getHp() {
        return this.hp - this.hitCount;
    }

    getData() {
        return this.data;
    }

    hit() {
        this.hitCount++;
        this.blocks[this.blockIdx].hit(this.hitCount);
        switch (this.data.hitSound) {
            case "1":
                SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Hit1);
                break;
            case "2":
                SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Hit2);
                break;
            case "3":
                SoundManager.instance.playSfxOneShot(SfxNames_TotemBreaker.Hit3);
                break;
        }

    }

    braek(dir: number) {
        this.blocks[this.blockIdx].break(dir);
        ScoreManager.instance.addScore(this.data.score);
        GameManager.instance.addGauge(this.data.rewardGauge);

        if (this.data.freezingTime > 0) {
            GameManager.instance.addItem(this.data.freezingTime);
        }


    }

    down(y: number, speed?: number) {
        this.state = State.down;
        this.dstY = y;
        if (speed) {
            this.speed = speed;
        }
        else {
            this.speed = store.config.blockDownSpeed;
        }
    }

    isDown() {
        return this.state === State.down;
    }

    onEnable() {
        this.reset();
    }

    update(dt: number) {
        switch (this.state) {
            case State.none:
                break;
            case State.down:
                const pos = this.node.position;
                this.node.setPosition(pos.x, pos.y - dt * this.speed, pos.z);

                if (this.node.position.y <= this.dstY) {
                    this.node.setPosition(pos.x, this.dstY, pos.z);
                    this.state = State.none;
                }
                break;
        }
    }
}
