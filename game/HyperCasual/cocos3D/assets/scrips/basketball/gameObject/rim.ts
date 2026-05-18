// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import Matter from '../Module/matter.js';
import { COLLISION_CATEGORY } from '../data/const';
import physics from '../ctrl/physics';
import Shake from '../ctrl/shake';
import store from '../data/store';
import GameMnager from '../ctrl/gameManager';
import Mathf from '../../Common/Mathf';
import Chain from './chain';

@ccclass('Rim')
export default class Rim extends Component {

    @property(Chain) chainNode: Chain = null;
    @property(Shake) shakeAction: Shake = null;
    @property(Node) cloneRim: Node = null;

    rimBody: Matter.Body[] = [];
    body: Matter.Body[] = [];

    private bodyPoints: Vec2[] = [];
    private tempVector: Vec2 = new Vec2();

    private lines: Vec2[] = [];


    onLoad() {
        for (let i = 0; i < 2; i++) {
            this.rimBody.push(Matter.Bodies.circle(0, 0, 5, {
                isStatic: true,
                collisionFilter: {
                    category: COLLISION_CATEGORY.rim,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain
                }
            }));
            this.rimBody[i].label = 'rim';
        }

        for (let i = 0; i < 5; i++) {
            this.body.push(Matter.Bodies.circle(0, 0, 5, {
                isStatic: true,
                collisionFilter: {
                    category: COLLISION_CATEGORY.t_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.ball,
                }
            }));
        }

        this.bodyPoints[0] = new Vec2(-35, 0);
        this.bodyPoints[1] = new Vec2(35, 0);
        this.bodyPoints[2] = new Vec2(-19, 0);
        this.bodyPoints[3] = new Vec2(19, 0);
        this.bodyPoints[4] = new Vec2(0, 0);

        this.lines[0] = new Vec2(0, 0);
        this.lines[1] = new Vec2(0, 0);

        this.chainNode.setRimBody(this.body);
    }

    start() {
        GameMnager.Instance.node.on('readyGame', this.readyGame.bind(this));
        GameMnager.Instance.node.on('startTurn', this.onStartTurn.bind(this));

        this.readyGame();
    }

    readyGame() {
        this.setPosition(0, 0);

        // const pos = this.node.position;
        // this.cloneRim.setPosition(pos);
        // this.cloneRim.angle = this.node.angle;

        // for (let i = 0; i < this.bodyPoints.length; i++) {
        //     this.bodyPoints[i].x = this.body[i].position.x - pos.x;
        //     this.bodyPoints[i].y = this.body[i].position.y - pos.y;
        // }

        this.setActive(false);
    }

    onEnable() {
        physics.addBody(this.rimBody[0]);
        physics.addBody(this.rimBody[1]);

        for (let i = 0; i < this.body.length; i++) {
            physics.addBody(this.body[i]);
        }
    }

    onDisable() {
        physics.removeBody(this.rimBody[0]);
        physics.removeBody(this.rimBody[1]);
        for (let i = 0; i < this.body.length; i++) {
            physics.removeBody(this.body[i]);
        }
    }

    onStartTurn() {
        this.setActive(true);
        this.setRandomPos();
    }

    setActive(active: boolean) {
        this.node.active = active;
        this.cloneRim.active = active;
        this.chainNode.node.active = active;
    }

    setPosition(x, y) {
        this.node.setPosition(x, y);

        this.tempVector.x = x + this.bodyPoints[0].x - 5;
        this.tempVector.y = y + this.bodyPoints[0].y;
        Matter.Body.setPosition(this.rimBody[0], this.tempVector);

        this.tempVector.x = x + this.bodyPoints[1].x + 5;
        this.tempVector.y = y + this.bodyPoints[1].y;
        Matter.Body.setPosition(this.rimBody[1], this.tempVector);


        for (let i = 0; i < this.bodyPoints.length; i++) {
            this.tempVector.x = x + this.bodyPoints[i].x;
            this.tempVector.y = y + this.bodyPoints[i].y;
            Matter.Body.setPosition(this.body[i], this.tempVector);
        }

        this.chainNode.setPosition();

        const pos = this.node.position;
        this.cloneRim.setPosition(pos);
        this.cloneRim.angle = this.node.angle;

        for (let i = 0; i < this.bodyPoints.length; i++) {
            this.bodyPoints[i].x = this.body[i].position.x - pos.x;
            this.bodyPoints[i].y = this.body[i].position.y - pos.y;
        }
    }

    setRotataion(r) {
        this.node.rotation = r;
    }

    shake() {
        this.shakeAction.enabled = true;
        this.chainNode.shake();
    }

    getLine() {
        this.lines[0].x = this.node.position.x + this.bodyPoints[0].x;
        this.lines[0].y = this.node.position.y + this.bodyPoints[0].y;
        this.lines[1].x = this.node.position.x + this.bodyPoints[1].x;
        this.lines[1].y = this.node.position.y + this.bodyPoints[1].y;

        return this.lines;
    }

    setRandomPos() {
        const rx = Mathf.randomInt(store.minX, store.maxY);
        const ry = Mathf.randomInt(store.minY, store.maxY);
        this.setPosition(rx, ry);
        this.shake();
    }

    update(dt) {

    }
}
