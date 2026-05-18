import { _decorator, Component, macro, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component {

    @property
    private enableMutilTouch : boolean = false;

    protected onLoad(): void {
        macro.ENABLE_MULTI_TOUCH = this.enableMutilTouch;        
    }
}


