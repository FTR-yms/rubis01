import { _decorator, Component, misc, Node, sp, UIOpacity, UITransform, Vec3 } from 'cc';
import { BOARD_SIZE, JELLY_COLOR, MONSTER_COLOR, MONSTER_DISTANCE } from '../config';
import { EventManager } from '../../Common/EventManager';
import { TimeGauge } from './TimeGauge';
import { State } from '../../inTheRuin/FrameWork/State';
import { SoundManager } from '../../Common/SoundManager';
import { SfxNames_YummyJelly } from '../../Common/SoundNames';
import Mathf from '../../Common/Mathf';
const { ccclass, property } = _decorator;

@ccclass('Jelly')
export class Jelly extends Component {
    @property(sp.Skeleton)
    monsterRenderer: sp.Skeleton = null;

    @property(Node)
    line: Node = null;
    lineTransform: UITransform = null;
    lineParent: Node = null;

    private readonly lineHeight = 20;

    isTrancePoint: boolean = false;
    move: boolean = false;

    color: number = 0;
    jellyOpac: UIOpacity = null;

    target: Node | null = null;
    targetIndex: number = 0;

    private noRandomAnimation: boolean = false;

    private isBind: boolean = false;


    @property
    actionPercentage: number = 4;

    aroundShape: number[] = [1, 2, 3];
    sleepShape: number[] = [3, 2, 1];

    currentState: State = null;

    cellPos: {
        x: number,
        y: number,
    } = {
            x: -1,
            y: -1
        };

    protected onLoad(): void {
        this.lineTransform = this.line.getComponent(UITransform);
        this.jellyOpac = this.node.getComponent(UIOpacity);
    }

    trancePoint(target: Node, index: number) {
        this.isTrancePoint = true;

        let i = this.monsterRenderer.setAnimation(0, 'pop', false);

        this.scheduleOnce(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_YummyJelly.Remove);
        }, 0.2);

        this.scheduleOnce(() => {
            this.jellyOpac.opacity = 0;
            // this.monsterRenderer.setAnimation(0, 'idle_basic', false);
            // Game.Instance.points.addNewPoint(this.node.getWorldPosition(), this.target, this.targetIndex, this.color);
            EventManager.instance.emit('trancePointEnd', this.node.getWorldPosition(), target, index, this.color);
        }, i.animationEnd);

        this.target = target;
        this.targetIndex = index;

        this.line.active = false;
    }

    setColor(color: number) {
        this.color = color;
        this.monsterRenderer.setSkin(JELLY_COLOR[this.color]);
    }
    appear() {
        this.monsterRenderer.setAnimation(0, 'landing', false);
        this.monsterRenderer.addAnimation(0, 'idle_basic', true);
        // this.monsterRenderer.setAnimation(0, 'idle_basic', true);
        this.jellyOpac.opacity = 255;
        this.noRandomAnimation = false;
        this.isBind = false;

        this.schedule(() => {
            if (this.noRandomAnimation) {
                return;
            }

            let i = Mathf.randomInt(0, 10);
            let actionValue = TimeGauge.instance.ActionTimerValue;

            let aroundShapePercent = this.aroundShape[actionValue];
            let sleepShaoePercent = this.sleepShape[actionValue];

            let track: sp.spine.TrackEntry = null;

            if (i < aroundShapePercent) {
                track = this.monsterRenderer.setAnimation(0, "idle_look_around", false);
                this.monsterRenderer.addAnimation(0, "idle_basic", true);
                this.noRandomAnimation = true;
            }
            else if (i < aroundShapePercent + sleepShaoePercent) {
                track = this.monsterRenderer.setAnimation(0, "idle_snooze", false);
                this.monsterRenderer.addAnimation(0, "idle_basic", true);
                this.noRandomAnimation = true;
            }

            if (track != null) {
                this.scheduleOnce(() => {
                    if (this.isBind == true) {
                        return;
                    }

                    this.noRandomAnimation = false;
                }, track.animationEnd);
            }


        }, 1.0);
    }
    setPosition(x: number, y: number) {
        this.cellPos.x = x;
        this.cellPos.y = y;
        this.node.setPosition(new Vec3(MONSTER_DISTANCE * x, -(MONSTER_DISTANCE * y)));
    }
    bind(beforeWay: number, pos: Vec3) {
        this.monsterRenderer.setAnimation(0, 'selected', false);
        this.monsterRenderer.addAnimation(0, 'selected_idle', true);
        this.noRandomAnimation = true;
        this.isBind = true;

        if (beforeWay == -1) {
            return;
        }

        this.line.active = true;

        let distance = Vec3.distance(this.node.position, pos);
        this.lineTransform.setContentSize(distance, this.lineHeight);

        let minus: Vec3 = new Vec3();
        minus = Vec3.subtract(minus, this.node.position, pos);

        let degree = misc.radiansToDegrees(Math.atan2(minus.y, minus.x));

        this.line.eulerAngles = new Vec3(0, 0, degree);

        let worldPos = this.line.getWorldPosition();
        this.line.setParent(this.lineParent);
        this.line.setWorldPosition(worldPos);

    }
    bindCancel() {
        this.monsterRenderer.setAnimation(0, 'release', false);
        this.monsterRenderer.addAnimation(0, 'idle_basic', true);

        let worldPos = this.line.getWorldPosition();
        this.line.setParent(this.node);
        this.line.setWorldPosition(worldPos);

        this.line.active = false;
        this.noRandomAnimation = false;
        this.isBind = false;
    }

    magicAttack() {
        EventManager.instance.emit('attackEnd');
    }

    gameOver() {
        this.monsterRenderer.setAnimation(0, 'laugh', true);
    }

    die() {
        let i = this.monsterRenderer.setAnimation(0, 'disappear', false);

        this.scheduleOnce(() => {
            SoundManager.instance.playSfxOneShot(SfxNames_YummyJelly.Remove);
        }, 0.2);

        this.scheduleOnce(() => {
            this.jellyOpac.opacity = 0;
            EventManager.instance.emit('dieEnd');
        }, i.animationEnd);

        this.line.active = false;
    }

    reset() {
        let worldPos = this.line.getWorldPosition();
        this.line.setParent(this.node);
        this.line.setWorldPosition(worldPos);
    }

    setState(state: State) {
        this.currentState = state;
    }

    protected update(dt: number): void {

        if (this.move) {
            let pos = this.node.getPosition();
            pos.y -= 700 * dt;
            this.node.setPosition(pos);

            if (this.node.position.y < -(MONSTER_DISTANCE * this.cellPos.y)) {
                this.move = false;
                let pos = this.node.getPosition();
                pos.y = -(MONSTER_DISTANCE * this.cellPos.y);
                this.node.setPosition(pos);
                this.node.setSiblingIndex(Math.floor(this.cellPos.y * BOARD_SIZE.width + this.cellPos.x));
                EventManager.instance.emit('moveEnd');
                this.monsterRenderer.setAnimation(0, 'landing', false);
                this.monsterRenderer.addAnimation(0, 'idle_basic', true);

            }
        }
    }

    movePosition(x: number, y: number) {
        this.cellPos.x = x;
        this.cellPos.y = y;
        this.move = true;
    }
}


