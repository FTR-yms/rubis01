import { _decorator, Component, Sprite, SpriteFrame} from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class NewClass extends Component {

    @property( Sprite ) private sprite : Sprite = null;
    @property( SpriteFrame ) private spriteFrame : SpriteFrame[] = [];

    private time : number = 0;
    private idx : number = 0;
    private interval : number = 0.03;

    onEnable() {
        this.time = 0;
        this.idx = 0;        
        this.sprite.spriteFrame = this.spriteFrame[this.idx];
    }

    update (dt) {
        this.time += dt;
        const idx = Math.ceil(this.time / this.interval);
        if( idx !== this.idx ) {
            if( this.idx >= this.spriteFrame.length ) {
                this.node.active = false;
            }
            this.idx = idx;
            this.sprite.spriteFrame = this.spriteFrame[this.idx];
        }

    }
}
