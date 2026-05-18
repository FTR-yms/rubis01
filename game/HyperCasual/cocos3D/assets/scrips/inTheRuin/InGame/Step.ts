import { _decorator, Component, Node, KeyCode } from 'cc';
import { GameState } from '../FrameWork/Config';
import { InputManager } from '../FrameWork/InputManager';
import Store from '../FrameWork/Store';
const { ccclass, property } = _decorator;

@ccclass('Step')
export class Step extends Component {
    onStep() {
        if(Store.gameState == GameState.PLAY)
        {
            InputManager.Instance.setKey(KeyCode.ARROW_LEFT);
        }
        else
        {
            InputManager.Instance.setKey(KeyCode.ARROW_LEFT, false);
        }
    }

    twoStep() {
        if(Store.gameState == GameState.PLAY)
        {
            InputManager.Instance.setKey(KeyCode.ARROW_RIGHT);
        }
        else
        {
            InputManager.Instance.setKey(KeyCode.ARROW_LEFT, false);
        }
    }
}

