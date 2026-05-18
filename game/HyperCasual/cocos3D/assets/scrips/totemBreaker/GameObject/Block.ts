import { SpriteFrame, Sprite, Animation, Component, _decorator, Color } from "cc";
import Mathf from "../../Common/Mathf";

const { ccclass, property } = _decorator;


@ccclass
export default class Block extends Component {

    @property(SpriteFrame) sprites: SpriteFrame[] = [];
    @property(Sprite) sprite: Sprite = null;
    @property(Animation) animation: Animation = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onEnable() {
        this.reset();
    }


    reset() {
        this.sprite.spriteFrame = this.sprites[0];
        this.sprite.node.setPosition(0, 41.5);
        this.sprite.node.angle = 0;

        const color = this.sprite.color;
        this.sprite.color = new Color(color.r, color.g, color.b, 255);
        this.animation.stop();
    }

    setDir(dir: number) {
        if (dir === 0) {
            const x = Mathf.randomBoolean() ? 1 : -1;
            this.sprite.node.setScale(x, this.sprite.node.scale.y);
        }
        else {
            this.sprite.node.setScale(dir, this.sprite.node.scale.y);
        }
    }

    break(dir: number) {
        if (dir === 1) {
            this.animation.play('left_break');
        }
        else {
            this.animation.play('right_break');
        }

        // this.animation.play('right_break');       
    }

    hit(hitCount: number) {
        if (hitCount < this.sprites.length) {
            this.sprite.spriteFrame = this.sprites[hitCount];
        }
    }


}
