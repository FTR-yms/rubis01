import { Component, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import GameManager from "./GameManager";
import Mathf from "../../Common/Mathf";

const { ccclass, property } = _decorator;

@ccclass
export default class Cloud extends Component {

    @property(SpriteFrame) private spriteFrames: SpriteFrame[] = [];
    @property(Sprite) private sprite: Sprite = null;

    private speed: number = 0;

    private widthHalf: number = 0;

    start() {
        this.widthHalf = this.node.parent.getComponent(UITransform).width / 2;
    }

    public onGameStart(): void {
        this.reset();
        this.node.setPosition(Mathf.randomInt(-this.widthHalf, this.widthHalf), this.node.position.y);
    }

    reset() {
        this.sprite.spriteFrame = this.spriteFrames[Mathf.randomInt(0, this.spriteFrames.length)];

        this.speed = Mathf.randomInt(20, 30);
        this.node.setPosition(-this.widthHalf * 2, Mathf.randomInt(50, 400));
    }

    update(dt) {
        const pos = this.node.position;
        this.node.setPosition(pos.x + dt * this.speed, pos.y);

        if (pos.x >= this.widthHalf * 2) {
            this.reset();
        }
    }
}
