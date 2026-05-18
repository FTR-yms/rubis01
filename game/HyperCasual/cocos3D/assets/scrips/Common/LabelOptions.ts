import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelOptions')
export class LabelOptions extends Component {
    @property
    private letter: number = 0;

    protected start(): void {
        const label = this.getComponent(Label);

        label.spacingX = 100;
    }
}


