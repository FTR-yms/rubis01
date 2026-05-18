// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";
import Mathf from '../../Common/Mathf';

@ccclass('Background')
export default class Background extends Component {

    @property(Node) private dayNode: Node = null;
    @property(Node) private nightNode: Node = null;
    @property(Node) private dayNode2: Node = null;
    @property(Node) private nightNode2: Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    start() {
        GameMnager.Instance.node.on('startGame', this.onStartGame.bind(this));
    }

    onStartGame() {
        const r = Mathf.randomInt(0, 2);
        if (r === 0) {
            this.dayNode.active = true;
            this.nightNode.active = false;
            this.dayNode2.active = true;
            this.nightNode2.active = false;
        }
        else {
            this.dayNode.active = false;
            this.nightNode.active = true;
            this.dayNode2.active = false;
            this.nightNode2.active = true;
        }
    }
}
