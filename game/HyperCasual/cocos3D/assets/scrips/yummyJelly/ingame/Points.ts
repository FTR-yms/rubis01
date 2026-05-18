import { _decorator, Component, Prefab, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import Point from "./Point";
import { EventManager } from "../../Common/EventManager";
import { Pool } from '../../Common/Pool';

@ccclass('Points')
export default class Points extends Component {
    @property(Pool)
    private pool: Pool = null
    start() {
        EventManager.instance.on('pointEnd', (pointNode) => {
            this.pool.return(pointNode);
        })
    }
    // update (dt) {}
    reset() {

    }
    addNewPoint(pos: Vec3, target: Node, targetIndex: number, color: number) {
        let node = this.pool.get() as Node;

        let point = node.getComponent(Point);
        point.node.setWorldPosition(pos);
        point.setTarget(target, targetIndex, color);
    }
}