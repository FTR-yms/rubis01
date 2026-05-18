import { _decorator, Component, Node, Collider2D, Contact2DType, Animation, IPhysics2DContact, Vec3, tween } from 'cc';
import { STAIR_SIZE } from '../FrameWork/Config';
import { EventManager } from '../../Common/EventManager';
import { Pool, PoolKey } from '../FrameWork/Pool';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_InTheRuin } from '../../Common/SoundNames';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    isDead: boolean = false;

    set Dead(dead: boolean) {
        this.isDead = dead;
    }

    get Dead() {
        return this.isDead;
    }

    onLoad() {
        EventManager.instance.on("upItem", (step: number) => { this.upItem(step) });
        EventManager.instance.on("returnItem", () => { this.returnItem() });
    }

    start() {
        let colliders = this.getComponent(Collider2D);
        if (colliders) {
            colliders.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {
        if (this.getComponent(Animation).getState('get').isMotionless &&
            this.getComponent(Animation).getState('idle').isMotionless) {
            this.isDead = true;
        }
    }

    onBeginContact(self: Collider2D, ohterCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (ohterCollider.node.name == "player") {
            this.getComponent(Animation).play("get");
            this.gainItem();
        }
    }

    upItem(step: number) {
        let pos = new Vec3();
        pos.x = this.node.position.x - STAIR_SIZE.x * step;
        pos.y = this.node.position.y - STAIR_SIZE.y / 2 * step;

        tween(this.node).to(0.2, { position: pos }).start();
    }

    gainItem() {
        EventManager.instance.emit("addTime");
        SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.ITEM);
    }

    returnItem() {
        this.isDead = false;
        this.getComponent(Animation).play("idle");
        Pool.Instance.returnObject(PoolKey.item, this.node);
    }
}