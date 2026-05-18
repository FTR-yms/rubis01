// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, sp, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { BackgroundFeverChangeTime, BackgroundSize, BackgroundSpeed, DefaultSkySpeed } from "../utilScript/Config_CircleRun";
import Store from "../utilScript/Store_CircleRun";

@ccclass('Background_CircleRun')
export default class Background_CircleRun extends Component {
    @property(Node) ground: Node = null;
    @property(Node) brush: Node = null;
    @property(Node) mountain: Node = null;
    @property(Node) sky: Node = null;

    @property(Node) feverGround: Node = null;
    @property(Node) feverBrush: Node = null;
    @property(Node) feverMountain: Node = null;
    @property(Node) feverSky: Node = null;

    @property(UITransform) fever: UITransform = null;
    @property(sp.Skeleton) feverSpine: sp.Skeleton = null;
    normalNodes: Node[] = null;
    feverNodes: Node[] = null;
    isFever: boolean = false;
    groundAngle: number = 0;
    brushAngle: number = 0;
    mountainAngle: number = 0;
    skyAngle: number = 0;
    feverOpenTime = 0;
    //    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.normalNodes = [];
        this.normalNodes.push(this.ground);
        this.normalNodes.push(this.brush);
        this.normalNodes.push(this.mountain);
        this.normalNodes.push(this.sky);

        this.feverNodes = [];
        this.feverNodes.push(this.feverGround);
        this.feverNodes.push(this.feverBrush);
        this.feverNodes.push(this.feverMountain);
        this.feverNodes.push(this.feverSky);

        this.feverEnd();

        this.groundAngle = Math.random() * 360;
        this.brushAngle = Math.random() * 360;
        this.mountainAngle = Math.random() * 360;
        this.skyAngle = Math.random() * 360;

        this.feverSpine.setCompleteListener(() => {
            this.feverSpine.node.active = false;
        });

        this.feverSpine.node.active = false;

        this.isFever = false;
        this.feverOpenTime = BackgroundFeverChangeTime;
    }
    start() {

    }
    update(dt) {
        this.groundAngle += (dt * Store.speed * BackgroundSpeed.ground) % 360;
        this.brushAngle += (dt * Store.speed * BackgroundSpeed.brush) % 360;
        this.mountainAngle += (dt * Store.speed * BackgroundSpeed.mountain) % 360;
        this.skyAngle += (dt * Store.speed * BackgroundSpeed.sky + DefaultSkySpeed * dt) % 360;

        this.ground.angle = this.groundAngle;
        this.brush.angle = this.brushAngle;
        this.mountain.angle = this.mountainAngle;
        this.sky.angle = this.skyAngle;
        this.feverGround.angle = this.groundAngle;
        this.feverBrush.angle = this.brushAngle;
        this.feverMountain.angle = this.mountainAngle;
        this.feverSky.angle = this.skyAngle;

        if (this.isFever && this.feverOpenTime < BackgroundFeverChangeTime) {
            this.feverOpenTime += dt;

            this.fever.width = BackgroundSize.width * this.feverOpenTime / BackgroundFeverChangeTime;
            this.fever.height = BackgroundSize.height * this.feverOpenTime / BackgroundFeverChangeTime;

            if (this.feverOpenTime >= BackgroundFeverChangeTime) {
                this.fever.width = BackgroundSize.width;
                this.fever.height = BackgroundSize.height;
            }
        }

        if (!this.isFever && this.feverOpenTime < BackgroundFeverChangeTime) {
            this.feverOpenTime += dt;

            this.fever.width = BackgroundSize.width - BackgroundSize.width * this.feverOpenTime / BackgroundFeverChangeTime;
            this.fever.height = BackgroundSize.height - BackgroundSize.height * this.feverOpenTime / BackgroundFeverChangeTime;

            if (this.feverOpenTime >= BackgroundFeverChangeTime) {
                this.fever.width = 0;
                this.fever.height = 0;
            }
        }
    }
    feverStart() {
        this.isFever = true;
        this.feverOpenTime = 0;

        this.feverSpine.node.active = true;
        this.feverSpine.setAnimation(0, 'fevertime', false);
    }
    feverEnd() {
        this.isFever = false;
        this.feverOpenTime = 0;
    }
}
