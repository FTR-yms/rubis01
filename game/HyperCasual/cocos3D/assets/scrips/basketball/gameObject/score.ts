// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, tween } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";
import ImageFont from '../../Common/ImageFont';

@ccclass('Score')
export default class Score extends Component {
    public static Instance: Score = null;

    private label: ImageFont = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Score.Instance = this;
        this.label = this.node.getComponent(ImageFont);
    }

    start() {
        this.node.active = false;
    }

    addScore(x: number, y: number, score: number) {

        this.node.active = true;

        const oriY = y;
        this.node.setPosition(x, y);
        this.label.setText(score.toString());
        const targetPos = this.node.position.clone();
        targetPos.y += 80;
        const t = tween(this.node)
            .to(1, { position: targetPos }, { easing: 'circOut' })
            .call(() => {
                this.node.active = false;
            })
            .start();
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
// import ImageFont from "../fw/ImageFont";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class Score extends cc.Component {
// 
//     public static Instance : Score = null;
// 
//     private label : ImageFont = null;
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad () {
//         Score.Instance = this;
//         this.label = this.node.getComponent( ImageFont );
//     }
// 
//     start() {
//         this.node.active = false;
//     }
// 
//     addScore( x : number, y : number, score : number ) {
// 
//         this.node.active = true;
// 
//         const oriY = y;
//         this.node.setPosition( x, y );
// 
//         this.label.setText( score.toString() );
//         const tween = cc.tween( this.node )
//             .to( 1, { y : oriY + 80 }, {easing : 'circOut'}  )
//             .call(()=>{
//                 this.node.active = false;
//             })
//             .start();
//     }
// 
//     
//     // update (dt) {}
// }
