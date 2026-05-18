import { _decorator, Component, Node, Animation } from 'cc';
import { Pool, PoolKey } from '../FrameWork/Pool';
const { ccclass, property } = _decorator;

@ccclass('Landeff')
export class Landeff extends Component {
    update(deltaTime: number) {
        if(this.getComponent(Animation).getState("dust").isMotionless)
        {
            Pool.Instance.returnObject(PoolKey.landeff, this.node);
        }
    }
}

