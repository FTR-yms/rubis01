import { _decorator, Component, Node, Game, tween, Vec3, Sprite, Vec2, screen, UITransform, SpriteRenderer } from 'cc';
import { GameState, SPOTLIGHT_BLUR, SPOTLIGHT_RADIUS } from '../FrameWork/Config';
import Store from '../FrameWork/Store';
const { ccclass, property } = _decorator;

@ccclass('SpotLight')
export class SpotLight extends Component {
    @property(Sprite)
    sprite : Sprite = null;
    target : Node = null;

    radius : number = SPOTLIGHT_RADIUS;
    blur : number = 0.2;

    isBlur : boolean = false;

    private transform : UITransform = null;

    onLoad() {
        this.transform = this.getComponent(UITransform);
    }

    set Target(node : Node) {
        this.target = node;
        this.radius = SPOTLIGHT_RADIUS;
    }
    
    update(deltaTime: number) {
        if(this.target != null)
        {
            this.sprite.getMaterial(0).setProperty("radius", this.radius);
            let resolution : Vec2 = new Vec2(this.transform.width, this.transform.height);
            this.sprite.getMaterial(0).setProperty("ratio", resolution);
            let pos = new Vec2(this.target.position.x - 90 + resolution.x / 2 , -this.target.position.y + resolution.y/2);
            this.sprite.getMaterial(0).setProperty("pos", pos);

            if(this.blur > SPOTLIGHT_BLUR)
            {
                this.isBlur = true;
            }
            else if(this.blur < 0.19)
            {
                this.isBlur = false;
            }

            if(this.isBlur)
            {
                this.blur -= 0.005;
            }
            else
            {
                this.blur += 0.005;
            }
            this.sprite.getMaterial(0).setProperty("blur", this.blur);
            if(Store.gameState == GameState.TIMEOVER)
            {
                this.radius -= deltaTime;
            }
        }
    }
}