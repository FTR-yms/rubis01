// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, sp, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Perfect')
export default class Perfect extends Component {
    // LIFE-CYCLE CALLBACKS:
    static Instance: Perfect = null;

    private spine: sp.Skeleton = null;

    onLoad() {
        Perfect.Instance = this;
        this.spine = this.node.getComponent(sp.Skeleton);
    }

    start() {
        this.node.active = false;
    }

    init(x, y) {

        this.node.active = true;
        this.node.setPosition(x, y);
        this.spine.setAnimation(0, 'in', false);

        const t = tween(this.node)
            .delay(5667)
            .call(() => {
                this.node.active = true;
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
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class Perfect extends cc.Component {
// 
//     // LIFE-CYCLE CALLBACKS:
//     static Instance : Perfect = null;
// 
//     private spine : sp.Skeleton = null;
// 
//     onLoad () {
//         Perfect.Instance = this;
//         this.spine = this.node.getComponent( sp.Skeleton );
//     }
// 
//     start() {
//         this.node.active = false;
//     }
// 
//     init( x, y ) {
// 
//         this.node.active = true;
// 
//         this.node.x = x;
//         this.node.y = y;
// 
//         this.spine.setAnimation(0, 'in', false );
// 
//         const tween = cc.tween( this.node )
//             .delay(5667)
//             .call(()=>{
//                 this.node.active = true;
//             }) 
//             .start();
//     }
// 
//     // update (dt) {}
// }
