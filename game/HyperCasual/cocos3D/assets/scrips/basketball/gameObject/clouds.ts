// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Sprite, Node } from 'cc';
import Mathf from '../../Common/Mathf';
const { ccclass, property } = _decorator;

const _speed = {
    min: 5,
    max: 10,
};
const _y = {
    min: 300,
    max: 40
};
const _moveDistance = 455 * 2;
const _maxCount = 3;

@ccclass('Clouds')
export default class Clouds extends Component {
    @property(SpriteFrame) private spriteFrames: SpriteFrame[] = [];

    private sprites: Sprite[] = [];
    private dirs: number[] = [];
    private speeds: number[] = [];
    private moveDistances: number[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let i = 0; i < _maxCount; i++) {
            const node = new Node(i.toString());
            const sprite = node.addComponent(Sprite);
            this.sprites.push(sprite);
            this.node.addChild(node);
        }
    }

    onEnable() {
        for (let i = 0; i < _maxCount; i++) {
            this.gen(i, true);
        }
    }

    update(dt) {
        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            const d = this.speeds[i] * dt;
            const pos = sprite.node.position;
            sprite.node.setPosition(pos.x + d * this.dirs[i], pos.y);
            this.moveDistances[i] += d;
            if (this.moveDistances[i] >= _moveDistance) {
                this.gen(i, false);
            }
        }
    }

    gen(idx: number, isInit: boolean) {
        const sprite = this.sprites[idx];

        const r = Mathf.randomInt(0, this.spriteFrames.length);
        sprite.spriteFrame = this.spriteFrames[r];
        let y = Mathf.randomInt(_y.min, _y.max);
        let x = 0;
        if (isInit) {
            x = Mathf.randomInt(-_moveDistance / 2, _moveDistance / 2);
        }
        else {
            x = -_moveDistance / 2;
        }

        sprite.node.setPosition(x, y);

        this.dirs[idx] = Mathf.randomInt(0, 2) === 0 ? 1 : -1;
        this.speeds[idx] = Mathf.randomInt(_speed.min, _speed.max);
        this.moveDistances[idx] = 0;
    }
}

