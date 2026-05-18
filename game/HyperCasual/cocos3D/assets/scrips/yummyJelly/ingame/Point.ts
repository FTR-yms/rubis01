import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

import Following from "../fw/Following";
import { EventManager } from "../../Common/EventManager";
import { JELLY_COLOR } from '../config';
import Mathf from '../../Common/Mathf';

@ccclass('Point')
export default class Point extends Component {
    @property(sp.Skeleton)
    renderer: sp.Skeleton = null;

    following: Following = null;
    targetIndex: number = 0;
    onLoad() {
        this.following = this.node.getComponent(Following);
    }
    start() {
        this.renderer.getCurrent(0).trackTime = 1;
    }
    update(dt) {
        if (
            this.following.target != null &&
            Mathf.distance({ x: this.node.position.x, y: this.node.position.y }, { x: this.following.target.position.x, y: this.following.target.position.y }) < 30
        ) {
            EventManager.instance.emit('pointEnd', this.node, this.targetIndex);
        }
    }
    setPosition(x: number, y: number) {
        this.node.setPosition(x, y, 0);
    }
    setTarget(target: Node, targetIndex: number, color: number) {
        this.following = this.node.getComponent(Following);
        this.following.target = target;
        this.targetIndex = targetIndex;

        this.renderer.setSkin(JELLY_COLOR[color]);
    }
}

