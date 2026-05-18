// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import Mathf from '../../Common/Mathf';

@ccclass('Leaf')
export default class Leaf extends Component {
    private sprite: Sprite = null;
    private angle = 0;

    onLoad() {
        this.sprite = this.node.getComponent(Sprite);
    }

    onEnable() {
        this.angle = Mathf.randomInt(-45, 45);
        this.node.angle = this.angle;
    }

    setSpriteFrame(sf: SpriteFrame) {
        this.sprite.spriteFrame = sf;
    }

    updateMove(dx: number, dy: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x + dx, pos.y + dy);

        this.node.angle = this.angle + Mathf.randomInt(-5, 5);
        if (this.node.position.y < -960 / 2) {
            return false;
        }

        return true;
    }
}