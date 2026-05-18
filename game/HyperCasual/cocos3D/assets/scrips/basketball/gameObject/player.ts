// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

import GameMnager from "../ctrl/gameManager";
import { SoundManager } from "../../Common/SoundManager";
import store from "../data/store";
import { SfxNames_Basketball } from '../../Common/SoundNames';

@ccclass('Player')
export default class Player extends Component {

    private spine: sp.Skeleton = null;

    onLoad() {
        this.spine = this.node.getComponent(sp.Skeleton);
        this.spine.setEventListener((track, event) => {

            switch (track.animation.name) {
                case 'bold':
                    break;
                case 'shoot': {
                    const x = this.node.position.x + 45;
                    const y = this.node.position.y - 169;
                    this.node.emit('shoot', x, y);
                    //
                    break;
                }
                case 'dribble':
                    //드리블 사운드
                    if (!store.isActiveBall && !store.isGameOver && store.isGameStart) {
                        SoundManager.instance.playSfxOneShot(SfxNames_Basketball.Ball);
                    }

                    break;
            }
        });
    }

    start() {
        GameMnager.Instance.node.on('readyGame', this.idle.bind(this));
        // GameMnager.Instance.node.on('startGame', this.idle.bind(this));
        // GameMnager.Instance.node.on('out', this.fail.bind(this));
        GameMnager.Instance.node.on('gameOver', this.fail.bind(this));
    }

    shot() {
        this.spine.setAnimation(0, 'shoot', false);
        this.spine.addAnimation(0, 'idle', true, 0);
    }

    idle() {
        this.spine.setAnimation(0, 'idle', true);
    }

    fail() {
        this.spine.setAnimation(0, 'die', false);
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
// import SoundManager from "../fw/SoundManager";
// import store from "../data/store";
//
// const {ccclass, property} = cc._decorator;
//
// @ccclass
// export default class Player extends cc.Component {
//
//     private spine : sp.Skeleton = null;
//
//     onLoad () {
//         this.spine = this.node.getComponent( sp.Skeleton );
//         this.spine.setEventListener( ( track, event ) => {
//
//             switch(event.data.name ) {
//                 case 'bold':
//                     break;
//                 case 'shoot' : {
//                     const x = this.node.position.x + 45;
//                     const y = this.node.position.y - 169;
//                     this.node.emit('shoot', x, y);
//                     //
//                     break;
//                 }
//                 case 'dribble':
//                     //드리블 사운드
//                     if(!store.isActiveBall && !store.isGameOver && store.isGameStart ) {
//                         SoundManager.Instance.playSound( 'ball', 0.5 );
//                     }
//
//                     break;
//             }
//         } );
//     }
//
//     start() {
//         GameMnager.Instance.node.on('startGame', this.idle.bind(this));
//         GameMnager.Instance.node.on('out', this.fail.bind(this));
//     }
//
//     shot() {
//         this.spine.setAnimation( 0, 'shoot', false );
//         this.spine.addAnimation(0, 'idle', true, 0);
//     }
//
//     idle() {
//         this.spine.setAnimation( 0, 'idle', true );
//     }
//
//     fail() {
//         this.spine.setAnimation( 0, 'die', false );
//     }
//
//     // update (dt) {}
// }
