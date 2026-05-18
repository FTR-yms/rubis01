import { _decorator, Component, Node } from 'cc';
import { EventHandlers } from '../../Common/EventHandlers';
const { ccclass, property } = _decorator;

@ccclass('FlowManager_TotemBreaker')
export class FlowManager_TotemBreaker extends Component {
    @property(EventHandlers)
    private gameStart: EventHandlers = null;

    @property(EventHandlers)
    private gameOver: EventHandlers = null;

    public onGameStart(): void {
        this.gameStart.invoke();
    }

    public onGameOver(): void {
        this.gameOver.invoke();
    }
}


