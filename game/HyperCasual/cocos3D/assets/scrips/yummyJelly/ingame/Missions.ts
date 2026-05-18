import { _decorator, Component, EventHandler, instantiate, Node, Prefab } from 'cc';
import { Mission } from './Mission';
import { JELLY_COLOR, MAX_NEED, MIN_NEED, MONSTER_COLOR } from '../config';
import { JellyBoss } from './JellyBoss';
import Mathf from '../../Common/Mathf';
const { ccclass, property } = _decorator;

@ccclass('Missions')
export class Missions extends Component {
    @property(Mission)
    missions: Mission[] = [];

    @property(EventHandler)
    private matchMission: EventHandler[] = [];

    @property(Prefab)
    private jellyCompleteEft: Prefab = null;

    @property(JellyBoss)
    private jellyBoss: JellyBoss = null;

    @property(Node)
    private boss: Node = null;

    colors = [];
    counts = [];
    colorQueue = [];

    gameStart() {
        this.missions.forEach(mission => { mission.gameStart(); });

        this.colors[0] = this.getNewColor();
        this.colors[1] = this.getNewColor();
        this.colors[2] = this.getNewColor();

        this.counts[0] = this.getRandomCount();
        this.counts[1] = this.getRandomCount();
        this.counts[2] = this.getRandomCount();

        this.setInfos();
    }

    reset() {
        this.colorQueue = [];

        for (let i = 0; i < JELLY_COLOR.length; ++i) {
            this.colorQueue[i] = i;
        }

        this.missions.forEach(mission => { mission.reset(); });

        this.counts[0] = 0;
        this.counts[1] = 0;
        this.counts[2] = 0;
    }

    getNewColor() {
        this.colorQueue.sort(() => Math.random() - Math.random());
        return this.colorQueue.pop();
    }

    getRandomCount() {
        return Mathf.randomInt(MIN_NEED, MAX_NEED);
    }

    setInfos() {
        try {
            for (let i = 0; i < this.colors.length; ++i) {
                this.missions[i].setInfo(this.colors[i], this.counts[i]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    countDown(index: number) {
        this.counts[index] = Math.max(this.counts[index] - 1, 0);
        this.missions[index].setCount(this.counts[index]);
    }

    newNeed(index: number) {
        if (this.counts[index] == 0) {
            let colorTemp = this.colors[index];
            this.colors[index] = this.getNewColor();
            this.returnColor(colorTemp);
            this.counts[index] = this.getRandomCount();


            // let obj: jellyCompleteEft = instantiate(this.jellyCompleteEft).getComponent(jellyCompleteEft);
            // this.scheduleOnce(() => {
            //     obj.setComplete(colorTemp);
            // }, 0)

            // obj.node.setParent(this.node.parent);
            // obj.node.setWorldPosition(this.missions[index].node.getWorldPosition());
            // obj.setTarget(this.boss, colorTemp);

            // this.jellyBoss.eat();

            this.matchMission.forEach(event => {
                event.emit([event.customEventData]);
            })

            this.missions[index].complete(this.colors[index], this.counts[index]);
        }
    }

    returnColor(color: number) {
        this.colorQueue.push(color);
    }

}


