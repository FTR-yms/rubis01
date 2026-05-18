// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Node, Sprite, UIOpacity, UITransform, Color } from 'cc';
const { ccclass, property } = _decorator;

import { IParabolaData } from "../data/parabola";

@ccclass('GuideLine')
export default class GuideLine extends Component {
    @property(SpriteFrame) private spriteFrame = null;

    private dots: Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let i = 0; i < 20; i++) {
            const node = new Node(i.toString());
            const sprite = node.addComponent(Sprite)
            sprite.spriteFrame = this.spriteFrame;
            this.dots.push(node);
            this.node.addChild(node);
            node.getComponent(UITransform).setContentSize(9, 9);
            sprite.color = new Color(sprite.color.r, sprite.color.g, sprite.color.b, 255 * ((i + 1) / 20));
        }
    }

    start() {
        this.node.active = false;
    }

    draw(x, y, data: IParabolaData) {
        this.node.active = true;
        for (let i = 0; i < 20; i++) {
            const tt = (data.t / 20) * i;
            const x2 = x + (data.v * Math.cos(data.a) * tt);
            const y2 = y + ((data.v * Math.sin(data.a) * tt) - (0.5 * data.g * (tt * tt)));
            this.dots[i].setPosition(x2, y2);
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
// import { IParabolaData } from "../data/parabola";
// 
// const {ccclass, property} = cc._decorator;
// 
// @ccclass
// export default class GuideLine extends cc.Component {
// 
//     @property( cc.SpriteFrame ) private spriteFrame = null;
// 
//     private dots : cc.Node[] = [];
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad () {
//         for( let i = 0; i < 20; i++ ) {
//             const node = new cc.Node(i.toString());
//             node.addComponent( cc.Sprite ).spriteFrame = this.spriteFrame;
//             this.dots.push( node );
//             this.node.addChild( node );
//             node.width = 9;
//             node.height = 9;
//             node.opacity = 255 * ((i + 1) / 20);
//         }
//     }
// 
//     start() {
//         this.node.active = false;
//     }
// 
//     draw( x, y,  data : IParabolaData ) {
//         this.node.active = true;
//         for( let i = 0; i < 20; i++ )
//         {
//             const tt = (data.t / 20) * i;
//             const x2 = x + (data.v * Math.cos( data.a ) * tt);
//             const y2 = y + ((data.v * Math.sin( data.a ) * tt) - (0.5 * data.g * (tt * tt)));
//             this.dots[i].setPosition( x2, y2 );
//         }
//     }
// 
// 
// 
//     // update (dt) {}
// }
