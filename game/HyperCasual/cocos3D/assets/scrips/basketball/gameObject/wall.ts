// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import Matter from '../Module/matter.js';
import physics from '../ctrl/physics';

@ccclass('Wall')
export default class Wall extends Component {
    private body: Matter.Body = null;

    onLoad() {
        this.body = Matter.Bodies.rectangle(0, -460, 960, 50, { isStatic: true });
        this.body.label = 'wall';
    }

    onEnable() {
        physics.addBody(this.body);
        this.node.setPosition(this.body.position.x, this.body.position.y);
    }

    onDisable() {
        physics.removeBody(this.body);
    }

}
