// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";
import store from "../data/store";

@ccclass('WindBoard')
export default class WindBoard extends Component {
    private leftNode: Node = null;
    private rightNode: Node = null;

    private leftWindNodes: Node[] = [];
    private rightWindNodes: Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.leftNode = this.node.getChildByName('left');
        this.rightNode = this.node.getChildByName('right');

        for (let i = 0; i < 3; i++) {
            const idx = i + 1;
            const node1 = this.leftNode.getChildByName(idx.toString());
            const node2 = this.rightNode.getChildByName(idx.toString());
            this.leftWindNodes.push(node1);
            this.rightWindNodes.push(node2);
        }

    }

    start() {
        GameMnager.Instance.node.on('startTurn', this.onStartTurn.bind(this));
    }

    onStartTurn() {
        const wind = store.wind;
        if (wind > 0) {
            this.leftNode.active = false;
            this.rightNode.active = true;
            for (let i = 0; i < 3; i++) {
                this.rightWindNodes[i].active = wind > i;
            }
        }
        else if (wind < 0) {
            this.leftNode.active = true;
            this.rightNode.active = false;
            for (let i = 0; i < 3; i++) {
                this.leftWindNodes[i].active = Math.abs(wind) > i;
            }
        }
        else {
            this.leftNode.active = false;
            this.rightNode.active = false;
        }
    }
}


/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// 
// import GameMnager from "../ctrl/gameManager";
// import store from "../data/store";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class WindBoard extends cc.Component {
// 
//     private leftNode : cc.Node = null;
//     private rightNode : cc.Node = null;
// 
//     private leftWindNodes : cc.Node[] = [];
//     private rightWindNodes : cc.Node[] = [];
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad () {
//         this.leftNode = this.node.getChildByName( 'left' );
//         this.rightNode = this.node.getChildByName( 'right' );
// 
//         for( let i = 0; i < 3; i++ ) {
//             const idx = i + 1;
//             const node1 = this.leftNode.getChildByName(idx.toString());
//             const node2 = this.rightNode.getChildByName(idx.toString());
//             this.leftWindNodes.push( node1 );
//             this.rightWindNodes.push( node2 );
//         }
// 
//     }
// 
//     start () {
//         GameMnager.Instance.node.on('startTurn', this.onStartTurn.bind(this));
//     }
// 
//     onStartTurn() {
//         const wind = store.wind;
//         if( wind > 0 ) {
//             this.leftNode.active = false;
//             this.rightNode.active = true;
//             for( let i = 0; i < 3; i++ ) {
//                 this.rightWindNodes[i].active = wind > i;
//             }
//         }
//         else if( wind < 0 ) {
//             this.leftNode.active = true;
//             this.rightNode.active = false;
//             for( let i = 0; i < 3; i++ ) {
//                 this.leftWindNodes[i].active = Math.abs(wind) > i;
//             }
//         }
//         else {
//             this.leftNode.active = false;
//             this.rightNode.active = false;
//         }
//     }
// 
//     // update (dt) {}
// }
