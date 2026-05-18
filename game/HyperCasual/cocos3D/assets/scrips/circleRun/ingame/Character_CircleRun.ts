// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, sp } from 'cc';
const { ccclass, property } = _decorator;

import SpriteAnimation from "../framework/SpriteAnimation";
import {
    CharacterAnimations,
    CharacterHitTime,
    CharacterJumpPower,
    CharacterJumpTime,
    CharacterState,
    CoinScore,
    GameEvent, IdCoinScore,
    MinSpeed
} from "../utilScript/Config_CircleRun";
import Coin_CircleRun from "./Coin_CircleRun";
import Hurdle_CircleRun from "./Hurdle_CircleRun";
import { EventManager } from "../../Common/EventManager";
import Store from "../utilScript/Store_CircleRun";
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_CircleRun } from '../../Common/SoundNames';

@ccclass('Character_CircleRun')
export default class Character_CircleRun extends Component {
    // collisionManager: CollisionManager | null = null;

    @property(sp.Skeleton)
    private spine: sp.Skeleton = null;

    @property(Collider2D)
    private collider: Collider2D = null;

    defaultY: number = 0;
    state: CharacterState = CharacterState.run;
    jumpTime: number = 0;
    hitTime: number = 0;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);

        this.defaultY = this.node.position.y;
        this.jumpTime = CharacterJumpTime;
    }
    start() {
        this.ready();
    }
    update(dt) {
        if (this.state === CharacterState.die) {
            return;
        }
        else if (this.state === CharacterState.jump) {
            this.jumpTime += dt * Store.speed / MinSpeed;

            this.setPositionY(this.defaultY + CharacterJumpPower * this.calculateJumpPower(this.jumpTime / CharacterJumpTime));

            if (this.jumpTime >= CharacterJumpTime) {
                this.jumpEnd();
            }
        }
        else {
            if (this.state === CharacterState.hit) {
                this.hitTime += dt;

                if (this.hitTime > CharacterHitTime) {
                    this.hitEnd();
                }
            }

            if (this.jumpTime < CharacterJumpTime) {
                this.jumpTime += dt;
                this.setPositionY(this.defaultY + CharacterJumpPower * this.calculateJumpPower(this.jumpTime / CharacterJumpTime));

                if (this.jumpTime > CharacterJumpTime) {
                    this.setPositionY(this.defaultY);
                }
            }
        }
    }
    ready() {
        this.state = CharacterState.ready;
        this.spine.setAnimation(0, "run", true);
        // this.spriteAnimation.playAnimation(CharacterAnimations.ready, true);
    }
    run() {
        this.state = CharacterState.run;
        this.spine.setAnimation(0, "run", true);
        // this.spriteAnimation.playAnimation(CharacterAnimations.run, true);
    }
    jump() {
        if (this.state !== CharacterState.run) {
            return;
        }
        SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Jump);
        this.state = CharacterState.jump;
        this.spine.setAnimation(0, "jump", false);
        // this.spriteAnimation.playAnimation(CharacterAnimations.jump, true);
        this.jumpTime = 0;
    }
    jumpEnd() {
        this.setPositionY(this.defaultY);
        this.run();
    }

    setPositionY(y: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x, y);
    }
    calculateJumpPower(x) {
        return -(Math.pow(x - 0.5, 2)) * 4 + 1;
    }
    hit() {
        Store.characterHitCount += 1;
        this.state = CharacterState.hit;
        this.spine.setAnimation(0, "hit01", false);
        // this.spriteAnimation.playAnimation(CharacterAnimations.hit, true);
        this.hitTime = 0;
        if (this.jumpTime < CharacterJumpTime / 2) {
            this.jumpTime = CharacterJumpTime - this.jumpTime;
        }
    }

    die() {
        this.state = CharacterState.die;
        this.spine.setAnimation(0, "die", false);
    }

    hitEnd() {
        this.run();
    }
    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("ASDAS");

        let coin = otherCollider.getComponent(Coin_CircleRun);
        let hurdle = otherCollider.getComponent(Hurdle_CircleRun);

        if (this.state !== CharacterState.hit && coin !== null && !coin.isPoped) {
            SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Coin);
            coin.pop();
            if (coin.isId) {
                EventManager.instance?.emit(GameEvent.scoreUp, IdCoinScore);
                EventManager.instance.emit(GameEvent.feverStart);
            }
            else {
                EventManager.instance?.emit(GameEvent.scoreUp, CoinScore);
            }
        }
        else if (this.state !== CharacterState.hit && !Store.isFever && hurdle !== null) {
            if (!hurdle.isHit) {
                SoundManager.instance.playSfxOneShot(SfxNames_CircleRun.Crush);
                EventManager.instance.emit(GameEvent.characterHit);
                hurdle.hit();
                this.hit();
            }
        }
    }
}