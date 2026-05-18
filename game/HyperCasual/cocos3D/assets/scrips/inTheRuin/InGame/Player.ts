import { _decorator, Component, Node,  Collider2D, IPhysics2DContact, Contact2DType, PhysicsSystem2D, EPhysics2DDrawFlags, sp } from 'cc';
import { EventManager } from '../../Common/EventManager';
import { PlayerState } from './PlayerState';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(sp.Skeleton)
    private spine : sp.Skeleton = null;

    state : PlayerState = null;
    contact : boolean = false;

    getSpine() {
        return this.spine;
    }

    onLoad() {
        ///this.stateMgr = StateManager.Instance;
        //this.stateMgr.addState(this.state = new PlayerState());
        this.state = new PlayerState(this);
        EventManager.instance.on("timeover", () => { this.timeover() });
    }

    start() {
        let colliders = this.getComponent(Collider2D);
        if(colliders)
        {
            colliders.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact, this);
        }

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;

        this.state.start();
        this.state.changeState("Intro");
    }

    update(deltaTime: number) {
        this.state.update(deltaTime);
    }

    onBeginContact(self: Collider2D, ohterCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.contact = true;
    }
    
    timeover() {
        this.state.changeState("TimeOver");
    }
}