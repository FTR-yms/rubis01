// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2, Sprite, find, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

import Matter from '../Module/matter.js';
import physics from '../ctrl/physics';
import { COLLISION_CATEGORY } from '../data/const';
import store from '../data/store';
import FireEffect from './fireEffect';
import BallFx from './ballFx';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_Basketball } from '../../Common/SoundNames';

@ccclass('Ball')
export default class Ball extends Component {
    @property(FireEffect)
    private fireEffect: FireEffect = null;

    @property(Node)
    private ballFx: Node = null;

    @property(UIOpacity)
    private opacity: UIOpacity = null;

    private body: Matter.Body = null;
    private prePosition: Vec2 = new Vec2();
    private isBounce: boolean = false;
    private sprite: Sprite | null = null;
    private shotAngleVelocity: number = 0;
    private bounceAngle: number = 0;
    private isCheck: boolean = false;
    private groundBounceCount: number = 0;
    private tempVector: Vec2 = new Vec2();
    private line: Vec2[] = [
        new Vec2(),
        new Vec2()
    ];
    //    // LIFE-CYCLE CALLBACKS:
    getIsCheck(): boolean {
        return this.isCheck;
    }
    setIsCheck(value: boolean) {
        this.isCheck = value;
    }
    onLoad() {
        this.sprite = find('sprite', this.node).getComponent(Sprite);

        this.body = Matter.Bodies.circle(0, 0, 22.5, {
            restitution: 0.7, frictionAir: 0,
            collisionFilter: {
                category: COLLISION_CATEGORY.ball,
                mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.t_chain
            }
        });

        Matter.Events.on(this.body, 'collisionStart', (e) => {
            this.node.emit('collisionStart', e);
        });
    }
    start() {
        this.node.active = false;
    }
    onEnable() {
        store.isActiveBall = true;
        physics.addBody(this.body);
    }
    onDisable() {
        store.isActiveBall = false;
        physics.removeBody(this.body);
    }
    update(dt) {
        this.prePosition.x = this.node.position.x;
        this.prePosition.y = this.node.position.y
        this.node.setPosition(this.body.position.x, this.body.position.y);

        if (!this.isBounce) {
            const angle = (this.sprite.node.angle + ((180 / Math.PI) * this.shotAngleVelocity)) % 360;
            this.sprite.node.angle = angle;
        }
        else {
            const angle = ((180 / Math.PI) * (this.bounceAngle + this.body.angle)) % 360;
            this.sprite.node.angle = angle;
        }

        if (this.groundBounceCount > 1) {
            this.opacity.opacity -= dt * 150;
            if (this.opacity.opacity <= 0) {
                this.node.active = false;
            }
        }
    }
    getMagnitue(): number {
        return Matter.Vector.magnitude(this.body.velocity);
    }
    onBounceRim() {
        const magnitude = this.getMagnitue();
        const vel = Matter.Vector.mult(this.body.velocity, store.config.rimReduce);
        Matter.Body.setVelocity(this.body, vel);

        if (magnitude > 5) {
            SoundManager.instance.setVolume(SfxNames_Basketball.Ball, 1);
            SoundManager.instance.playSfx(SfxNames_Basketball.Ball);
        }
        else {
            SoundManager.instance.setVolume(SfxNames_Basketball.Ball, (magnitude / 5));
            SoundManager.instance.playSfx(SfxNames_Basketball.Ball);
        }
    }
    onBounce(label: string) {
        if (label === 'wall') {
            this.groundBounceCount++;
        }

        if (this.isBounce) return;
        this.isBounce = true;
        this.bounceAngle = this.sprite.node.angle;
    }
    shot(x: number, y: number, vx: number, vy: number) {
        this.groundBounceCount = 0;
        this.opacity.opacity = 255;

        if (this.node.active) {
            this.ballFx.setPosition(this.node.position.x, this.node.position.y);
            this.ballFx.active = true;
            this.node.active = false;
        }

        this.node.active = true;

        this.isBounce = false;
        this.isCheck = false;

        this.tempVector.x = vx;
        this.tempVector.y = vy;
        this.node.setPosition(x, y);
        this.prePosition.x = this.node.position.x;
        this.prePosition.y = this.node.position.y

        const mag = Matter.Vector.magnitude(this.tempVector);
        const dir = this.tempVector.x > 0 ? 1 : -1;

        Matter.Body.setVelocity(this.body, this.tempVector);
        Matter.Body.setPosition(this.body, this.node.position);
        Matter.Body.setAngle(this.body, 0);
        this.shotAngleVelocity = dir * mag * 0.01;
        Matter.Body.setAngularVelocity(this.body, 0);
        console.log(Matter.Body);

        if (store.isFireBall) {
            SoundManager.instance.playSfxOneShot(SfxNames_Basketball.Fire);
            this.fireEffect.init(this.opacity);
        }
        else {
            this.fireEffect.node.active = false;
        }
    }
    getLine() {
        this.line[0].x = this.prePosition.x;
        this.line[0].y = this.prePosition.y;
        this.line[1].x = this.node.position.x;
        this.line[1].y = this.node.position.y;
        return this.line;
    }
}