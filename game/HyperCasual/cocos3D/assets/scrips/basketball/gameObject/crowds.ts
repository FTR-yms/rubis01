// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";

@ccclass('Crowds')
export default class Crowds extends Component {
    private spines: sp.Skeleton[] = [];

    onLoad() {
        for (let i = 0; i < 6; i++) {
            const node = this.node.getChildByName(i.toString());
            this.spines.push(node.getComponent(sp.Skeleton));
        }
    }

    start() {
        GameMnager.Instance.node.on('goal', this.onGoal.bind(this));
    }

    onGoal() {
        for (let i = 0; i < this.spines.length; i++) {
            this.spines[i].setAnimation(0, 'jump', false);
            this.spines[i].addAnimation(0, 'idle', true);
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
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class Crowds extends cc.Component {
// 
//     private spines : sp.Skeleton[] = [];
// 
//     onLoad () {
//         for( let i = 0; i < 6; i++ ) {
//             const node = this.node.getChildByName(i.toString());
//             this.spines.push( node.getComponent( sp.Skeleton ) );
//         }
//     }
// 
//     start () {
//         GameMnager.Instance.node.on( 'goal', this.onGoal.bind(this) );
//     }
// 
//     onGoal() {  
//         for( let i = 0; i < this.spines.length; i++ ) {
//             this.spines[i].setAnimation( 0, 'jump', false );
//             this.spines[i].addAnimation( 0, 'idle', true );
//         }
//     }
// 
//     // update (dt) {}
// }
