import { _decorator, Component, Node } from 'cc';
import { FormatLabel } from './FormatLabel';
const { ccclass, property } = _decorator;

@ccclass('ResultPopup')
export class ResultPopup extends Component {
    @property(FormatLabel)
    private scoreLabel : FormatLabel = null;

    public open(score : number) {
        this.node.active = true;
        this.scoreLabel.setFormat(score);
    }

    public close() {
        this.node.active = false;
    }
}


