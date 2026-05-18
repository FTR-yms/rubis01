// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shadow')
export default class Shadow extends Component {
    @property(Node) ballShadow: Node = null;
    @property(UIOpacity) ballShadowOpacity: UIOpacity = null;
    @property(Node) baordShadow: Node = null;

    @property(Node) ballNode: Node = null;
    @property(Node) baordNode: Node = null
    @property(UIOpacity) boardShadowOpacity: UIOpacity = null;;


    update(dt) {
        if (this.ballNode.active) {
            this.ballShadow.active = true;
            this.ballShadow.setPosition(this.ballNode.position.x, this.ballShadow.position.y);

            const dstY = Math.abs(this.ballShadow.position.y - this.ballNode.position.y);
            const scale = dstY / 960;
            this.ballShadow.setScale(0.7 + scale, 0.7 + scale);
            this.ballShadowOpacity.opacity = 255 - (255 * scale);
        }
        else {
            this.ballShadow.active = false;
        }

        if (this.baordNode.active) {
            this.baordShadow.active = true;
            this.baordShadow.setPosition(this.baordNode.position.x, this.baordShadow.position.y);

            const dstY = Math.abs(this.baordShadow.position.y - this.baordNode.position.y);
            const scale = dstY / 540;
            this.baordShadow.setScale(0.1 + scale, 0.1 + scale);
            this.boardShadowOpacity.opacity = 255 - (100 * scale);

        }
        else {
            this.baordShadow.active = false;
        }

    }
}