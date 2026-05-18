import { _decorator, Component, Node} from 'cc';
import { State } from './State';
const { ccclass, property } = _decorator;

@ccclass('StateManager')
export class StateManager extends Component {
    private static _instance = null;
    
    static get Instance() {
        if(!StateManager._instance)
        {
            console.log("not find StateManager");
            return null;
        }

        return StateManager._instance;
    }

    state = new Array();

    addState(state : State) {
        this.state.push(state);
    }

    onLoad() {
        StateManager._instance = this;
    }
    
    update(deltaTime: number) {
        for(let state of this.state)
        {
            state.update(deltaTime);
        }
    }
}

