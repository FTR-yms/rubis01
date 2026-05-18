import { _decorator, Component, Node, UITransform, UI } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    private transform : UITransform = null;

    onLoad() {
        this.transform = this.getComponent(UITransform);
    }

    update()
    {
    }
}