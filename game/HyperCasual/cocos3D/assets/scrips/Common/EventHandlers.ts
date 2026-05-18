import { _decorator, Component, EventHandler, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventHandlers')
export class EventHandlers extends Component {
    @property(EventHandler)
    events: EventHandler[] = [];

    public invoke() {
        this.events.forEach(event => {
            event.emit([event.customEventData]);
        })
    }
}


