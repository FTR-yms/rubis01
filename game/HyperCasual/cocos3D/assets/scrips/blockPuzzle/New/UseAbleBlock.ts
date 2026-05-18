import { _decorator, Component, Node, Vec2, Vec3, Animation, Sprite, SpriteFrame } from 'cc';
import { Pool } from '../../Common/Pool';
const { ccclass, property } = _decorator;

@ccclass('UseAbleBlock')
export class UseAbleBlock extends Component {
    private vec : Vec2 = new Vec2(0, 0);
    private vecPos : Vec3 = new Vec3(0, 0);

    private animation : Animation = null;

    private renderer : Sprite = null;

    public pool : Pool = null;

    private get Ani() : Animation
    {
        if (null === this.animation)
        {
            this.animation = this.getComponent(Animation);
        }

        return this.animation;
    }

    private get Renderer() : Sprite
    {
        if (null === this.renderer)
        {
            this.renderer = this.getComponent(Sprite);
        }

        return this.renderer;
    }

    public set Sprite(spriteFrame : SpriteFrame)
    {
        this.Renderer.spriteFrame = spriteFrame;
    }

    public get Sprite() : SpriteFrame
    {
        return this.Renderer.spriteFrame;
    }

    public get Vec() : Vec2
    {
        return this.vec;
    }

    public initSettings(x, y) : void
    {
        this.vec.x = x;
        this.vec.y = y;
    }

    public setMatchPos(calcPos : Vec2, standardPos : Vec3, padding : number = 0) : void
    {
        this.vecPos.x = calcPos.x * this.vec.x + standardPos.x + padding * this.vec.x;
        this.vecPos.y = calcPos.y * -this.vec.y + standardPos.y + padding * -this.vec.y;

        this.node.setWorldPosition(this.vecPos);
    }

    public setAni(name : string) : void
    {
        this.Ani.play(name);
    }

    public setPool(pool : Pool)
    {
        this.pool = pool;
    }

    public Cool()
    {        
        this.pool.return(this.node);
    }
}

