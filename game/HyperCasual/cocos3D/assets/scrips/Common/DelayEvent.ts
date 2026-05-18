import { _decorator, Component, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DelayEvent')
export class DelayEvent extends Component {
    @property
    private onEanble : boolean = false;

    @property
    private delay : number = 0;

    @property(EventHandler)
    private events : EventHandler[] = [];

    protected onEnable(): void {
        if(this.onEanble) {
            this.invoke();
        }
    }

    public invoke()
    {
        this.scheduleOnce(this.call, this.delay);
    }

    public call() {
        for(let e of this.events) {
            e.emit([e.customEventData]);
        }
    }
}


