import { _decorator, Component, director, Node, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PausePopup')
export class PausePopup extends Component {
    @property(Widget)
    private widgets: Widget[] = [];

    public onClickHomeButton() {
        this.close();
        // store.nextScene = "title";
        director.loadScene("loadScene");
    }
    public close(): void {
        director.getScheduler().setTimeScale(1);
        director.resume();


        this.node.active = false;
    }

    public open() {
        this.node.active = true;

        for (let widget of this.widgets) {
            widget.updateAlignment();
        }

        director.getScheduler().setTimeScale(0);
        director.pause();
    }
}


