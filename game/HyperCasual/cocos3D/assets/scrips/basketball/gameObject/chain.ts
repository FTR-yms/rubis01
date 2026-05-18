// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, Sprite, Vec2, Node } from 'cc';
const { ccclass, property } = _decorator;

import Rim from "./rim";
import Matter from '../Module/matter.js';
import { COLLISION_CATEGORY } from "../data/const";
import physics from "../ctrl/physics";

@ccclass('Chain')
export default class Chain extends Component {
    @property(SpriteFrame)
    private chainSprite: SpriteFrame = null;

    private chainHeight: number = 13;
    private chainCount: number = 3;
    private group: number[] = [];
    private rope: Matter.Composite[] = [];
    private constraint: Matter.Constraint[] = [];
    private sprites: Sprite[][] = [];
    private tempVector: Vec2 = new Vec2();

    setRimBody(body : Matter.Body[]) {
        this.group[0] = Matter.Body.nextGroup(true);
        this.rope[0] = Matter.Composites.stack(body[0].position.x, body[0].position.y, this.chainCount, 1, 0, 0, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, this.chainHeight, 5, {
                collisionFilter: {
                    category: COLLISION_CATEGORY.c_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain ^ COLLISION_CATEGORY.rim,
                    group: this.group[0]
                }
            });
        });
        this.constraint[0] = Matter.Constraint.create({
            bodyA: body[0],
            bodyB: this.rope[0].bodies[0],
            stiffness: 0,
        });
        Matter.Composites.chain(this.rope[0], 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 3 });
        Matter.Composite.add(this.rope[0], this.constraint[0]);

        this.group[1] = Matter.Body.nextGroup(true);
        this.rope[1] = Matter.Composites.stack(body[1].position.x, body[1].position.y, this.chainCount, 1, 0, 0, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, this.chainHeight, 5, {
                collisionFilter: {
                    category: COLLISION_CATEGORY.c_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain ^ COLLISION_CATEGORY.rim,
                    group: this.group[1]
                }
            });
        });
        this.constraint[1] = Matter.Constraint.create({
            bodyA: body[1],
            bodyB: this.rope[1].bodies[0],
            stiffness: 0,
        });
        Matter.Composites.chain(this.rope[1], 0.5, 0.05, -0.5, 0, { stiffness: 0.8, length: 3 });
        Matter.Composite.add(this.rope[1], this.constraint[1]);

        this.group[2] = Matter.Body.nextGroup(true);
        this.rope[2] = Matter.Composites.stack(body[2].position.x, body[2].position.y, this.chainCount, 1, 0, 0, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, this.chainHeight, 5, {
                collisionFilter: {
                    category: COLLISION_CATEGORY.c_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.ball ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain ^ COLLISION_CATEGORY.rim,
                    group: this.group[2]
                }
            });
        });
        this.constraint[2] = Matter.Constraint.create({
            bodyA: body[2],
            bodyB: this.rope[2].bodies[0],
            pointB: { x: 0, y: 0 },
            pointA: { x: 0, y: 0 },
            stiffness: 0.5,
        });
        Matter.Composites.chain(this.rope[2], 0.5, 0, -0.5, 0, { stiffness: 0.9, length: 3 });
        Matter.Composite.add(this.rope[2], this.constraint[2]);

        this.group[3] = Matter.Body.nextGroup(true);
        this.rope[3] = Matter.Composites.stack(body[3].position.x, body[3].position.y, this.chainCount, 1, 0, 0, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, this.chainHeight, 5, {
                collisionFilter: {
                    category: COLLISION_CATEGORY.c_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.ball ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain ^ COLLISION_CATEGORY.rim,
                    group: this.group[3]
                }
            });
        });
        this.constraint[3] = Matter.Constraint.create({
            bodyA: body[3],
            bodyB: this.rope[3].bodies[0],
            pointB: { x: 0, y: 0 },
            pointA: { x: 0, y: 0 },
            stiffness: 0.5,
        });
        Matter.Composites.chain(this.rope[3], 0.5, 0, -0.5, 0, { stiffness: 0.9, length: 3 });
        Matter.Composite.add(this.rope[3], this.constraint[3]);


        this.group[4] = Matter.Body.nextGroup(true);
        this.rope[4] = Matter.Composites.stack(body[4].position.x, body[4].position.y, this.chainCount, 1, 0, 0, (x: number, y: number) => {
            return Matter.Bodies.rectangle(x, y, this.chainHeight, 5, {
                collisionFilter: {
                    category: COLLISION_CATEGORY.c_chain,
                    mask: 0xFFFFFFFF ^ COLLISION_CATEGORY.ball ^ COLLISION_CATEGORY.t_chain ^ COLLISION_CATEGORY.c_chain ^ COLLISION_CATEGORY.rim,
                    group: this.group[4]
                }
            });
        });
        this.constraint[4] = Matter.Constraint.create({
            bodyA: body[4],
            bodyB: this.rope[4].bodies[0],
            pointB: { x: 0, y: 0 },
            pointA: { x: 0, y: 0 },
            stiffness: 0.5,
        });
        Matter.Composites.chain(this.rope[4], 0.5, 0, -0.5, 0, { stiffness: 0.9, length: 3 });
        Matter.Composite.add(this.rope[4], this.constraint[4]);




        for (let i = 0; i < this.rope.length; i++) {
            this.sprites[i] = [];
            for (let j = 0; j < this.chainCount; j++) {
                const node = new Node(`chain_${i}_${j}`);
                this.node.addChild(node);
                const sprite = node.addComponent(Sprite);
                sprite.spriteFrame = this.chainSprite;
                this.sprites[i].push(sprite);
            }
        }
    }
    onEnable() {
        for (let i = 0; i < this.rope.length; i++) {
            physics.addBody(this.rope[i]);
        }
    }
    onDisable() {
        for (let i = 0; i < this.rope.length; i++) {
            physics.removeBody(this.rope[i]);
        }
    }
    setPosition() {
        const rootX = this.node.parent.position.x;
        const rootY = this.node.parent.position.y + 10;
        const posX = [-30, 30, -19, 19, 0];

        for (let i = 0; i < this.sprites.length; i++) {
            const sprites = this.sprites[i];
            for (let j = 0; j < sprites.length; j++) {
                const body = this.rope[i].bodies[j];
                this.tempVector.x = rootX + posX[i];
                this.tempVector.y = rootY - 9 - i * 17;
                Matter.Body.setPosition(body, this.tempVector);
            }
        }
    }
    shake() {
        this.tempVector.x = 5;
        this.tempVector.y = 5;

        for (let i = 0; i < this.rope.length; i++) {
            Matter.Body.setVelocity(this.rope[i].bodies[1], this.tempVector);
        }
    }
    update(dt) {
        for (let i = 0; i < this.sprites.length; i++) {
            const sprites = this.sprites[i];

            for (let j = 0; j < sprites.length; j++) {
                const body = this.rope[i].bodies[j];
                const x = body.position.x - this.node.parent.position.x;
                const y = body.position.y - this.node.parent.position.y;

                this.sprites[i][j].node.setPosition(x, y);
                this.sprites[i][j].node.angle = (180 / Math.PI) * ((Math.PI / 2) + body.angle);
            }
        }
        // console.log( this.rope[0].bodies[0].position.x, this.rope[1].bodies[0].position.x, this.rope[2].bodies[0].position.x, this.rope[3].bodies[0].position.x );

    }
}
