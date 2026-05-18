// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Prefab, view } from 'cc';
const { ccclass, property } = _decorator;

import Leaf from "./leaf";
import store from "../data/store";
import GameMnager from "../ctrl/gameManager";
import { Pool } from '../../Common/Pool';
import Mathf from '../../Common/Mathf';
const _interval = 0.7;
const _speedY = -100;
const _speedX = 30;

@ccclass('LeafContainer')
export default class LeafContainer extends Component {
    @property(SpriteFrame) spriteFrames: SpriteFrame[] = [];
    @property(Pool) pool: Pool = null;
    @property(Prefab) prefab: Prefab = null;

    private time: number = 0;
    private leafs: Leaf[] = [];


    start() {
        GameMnager.Instance.node.on('startGame', () => {
            this.claer();
        });
    }

    claer() {
        while (this.leafs.length > 0) {
            const leaf = this.leafs.pop();
            this.pool.return(leaf.node);
        }
    }

    update(dt) {
        const deltaX = store.wind * _speedX * dt;
        const deltaY = _speedY * dt;


        for (let i = 0; i < this.leafs.length; i++) {
            const leaf = this.leafs[i];
            if (!leaf.updateMove(deltaX, deltaY)) {
                leaf.node.active = false;
                this.pool.return(leaf.node);
                this.leafs.splice(i, 1);
                i--;
            }
        }

        if (store.wind !== 0) {
            this.time += dt;
            if (this.time >= _interval) {
                this.time = 0;
                const leaf = this.pool.get().getComponent(Leaf);
                leaf.node.active = true;
                this.leafs.push(leaf);
                leaf.setSpriteFrame(this.spriteFrames[Mathf.randomInt(0, this.spriteFrames.length)]);

                const width = view.getVisibleSize().width;
                const height = view.getVisibleSize().height;

                leaf.node.setPosition(Mathf.randomInt(-width, width),
                    height / 2 + 20);

            }
        }

    }
}
