import { Component, _decorator, Node, Sprite, Color } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class ItemEffect extends Component {

    @property(Node) private item: Node = null;
    private time: number = 0;
    private maxTime: number = 0.6;

    private spriteRenderer: Sprite;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.spriteRenderer = this.item.getComponent(Sprite);
    }

    onEnable() {
        this.time = 0;
        this.item.setPosition(this.item.position.x, 0);
        const color = this.spriteRenderer.color;
        this.spriteRenderer.color = new Color(color.r, color.g, color.b, 255);
    }

    update(dt) {
        this.time += dt;
        const color = this.spriteRenderer.color;
        if (this.time >= this.maxTime) {
            this.item.setPosition(this.item.position.x, 100);
            this.spriteRenderer.color = new Color(color.r, color.g, color.b, 0);
            this.node.active = false;
        }

        this.spriteRenderer.color = new Color(color.r, color.g, color.b, 255 - (this.time * 255));
    }
}
