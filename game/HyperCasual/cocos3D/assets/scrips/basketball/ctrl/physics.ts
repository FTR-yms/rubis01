import Matter from '../Module/matter.js';

class Physics {

    engine: Matter.Engine = Matter.Engine.create();
    runner: Matter.Runner = Matter.Runner.create();
    world: Matter.World = this.engine.world;

    constructor() {

        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            const length = event.pairs.length;
            for (let i = 0; i < length; i++) {
                const pair = event.pairs[i];
                this.trigger(pair.bodyA, 'collisionStart', { otherBody: pair.bodyB });
                this.trigger(pair.bodyB, 'collisionStart', { otherBody: pair.bodyA });
            }
        });

        this.engine.world.gravity.y = -1;
    }

    update(dt: number) {
        if (dt > 0) {
            Matter.Engine.update(this.engine, 1000 / 60);
        }
    }

    addBody(body: Matter.Body | Matter.Body[] | Matter.Composite | Matter.Composite[]) {
        Matter.World.add(this.world, body);
    }

    removeBody(body: Matter.Body | Matter.Composite) {
        Matter.World.remove(this.world, body);
    }

    trigger(object: any, eventName: string, event: any) {
        Matter.Events.trigger(object, eventName, event);
    }
}

export default new Physics();