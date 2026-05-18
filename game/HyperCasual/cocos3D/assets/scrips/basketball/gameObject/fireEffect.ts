// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Sprite, Node, UIOpacity, Color, math } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";

@ccclass('FireEffect')
export default class FireEffect extends Component {
    @property(SpriteFrame) spriteFrame = null;
    private interval = 0.01;
    private liveTime = 0.5;
    private sprites: Sprite[] = [];
    private count: number = Math.ceil(this.liveTime / this.interval) + 10;
    private currentIdx: number = 0;
    private target: UIOpacity = null;
    private time: number = 0;
    private uiOpacity: UIOpacity = null;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        for (let i = 0; i < this.count; i++) {
            const node = new Node(i.toString());
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = this.spriteFrame;
            sprite.color = new Color(255, 255, 255, 0);
            this.node.addChild(node);
            this.sprites.push(sprite);
        }
    }
    start() {
        GameMnager.Instance.node.on('startGame', () => {
            this.node.active = false;
        });

        this.node.active = false;
    }
    init(target: UIOpacity) {
        this.target = target;
        this.node.active = true;
        this.time = 0;
        this.currentIdx = 0;

        for (let i = 0; i < this.count; i++) {
            this.sprites[i].color = new Color(255, 255, 255, 0);
        }
    }
    update(dt: number) {
        this.time += dt;
        if (this.time >= this.interval) {
            this.time = 0;
            const sprite = this.sprites[this.currentIdx];
            sprite.node.setPosition(this.target.node.position.x, this.target.node.position.y);
            sprite.color = new Color(255, 255, 255, 255);
            sprite.node.setScale(1, 1);
            sprite.node.angle = 360 * Math.random();
            this.currentIdx = (this.currentIdx + 1) % this.count;
        }

        for (let i = 0; i < this.count; i++) {
            const sprite = this.sprites[i];
            if (sprite.color.a > 0) {
                const alpha = (sprite.color.a - dt * (255 / this.liveTime)) * (this.target.opacity / 255);
                sprite.color = new Color(255, 255, 255, math.clamp(alpha, 0, 255));
                sprite.node.scale.subtract3f(dt * 0.5, dt * 0.5, 0);
            }
        }

        // if (this.node.active && this.target.opacity <= 0) {
        //     this.node.active = false;
        // }
        // this.node.children.sort((a, b) => a.getComponent(Sprite).color.a - b.getComponent(Sprite).color.a);
    }
}

