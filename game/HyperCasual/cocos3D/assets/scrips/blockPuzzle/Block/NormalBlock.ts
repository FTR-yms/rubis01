import { _decorator, Component, Node, Sprite, SpriteFrame, Color, Animation, utils, renderer, RenderRoot2D, Material, lerp } from 'cc';
import Util from '../../Common/Util';
import { Pool } from '../../Common/Pool';
const { ccclass, property } = _decorator;

@ccclass('NormalBlock')
export class NormalBlock extends Component {
    private animation: Animation = null;
    private renderer: Sprite = null;

    private material: Material = null;

    private isGameOver: boolean = false;

    private gValue: number = 1;

    public pool: Pool = null;

    private get Animation(): Animation {
        return Util.getDefault(this.animation, this.getComponent(Animation));
    }

    private get Renderer(): Sprite {
        return Util.getDefault(this.renderer, this.getComponent(Sprite));
    }

    public match(): void {
        this.Animation.play("match");
    }

    public gameOver(): void {
        this.isGameOver = true;
        this.gValue = 1;
    }

    public update(dt: number) {
        if (this.isGameOver) {
            this.material.setProperty("g", this.gValue);
            this.gValue = lerp(this.gValue, 0, dt * 2);
        }
    }

    public matchEnd(): void {
        if (this.pool) {
            this.pool.return(this.node);
        }
    }

    public setSprite(spriteFrame: SpriteFrame, alphaValue: number) {
        this.isGameOver = false;
        this.material = this.Renderer.getMaterialInstance(0);
        this.material.setProperty("g", 1);
        this.Renderer.spriteFrame = spriteFrame;
        this.Renderer.color = new Color(255, 255, 255, alphaValue * 255);
    }

    public setPool(pool: Pool) {
        this.pool = pool;
    }
}

