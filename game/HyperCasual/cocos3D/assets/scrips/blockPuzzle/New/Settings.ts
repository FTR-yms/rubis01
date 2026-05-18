import { _decorator, Component, Node, macro } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Settings')
export class Settings extends Component {
    start() {
        macro.ENABLE_MULTI_TOUCH = false;
    }
}

