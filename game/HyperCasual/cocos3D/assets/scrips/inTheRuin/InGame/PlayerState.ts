import { _decorator, Component, Node, KeyCode, Animation, UITransform, RigidBody2D, ERigidBody2DType, sp, tween, Vec3, screen } from 'cc';
import { CANVAS_SIZE, GameState } from '../FrameWork/Config';
import { EventManager } from '../../Common/EventManager';
import { InputManager } from '../FrameWork/InputManager';
import { Pool, PoolKey } from '../FrameWork/Pool';
import { State } from '../FrameWork/State';
import Store from '../FrameWork/Store';
import { Player } from './Player';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_InTheRuin } from '../../Common/SoundNames';
const { ccclass, property } = _decorator;

@ccclass('PlayerState')
export class PlayerState extends State {

    protected curTrack: sp.spine.TrackEntry = null;
    protected aniTime: number = 0;

    constructor(unit: Player) {
        super();
        this.setUnit(unit);
    }

    start() {
        this.state["Intro"] = new Intro(this.unit);
        this.state["Idle"] = new Idle(this.unit);
        this.state["Select"] = new Select(this.unit);
        this.state["Step_00"] = new Step_00(this.unit);
        this.state["Step_01"] = new Step_01(this.unit);
        this.state["TimeOver"] = new TimeOver(this.unit);
        this.state["Fall"] = new Fall(this.unit);
    }

    protected enter() {
        super.enter();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        this.state[this.curState].update(deltaTime);
    }

    protected exit() {
        super.exit();
    }
}

class Intro extends PlayerState {
    enter() {
        // Pool.Instance.getObject(PoolKey.landeff).getComponent(Animation).play("dust");
        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_in", false);
    }

    update(deltaTime: number) {
        this.aniTime += deltaTime;

        if (this.curTrack.animationEnd < this.aniTime) {
            this.unit.state.changeState('Idle');
        }
    }

    exit() {
        this.aniTime = 0;
    }
}

class Idle extends PlayerState {
    enter() {
        Pool.Instance.getObject(PoolKey.landeff).getComponent(Animation).play("dust");

        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_idle", true);
    }

    update(deltaTime: number) {
        if (Store.gameState == GameState.TIMEOVER) {
            this.unit.state.changeState("TimeOver");
            return;
        }

        this.keyInput(deltaTime);
    }

    keyInput(deltaTime: number) {
        if (InputManager.Instance.getKeyDown(KeyCode.ARROW_RIGHT)) {
            this.unit.state.changeState('Step_01')
        }

        if (InputManager.Instance.getKeyDown(KeyCode.ARROW_LEFT)) {
            this.unit.state.changeState('Step_00')
        }
    }

    exit() {
        this.unit.contact = false;
    }
}

class Select extends PlayerState {
    enter() {
        super.enter();
    }

    update(deltaTime: number) {
        super.update(deltaTime);

    }

    exit() {
        super.exit();
    }
}

class Step_00 extends PlayerState {
    private endAni: boolean = false;

    enter() {
        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_jump", false);
        EventManager.instance.emit("StepUp", 1);
        tween(this.unit.node).to(0.1, { position: new Vec3(0, 100, 0) }).to(0.1, { position: new Vec3(0, 0, 0) }).call(() => { this.endAni = true; }).start();
    }

    update(deltaTime: number) {

        if (this.endAni) {
            if (this.unit.contact) {
                this.unit.state.changeState('Idle');
            }

            else {
                this.unit.state.changeState('Fall');
            }
        }
    }

    exit() {
        this.aniTime = 0;
        this.endAni = false;
    }
}

class Step_01 extends PlayerState {
    private endAni: boolean = false;
    enter() {
        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_jump", false);
        EventManager.instance.emit("StepUp", 2);
        tween(this.unit.node).to(0.1, { position: new Vec3(0, 100, 0) }).to(0.1, { position: new Vec3(0, 0, 0) }).call(() => { this.endAni = true; }).start();
    }

    update(deltaTime: number) {
        if (this.endAni) {
            if (this.unit.contact) {
                this.unit.state.changeState('Idle');
            }

            else {
                this.unit.state.changeState('Fall');
            }
        }
    }

    exit() {
        this.aniTime = 0;
        this.endAni = false;
    }
}

class TimeOver extends PlayerState {
    enter() {
        Store.gameState = GameState.TIMEOVER;
        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_idle", false);
    }

    update(deltaTime: number) {
        this.aniTime += deltaTime;

        if (this.curTrack.animationEnd + 0.5 < this.aniTime) {
            EventManager.instance.emit("GameOver");
        }
    }

    exit() {
        this.aniTime = 0;
    }
}

class Fall extends PlayerState {
    fall: boolean;

    veloY: number = 0;

    enter() {
        Store.gameState = GameState.FALL;
        this.curTrack = this.unit.getSpine().setAnimation(0, Store.charactor + "_idle", false);
        this.fall = true;

        let screenY = screen.windowSize.height + 300;

        tween(this.unit.node)
            .delay(0.7)
            .by(1.5, { position: new Vec3(0, -screenY, 0) }, { easing: "sineInOut" })
            .start();
    }

    update(deltaTime: number) {
        this.aniTime += deltaTime;
        if (this.fall && 0.8 < this.aniTime) {
            SoundManager.instance.playSfxOneShot(SfxNames_InTheRuin.FALL);
            this.fall = false;
        }

        // console.log(this.unit.node.position.y + (this.unit.getComponent(UITransform).contentSize.height / 2), - (CANVAS_SIZE.height / 2), Store.gameState);

        if (this.unit.node.position.y + (this.unit.getSpine().node.getComponent(UITransform).contentSize.height / 2) <
            -(CANVAS_SIZE.height / 2) && Store.gameState != GameState.READY) {
            //Store.gameState = GameState.READY;
            EventManager.instance.emit("GameOver");
        }
    }

    exit() {
        this.aniTime = 0;
    }
}