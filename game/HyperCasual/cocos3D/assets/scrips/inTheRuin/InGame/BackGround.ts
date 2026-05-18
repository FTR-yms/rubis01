import { _decorator, Component, Node, screen, Tween } from 'cc';
import { BackGroundType, CANVAS_SIZE } from '../FrameWork/Config';
const { ccclass, property } = _decorator;

@ccclass('BackGround')
export class BackGround extends Component {
    private type : BackGroundType = null;

    set Type(type : BackGroundType) {
        this.type = type;
    }
    get Type(){
        return this.type;
    }
}

