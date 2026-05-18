import { _decorator, Component, Node } from 'cc';
import { Player } from '../InGame/Player';
const { ccclass, property } = _decorator;

@ccclass('State')
export class State extends Component {

    protected oldState : string = null;
    protected curState : string = null;
    protected state : {} = {};
    protected unit : Player = null;

    changeState(state : string) {
        if(!state)
        {
            return;
        }

        if(this.curState !== null)
        {
            this.oldState = this.curState;
            this.state[this.oldState].exit();
        }

        this.curState = state;
        this.state[this.curState].enter();
    }

    setUnit(unit : Player) {
        this.unit = unit;
    }

    protected enter() {}
    protected update(deltaTime: number) {}
    protected exit() {}
}